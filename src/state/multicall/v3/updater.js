import { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { errorFetchingV3MulticallResults, fetchingV3MulticallResults, updateV3MulticallResults } from './actions'
import { parseCallKey } from './utils'
import useDebounce from '../../../hooks/useDebounce'
import { useBlockNumber } from '../../application/hooks'
import { chunkArray } from '../../../utils/chunkArray'
import { retry, RetryableError } from '../../../utils/retry'
import { useMulticall2Contract } from '../../../hooks/useContractV3'

const DEFAULT_GAS_REQUIRED = 1_000_000

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multicall multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param blockNumber block number passed as the block tag in the eth_call
 */
const fetchChunk = async (multicall, chunk, blockNumber) => {
  // console.debug('Fetching chunk', chunk, blockNumber)
  try {
    const { returnData } = await multicall.callStatic.multicall(
      chunk.map((obj) => ({
        target: obj.address,
        callData: obj.callData,
        gasLimit: obj.gasRequired ?? DEFAULT_GAS_REQUIRED,
      })),
      { blockTag: blockNumber },
    )

    if (process.env.NODE_ENV === 'development') {
      returnData.forEach((r, i) => {
        if (!r.success && r.returnData.length === 2 && r.gasUsed.gte(Math.floor((chunk[i].gasRequired ?? DEFAULT_GAS_REQUIRED) * 0.95))) {
          console.warn(`A call failed due to requiring ${r.gasUsed.toString()} vs. allowed ${chunk[i].gasRequired ?? DEFAULT_GAS_REQUIRED}`, chunk[i])
        }
      })
    }

    return returnData
  } catch (error) {
    if (error.code === -32000 || error.message?.indexOf('header not found') !== -1) {
      throw new RetryableError(`header not found for block number ${blockNumber}`)
    }
    // console.error('Failed to fetch chunk', error)
    throw error
  }
}

/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export const activeListeningKeys = (allListeners, chainId) => {
  if (!allListeners || !chainId) return {}
  const listeners = allListeners[chainId]
  if (!listeners) return {}

  return Object.keys(listeners).reduce((memo, callKey) => {
    const keyListeners = listeners[callKey]

    memo[callKey] = Object.keys(keyListeners)
      .filter((key) => {
        const blocksPerFetch = parseInt(key)
        if (blocksPerFetch <= 0) return false
        return keyListeners[blocksPerFetch] > 0
      })
      .reduce((previousMin, current) => {
        return Math.min(previousMin, parseInt(current))
      }, Infinity)
    return memo
  }, {})
}

/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
export const outdatedListeningKeys = (callResults, listeningKeys, chainId, latestBlockNumber) => {
  if (!chainId || !latestBlockNumber) return []
  const results = callResults[chainId]
  // no results at all, load everything
  if (!results) return Object.keys(listeningKeys)

  return Object.keys(listeningKeys).filter((callKey) => {
    const blocksPerFetch = listeningKeys[callKey]

    const data = callResults[chainId][callKey]
    // no data, must fetch
    if (!data) return true

    const minDataBlockNumber = latestBlockNumber - (blocksPerFetch - 1)

    // already fetching it for a recent enough block, don't refetch it
    if (data.fetchingBlockNumber && data.fetchingBlockNumber >= minDataBlockNumber) return false

    // if data is older than minDataBlockNumber, fetch it
    return !data.blockNumber || data.blockNumber < minDataBlockNumber
  })
}

const Updater = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.multicallV3)
  // wait for listeners to settle before triggering updates
  const debouncedListeners = useDebounce(state.callListeners, 100)
  const latestBlockNumber = useBlockNumber()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const multicall2Contract = useMulticall2Contract()
  const cancellations = useRef()

  const listeningKeys = useMemo(() => {
    return activeListeningKeys(debouncedListeners, chainId)
  }, [debouncedListeners, chainId])

  const unserializedOutdatedCallKeys = useMemo(() => {
    return outdatedListeningKeys(state.callResults, listeningKeys, chainId, latestBlockNumber)
  }, [chainId, state.callResults, listeningKeys, latestBlockNumber])

  const serializedOutdatedCallKeys = useMemo(() => JSON.stringify(unserializedOutdatedCallKeys.sort()), [unserializedOutdatedCallKeys])

  useEffect(() => {
    if (!latestBlockNumber || !chainId || !multicall2Contract) return

    const outdatedCallKeys = JSON.parse(serializedOutdatedCallKeys)
    if (outdatedCallKeys.length === 0) return
    const calls = outdatedCallKeys.map((key) => parseCallKey(key))

    const chunkedCalls = chunkArray(calls)

    if (cancellations.current && cancellations.current.blockNumber !== latestBlockNumber) {
      cancellations.current.cancellations.forEach((c) => c())
    }

    dispatch(
      fetchingV3MulticallResults({
        calls,
        chainId,
        fetchingBlockNumber: latestBlockNumber,
      }),
    )

    cancellations.current = {
      blockNumber: latestBlockNumber,
      cancellations: chunkedCalls.map((chunk, index) => {
        const { cancel, promise } = retry(() => fetchChunk(multicall2Contract, chunk, latestBlockNumber), {
          n: Infinity,
          minWait: 1000,
          maxWait: 2500,
        })
        promise
          .then((returnData) => {
            // accumulates the length of all previous indices
            const firstCallKeyIndex = chunkedCalls.slice(0, index).reduce((memo, curr) => memo + curr.length, 0)
            const lastCallKeyIndex = firstCallKeyIndex + returnData.length

            const slice = outdatedCallKeys.slice(firstCallKeyIndex, lastCallKeyIndex)

            // split the returned slice into errors and success
            const { erroredCalls, results } = slice.reduce(
              (memo, callKey, i) => {
                if (returnData[i].success) {
                  memo.results[callKey] = returnData[i].returnData ?? null
                } else {
                  memo.erroredCalls.push(parseCallKey(callKey))
                }
                return memo
              },
              { erroredCalls: [], results: {} },
            )

            // dispatch any new results
            if (Object.keys(results).length > 0)
              dispatch(
                updateV3MulticallResults({
                  chainId,
                  results,
                  blockNumber: latestBlockNumber,
                }),
              )

            // dispatch any errored calls
            if (erroredCalls.length > 0) {
              console.debug('Calls errored in fetch', erroredCalls)
              dispatch(
                errorFetchingV3MulticallResults({
                  calls: erroredCalls,
                  chainId,
                  fetchingBlockNumber: latestBlockNumber,
                }),
              )
            }
          })
          .catch((error) => {
            if (error.isCancelledError) {
              console.debug('Cancelled fetch for blockNumber', latestBlockNumber, chunk, chainId)
              return
            }
            // console.error('Failed to fetch multicall chunk', chunk, chainId, error)
            dispatch(
              errorFetchingV3MulticallResults({
                calls: chunk,
                chainId,
                fetchingBlockNumber: latestBlockNumber,
              }),
            )
          })
        return cancel
      }),
    }
  }, [chainId, multicall2Contract, dispatch, serializedOutdatedCallKeys, latestBlockNumber])

  return null
}

export default Updater
