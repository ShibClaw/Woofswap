import { useState, useCallback, useEffect } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useDispatch } from 'react-redux'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import { TaxAssets, TransactionType } from '../config/constants'
import { v4 as uuidv4 } from 'uuid'
import { getAllowance, sendContract } from '../utils/api'
import { getRouterAddress, getWBONE_WoofAddress } from '../utils/addressHelpers'
import { getERC20Contract, getGaugeContract } from '../utils/contractHelpers'
import useWeb3 from './useWeb3'
import { fromWei, MAX_UINT256, toWei } from '../utils/formatNumber'
import {useRouter, useAbiContract, useTokenFactoryContract} from './useContract'
import erc20Abi from '../config/abi/erc20.json'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import useRefresh from './useRefresh'

const useAddLiquidity = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const routerAddress = getRouterAddress()
  const routerContract = useRouter()

  const web3 = useWeb3()
    const handleSell = useCallback(
        async (tokenFactoryContract,currentTokenAddress,symbol,routerAddress,amount,address) => {

            const key = uuidv4()
            const approve0uuid = uuidv4()
            const supplyuuid = uuidv4()
            setPending(true)
            dispatch(
                openTransaction({
                    key,
                    title: `Sell  ${symbol} `,
                    transactions: {
                        [approve0uuid]: {
                            desc: `Approve ${symbol}`,
                            status: TransactionType.START,
                            hash: null,
                        },
                        [supplyuuid]: {
                            desc: `Sell ${amount } ${symbol} `,
                            status: TransactionType.START,
                            hash: null,
                        },
                    },
                }),
            )

            let isApproved = true

            const tokenContract = getERC20Contract(web3, currentTokenAddress)
            const balance = await tokenContract.balanceOf(address);
            const allowance = await getAllowance(tokenContract, routerAddress, address)
            if (fromWei(allowance, 18).lt(amount)) {
                isApproved = false
                try {
                    await sendContract(dispatch, key, approve0uuid, tokenContract, 'approve', [routerAddress, balance], address)
                    isApproved = true;
                } catch (err) {
                    console.log('approve 0 error :>> ', err)
                    setPending(false)
                    return
                }
            }

            if (isApproved) {
                dispatch(
                    updateTransaction({
                        key,
                        uuid: approve0uuid,
                        status: TransactionType.SUCCESS,
                    }),
                )
            }

            const sendAmount1 = toWei(amount, 18).toFixed(0)
            const params = [currentTokenAddress,sendAmount1]

            try {
                await sendContract(dispatch, key, supplyuuid, tokenFactoryContract, 'sellTokens', params, address, '0')
            } catch (err) {
                console.log('supply error :>> ', err)
                setPending(false)
                return
            }

            dispatch(
                updateTransaction({
                    key,
                    uuid: supplyuuid,
                    status: TransactionType.SUCCESS,
                }),
            )

            dispatch(
                completeTransaction({
                    key,
                    final: 'Sell Success',
                }),
            )
            setPending(false)
        },
        [address, web3, routerContract],
    )
    const handleBuy = useCallback(
        async (tokenFactoryContract,currentTokenAddress,symbol,routerAddress,amount,address) => {
            const gdogAddress  = '0xf6D9Cf57e20bA0d33372E8998A9424aa53411E04';
            const key = uuidv4()
            const approve0uuid = uuidv4()
            const supplyuuid = uuidv4()
            setPending(true)
            dispatch(
                openTransaction({
                    key,
                    title: `Buy  ${symbol} `,
                    transactions: {
                        [approve0uuid]: {
                            desc: `Approve GDOG`,
                            status: TransactionType.START,
                            hash: null,
                        },
                        [supplyuuid]: {
                            desc: `Buy ${symbol}  , ${amount } GDOG `,
                            status: TransactionType.START,
                            hash: null,
                        },
                    },
                }),
            )

            let isApproved = true
            const sendAmount1 = toWei(amount, 18).toFixed(0)

            // const tokenContract = getERC20Contract(web3, currentTokenAddress)
            const tokenContract = getERC20Contract(web3, gdogAddress)
            // const tokenContract = getERC20Contract(web3, routerAddress)
            debugger
            const balance = await tokenContract.balanceOf(address);
            const allowance = await getAllowance(tokenContract, routerAddress, address)
            if (fromWei(allowance, 18).lt(amount)) {
                isApproved = false
                try {
                    //await sendContract(dispatch, key, approve0uuid, tokenContract, 'approve', [routerAddress, balance], address)
                    await sendContract(dispatch, key, approve0uuid, tokenContract, 'approve', [routerAddress, sendAmount1], address)
                    isApproved = true;
                } catch (err) {
                    console.log('approve 0 error :>> ', err)
                    setPending(false)
                    return
                }
            }

            if (isApproved) {
                dispatch(
                    updateTransaction({
                        key,
                        uuid: approve0uuid,
                        status: TransactionType.SUCCESS,
                    }),
                )
            }
            debugger

            const params = [currentTokenAddress,sendAmount1]

            try {
                await sendContract(dispatch, key, supplyuuid, tokenFactoryContract, 'buyTokens', params, address, '0')
            } catch (err) {
                console.log('supply error :>> ', err)
                setPending(false)
                return
            }

            dispatch(
                updateTransaction({
                    key,
                    uuid: supplyuuid,
                    status: TransactionType.SUCCESS,
                }),
            )

            dispatch(
                completeTransaction({
                    key,
                    final: 'Sell Success',
                }),
            )
            setPending(false)
        },
        [address, web3, routerContract],
    )
  const handleAdd = useCallback(
    async (firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline) => {


        if(firstAsset.address.length<42 ){
            let fobj = JSON.parse(JSON.stringify(firstAsset))
            let sobj = JSON.parse(JSON.stringify(secondAsset))
            let fm = JSON.parse(JSON.stringify(firstAmount))
            let sm = JSON.parse(JSON.stringify(secondAmount))

            firstAsset = sobj;
            secondAsset = fobj;
            firstAmount = sm;
            secondAmount = fm;
        }

      const key = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const supplyuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${firstAsset.symbol} and ${secondAsset.symbol} (${isStable ? 'Stable' : 'Volatile'})`,
          transactions: {
            [approve0uuid]: {
              desc: `Approve ${firstAsset.symbol}`,
              status: TransactionType.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${secondAsset.symbol}`,
              status: TransactionType.START,
              hash: null,
            },
            [supplyuuid]: {
              desc: `Deposit tokens in the pool`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      let isApproved = true
        //if (firstAsset.address !== 'BONE') {
        if (firstAsset.address.length == 42) {
            const tokenContract = getERC20Contract(web3, firstAsset.address)
            const balance = await tokenContract.balanceOf(address);
        const allowance = await getAllowance(tokenContract, routerAddress, address)
        if (fromWei(allowance, firstAsset.decimals).lt(firstAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve0uuid, tokenContract, 'approve', [routerAddress, balance], address)
          } catch (err) {
            console.log('approve 0 error :>> ', err)
            setPending(false)
            return
          }
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve0uuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }
      isApproved = true
      //if (secondAsset.address !== 'BONE') {
      if (secondAsset.address.length == 42) {
        const tokenContract = getERC20Contract(web3, secondAsset.address)
          const balance = await tokenContract.balanceOf(address);
        const allowance = await getAllowance(tokenContract, routerAddress, address)
        if (fromWei(allowance, secondAsset.decimals).lt(firstAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve1uuid, tokenContract, 'approve', [routerAddress, balance], address)
          } catch (err) {
            console.log('approve 1 error :>> ', err)
            setPending(false)
            return
          }
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve1uuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      const sendSlippage = new BigNumber(100).minus(slippage).div(100)
      const sendAmount0 = toWei(firstAmount, firstAsset.decimals).toFixed(0)
      const sendAmount1 = toWei(secondAmount, secondAsset.decimals).toFixed(0)
      const deadlineVal =
        '' +
        moment()
          .add(Number(deadline) * 60, 'seconds')
          .unix()
      // const sendAmount0Min = toWei(sendSlippage.times(firstAmount), firstAsset.decimals).div(new BigNumber(2)).toFixed(0)
      // const sendAmount1Min = toWei(sendSlippage.times(secondAmount), secondAsset.decimals).div(new BigNumber(2)).toFixed(0)

        const sendAmount0Min = '0';
        const sendAmount1Min = '0';
      let func = 'addLiquidity'
      let params = [firstAsset.address, secondAsset.address, isStable, sendAmount0, sendAmount1, sendAmount0Min, sendAmount1Min, address, deadlineVal]
      let sendValue = '0'

      //if (firstAsset.address === 'BONE') {
      if (firstAsset.address.length<42 ) {
        func = 'addLiquidityETH'
        params = [secondAsset.address, isStable, sendAmount1, sendAmount1Min, sendAmount0Min, address, deadlineVal]
        sendValue = sendAmount0
      }
      //if (secondAsset.address === 'BONE') {
      if (secondAsset.address.length<42 ) {
        func = 'addLiquidityETH'
        params = [firstAsset.address, isStable, sendAmount0, sendAmount0Min, sendAmount1Min, address, deadlineVal]
        sendValue = sendAmount1
      }

      try {
        await sendContract(dispatch, key, supplyuuid, routerContract, func, params, address, sendValue)
      } catch (err) {
        console.log('supply error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added',
        }),
      )
      setPending(false)
    },
    [address, web3, routerContract],
  )

  const handleAddAndStake = useCallback(
    async (pair, firstAsset, secondAsset, firstAmount, secondAmount, isStable, slippage, deadline) => {


        if(firstAsset.address.length<42 ){
            let fobj = JSON.parse(JSON.stringify(firstAsset))
            let sobj = JSON.parse(JSON.stringify(secondAsset))
            let fm = JSON.parse(JSON.stringify(firstAmount))
            let sm = JSON.parse(JSON.stringify(secondAmount))

            firstAsset = sobj;
            secondAsset = fobj;
            firstAmount = sm;
            secondAmount = fm;
        }

      const key = uuidv4()
      const approve0uuid = uuidv4()
      const approve1uuid = uuidv4()
      const approve2uuid = uuidv4()
      const supplyuuid = uuidv4()
      const stakeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Add ${firstAsset.symbol} and ${secondAsset.symbol} (${isStable ? 'Stable' : 'Volatile'})`,
          transactions: {
            [approve0uuid]: {
              desc: `Approve ${firstAsset.symbol}`,
              status: TransactionType.WAITING,
              hash: null,
            },
            [approve1uuid]: {
              desc: `Approve ${secondAsset.symbol}`,
              status: TransactionType.START,
              hash: null,
            },
            [supplyuuid]: {
              desc: `Deposit tokens in the pool`,
              status: TransactionType.START,
              hash: null,
            },
            [approve2uuid]: {
              desc: `Approve ${pair.pairInfo_symbol}`,
              status: TransactionType.START,
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

      let isApproved = true
      //if (firstAsset.address !== 'BONE') {
      if (firstAsset.address.length == 42) {
        const tokenContract = getERC20Contract(web3, firstAsset.address)
          const balance = await tokenContract.balanceOf(address);
        const allowance = await getAllowance(tokenContract, routerAddress, address)
        if (fromWei(allowance, firstAsset.decimals).lt(firstAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve0uuid, tokenContract, 'approve', [routerAddress, balance], address)
          } catch (err) {
            console.log('approve 0 error :>> ', err)
            setPending(false)
            return
          }
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve0uuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }
      isApproved = true
      //if (secondAsset.address !== 'BONE') {
      if (secondAsset.address.length == 42 ) {
        const tokenContract = getERC20Contract(web3, secondAsset.address)
          const balance = await tokenContract.balanceOf(address);
        const allowance = await getAllowance(tokenContract, routerAddress, address)
        if (fromWei(allowance, secondAsset.decimals).lt(firstAmount)) {
          isApproved = false
          try {
            await sendContract(dispatch, key, approve1uuid, tokenContract, 'approve', [routerAddress, balance], address)
          } catch (err) {
            console.log('approve 1 error :>> ', err)
            setPending(false)
            return
          }
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approve1uuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      const sendSlippage = new BigNumber(100).minus(slippage).div(100)
      const sendAmount0 = toWei(firstAmount, firstAsset.decimals).toFixed(0)
      const sendAmount1 = toWei(secondAmount, secondAsset.decimals).toFixed(0)
      const deadlineVal =
        '' +
        moment()
          .add(Number(deadline) * 60, 'seconds')
          .unix()
      // const sendAmount0Min = toWei(sendSlippage.times(firstAmount), firstAsset.decimals).div(new BigNumber(2)).toFixed(0)
      // const sendAmount1Min = toWei(sendSlippage.times(secondAmount), secondAsset.decimals).div(new BigNumber(2)).toFixed(0)

        const sendAmount0Min = '0';
        const sendAmount1Min = '0';
      let func = 'addLiquidity'
      let params = [firstAsset.address, secondAsset.address, isStable, sendAmount0, sendAmount1, sendAmount0Min, sendAmount1Min, address, deadlineVal]
      let sendValue = '0'

      //if (firstAsset.address === 'BONE') {
      if (firstAsset.address.length<42 ) {
        func = 'addLiquidityETH'
        params = [secondAsset.address, isStable, sendAmount1, sendAmount1Min, sendAmount0Min, address, deadlineVal]
        sendValue = sendAmount0
      }
      //if (secondAsset.address === 'BONE') {
      if (secondAsset.address.length<42 ) {
        func = 'addLiquidityETH'
        params = [firstAsset.address, isStable, sendAmount0, sendAmount0Min, sendAmount1Min, address, deadlineVal]
        sendValue = sendAmount1
      }

      try {
        await sendContract(dispatch, key, supplyuuid, routerContract, func, params, address, sendValue)
      } catch (err) {
        console.log('supply error :>> ', err)
        setPending(false)
        return
      }

      isApproved = true
      const pairContract = getERC20Contract(web3, pair.address)
        const balance = await pairContract.balanceOf(address);
      const allowance = await getAllowance(pairContract, pair.pairInfo_gauge, address)
      const balanceOf = await pairContract.balanceOf(address)
      if (fromWei(allowance).lt(fromWei(balanceOf))) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approve2uuid, pairContract, 'approve', [pair.pairInfo_gauge, balance], address)
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
            uuid: approve2uuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      const gaugeContract = getGaugeContract(web3, pair.pairInfo_gauge)
      try {
        await sendContract(dispatch, key, stakeuuid, gaugeContract, 'deposit', [balanceOf,0], address)
      } catch (err) {
        console.log('stake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Liquidity Added and Staked',
        }),
      )
      setPending(false)
    },
    [address, web3,routerContract],
  )

  return { onAdd: handleAdd, onSell: handleSell,onBuy: handleBuy, onAddAndStake: handleAddAndStake, pending }
}

const useQuoteRemove = (pair, withdrawAmount) => {
  const [outputs, setOutputs] = useState({
    firstAmount: '',
    secondAmount: '',
  })
  const contract = useRouter()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchInfo = async () => {
      const res = await contract
        .quoteRemoveLiquidity(pair.token0.address, pair.token1.address, pair.stable, toWei(withdrawAmount).dp(0).toString(10))
      setOutputs({
        firstAmount: fromWei(res.amountA, pair.token0.decimals).toString(10),
        secondAmount: fromWei(res.amountB, pair.token1.decimals).toString(10),
      })
    }
    if (pair && withdrawAmount && withdrawAmount !== '') {
      fetchInfo()
    } else {
      setOutputs({
        firstAmount: '',
        secondAmount: '',
      })
    }
  }, [contract, fastRefresh, pair, withdrawAmount])

  return outputs
}

const useRemoveLiquidity = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const routerAddress = getRouterAddress()
  const routerContract = useRouter()
  const web3 = useWeb3()

  const handleRemove = useCallback(
    async (pair, withdrawAmount, slippage, deadline, firstAmount, secondAmount) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const removeuuid = uuidv4()
      setPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Remove liquidity from ${pair.symbol}`,
          transactions: {
            [approveuuid]: {
              desc: `Approve ${pair.symbol}`,
              status: TransactionType.WAITING,
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

      let isApproved = true
      const tokenContract = getERC20Contract(web3, pair.address)
        const balance = await tokenContract.balanceOf(address);
      const allowance = await getAllowance(tokenContract, routerAddress, address)
      if (fromWei(allowance, pair.decimals).lt(withdrawAmount)) {
        isApproved = false
        try {
          await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [routerAddress, balance], address)
        } catch (err) {
          console.log('approve 0 error :>> ', err)
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
      const sendSlippage = new BigNumber(100).minus(slippage).div(100)
      const sendAmount = toWei(withdrawAmount, pair.decimals).toFixed(0)
     // const sendAmount0Min = toWei(firstAmount, pair.token0.decimals).times(sendSlippage).toFixed(0)
     // const sendAmount1Min = toWei(secondAmount, pair.token1.decimals).times(sendSlippage).toFixed(0)
         const sendAmount0Min = '1'
        const sendAmount1Min = '1'
        const deadlineVal =
        '' +
        moment()
          .add(Number(deadline) * 60, 'seconds')
          .unix()

        //removeLiquidityETHSupportingFeeOnTransferTokens
        //removeLiquidityETHWithPermit
        //removeLiquidityETHWithPermitSupportingFeeOnTransferTokens
        //removeLiquidityWithPermit
      let func = 'removeLiquidity'
      let params = [pair.token0.address, pair.token1.address, pair.stable, sendAmount, sendAmount0Min, sendAmount1Min, address, deadlineVal]

      if (pair.token0.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {
        func = TaxAssets.includes(pair.token1.address.toLowerCase())  ? 'removeLiquidityETHSupportingFeeOnTransferTokens' : 'removeLiquidityETH'
        params = [pair.token1.address, pair.stable, sendAmount, sendAmount1Min, sendAmount0Min, address, deadlineVal]
      }
      if (pair.token1.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {
        func = TaxAssets.includes(pair.token0.address.toLowerCase()) ? 'removeLiquidityETHSupportingFeeOnTransferTokens' : 'removeLiquidityETH'
        params = [pair.token0.address, pair.stable, sendAmount, sendAmount0Min, sendAmount1Min, address, deadlineVal]
      }
        params = [pair.token0.address, pair.token1.address, pair.stable, sendAmount, sendAmount0Min, sendAmount1Min, address, deadlineVal]
        func = 'removeLiquidity'
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
          final: 'Liquidity Removed',
        }),
      )
      setPending(false)
    },
    [address, web3, routerContract],
  )

  return { onRemove: handleRemove, pending }
}

export { useAddLiquidity, useRemoveLiquidity, useQuoteRemove }
