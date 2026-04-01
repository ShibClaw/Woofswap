import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BaseAssetsConetext } from '../../../context/BaseAssetsConetext'
import TokenInput from '../../common/Input/TokenInput'
// import Toggle from '../../common/Toggle'
import StyledButton from '../../common/Buttons/styledButton'
import {formatAmount, fromWei,toWei, isInvalidAmount, ZERO_ADDRESS} from '../../../utils/formatNumber'
import { customNotify } from '../../../utils/notify'
import { useAddLiquidity } from '../../../hooks/useLiquidity'
import BigNumber from 'bignumber.js'
import LiquidityDetails from './liquidityDetails'
import useWalletModal from '../../../hooks/useWalletModal'
import { getWBONE_WoofAddress } from '../../../utils/addressHelpers'
import {fetchUserPairs} from "../../../utils/fetchUserPairs";
import { PairsContext } from '../../../context/PairsContext'
import useWeb3 from "../../../hooks/useWeb3";
import { fetchAssetsBalances } from '../../../utils/fetchUserAssets'
import useRefresh from "../../../hooks/useRefresh";

const getAddress = (asset) => {
  if (asset.address.length<42) { //if (asset.address === 'BONE') {
    return getWBONE_WoofAddress().toLowerCase()
  }
  return asset.address.toLowerCase()
}

let previousPair

