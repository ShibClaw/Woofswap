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

const Swap = () => {
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
  const { onSwap, onSendContract, onCallContract, onWrap, onUnwrap, swapPending } = useProceedSwap()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  // const searchAsset = useContext(BaseAssetsConetext)

  const toAmount = useMemo(() => {

    if (fromAsset && toAsset && fromAsset.address.length<42 && (toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase() || toAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )) {
      return fromAmount
    }
    if (fromAsset && toAsset && toAsset.address.length<42 && (fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()|| fromAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )) {
      return fromAmount
    }
    if (fromAsset && toAsset && wrappedAsset(fromAsset).address.toLowerCase() === wrappedAsset(toAsset).address.toLowerCase()) {
      return fromAmount
    }
    if (bestTrade) {
      return bestTrade.finalValue.toString(10)
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
    if (!address || (chainId != 109 &&chainId != 2420 &&chainId != 10088 &&chainId != 86 &&chainId != 196 &&chainId != 177 && chainId != 860621)) {
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
    if(priceImpact.gt(15)){
      return {
        isError: false,
        label: 'Price lmpact Too High',
      }
    }else if(priceImpact.gt(5)){
      return {
        isError: false,
        label: 'SWAP  Anyway',
      }
    }else {
      return {
        isError: false,
        label: 'SWAP',
      }
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
      if(from.chainId == chainId) {
        setFromAsset(from)
      }else {
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
                  Swap
                </p>
                <button
                  onClick={() => {
                    setSetting(!setting)
                  }}
                  className=''
                >
                  <img className='icon-size-big invert-img invert-img'  alt='' src='/image/swap/bar.svg' />
                </button>
              </div>
              <div className='mt-3 md:mt-[26px]'>
                <div className='flex flex-col w-full items-center justify-center'>
                  <TokenInput
                    title='From'
                    asset={fromAsset}
                    setAsset={setFromAsset}
                    amount={fromAmount}
                    setAmount={setFromAmount}
                    onInputChange={(e) => {
                      setFromAmount(e.target.value)
                    }}
                    selectedAssets={[fromAsset, toAsset]}
                  />
                  <button
                    onClick={() => {
                      const tempAsset = fromAsset
                      if (new BigNumber(toAmount).gt(0)) {
                        setFromAmount(toAmount)
                      }
                      setFromAsset(toAsset)
                      setToAsset(tempAsset)
                    }}
                    className='focus:outline-none mb-10px mt-10px z-[8]'
                  >
                    <img className='focus:outline-none icon-size-big invert-img' src='/image/icons/icon-arrow-down.svg' />
                  </button>
                  <TokenInput title='To' asset={toAsset} setAsset={setToAsset} amount={toAmount} selectedAssets={[fromAsset, toAsset]} disabled />
                </div>
              </div>

              <div className='mt-5'>
                <div className='flex items-center justify-between'>
                  <p className='text-grey-1-0 text-sm md:text-base leading-5'>Slippage Tolerance</p>
                  <p className='text-grey-1-0 text-sm md:text-base leading-5'>{slippage}%</p>
                </div>
              </div>

              {address ? (
                  <div>
                <StyledButton
                  disabled={btnMsg.isError || swapPending}
                  pending={swapPending}
                  onClickHandler={() => {

                if (isWrap) {
                  onWrap(fromAmount,toAsset.address)
                } else if (isUnwrap) {
                  onUnwrap(fromAmount,fromAsset.address)
                } else {
                  if(priceImpact.gt(15)){
                    var person=prompt("This swap has a price impact of at least 15%. Please type the word \"confirm\" to continue with this swap.","");
                    if (person!="confirm"){
                      return  ;
                    }else {

                        const bestTradeTemp = bestTrade
                        onSwap(fromAsset, toAsset, fromAmount, bestTradeTemp, slippage, deadline)
                    }

                  }else if(priceImpact.gt(10)){
                    var person=prompt("This swap has a price impact of at least 10%. Please type the word \"confirm\" to continue with this swap.","");
                    if (person!="confirm"){
                      return  ;
                    }else {
                        const bestTradeTemp = bestTrade
                        onSwap(fromAsset, toAsset, fromAmount, bestTradeTemp, slippage, deadline)
                    }

                  }else if(priceImpact.gt(5)) {
                    if (confirm('TThis swap has a price impact of at least 5%. Please confirm that you would like to continue with this swap.')){

                        const bestTradeTemp = bestTrade
                        onSwap(fromAsset, toAsset, fromAmount, bestTradeTemp, slippage, deadline)

                    }
                  }else {

                      const bestTradeTemp = bestTrade
                      onSwap(fromAsset, toAsset, fromAmount, bestTradeTemp, slippage, deadline)

                  }

                }



                  }}
                  content={btnMsg.label}
                  className={'py-[13px] md:py-[14.53px] text-white mt-2 md:mt-5 text-base md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px] '+( priceImpact.gt(5)?"red-btn":"")}
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
                          Price Impact Too High: <span className='text-error-red'>{formatAmount(priceImpact)}%</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    priceImpact.gt(0) && (
                      <div className='mt-[0.3rem]'>
                        <div className='flex items-center justify-between'>
                          <p className='text-grey-1-0 text-sm md:text-base leading-5'>Price Impact</p>
                          <p
                            className={`text-sm md:text-base leading-5 ${
                              priceImpact.lt(1) ? 'text-success' : priceImpact.lt(3) ? 'text-warn' : priceImpact.lt(5) ? 'text-error-red' : 'text-error-red'
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

export default Swap
