import React, { useCallback, useMemo, useState,useContext } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import StyledButton from '../../common/Buttons/styledButton'
import BalanceInput from '../../common/Input/BalanceInput'
import SearchInput from '../../common/Input/SearchInput'
import TransparentButton from '../../common/Buttons/transparentButton'
import LiquidityDetails from './liquidityDetails'
import { useQuoteRemove, useRemoveLiquidity } from '../../../hooks/useLiquidity'
import { customNotify } from '../../../utils/notify'
import useWalletModal from '../../../hooks/useWalletModal'
import { getLPSymbol, isInvalidAmount } from '../../../utils/formatNumber'
import NoFound from '../../common/NoFound'
import {PairsContext} from "../../../context/PairsContext";
import {BaseAssetsConetext} from "../../../context/BaseAssetsConetext";
import BigNumber from 'bignumber.js'

const RemoveLiquidity = ({ slippage, deadline, pairAddress, pairs }) => {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedPairAddress, setSelectedPairAddress] = useState(pairAddress)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { userPairs } = useContext(PairsContext)
    const baseAssets = useContext(BaseAssetsConetext)
  // const userPairs1 = useMemo(() => {
  //   return pairs.filter((pair) => !pair.account?.lpBalance.isZero())
  //     // return pairs;
  // }, [pairs])

    let filterUserPairs = useMemo(() => {
        return userPairs.filter((pair) => !new BigNumber(pair.account_lp_balance).isZero())
        // return pairs;
    }, [userPairs])

    filterUserPairs = filterUserPairs.map((reward) => {

        const found0 = baseAssets.find((ele) => ele.address.toLowerCase() === reward.pairInfo_token0.toLowerCase())
        const found1 = baseAssets.find((ele) => ele.address.toLowerCase() === reward.pairInfo_token1.toLowerCase())
        return {
            ...reward,
            token0_logoURI:found0?found0.logoURI: "/image/tokens/ERC20_"+ (chainId?chainId:109)+".png",
            token1_logoURI:found1?found1.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png",
        }
    })

    // userPairs = userPairs1;
  const pair = useMemo(() => {
    if (filterUserPairs && filterUserPairs.length > 0) {
      return filterUserPairs.find((item) => item.address === selectedPairAddress)
    }
    return null
  }, [selectedPairAddress, filterUserPairs])


    // const found = baseAssets.find((ele) => ele.address.toLowerCase() === token)
    // if (found) {
    //     const usdValue = new BigNumber(amount).div(new BigNumber(10).pow(decimal)).times(found.price)
    // }

  const filteredPairs = useMemo(() => {
    if (!searchText || searchText === '') {
      return filterUserPairs
    }
    return filterUserPairs.filter((pair) => pair.symbol.toLowerCase().includes(searchText.toLowerCase()))
  }, [filterUserPairs, searchText])
  const { firstAmount, secondAmount } = useQuoteRemove(pair, withdrawAmount)
  const { openWalletModal } = useWalletModal()

  const { onRemove } = useRemoveLiquidity()

  const errorMsg = useMemo(() => {
    if (pair) {
      if (isInvalidAmount(withdrawAmount)) {
        return 'Invalid Amount'
      }
      if (new BigNumber(pair.account_lp_balance).lt(withdrawAmount)) {
        return 'Insufficient ' + pair.symbol + ' Balance'
      }
    }
    return null
  }, [withdrawAmount, pair])

  const onRemoveLiquidity = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
      return
    }
    onRemove(pair, withdrawAmount, slippage, deadline, firstAmount, secondAmount)
  }, [pair, withdrawAmount, slippage, deadline, firstAmount, secondAmount, errorMsg])

  return (
    <>
      {pair ? (
        <div className={`flex flex-col w-full items-center justify-center mt-4`}>
          {!pairAddress || true && (
            <div
              className='flex items-center w-full mb-2 cursor-pointer'
              onClick={() => {
                setSelectedPairAddress(null)
              }}
            >
              <button className='mr-[12px]'>
                <img className='icon-size-mini' alt='' src='/image/icons/icon-back-arrow.svg' width={15} />
              </button>
              <div className='text-base f-f-fg text-grey'>Back to List</div>
            </div>
          )}
          <BalanceInput
            title='Amount'
            inputAmount={withdrawAmount}
            setInputAmount={setWithdrawAmount}
            symbol={pair.pairInfo_symbol}
            balance={new BigNumber(pair.account_lp_balance).div(new BigNumber(10).pow(18))}
            logoURIs={[pair.token0_logoURI?pair.token0_logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png", pair.token1_logoURI?pair.token1_logoURI:"/image/tokens/ERC20_"+ chainId+".png"]}
          />
          <button className='focus:outline-none my-4 z-[8]'>
            <img className='invert-img' src='/image/liquidity/arrow-down2.svg' />
          </button>
          <div className='md:flex-row flex-col flex w-full items-center space-y-2 md:space-y-0  md:space-x-3'>
            <div className='gradient-bg  p-px  rounded-[3px] w-full md:w-1/2'>
              <div className='bg-body pr-4 rounded-[3px] justify-between flex items-center'>
                <input
                  className='bg-transparent w-3/5 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4 text-lg md:text-2xl md:leading-10 placeholder-[#757384] text-dimGray'
                  placeholder='0.00'
                  value={firstAmount}
                  disabled
                />
                <button className='flex items-center space-x-2'>
                  <img className='relative z-[5]' alt='' src={pair.token0_logoURI?pair.token0_logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={28} height={28} />
                  <p className='text-sm md:text-lg font-semibold text-white'>{pair.token0.symbol}</p>
                </button>
              </div>
            </div>
            <div className='gradient-bg  p-px  rounded-[3px] w-full md:w-1/2'>
              <div className='bg-body pr-4 rounded-[3px] flex justify-between items-center'>
                <input
                  className='bg-transparent w-3/5 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4 text-lg md:text-2xl md:leading-10 placeholder-[#757384] text-dimGray'
                  placeholder='0.00'
                  value={secondAmount}
                  disabled
                />
                <button className='flex items-center space-x-2'>
                  <img className='relative z-[5]' alt='' src={pair.token1_logoURI?pair.token1_logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={28} height={28} />
                  <p className='text-sm md:text-lg font-semibold text-white'>{pair.token1.symbol}</p>
                </button>
              </div>
            </div>
          </div>
          <LiquidityDetails pair={pair} slippage={slippage} />
          {address ? (
            <>
              <StyledButton
                content={'REMOVE LIQUIDITY'}
                onClickHandler={onRemoveLiquidity}
                className='grey-btn py-[13px] md:py-[14.53px] text-white  mt-4 text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
              />
            </>
          ) : (
            <StyledButton
              onClickHandler={openWalletModal}
              content={'CONNECT WALLET'}
              className='py-[13px] md:py-[14.53px] text-white  mt-4 text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
            />
          )}
        </div>
      ) : (
        <>
          <SearchInput className={'mt-3'} full searchText={searchText} setSearchText={setSearchText} placeholder='Search LP' />
          {filteredPairs.length > 0 ? (
            <div className='w-full mt-[18px]'>
              <p className='f-f-fg text-grey-2 font-semibold pl-4 text-lg pb-2'>My Liquidity Pairs</p>
              {filteredPairs.map((item, idx) => (
                <div key={idx} className={`${filteredPairs.length - 1 !== idx && 'mb-3'} gradient-bg p-px rounded-[5px]`}>
                  <div className='popup-gradientbg px-5 py-3.5 rounded-[5px] md:flex items-center justify-between w-full'>
                    <div className='flex text-grey-2 items-center  space-x-3'>
                      <div className='flex items-center  -space-x-2'>
                        <img className='relative z-10' alt='' src={item.token0_logoURI?item.token0_logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={31} height={31} />
                        <img className='relative z-[5]' alt='' src={item.token1_logoURI?item.token1_logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={31} height={31} />
                      </div>
                      <div className='font-medium'>
                        <p className='text-[17px] md:text-[19px] leading-[30px]'>{`${getLPSymbol(item)}`}</p>
                        <p className='tracking-[0.78px] text-[11px] md:text-[13px] leading-3 md:leading-none'>{item.stable ? 'STABLE' : 'VOLATILE'}</p>
                      </div>
                    </div>
                    <TransparentButton

                      onClickHandler={() => {
                          console.log(item.address)
                        setSelectedPairAddress(item.address)
                      }}
                      fontWeight={'font-normal'}
                      className={
                        'grey-btn no-border h-10 px-4 max-w-[160px] mt-2.5 md:mt-0 box-shadow-btn md:max-w-fit text-white flex flex-col items-center justify-center text-[15px] md:text-[17px]'
                      }
                      content={'Remove Liquidity'}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='table-normal w-full'>
              <NoFound title='No liquidity found' />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default RemoveLiquidity
