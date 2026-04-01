import { useState, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useDispatch } from 'react-redux'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import { TaxAssets, TransactionType } from '../config/constants'
import { v4 as uuidv4 } from 'uuid'
import { getAllowance, sendContract } from '../utils/api'
import { getERC20Contract, getGaugeContract } from '../utils/contractHelpers'
import useWeb3 from './useWeb3'
import { fromWei, MAX_UINT256, toWei } from '../utils/formatNumber'
import { getRouterAddress, getWBONE_WoofAddress } from '../utils/addressHelpers'
import { useRouter } from './useContract'
import moment from 'moment'

const useMigrateToFusion = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleMigrateToFusion = useCallback(
    async (pair, fusion) => {
      const key = uuidv4()
      const unstakeuuid = uuidv4()
      const approveuuid = uuidv4()
      const stakeuuid = uuidv4()
      const harvestuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Migrate ${pair.token0.symbol}/${pair.token1.symbol} (${pair.title})`,
          transactions: {
            [unstakeuuid]: {
              desc: `Unstake LP tokens from the gauge`,
              status: TransactionType.WAITING,
              hash: null,
            },
            [harvestuuid]: {
              desc: `Claim your earnings`,
              status: TransactionType.START,
              hash: null,
            },
            [approveuuid]: {
              desc: `Approve ${pair.symbol}`,
              status: TransactionType.START,
              hash: null,
            },
            [stakeuuid]: {
              desc: `Stake LP tokens to new gauge`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      // Unstake LP
      let isUnstaked = true
      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      if (pair.account.gaugeBalance.gt(0)) {
        isUnstaked = false
        const unstakeParams = [toWei(pair.account.gaugeBalance, pair.decimals).toFixed(0)]
        setPending(true)
        try {
          await sendContract(dispatch, key, unstakeuuid, gaugeContract, 'withdraw', unstakeParams, address)
        } catch (err) {
          console.log('unstake error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isUnstaked) {
        dispatch(
          updateTransaction({
            key,
            uuid: unstakeuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }
      // Claim earnings
      let isHarvested = true
      if (pair.account.gaugeEarned.gt(0)) {
        isHarvested = false
        try {
          await sendContract(dispatch, key, harvestuuid, gaugeContract, 'getReward', [], address)
        } catch (err) {
          console.log('harvest error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isHarvested) {
        dispatch(
          updateTransaction({
            key,
            uuid: harvestuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }
      // Approve
      let isApproved = true
      const tokenContract = getERC20Contract(web3, pair.address)
      const allowance = await getAllowance(tokenContract, fusion.gauge.address, address)
      const lpBalance = await tokenContract.balanceOf(address)
      if (fromWei(allowance, pair.decimals).lt(fromWei(lpBalance))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [fusion.gauge.address, MAX_UINT256], address)
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
      // Stake
      const params = [lpBalance]
      const fusionContract = getGaugeContract(web3, fusion.gauge.address)
      try {
        await sendContract(dispatch, key, stakeuuid, fusionContract, 'deposit', params, address)
      } catch (err) {
        console.log('stake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Migration Successful',
        }),
      )
      setPending(false)
    },
    [address, web3],
  )

  return { onMigrateToFusion: handleMigrateToFusion, pending }
}

const useMigrateToGamma = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const routerContract = useRouter()

  const handleMigrateToGamma = useCallback(
    async (pair, gamma) => {
      const key = uuidv4()
      const unstakeuuid = uuidv4()
      const harvestuuid = uuidv4()
      const approveuuid = uuidv4()
      const removeuuid = uuidv4()
      console.log('gamma :>> ', gamma)
      dispatch(
        openTransaction({
          key,
          title: `Migrate ${pair.token0.symbol}/${pair.token1.symbol} (${pair.title})`,
          transactions: {
            [unstakeuuid]: {
              desc: `Unstake LP tokens from the gauge`,
              status: TransactionType.WAITING,
              hash: null,
            },
            [harvestuuid]: {
              desc: `Claim your earnings`,
              status: TransactionType.START,
              hash: null,
            },
            [approveuuid]: {
              desc: `Approve ${pair.symbol}`,
              status: TransactionType.START,
              hash: null,
            },
            [removeuuid]: {
              desc: `Withdraw tokens from the pool`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      // Unstake LP
      let isUnstaked = true
      const gaugeContract = getGaugeContract(web3, pair.gauge.address)
      if (pair.account.gaugeBalance.gt(0)) {
        isUnstaked = false
        const unstakeParams = [toWei(pair.account.gaugeBalance, pair.decimals).toFixed(0)]
        setPending(true)
        try {
          await sendContract(dispatch, key, unstakeuuid, gaugeContract, 'withdraw', unstakeParams, address)
        } catch (err) {
          console.log('unstake error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isUnstaked) {
        dispatch(
          updateTransaction({
            key,
            uuid: unstakeuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }
      // Claim earnings
      let isHarvested = true
      if (pair.account.gaugeEarned.gt(0)) {
        isHarvested = false
        try {
          await sendContract(dispatch, key, harvestuuid, gaugeContract, 'getReward', [], address)
        } catch (err) {
          console.log('harvest error :>> ', err)
          setPending(false)
          return
        }
      }
      if (isHarvested) {
        dispatch(
          updateTransaction({
            key,
            uuid: harvestuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }
      // Approve
      let isApproved = true
      const tokenContract = getERC20Contract(web3, pair.address)
      const allowance = await getAllowance(tokenContract, getRouterAddress(), address)
      const lpBalance = await tokenContract.balanceOf(address)
      if (fromWei(allowance, pair.decimals).lt(fromWei(lpBalance))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [getRouterAddress(), MAX_UINT256], address)
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
      const sendAmount = lpBalance
      const sendAmount0Min = 0
      const sendAmount1Min = 0
      const deadlineVal =
        '' +
        moment()
          .add(20 * 60, 'seconds')
          .unix()

      let func = 'removeLiquidity'
      let params = [pair.token0.address, pair.token1.address, pair.stable, sendAmount, sendAmount0Min, sendAmount1Min, address, deadlineVal]

      if (pair.token0.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {
        func = TaxAssets.includes(pair.token1.address.toLowerCase()) ? 'removeLiquidityETHSupportingFeeOnTransferTokens' : 'removeLiquidityETH'
        params = [pair.token1.address, pair.stable, sendAmount, sendAmount1Min, sendAmount0Min, address, deadlineVal]
      }
      if (pair.token1.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {
        func = TaxAssets.includes(pair.token0.address.toLowerCase()) ? 'removeLiquidityETHSupportingFeeOnTransferTokens' : 'removeLiquidityETH'
        params = [pair.token0.address, pair.stable, sendAmount, sendAmount0Min, sendAmount1Min, address, deadlineVal]
      }
      try {
        await sendContract(dispatch, key, removeuuid, routerContract, func, params, address)
      } catch (err) {
        console.log('remove error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Withdrawal Successful',
          link: `/liquidity/managev3?currency0=${gamma.token0.address}&currency1=${gamma.token1.address}`,
        }),
      )
      setPending(false)
    },
    [address, web3],
  )

  return { onMigrateToGamma: handleMigrateToGamma, pending }
}

export { useMigrateToFusion, useMigrateToGamma }
