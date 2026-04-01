import { useState, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useDispatch } from 'react-redux'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import { TransactionType } from '../config/constants'
import { v4 as uuidv4 } from 'uuid'
import { getAllowance, sendContract } from '../utils/api'
import useWeb3 from './useWeb3'
import { useV3Voter,useVeWoofZeroContract,useWhitelistContract } from './useContract'
import { fromWei, MAX_UINT256, toWei } from '../utils/formatNumber'
import { getERC20Contract, getBribeContract } from '../utils/contractHelpers'

const useInvite = () => {
    const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const dispatch = useDispatch()
    const web3 = useWeb3()
    const whitelistContract = useWhitelistContract()

    const handleInvite = useCallback(
        async (address) => {
            const key = uuidv4()
            const adduuid = uuidv4()
            dispatch(
                openTransaction({
                    key,
                    title: `Invite ` ,
                    transactions: {
                        [adduuid]: {
                            desc: `Invite from ` + `${address.slice(0, 4)}...${address.slice(-4)}`,
                            status: TransactionType.START,
                            hash: null,
                        },
                    },
                }),
            )
            let sendValue = '50000000000000000'
            setPending(true)
            try {
                await sendContract(dispatch, key, adduuid, whitelistContract, 'invite', [address], address,sendValue)
            } catch (err) {
                console.log('Invite error :>> ', err)
                setPending(false)
                return
            }

            dispatch(
                completeTransaction({
                    key,
                    final: 'Invited',
                }),
            )
            setPending(false)
        },
        [address, web3, whitelistContract],
    )
    return { onInvite: handleInvite, pending }
}
const useExcWoofZero = () => {
    const [excWoofZeroPending, setWoofZeroPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const dispatch = useDispatch()
    const web3 = useWeb3()
    const whitelistContract = useVeWoofZeroContract()

    const handeExcWoofZero = useCallback(
        async () => {
            const key = uuidv4()
            const adduuid = uuidv4()
            dispatch(
                openTransaction({
                    key,
                    title: `WOOF veWOOF  ` ,
                    transactions: {
                        [adduuid]: {
                            desc: `WOOF veWOOF `,
                            status: TransactionType.START,
                            hash: null,
                        },
                    },
                }),
            )
            let sendValue = '100000000000000000'
            setWoofZeroPending(true)
            try {
                await sendContract(dispatch, key, adduuid, whitelistContract, 'exc', [], address,sendValue)
            } catch (err) {
                console.log('Invite error :>> ', err)
                setWoofZeroPending(false)
                return
            }

            dispatch(
                completeTransaction({
                    key,
                    final: 'WOOF sucess',
                }),
            )
            setWoofZeroPending(false)
        },
        [address, web3, whitelistContract],
    )
    return { onExcWoofZero: handeExcWoofZero, excWoofZeroPending }
}
const useAddGauge = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const voterContract = useV3Voter()


  const handleAddGauge = useCallback(
    async (pool) => {
      const key = uuidv4()
      const adduuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Create gauge for ${pool.symbol}`,
          transactions: {
            [adduuid]: {
              desc: `Create gauge`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      try {
        await sendContract(dispatch, key, adduuid, voterContract, 'createGauge', [pool.address, pool.isGamma ? 1 : 0], address)
      } catch (err) {
        console.log('create gauge error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Gauge Created',
        }),
      )
      setPending(false)
    },
    [address, web3, voterContract],
  )

  return { onAddGauge: handleAddGauge, pending }
}

const useAddBribe = () => {
  const [pending, setPending] = useState(false)

    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleAddBribe = useCallback(
    async (pool, asset, amount) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const bribeuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Create bribe on ${pool.symbol}`,
          transactions: {
            [approveuuid]: {
              desc: `Approve ${asset.symbol}`,
              status: TransactionType.START,
              hash: null,
            },
            [bribeuuid]: {
              desc: `Create bribe`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let bribeAddress = pool.gauge.bribe
      let isApproved = true
      const tokenContract = getERC20Contract(web3, asset.address)
      const allowance = await getAllowance(tokenContract, bribeAddress, address)
      if (fromWei(allowance).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [bribeAddress, MAX_UINT256], address)
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
      const bribeContract = getBribeContract(web3, bribeAddress)
      const sendAmount = toWei(amount, asset.decimals).toFixed(0)
      const params = [asset.address, sendAmount]
      try {
        await sendContract(dispatch, key, bribeuuid, bribeContract, 'notifyRewardAmount', params, address)
      } catch (err) {
        console.log('create bribe error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Bribe Created',
        }),
      )
      setPending(false)
    },
    [address, web3],
  )

  return { onAddBribe: handleAddBribe, pending }
}

export { useAddGauge, useAddBribe,useInvite,useExcWoofZero }
