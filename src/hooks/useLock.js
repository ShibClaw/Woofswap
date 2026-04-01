import { useState, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useDispatch } from 'react-redux'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import { TransactionType } from '../config/constants'
import { v4 as uuidv4 } from 'uuid'
import { getAllowance, sendContract } from '../utils/api'
import { getERC20Contract } from '../utils/contractHelpers'
import useWeb3 from './useWeb3'
import { fromWei, toWei } from '../utils/formatNumber'
import { getWoofAddress, getVeWOOFAddress } from '../utils/addressHelpers'
import moment from 'moment'
import { useV3Voter, useVeDist, useVeWOOF } from './useContract'

const useCreateLock = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veWOOFContract = useVeWOOF()

  const handleCreate = useCallback(
    async (amount, unlockTime) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const createuuid = uuidv4()
      const unlockString = moment().add(unlockTime, 'seconds').format('YYYY/MM/DD')
      dispatch(
        openTransaction({
          key,
          title: `Vest WOOF until ${unlockString}`,
          transactions: {
            [approveuuid]: {
              desc: `Approve WOOF`,
              status: TransactionType.WAITING,
              hash: null,
            },
            [createuuid]: {
              desc: `Vest your tokens`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isApproved = true
      const tokenContract = getERC20Contract(web3, getWoofAddress())
      const allowance = await getAllowance(tokenContract, getVeWOOFAddress(), address)
      if (fromWei(allowance).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [getVeWOOFAddress(), toWei(amount).toFixed(0)], address)
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
      const params = [toWei(amount).toFixed(0), unlockTime]
      try {
        await sendContract(dispatch, key, createuuid, veWOOFContract, 'create_lock', params, address)
      } catch (err) {
        console.log('create lock error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Vesting Successful',
        }),
      )
      setPending(false)
    },
    [address, web3, veWOOFContract],
  )

  return { onCreateLock: handleCreate, pending }
}

const useIncreaseAmount = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veWOOFContract = useVeWOOF()

  const handleIncreaseAmount = useCallback(
    async (id, amount) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const increaseuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Increase vest amount on veWOOF #${id}`,
          transactions: {
            [approveuuid]: {
              desc: `Approve WOOF`,
              status: TransactionType.WAITING,
              hash: null,
            },
            [increaseuuid]: {
              desc: `Increase your vest amount`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isApproved = true
      const tokenContract = getERC20Contract(web3, getWoofAddress())
      const allowance = await getAllowance(tokenContract, getVeWOOFAddress(), address)
      if (fromWei(allowance).lt(amount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [getVeWOOFAddress(), toWei(amount).toFixed(0)], address)
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
      const params = [id, toWei(amount).toFixed(0)]
      try {
        await sendContract(dispatch, key, increaseuuid, veWOOFContract, 'increase_amount', params, address)
      } catch (err) {
        console.log('increase amount error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Vest Amount Increased',
        }),
      )
      setPending(false)
    },
    [address, web3, veWOOFContract],
  )

  return { onIncreaseAmount: handleIncreaseAmount, pending }
}

const useIncreaseDuration = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veWOOFContract = useVeWOOF()

  const handleIncreaseDuration = useCallback(
    async (id, unlockTime) => {
      const key = uuidv4()
      const increaseuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Increase unlock time on veWOOF #${id}`,
          transactions: {
            [increaseuuid]: {
              desc: `Increase your vest duration`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      const end = Math.floor((new Date().getTime() / 1000 + unlockTime) / 604800) * 604800
      console.log('unlockTime :>> ', unlockTime)
      console.log('end :>> ', end)
      const params = [id, unlockTime]
      try {
        await sendContract(dispatch, key, increaseuuid, veWOOFContract, 'increase_unlock_time', params, address)
      } catch (err) {
        console.log('increase duration error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Vest Duration Increased',
        }),
      )
      setPending(false)
    },
    [address, web3, veWOOFContract],
  )

  return { onIncreaseDuration: handleIncreaseDuration, pending }
}

const useWithdraw = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veWOOFContract = useVeWOOF()
  const voterContract = useV3Voter()
  const veDistContract = useVeDist()

  const handleWithdraw = useCallback(
    async (veWOOF) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      const claimuuid = uuidv4()
      const withdrawuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Withdraw vest amount on veWOOF #${veWOOF.id}`,
          transactions: {
            [resetuuid]: {
              desc: `Reset votes`,
              status: TransactionType.START,
              hash: null,
            },
            // [claimuuid]: {
            //   desc: `Claim rebase`,
            //   status: TransactionType.START,
            //   hash: null,
            // },
            [withdrawuuid]: {
              desc: `Withdraw vest amount`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isReset = true
      if (veWOOF.voted) {
        isReset = false
        try {
          await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [veWOOF.id], address)
        } catch (err) {
          console.log('reset error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isReset) {
        dispatch(
          updateTransaction({
            key,
            uuid: resetuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      // let isClaimed = true
      // if (veWOOF.rebase_amount.gt(0)) {
      //   isClaimed = false
      //   try {
      //     await sendContract(dispatch, key, claimuuid, veDistContract, 'claim', [veWOOF.id], address)
      //   } catch (err) {
      //     console.log('claim error :>> ', err)
      //     setPending(false)
      //     return
      //   }
      // }
      // if (isClaimed) {
      //   dispatch(
      //     updateTransaction({
      //       key,
      //       uuid: claimuuid,
      //       status: TransactionType.SUCCESS,
      //     }),
      //   )
      // }

      try {
        await sendContract(dispatch, key, withdrawuuid, veWOOFContract, 'withdraw', [veWOOF.id], address)
      } catch (err) {
        console.log('withdraw error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Vest Withdrawn',
        }),
      )
      setPending(false)
    },
    [address, web3, veWOOFContract, veDistContract],
  )

  return { onWithdraw: handleWithdraw, pending }
}

const useMerge = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veWOOFContract = useVeWOOF()
  const voterContract = useV3Voter()
  const veDistContract = useVeDist()

  const handleMerge = useCallback(
    async (from, to) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      const claimuuid = uuidv4()
      const withdrawuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Merge veWOOF #${from.id} to veWOOF #${to.id}`,
          transactions: {
            [resetuuid]: {
              desc: `Reset votes for veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
            [claimuuid]: {
              desc: `Claim rebase for veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
            [withdrawuuid]: {
              desc: `Merge veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isReset = true
      if (from.voted) {
        isReset = false
        try {
          await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [from.id], address)
        } catch (err) {
          console.log('reset error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isReset) {
        dispatch(
          updateTransaction({
            key,
            uuid: resetuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      let isClaimed = true
      if (from.rebase_amount.gt(0)) {
        isClaimed = false
        try {
          await sendContract(dispatch, key, claimuuid, veDistContract, 'claim', [from.id], address)
        } catch (err) {
          console.log('claim error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isClaimed) {
        dispatch(
          updateTransaction({
            key,
            uuid: claimuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      try {
        await sendContract(dispatch, key, withdrawuuid, veWOOFContract, 'merge', [from.id, to.id], address)
      } catch (err) {
        console.log('withdraw error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Merge Successful',
        }),
      )
      setPending(false)
    },
    [address, web3, veWOOFContract, veDistContract],
  )

  return { onMerge: handleMerge, pending }
}

const useSplit = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veWOOFContract = useVeWOOF()
  const voterContract = useV3Voter()
  const veDistContract = useVeDist()

  const handleSplit = useCallback(
    async (from, weights) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      const claimuuid = uuidv4()
      const splituuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Split veWOOF #${from.id}`,
          transactions: {
            [resetuuid]: {
              desc: `Reset votes for veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
            [claimuuid]: {
              desc: `Claim rebase for veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
            [splituuid]: {
              desc: `Split veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isReset = true
      if (from.voted) {
        isReset = false
        try {
          await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [from.id], address)
        } catch (err) {
          console.log('reset error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isReset) {
        dispatch(
          updateTransaction({
            key,
            uuid: resetuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      let isClaimed = true
      if (from.rebase_amount.gt(0)) {
        isClaimed = false
        try {
          await sendContract(dispatch, key, claimuuid, veDistContract, 'claim', [from.id], address)
        } catch (err) {
          console.log('claim error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isClaimed) {
        dispatch(
          updateTransaction({
            key,
            uuid: claimuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      try {
        await sendContract(dispatch, key, splituuid, veWOOFContract, 'split', [weights, from.id], address)
      } catch (err) {
        console.log('split error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Split Successful',
        }),
      )
      setPending(false)
    },
    [address, web3, veWOOFContract, veDistContract],
  )

  return { onSplit: handleSplit, pending }
}

const useTransfer = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veWOOFContract = useVeWOOF()
  const voterContract = useV3Voter()
  const veDistContract = useVeDist()

  const handleTransfer = useCallback(
    async (from, to) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      const claimuuid = uuidv4()
      const transferuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Transfer veWOOF #${from.id}`,
          transactions: {
            [resetuuid]: {
              desc: `Reset votes for veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
            [claimuuid]: {
              desc: `Claim rebase for veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
            [transferuuid]: {
              desc: `Transfer veWOOF #${from.id}`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      let isReset = true
      if (from.voted) {
        isReset = false
        try {
          await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [from.id], address)
        } catch (err) {
          console.log('reset error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isReset) {
        dispatch(
          updateTransaction({
            key,
            uuid: resetuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      let isClaimed = true
      if (from.rebase_amount.gt(0)) {
        isClaimed = false
        try {
          await sendContract(dispatch, key, claimuuid, veDistContract, 'claim', [from.id], address)
        } catch (err) {
          console.log('claim error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isClaimed) {
        dispatch(
          updateTransaction({
            key,
            uuid: claimuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      try {
        await sendContract(dispatch, key, transferuuid, veWOOFContract, 'transferFrom', [address, to, from.id], address)
      } catch (err) {
        console.log('withdraw error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Transfer Successful',
        }),
      )
      setPending(false)
    },
    [address, web3, veWOOFContract, veDistContract],
  )

  return { onTransfer: handleTransfer, pending }
}

const useReset = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veWOOFContract = useVeWOOF()
  const voterContract = useV3Voter()
  const veDistContract = useVeDist()

  const handleReset = useCallback(
    async (veWoofId) => {
      const key = uuidv4()
      const resetuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Reset Votes`,
          transactions: {
            [resetuuid]: {
              desc: `Reset votes for veWOOF #${veWoofId}`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      try {
        await sendContract(dispatch, key, resetuuid, voterContract, 'reset', [veWoofId], address)
      } catch (err) {
        console.log('reset error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Reset Successful',
        }),
      )
      setPending(false)
    },
    [address, web3, veWOOFContract, veDistContract],
  )

  return { onReset: handleReset, pending }
}

export { useCreateLock, useIncreaseAmount, useIncreaseDuration, useWithdraw, useMerge, useSplit, useTransfer, useReset }
