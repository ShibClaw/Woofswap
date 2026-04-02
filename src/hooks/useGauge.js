import { useState, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useDispatch } from 'react-redux'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import { TransactionType } from '../config/constants'
import { v4 as uuidv4 } from 'uuid'
import { getAllowance, sendContract } from '../utils/api'
import { getERC20Contract, getGaugeContract } from '../utils/contractHelpers'
import useWeb3 from './useWeb3'
import { fromWei, getLPSymbol, MAX_UINT256, toWei } from '../utils/formatNumber'
import { useVoter } from './useContract'
import { getWoofAddress } from '../utils/addressHelpers'

const useStake = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleStake = useCallback(
    async (pair, amount) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const stakeuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Stake ${pair.symbol} in the gauge`,
          transactions: {
            [approveuuid]: {
              desc: `Approve ${pair.symbol}`,
              status: TransactionType.WAITING,
              hash: null,
            },
            [stakeuuid]: {
              desc: `Stake LP tokens in the gauge`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isApproved = true
      const tokenContract = getERC20Contract(web3, pair.address)
      const allowance = await getAllowance(tokenContract, pair.gauge.address, address)
      if (fromWei(allowance, pair.decimals).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [pair.gauge.address, MAX_UINT256], address)
        } catch (err) {
          console.log('approve error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }
      const params = [toWei(amount, pair.decimals).toFixed(0),0]
      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      try {
        await sendContract(dispatch, key, stakeuuid, gaugeContract, 'deposit', params, address)
      } catch (err) {
        console.log('stake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'LP Staked',
        }),
      )
      setPending(false)
    },
    [address, web3],
  )

  return { onStake: handleStake, pending }
}

const useUnstake = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleUntake = useCallback(
    async (pair, amount) => {
      const key = uuidv4()
      const unstakeuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Unstake ${pair.symbol} from the gauge`,
          transactions: {
            [unstakeuuid]: {
              desc: `Unstake LP tokens from the gauge`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )
      const params = [toWei(amount, pair.decimals).toFixed(0)]
      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      setPending(true)
      try {
        await sendContract(dispatch, key, unstakeuuid, gaugeContract, 'withdraw', params, address)
      } catch (err) {
        console.log('unstake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'LP Unstaked',
        }),
      )
      setPending(false)
    },
    [address, web3],
  )

  return { onUnstake: handleUntake, pending }
}

const useHarvest = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleHarvest = useCallback(
    async (pair) => {
      const key = uuidv4()
      const harvestuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim earnings for ${getLPSymbol(pair)}`,
          transactions: {
            [harvestuuid]: {
              desc: `Claim your earnings`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )
      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      setPending(true)
      try {
        await sendContract(dispatch, key, harvestuuid, gaugeContract, 'getReward', [address,[getWoofAddress()]], address)
      } catch (err) {
        console.log('harvest error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Rewards Claimed',
        }),
      )
      setPending(false)
    },
    [address, web3],
  )

  return { onHarvest: handleHarvest, pending }
}

const useAllHarvest = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const voterContract = useVoter()

  const handleAllHarvest = useCallback(
    async (pairs) => {

      // const key = uuidv4()
      // const harvestuuids = []
      // const txns = {}
      // for (let i = 0; i < pairs.length; i++) {
      //   const id = uuidv4()
      //   harvestuuids.push(id)
      //   txns[id] = {
      //     desc: `Claim ${getLPSymbol(pairs[i])} earnings`,
      //     status: TransactionType.START,
      //     hash: null,
      //   }
      // }
      // dispatch(
      //   openTransaction({
      //     key,
      //     title: `Claim all earnings (${pairs.length})`,
      //     transactions: txns,
      //   }),
      // )
      //
      // setPending(true)
      // for (let i = 0; i < pairs.length; i++) {
      //   const pair = pairs[i]
      //   const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      //   try {
      //     await sendContract(dispatch, key, harvestuuids[i], gaugeContract, 'getReward', [], address)
      //   } catch (err) {
      //     console.log('all harvest error :>> ', err)
      //     setPending(false)
      //     return
      //   }
      // }
      //
      // dispatch(
      //   completeTransaction({
      //     key,
      //     final: 'Claimed all earnings',
      //   }),
      // )
      // setPending(false)

        var memory_gauges = [];
        var memory_tokens = [];
        for (let i = 0; i < pairs.length; i++) {
            memory_gauges[i] = pairs[i].account.pairInfo_gauge;
            memory_tokens[i] = [getWoofAddress()];
        }


        const key = uuidv4()
        const harvestuuid = uuidv4()
        dispatch(
            openTransaction({
                key,
                title: `Claim all earnings `,
                transactions: {
                    [harvestuuid]: {
                        desc: `Claim all earnings`,
                        status: TransactionType.START,
                        hash: null,
                    },
                },
            }),
        )
        setPending(true)
        if (!voterContract) {
            console.warn('Voter contract not available on this chain')
            setPending(false)
            return
        }
        try {
            await sendContract(dispatch, key, harvestuuid, voterContract, 'claimRewards', [memory_gauges,memory_tokens], address)
        } catch (err) {
            console.log('harvest error :>> ', err)
            setPending(false)
            return
        }

        dispatch(
            completeTransaction({
                key,
                final: 'Claimed all earnings',
            }),
        )
        setPending(false)
    },
    [address, web3, voterContract],
  )

  return { onAllHarvest: handleAllHarvest, pending }
}

export { useStake, useUnstake, useHarvest, useAllHarvest }