const AddLiquidity = ({ slippage, deadline, pairAddress, pairsWeb }) => {
  const [firstAmount, setFirstAmount] = useState('')
  const [firstAsset, setFirstAsset] = useState()
  const [secondAmount, setSecondAmount] = useState('')
  const [secondAsset, setSecondAsset] = useState()
  const [stable, setStable] = useState(false)
  const [init, setInit] = useState(false)
  // const [options, setoptions] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { openWalletModal } = useWalletModal()
  const { onAdd, onAddAndStake } = useAddLiquidity()
  const baseAssets = useContext(BaseAssetsConetext)
  const { userPairs } = useContext(PairsContext)
    const web3 = useWeb3()
    const { fastRefresh } = useRefresh()

  useEffect(() => {


    if (!pairAddress) {
      if (!firstAsset) {
        //setFirstAsset(baseAssets.find((asset) => asset.symbol === 'BONE'))
          setFirstAsset(baseAssets.find((asset) => asset.address.length <42))
      }
      if (!secondAsset) {
          // if(baseAssets.length>2)
          //     setSecondAsset(baseAssets[2])
          // else if(baseAssets.length>1)
          //     setSecondAsset(baseAssets[1])
          // else if(baseAssets.length>0)
          //     setSecondAsset(baseAssets[0])
        //setSecondAsset(baseAssets.find((asset) => asset.symbol === 'WOOF'))
      }
    } else if (userPairs && userPairs.length > 0 && !init) {
      const item = userPairs.find((ele) => ele.address.toLowerCase() === pairAddress.toLowerCase())

        setFirstAsset(item.token0)
        setSecondAsset(item.token1)


        // setFirstAsset(
      //   baseAssets.find((asset) =>
      //     item.token0.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()
      //       ? asset.symbol === 'BONE'
      //       : asset.address.toLowerCase() === item.token0.address.toLowerCase(),
      //   ),
      // )
      // setSecondAsset(
      //   baseAssets.find((asset) =>
      //     item.token1.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()
      //       ? asset.symbol === 'BONE'
      //       : asset.address.toLowerCase() === item.token1.address.toLowerCase(),
      //   ),
      // )
      setStable(item.stable)
      setInit(true)
    }
  }, [baseAssets, pairAddress, userPairs,chainId])

  useEffect(async () => {
    if (firstAsset) {
        setFirstAsset(firstAsset)

      // setFirstAsset(baseAssets.find((asset) => asset.symbol === firstAsset.symbol))
    }
    if (secondAsset) {
        setSecondAsset(secondAsset)
      // setSecondAsset(baseAssets.find((asset) => asset.symbol === secondAsset.symbol))
    }
    if(pairAddress){
        if (firstAsset) {
            if(!firstAsset.balance){
                if(firstAsset.address.length <42 && baseAssets.length>0){
                    setFirstAsset(baseAssets[0])
                }else {
                    const userBalances = await fetchAssetsBalances([firstAsset], address,web3)
                    firstAsset.balance = userBalances[0]
                    setFirstAsset(firstAsset)
                }
            }
        }
        if (secondAsset) {
            if(!secondAsset.balance){
                if(secondAsset.address.length <42 && baseAssets.length>0){
                    setsecondAsset(baseAssets[0])
                }else {
                    const userBalances = await fetchAssetsBalances([secondAsset], address,web3)
                    secondAsset.balance = userBalances[0]
                    setSecondAsset(secondAsset)
                }
            }
        }

    }
  }, [baseAssets, firstAsset, secondAsset,pairAddress])

  const pair = useMemo(() => {

    if (pairsWeb && pairsWeb.length > 0 && firstAsset && secondAsset) {
      return pairsWeb.find(
        (item) =>
          [getAddress(firstAsset), getAddress(secondAsset)].includes(getAddress(item.token0)) &&
          [getAddress(firstAsset), getAddress(secondAsset)].includes(getAddress(item.token1))
            &&
          item.stable === stable
      )
    } else {
      return null
    }

  }, [firstAsset, secondAsset, pairsWeb, stable])

    const pairContract = useMemo(() => {

        if (userPairs && userPairs.length > 0 && firstAsset && secondAsset) {

            // {
            //     "address": "0x9B9F72db3EE41116b1036f74aC2B709834Db9774",
            //     "pairInfo_symbol": "sAMM-USDC/DAI",
            //     "pairInfo_name": "StableV1 AMM - USDC/DAI",
            //     "pairInfo_decimals": "18",
            //     "pairInfo_stable": true,
            //     "pairInfo_total_supply": "1111000010000000",
            //     "pairInfo_token0": "0xddbbf815664a962474dbbb4daf987d6a3e9cbe38",
            //     "pairInfo_token0_symbol": "USDC",
            //     "pairInfo_token0_decimals": "6",
            //     "pairInfo_reserve0": "1111000010",
            //     "pairInfo_claimable0": "0",
            //     "pairInfo_token1": "0x53642958E33d67A9abF67205862b587b3D62898e",
            //     "pairInfo_token1_symbol": "DAI",
            //     "pairInfo_token1_decimals": "18",
            //     "pairInfo_reserve1": "1111000010000000000000",
            //     "pairInfo_claimable1": "0",
            //     "pairInfo_gauge": "0x863fd7Cbc8156e17226a6e3DAB6467eaff9A8B69",
            //     "pairInfo_gauge_total_supply": "277750000000000",
            //     "pairInfo_fee": "0xE723654A789B23C3D6C13472be29068B8fC0a989",
            //     "pairInfo_bribe": "0x4C21eAfDE45C4FB04483ecbeadd4ddA2A9046434",
            //     "pairInfo_emissions": "0",
            //     "pairInfo_emissions_token": "0x746785C133f6360853432411047D2c27132Fb6d0",
            //     "pairInfo_emissions_token_decimals": "18",
            //     "account_lp_balance": "833250000000000",
            //     "account_token0_balance": "936146869293224704920346644207918693",
            //     "account_token1_balance": "612217318534275868937379235126",
            //     "account_gauge_balance": "277750000000000",
            //     "account_gauge_earned": "0",
            //     "lpBalance": "0.00083325",
            //     "gaugeBalance": "0.00027775",
            //     "gaugeEarned": "0",
            //     "totalLp": "0.001111",
            //     "token0claimable": "0",
            //     "token1claimable": "0"
            // }
            let cp =
             userPairs.find(
                (item) =>
                    [getAddress(firstAsset), getAddress(secondAsset)].includes( item.pairInfo_token0.toLowerCase() ) &&
                    [getAddress(firstAsset), getAddress(secondAsset)].includes(  item.pairInfo_token1.toLowerCase() )
                    &&
                    item.pairInfo_stable === stable
            )

            return  cp;
        } else {
            return null
        }
    }, [firstAsset, secondAsset, userPairs, stable])



  const isReverse = useMemo(() => {
    if (pairContract && firstAsset) {
        //return getAddress(pair.token1) === getAddress(firstAsset)
        return pairContract.pairInfo_token1.toLowerCase() === getAddress(firstAsset)
    }
    return false
  }, [pair,pairContract, firstAsset])

  const onFirstChange = useCallback(
    (val) => {

        if (new BigNumber(val).gt(0)){
            try{
                setFirstAmount(new BigNumber(val).dp( parseInt( firstAsset?firstAsset.decimals:18 ) ))
            }catch (e) {
                console.log("onFirstChange "+e+","+firstAsset+","+firstAsset.decimals)
            }

        }else {
            setFirstAmount(val)
        }

      // if (pair) {
      //   const firstReserve = isReverse ? pair.token1.reserve : pair.token0.reserve
      //   const secondReserve = isReverse ? pair.token0.reserve : pair.token1.reserve
      //   setSecondAmount(val ? secondReserve.times(val).div(firstReserve).dp(secondAsset.decimals).toString(10) : '')
      // }

        if (pairContract) {
            const firstReserve = isReverse ? new BigNumber(pairContract.pairInfo_reserve1) : new BigNumber(pairContract.pairInfo_reserve0)
            const secondReserve = isReverse ? new BigNumber(pairContract.pairInfo_reserve0) : new BigNumber(pairContract.pairInfo_reserve1)
            setSecondAmount(val ?  new BigNumber(10).pow(firstAsset.decimals).times(val).times(secondReserve).div(firstReserve).div(new BigNumber(10).pow(secondAsset.decimals)).dp( parseInt(secondAsset.decimals)).toString(10) : '')
        }
    },
    [isReverse, pair,pairContract, setFirstAmount, setSecondAmount,fastRefresh],
  )

  const onSecondChange = useCallback(
    (val) => {

        if (new BigNumber(val).gt(0)){
            try{
                setSecondAmount(new BigNumber(val).dp(parseInt(secondAsset ? secondAsset.decimals:18 ) ))
            }catch (e) {
                console.log("onSecondChange "+e+","+secondAsset+","+secondAsset.decimals)
            }
        }else {
            setSecondAmount(val)
        }

      // if (pair) {
      //   const firstReserve = isReverse ? pair.token1.reserve : pair.token0.reserve
      //   const secondReserve = isReverse ? pair.token0.reserve : pair.token1.reserve
      //   setFirstAmount(val ? firstReserve.times(val).div(secondReserve).dp(firstAsset.decimals).toString(10) : '')
      // }
        if (pairContract) {
            const firstReserve = isReverse ? new BigNumber(pairContract.pairInfo_reserve1) : new BigNumber(pairContract.pairInfo_reserve0)
            const secondReserve = isReverse ? new BigNumber(pairContract.pairInfo_reserve0) : new BigNumber(pairContract.pairInfo_reserve1)
            setFirstAmount(val ?  new BigNumber(10).pow(secondAsset.decimals).times(val).times(firstReserve).div(secondReserve).div(new BigNumber(10).pow(firstAsset.decimals)).dp(parseInt(firstAsset.decimals)).toString(10) : '')
        }
    },
    [isReverse, pair, pairContract,setFirstAmount, setSecondAmount],
  )

  const errorMsg = useMemo(() => {

    if (!firstAsset || !secondAsset) {
      return `Invalid Asset`
    }
    if (isInvalidAmount(firstAmount) || isInvalidAmount(secondAmount)) {
      return `Invalid Amount`
    }
    if (firstAsset.balance.lt(firstAmount)) {
      return 'Insufficient ' + firstAsset.symbol + ' Balance'
    }
    if (secondAsset.balance.lt(secondAmount)) {
      return 'Insufficient ' + secondAsset.symbol + ' Balance'
    }
      if(stable){
          if(pairContract){
              if(pairContract.pairInfo_token0.toLowerCase() == firstAsset.address.toLowerCase())  {
                  if(!   new BigNumber(pairContract.pairInfo_reserve0).plus(new BigNumber(10).pow(firstAsset.decimals).times(firstAmount)).times(new BigNumber(10).pow(18) ).lt(new BigNumber(2).pow(256))){
                      return 'Error Stable Number'
                  }
                  if(!   new BigNumber(pairContract.pairInfo_reserve1).plus(new BigNumber(10).pow(secondAsset.decimals).times(secondAmount)).times(new BigNumber(10).pow(18) ).lt(new BigNumber(2).pow(256))){
                      return 'Error Stable Number'
                  }
              }else{
                  if(!   new BigNumber(pairContract.pairInfo_reserve0).plus(new BigNumber(10).pow(secondAsset.decimals).times(secondAmount)).times(new BigNumber(10).pow(18) ).lt(new BigNumber(2).pow(256))){
                      return 'Error Stable Number'
                  }
                  if(!   new BigNumber(pairContract.pairInfo_reserve1).plus(new BigNumber(10).pow(firstAsset.decimals).times(firstAmount)).times(new BigNumber(10).pow(18) ).lt(new BigNumber(2).pow(256))){
                      return 'Error Stable Number'
                  }
              }

          }else {
              if(!   new BigNumber(10).pow(firstAsset.decimals).times(firstAmount).times(new BigNumber(10).pow(18) ).lt(new BigNumber(2).pow(256))){
                  return 'Error Stable Number'
              }
              if(!   new BigNumber(10).pow(secondAsset.decimals).times(secondAmount).times(new BigNumber(10).pow(18) ).lt(new BigNumber(2).pow(256))){
                  return 'Error Stable Number'
              }
          }
      }

    return null
  }, [firstAmount, secondAmount, firstAsset, secondAsset,stable,pairContract])

  const onAddAndStakeLiquidity = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
      return
    }
    pairContract.symbol = pairContract.pairInfo_symbol;
    onAddAndStake(pairContract, firstAsset, secondAsset, firstAmount, secondAmount, stable, slippage, deadline)
  }, [pair,pairContract, firstAsset, secondAsset, firstAmount, secondAmount, stable, slippage, deadline])

  const onAddLqiduity = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
      return
    }
    onAdd(firstAsset, secondAsset, firstAmount, secondAmount, stable, slippage, deadline)
  }, [pairContract,firstAsset, secondAsset, firstAmount, secondAmount, stable, slippage, deadline])

  useEffect(() => {
    if (pairContract) {
      if (previousPair !== pairContract.address) {
        previousPair = pairContract.address
        // const firstReserve = isReverse ? pair.token1.reserve : pair.token0.reserve
        // const secondReserve = isReverse ? pair.token0.reserve : pair.token1.reserve

      const firstReserve = isReverse ? new BigNumber(pairContract.pairInfo_reserve1) : new BigNumber(pairContract.pairInfo_reserve0)
      const secondReserve = isReverse ? new BigNumber(pairContract.pairInfo_reserve0) : new BigNumber(pairContract.pairInfo_reserve1)


        if (firstAmount && secondAmount) {
          //setSecondAmount(secondReserve.times(firstAmount).div(firstReserve).dp(secondAsset.decimals).toString(10))
            setSecondAmount(firstAmount ?  new BigNumber(10).pow(firstAsset.decimals).times(firstAmount).times(secondReserve).div(firstReserve).div(new BigNumber(10).pow(secondAsset.decimals)).dp(parseInt(secondAsset.decimals)).toString(10) : '')
        }

        if (!firstAmount && secondAmount) {
            // setFirstAmount(firstReserve.times(secondAmount).div(secondReserve).dp(firstAsset.decimals).toString(10))
            setFirstAmount(secondAmount ?  new BigNumber(10).pow(secondAsset.decimals).times(secondAmount).times(firstReserve).div(secondReserve).div(new BigNumber(10).pow(firstAsset.decimals)).dp(parseInt(firstAsset.decimals)).toString(10) : '')
        }

        if (firstAmount && !secondAmount) {
          //setSecondAmount(secondReserve.times(firstAmount).div(firstReserve).dp(secondAsset.decimals).toString(10))
            setSecondAmount(firstAmount ?  new BigNumber(10).pow(firstAsset.decimals).times(firstAmount).times(secondReserve).div(firstReserve).div(new BigNumber(10).pow(secondAsset.decimals)).dp(parseInt(secondAsset.decimals)).toString(10) : '')
        }
      } else {
        previousPair = pairContract.address
      }
    } else {
      previousPair = undefined
    }
  }, [pair, isReverse,fastRefresh])

  return (
    <>
      <div className='md:mt-[34px] mt-3.5 mb-3.5 bg-body  rounded-[10px] max-w-[263px] w-full f-f-fg text-[13px] md:text-sm tracking-[0.56px] h-[34px] md:h-[38px]'>
        <button
          onClick={() => {
            setStable(true)
          }}
          className={`${stable ? 'bg-blue-2 text-white-btn font-medium' : 'text-dimGray'} w-1/2  transition-all h-full`}
        >
          STABLE
        </button>
        <button
          onClick={() => {
            setStable(false)
          }}
          className={`${!stable ? 'bg-blue-2 text-white-btn font-medium' : 'text-dimGray'} w-1/2 transition-all h-full uppercase`}
        >
          Volatile
        </button>
      </div>
      <div className='mt-3 md:mt-[14px]'>
        <div className={`flex flex-col w-full items-center justify-center `}>
          <TokenInput
            title='Input'
            asset={firstAsset}
            setAsset={setFirstAsset}
            amount={firstAmount}
            setAmount={onFirstChange}
            onInputChange={(e) => onFirstChange(e.target.value)}
            selectedAssets={[firstAsset, secondAsset]}
          />
          <div className='invert-img my-5 z-[8]'>
            <img src='/image/liquidity/plus.svg' />
          </div>
          <TokenInput
            title='Input'
            asset={secondAsset}
            setAsset={setSecondAsset}
            amount={secondAmount}
            setAmount={onSecondChange}
            onInputChange={(e) => onSecondChange(e.target.value)}
            selectedAssets={[firstAsset, secondAsset]}
          />
        </div>
      </div>
      {pair ? (
        <LiquidityDetails pair={pair} slippage={slippage} />
      ) : (
        firstAsset &&
        secondAsset && (
          <div className='mt-4'>
            <div className='text-grey-2 text-sm md:text-base font-medium pb-1 border-b border-[#757384]'>Starting Liquidity Info</div>
            <div className='flex justify-around mt-4 w-full'>
              <div className='flex flex-col items-center justify-between'>
                <p className='text-grey-1-0 text-sm md:text-base leading-5 font-medium'>
                  {firstAmount && secondAmount && !new BigNumber(secondAmount).isZero() ? formatAmount(firstAmount / secondAmount) : '0'}
                </p>
                <p className='text-grey-1-0 text-sm md:text-base leading-5'>
                  {firstAsset.symbol} per {secondAsset.symbol}
                </p>
              </div>
              <div className='flex flex-col items-center justify-between'>
                <p className='text-grey-1-0 text-sm md:text-base leading-5 font-medium'>
                  {firstAmount && secondAmount && !new BigNumber(firstAmount).isZero() ? formatAmount(secondAmount / firstAmount) : '0'}
                </p>
                <p className='text-grey-1-0 text-sm md:text-base leading-5'>
                  {secondAsset.symbol} per {firstAsset.symbol}
                </p>
              </div>
            </div>
          </div>
        )
      )}
      {/* <div className='flex items-center justify-end space-x-2 mt-5 font-light'>
      <p className='text-grey-1-0 text-sm md:text-base leading-5'>More Options</p>
      <Toggle
        toggleId='options'
        rounded={false}
        onChange={(e) => {
          setoptions(e.target.checked)
        }}
        small={true}
      />
    </div> */}
      {address ? (
        <div className='mt-8'>
          {pairContract && pairContract.pairInfo_gauge !== ZERO_ADDRESS && (
            <StyledButton
              onClickHandler={onAddAndStakeLiquidity}
              content={'ADD LIQUIDITY & STAKE LP'}
              className='blue-btn py-[13px] md:py-[14.53px] text-white mb-3 text-base md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
            />
          )}
          <StyledButton
            onClickHandler={onAddLqiduity}
            content={'ADD LIQUIDITY'}
            className='blue-btn py-[13px] md:py-[14.53px] text-white text-base md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
          />
        </div>
      ) : (
        <StyledButton
          onClickHandler={openWalletModal}
          content={'CONNECT WALLET'}
          className='grey-btn py-[13px] md:py-[14.53px] text-white mt-4 text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
        />
      )}
    </>
  )
}

export default AddLiquidity
