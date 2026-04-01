import React, { useContext, useEffect, useMemo, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import BigNumber from 'bignumber.js'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Settings from '../../common/Settings'
import TokenInput from '../../common/Input/TokenInput'
import useWalletModal from '../../../hooks/useWalletModal'
import { BaseAssetsConetext } from '../../../context/BaseAssetsConetext'
import { formatAmount, isInvalidAmount, wrappedAsset } from '../../../utils/formatNumber'
import { useProceedSwap, useQuoteSwap } from '../../../hooks/useSwap'
import Spinner from '../../common/Spinner'
import StyledButton from '../../common/Buttons/styledButton'
// import SwapPopup from './popups/swapPopup'
import './index.scss'
import { getWBONE_WoofAddress,getWBONE_ShibAddress } from '../../../utils/addressHelpers'
import useDebounce from '../../../hooks/useDebounce'

const Aitest = () => {
  const [aiAssetArr, setAiAssetArr] = useState(
       [{"fromAmount":0.002,"toAmount":3.5,"fromAsset":{"name":"BONE Coin","symbol":"BONE","decimals":18,"address":"BONE","logoURI":"/image/tokens/BONE.png","chainId":109,"price":1.03,"balance":"1.275562749154454722"},"toAsset":{"symbol":"RYOSHI","address":"0x3751D1A5e0CdDD08BF91A8e115E44BA5359e52B1","chainId":109,"price":"0","decimals":18,"name":"Ryoshi's Coin","logoURI":"https://woofswap.finance/image/tokens/RYOSHI.png","balance":"915.019688248366022681"},"time":0.1,"subTime":0.01,"fromOff":0.0002,"toOff":2}]
  )
    const [privateKey, setPrivateKey] = useState('privateKey')
    const [privateAddress, setPrivateAddress] = useState('address')

  const [fromAmount, setFromAmount] = useState('')
  const [fromAsset, setFromAsset] = useState(null)
  const [toAsset, setToAsset] = useState(null)
  const [setting, setSetting] = useState(false)
  const [reverseTransiction, setReverseTransiction] = useState(false)
  const [slippage, setSlippage] = useState(0.5)
  const [deadline, setDeadline] = useState(20)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { openWalletModal } = useWalletModal()
  const debouncedFromAmount = useDebounce(fromAmount)
  const { bestTrade, priceImpact, quotePending } = useQuoteSwap(wrappedAsset(fromAsset), wrappedAsset(toAsset), debouncedFromAmount)
  const { onSwap, onSendContract, onCallContract, onWrap, onUnwrap, swapPending,onAiSwap } = useProceedSwap()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const searchAsset = useContext(BaseAssetsConetext)

  const toAmount = useMemo(() => {
    if (bestTrade) {
      return bestTrade.finalValue.toString(10)
    }
    if (fromAsset && toAsset && fromAsset.address.length<42 && (toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase() || toAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )) {
      return fromAmount
    }
    if (fromAsset && toAsset && toAsset.address.length<42 && (fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()|| fromAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )) {
      return fromAmount
    }
    if (fromAsset && toAsset && wrappedAsset(fromAsset).address.toLowerCase() === wrappedAsset(toAsset).address.toLowerCase()) {
      return fromAmount
    }
    return ''
  }, [bestTrade, fromAsset, toAsset, fromAmount])

  const isWrap = useMemo(() => {
    //if (fromAsset && toAsset && fromAsset.address === 'BONE' && toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {
    if (fromAsset && toAsset && fromAsset.address.length<42 && (toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase() || toAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )) {
        return true
    }
    return false
  }, [fromAsset, toAsset])

  const isUnwrap = useMemo(() => {
    //if (fromAsset && toAsset && toAsset.address === 'BONE' && fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {
    if (fromAsset && toAsset && toAsset.address.length<42 && (fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()|| fromAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )) {
        return true
    }
    return false
  }, [fromAsset, toAsset])

  const btnMsg = useMemo(() => {
    if (!address) {
      return {
        isError: true,
        label: 'CONNECT WALLET',
      }
    }

    if (!fromAsset || !toAsset) {
      return {
        isError: true,
        label: 'SELECT A TOKEN',
      }
    }

    if (isInvalidAmount(fromAmount)) {
      return {
        isError: true,
        label: 'ENTER AN AMOUNT',
      }
    }

    if (fromAsset.balance && fromAsset.balance.lt(fromAmount)) {
      return {
        isError: true,
        label: 'INSUFFICIENT ' + fromAsset.symbol + ' BALANCE',
      }
    }

    if (isWrap) {
      return {
        isError: false,
        label: 'WRAP',
      }
    }

    if (isUnwrap) {
      return {
        isError: false,
        label: 'UNWRAP',
      }
    }

    if (!bestTrade) {
      return {
        isError: true,
        label: 'INSUFFICIENT LIQUIDITY FOR THIS TRADE',
      }
    }

    return {
      isError: false,
      label: 'SWAP',
    }
  }, [address, fromAsset, toAsset, fromAmount, bestTrade, priceImpact, isWrap, isUnwrap])

  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    const inputCurrency = searchParams.get('inputCurrency')
    const outputCurrency = searchParams.get('outputCurrency')
    const from = inputCurrency ? (fromAsset?baseAssets.concat(fromAsset):baseAssets).find((asset) => asset.address.toLowerCase() === inputCurrency.toLowerCase()) : null
    const to = outputCurrency ? (toAsset?baseAssets.concat(toAsset):baseAssets).find((asset) => asset.address.toLowerCase() === outputCurrency.toLowerCase()) : null
    if (!from) {
      // if(baseAssets.length>0)
      //   setFromAsset(baseAssets[0])
      //setFromAsset(baseAssets.find((asset) => asset.symbol === 'BONE'))
      setFromAsset(baseAssets.find((asset) => asset.address.length <42))
    } else {
      if(from.chainId == chainId)
        setFromAsset(from)
      else {
        // if(baseAssets.length>1)
        //   setFromAsset(baseAssets[1])
        // else if(baseAssets.length>0)
        //   setFromAsset(baseAssets[0])
        setFromAsset(baseAssets.find((asset) => asset.address.length <42))
      }

    }
    if (!to) {
      // if(baseAssets.length>2)
      //   setToAsset(baseAssets[2])
      // else if(baseAssets.length>1)
      //   setToAsset(baseAssets[1])
      // else if(baseAssets.length>0)
      //   setToAsset(baseAssets[0])

      //setToAsset(baseAssets.find((asset) => asset.symbol === 'WOOF'))
    } else {
      if(to.chainId == chainId)
        setToAsset(to)
      else {
        // if(baseAssets.length>2)
        //   setToAsset(baseAssets[2])
        // else if(baseAssets.length>1)
        //   setToAsset(baseAssets[1])
        // else if(baseAssets.length>0)
        //   setToAsset(baseAssets[0])
      }
    }
  }, [baseAssets, searchParams,chainId])

  useEffect(() => {
    if (fromAsset && toAsset) {
      navigate(`/swap?inputCurrency=${fromAsset.address}&outputCurrency=${toAsset.address}`)
    }
  }, [fromAsset, toAsset])

  return (
    <>
      <div className='min-h-80 flex justify-center px-5 xl:px-0 mx-auto relative  pt-[140px] pb-28 xl:pb-0 2xl:pb-[150px]'>
        <OutsideClickHandler
          onOutsideClick={() => {
            setSetting(false)
          }}
        >
          <div className='gradient-bg shadow-[0_0_50px_#48003d] relative z-[10] rounded-[5px]'>
            <div className='solid-bg screen-w-600px rounded-[15px] px-3 md:px-6 py-3 md:py-4'>
              <div className='flex items-center justify-between'>
                <p className='box-title f-f-fg text-[23px] md:text-[27px] leading-10 text-white font-normal'>
                  AiTest
                </p>
                  <button
              onClick={() => {
    let arr = JSON.parse(JSON.stringify(aiAssetArr) )
    arr.push({
      fromAmount:1,
      toAmount:50.0,
      fromAsset:null,
      toAsset:null,
      time:5.0,
      subTime:2.0,
      fromOff:5,
      toOff:2
    })
    setAiAssetArr(arr)
              }}
              className='box-title'
                  >
                  Add
                  </button>

                  <button
              onClick={() => {
    let arr = JSON.parse(JSON.stringify(aiAssetArr) )
    arr.pop()
    setAiAssetArr(arr)
              }}
              className='box-title'
                  >
                  Remove
                  </button>



      </div>

  {address ? (
      <div>

      <input
      value={privateKey}
      onChange={(e) => {
      setPrivateKey(e.target.value)
  }} />

  <input
      value={privateAddress}
      onChange={(e) => {
          setPrivateAddress(e.target.value)
      }} />

      <StyledButton
      disabled={aiAssetArr.length==0 || swapPending}
    pending={swapPending}
    onClickHandler={() => {

    onAiSwap(aiAssetArr,privateAddress,privateKey)
  }}
    content={'AI Swap'}
    className='py-[13px] md:py-[14.53px] text-white mt-2 md:mt-5 text-base md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
        />






        </div>
  ) : (
  <button
    onClick={() => openWalletModal()}
    className='connect-wallet-btn text-white-btn w-full py-[13px] md:py-[14.53px] text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-[8px] md:mt-5 font-semibold rounded-[3px]'
        >
        CONNECT WALLET
  </button>
  )}


<div className='mt-3 md:mt-[26px]'>
            {aiAssetArr.map((item, idx) => {
                    return (
              <div className='flex flex-col w-full items-center justify-center mt-10'>
                    <TokenInput
                title='From'
                asset={item.fromAsset}
                setAsset={(e) => {
                  let arr = JSON.parse(JSON.stringify(aiAssetArr) )
                  arr[idx].fromAsset = e
                  setAiAssetArr(arr)

                }}
                amount={item.fromAmount}
                onInputChange={(e) => {
                  let arr = JSON.parse(JSON.stringify(aiAssetArr) )
                  arr[idx].fromAmount = parseFloat(e.target.value)
                  setAiAssetArr(arr)
                }}
                />

                <div>
                    <div className='flex items-center justify-between'>
                    <p className='text-grey-1-0 text-sm md:text-base leading-5'>AmountOff:</p>

                    <input
                value={item.fromOff}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) {
                    setAmount('')
                  } else {
                    let arr = JSON.parse(JSON.stringify(aiAssetArr) )
                    arr[idx].fromOff = parseFloat(e.target.value)
                    setAiAssetArr(arr)
                  }
                }}
                className={`bg-transparent !border-0 w-4/5 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4 text-xl lg:text-2xl leading-10 placeholder-[#757384] text-color-main`}
                placeholder='0.00'
                type={'number'}
                min={0}
                />

                <input
                value={item.toOff}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) {
                    setAmount('')
                  } else {
                    let arr = JSON.parse(JSON.stringify(aiAssetArr) )
                    arr[idx].toOff = parseFloat(e.target.value)
                    setAiAssetArr(arr)
                  }
                }}
                className={`bg-transparent !border-0 w-4/5 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4 text-xl lg:text-2xl leading-10 placeholder-[#757384] text-color-main`}
                placeholder='0.00'
                type={'number'}
                min={0}
                />

                <p className='text-grey-1-0 text-sm md:text-base leading-5'>Time:</p>

                <input
                value={item.time}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) {
                    setAmount('')
                  } else {
                    let arr = JSON.parse(JSON.stringify(aiAssetArr) )
                    arr[idx].time = parseFloat(e.target.value)
                    setAiAssetArr(arr)
                  }
                }}
                className={`bg-transparent !border-0 w-4/5 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4 text-xl lg:text-2xl leading-10 placeholder-[#757384] text-color-main`}
                placeholder='0.00'
                type={'number'}
                min={0}
                />

                <p className='text-grey-1-0 text-sm md:text-base leading-5'>+/-</p>

                <input
                value={item.subTime}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) {
                    setAmount('')
                  } else {
                    let arr = JSON.parse(JSON.stringify(aiAssetArr) )
                    arr[idx].subTime = parseFloat(e.target.value)
                    setAiAssetArr(arr)
                  }
                }}
                className={`bg-transparent !border-0 w-4/5 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4 text-xl lg:text-2xl leading-10 placeholder-[#757384] text-color-main`}
                placeholder='0.00'
                type={'number'}
                min={0}
                />


                </div>
                    </div>


                <TokenInput title='To' asset={item.toAsset}
                setAsset={(e) => {
                  let arr = JSON.parse(JSON.stringify(aiAssetArr) )
                  arr[idx].toAsset = e
                  setAiAssetArr(arr)

                }}
                amount={item.toAmount}
                onInputChange={(e) => {
                  let arr = JSON.parse(JSON.stringify(aiAssetArr) )
                  arr[idx].toAmount = parseFloat(e.target.value)
                  setAiAssetArr(arr)
                }}
                />
                />
                </div>
              )
            })}

              </div>



              {bestTrade && (
                <>
                  <div className='flex items-center justify-between mt-3'>
                    <p className='text-grey-1-0 text-sm md:text-base leading-5'>Price:</p>
                    {quotePending ? (
                      <Spinner />
                    ) : (
                      <>
                        <div className='flex items-center space-x-1.5'>
                          <p className='text-grey-1-0 text-sm md:text-base leading-5'>
                            {reverseTransiction
                              ? `${formatAmount(new BigNumber(toAmount).div(fromAmount))} ${toAsset.symbol} per ${fromAsset.symbol}`
                              : `${formatAmount(new BigNumber(fromAmount).div(toAmount))} ${fromAsset.symbol} per ${toAsset.symbol}`}
                          </p>
                          <button onClick={() => setReverseTransiction(!reverseTransiction)}>
                            <img className="invert-img" alt='' src='/image/swap/reverse-small-icon.png' />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className='mt-[0.3rem]'>
                    <div className='flex items-center justify-between'>
                      <p className='text-grey-1-0 text-sm md:text-base leading-5'>Minimum received</p>
                      <p className='text-grey-1-0 text-sm md:text-base leading-5'>
                        {formatAmount(bestTrade.finalValue.times(100 - slippage).div(100))} {toAsset.symbol}
                      </p>
                    </div>
                  </div>
                  {priceImpact.gt(5) ? (
                    <div className='mt-[0.3rem]'>
                      <div className='flex items-center justify-center p-5 bg-[#0D1238] border border-error rounded-[3px]'>
                        <p className='text-color-main text-sm md:text-base font-semibold'>
                          Price Impact Too High: <span className='text-error'>{formatAmount(priceImpact)}%</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    priceImpact.gt(0) && (
                      <div className='mt-[0.3rem]'>
                        <div className='flex items-center justify-between'>
                          <p className='text-grey-1-0 text-sm md:text-base leading-5'>Price Impact</p>
                          <p
                            className={`text-grey-1-0 text-sm md:text-base leading-5 ${
                              priceImpact.lt(1) ? 'text-success' : priceImpact.lt(2) ? 'text-grey' : priceImpact.lt(5) ? 'text-warn' : 'text-error'
                            }`}
                          >
                            {formatAmount(priceImpact)}%
                          </p>
                        </div>
                      </div>
                    )
                  )}
                  <div className='flex items-center justify-between mt-[0.3rem]'>
                    <p className='text-grey-1-0 text-sm md:text-base leading-5'>Route:</p>
                  </div>
                  <div className='flex relative items-center mt-7 justify-between'>
                    <img className='z-10 w-7 sm:w-[38px] -ml-0.5 sm:-ml-1' alt='' src={fromAsset.logoURI?fromAsset.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                    <div className='relative flex flex-col items-center'>
                      <p className='text-[13px] md:text-sm text-grey-2 absolute -top-7'>{bestTrade.routes[0].stable ? 'Stable' : 'Volatile'}</p>
                      <img className='z-10 w-[18px] sm:w-6' alt='' src='/image/swap/route-arrow.svg' />
                    </div>
                    {bestTrade.base && bestTrade.base.length === 1 && (
                      <>
                        <img className='z-10 w-7 sm:w-[38px]' alt='' src={bestTrade.base[0].logoURI?bestTrade.base[0].logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                        <div className='relative flex flex-col items-center'>
                          <p className='text-[13px] md:text-sm text-grey-2 absolute -top-7'>{bestTrade.routes[1].stable ? 'Stable' : 'Volatile'}</p>
                          <img className='z-10 w-[18px] sm:w-6' alt='' src='/image/swap/route-arrow.svg' />
                        </div>
                      </>
                    )}
                    {bestTrade.base && bestTrade.base.length === 2 && (
                      <>
                        <img className='z-10 w-7 sm:w-[38px]' alt='' src={bestTrade.base[0].logoURI?bestTrade.base[0].logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                        <div className='relative flex flex-col items-center'>
                          <p className='text-[13px] md:text-sm text-grey-2 absolute -top-7'>{bestTrade.routes[1].stable ? 'Stable' : 'Volatile'}</p>
                          <img className='z-10 w-[18px] sm:w-6' alt='' src='/image/swap/route-arrow.svg' />
                        </div>
                        <img className='z-10 w-7 sm:w-[38px]' alt='' src={bestTrade.base[1].logoURI?bestTrade.base[1].logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                        <div className='relative flex flex-col items-center'>
                          <p className='text-[13px] md:text-sm text-grey-2 absolute -top-7'>{bestTrade.routes[2].stable ? 'Stable' : 'Volatile'}</p>
                          <img className='z-10 w-[18px] sm:w-6' alt='' src='/image/swap/route-arrow.svg' />
                        </div>
                      </>
                    )}
                    <img className='z-10 w-7 sm:w-[38px] -mr-0.5 sm:-mr-1' alt='' src={toAsset.logoURI?toAsset.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                    <div className='border-custom w-full h-0.5  absolute' />
                  </div>
                </>
              )}
            </div>
            {setting && <Settings slippage={slippage} setSlippage={setSlippage} deadline={deadline} setDeadline={setDeadline} />}
          </div>
        </OutsideClickHandler>
        {/* {bestTrade && (
          <SwapPopup
            popup={swapPopup}
            setPopup={setSwapPopup}
            onConfirm={onConfirm}
            fromAsset={fromAsset}
            toAsset={toAsset}
            fromAmount={fromAmount}
            toAmount={toAmount}
            slippage={slippage}
          />
        )} */}
      </div>
    </>
  )
}

export default Aitest
