import React, { useMemo, useState } from 'react'
import Counter from './counter'
import StyledButton from '../../../common/Buttons/styledButton'
import TransparentButton from '../../../common/Buttons/transparentButton'
import { useHarvest, useRoyaltyClaim, useTheNftInfo } from '../../../../hooks/useTheNft'
import { formatAmount } from '../../../../utils/formatNumber'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import useWalletModal from '../../../../hooks/useWalletModal'
import StakeModal from './stakeModal'
import usePrices from '../../../../hooks/usePrices'
import './style.scss'
import BigNumber from 'bignumber.js'

const Index = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { walletIds, stakedIds, pendingReward, totalStaked, rewardPerSecond, floorPrice, claimable, isOriginal } = useTheNftInfo()
  const prices = usePrices()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { openWalletModal } = useWalletModal()
  const { onHarvest, pending } = useHarvest()
  const { onClaim, pending: claimPending } = useRoyaltyClaim()

  const floorApr = useMemo(() => {
    const floorInUsd = prices['BONE'] * floorPrice
    const apr =
      totalStaked > 0
        ? rewardPerSecond
            .times(86400)
            .times(365)
            .times(prices['BONE'])
            .div(totalStaked * floorInUsd)
            .times(100)
        : new BigNumber(0)
    return apr.isZero() ? '-' : formatAmount(apr) + '%'
  }, [floorPrice, prices, totalStaked, rewardPerSecond])

  return (
    <div className='relative'>
      {/*<img src='/image/mint/hero-bg.png' alt='' className='bg w-full min-h-[500px] md:min-h-full absolute object-cover object-center' />*/}
      {/*<img src='/image/common/bg-b.png' className='bg-index absolute bottom-0 w-full' />*/}
      <div className='mx-auto container-1 hero relative z-10 pt-[120px] md:pt-[220px]'>
        <div className='lg:flex items-center lg:space-x-[27px]'>
          <div className='max-w-[538px]'>
            <p className='f-f-fg text-[40px] md:text-[47px] md:leading-[3.3rem] lg:text-[58px] leading-[2.7rem] max-w-[315px] md:max-w-full w-full lg:leading-[63px] text-grey font-semibold'>
              <span className='gradient-text'>Stake Your theNFT </span>
              for Passive Income
            </p>
            <p className='text-grey mt-3 md:mt-0.5 text-base md:text-xl leading-6 md:leading-[26px] font-light'>
              Stake your theNFT for weekly trading fees and royalties.
            </p>
            <div className='flex items-center space-x-[54.55px] mt-3 md:mt-[25px]'>
              <Counter title={'Total theNFTs Staked'} count={`${totalStaked}/1734`} />
              <Counter title={'Floor Price APR'} count={`${floorApr}`} />
            </div>
            <Counter
              className={'mt-4 md:mt-[18px]'}
              title={'Last Week’s Earnings'}
              count={`$${formatAmount(rewardPerSecond.times(prices['BONE']).times(604800))}`}
            />
            <StyledButton
              content={'BUY theNFTs ON OPENSEA'}
              onClickHandler={() => {
                window.open(`https://opensea.io/collection/thenian`, '_blank')
              }}
              className='relative w-full mt-4 md:mt-[18px] text-shadow-10 py-3 md:py-[17.36px] leading-[21px] md:leading-[22px] f-f-fg font-bold  text-grey  text-sm md:text-lg tracking-[2.1px] lg:tracking-[3.6px] rounded-[3px] transition-all duration-300 ease-in-out'
            />
          </div>
          <div className='lg:max-w-[540px] mt-10 lg:mt-0 shadow-[0px_0px_50px_#4E0042] w-full border-[#E400ED] border rounded-[5px] py-[13px] lg:pb-[19px] lg:pt-4 px-3 lg:px-[22.5px] solid-bg'>
            <div className='pb-3 lg:pb-[14.5px] border-b border-[#757384] text-grey f-f-fg text-[22px] lg:text-[27px] leading-8 font-medium'>STAKE theNFT</div>
            <div className='flex items-center xl:justify-start mt-4 lg:mt-[19.99px]'>
              <Counter className={'w-1/2'} small={true} title={'My Stake'} count={address ? stakedIds.length + ' theNFTs' : '-'} />
              <Counter className={'w-1/2'} small={true} title={'theNFTs in Your Wallet'} count={address ? walletIds.length + ' theNFTs' : '-'} />
            </div>
            <Counter small={true} title={'Claimable Fees'} count={address ? formatAmount(pendingReward) + ' WBONE' : '-'} className={'mt-[22px] lg:mt-5'} />
            {address ? (
              <div className='flex-col md:flex-row flex space-y-2.5 md:space-y-0 md:space-x-5 mt-[22px] lg:mt-5'>
                <StyledButton
                  content={'CLAIM FEES'}
                  disabled={pendingReward.isZero() || pending}
                  onClickHandler={() => {
                    onHarvest()
                  }}
                  className='
relative w-full py-3 md:py-[17.36px]  f-f-fg font-bold leading-[21px] md:leading-[22px]  text-grey  text-sm md:text-lg tracking-[2.1px]  lg:tracking-[1.44px] rounded-[3px] transition-all duration-300 ease-in-out'
                />
                <TransparentButton
                  content={'MANAGE'}

                  onClickHandler={() => {
                    setIsOpen(true)
                  }}
                  className='
relative w-full  f-f-fg font-bold py-3 md:py-[17.36px] leading-[21px] md:leading-[22px]  text-grey flex flex-col items-center justify-center text-sm md:text-lg tracking-[2.1px] lg:tracking-[1.44px] rounded-[3px] transition-all duration-300 ease-in-out'
                />
              </div>
            ) : (
              <StyledButton
                content={'CONNECT WALLET'}
                onClickHandler={() => {
                  openWalletModal()
                }}
                className='
        relative w-full  text-shadow-10 py-[13px] md:py-[18px] mt-2.5 md:mt-6 f-f-fg font-bold leading-4 md:leading-[20px]  text-grey  text-lg tracking-[1.12px] md:tracking-[1.44px] rounded-[3px] transition-all duration-300 ease-in-out'
              />
            )}
          </div>
        </div>
        <div className='bg-animate w-full mt-[73px] md:mt-[203px] rounded-[5px]'>
          <div className='bg-[#090333] p-3 md:p-6 xl:p-[40.9px] rounded-[5px] lg:flex items-center justify-between'>
            <div className='max-w-[400px] xl:max-w-[577px]'>
              <p className='gradient-text text-[22px] md:text-4xl'>Claim theNFT Minter Royalties</p>
              <p className='text-grey mt-2 md:mt-[10.27px] text-[16px] md:text-lg leading-[25px] md:leading-[26px]'>
                The original minters of the 1734 theNFTs earn 2% from the secondary sales of theNFTs, seeded to this pool weekly.
              </p>
            </div>
            <div className='flex flex-col items-center justify-center lg:max-w-[300px] xl:max-w-[400px] mt-[18px] lg:mt-0 w-full'>
              <div className=' flex items-center'>
                <span className='text-sm md:text-lg leading-5 font-medium f-f-fg text-[#DEDBF2]'>Claimable Fees:</span> &nbsp;{' '}
                <span className='text-grey text-[27px] leading-8 font-medium'>{address ? '$' + formatAmount(claimable.times(prices['BONE'])) : '-'}</span>
              </div>
              {address ? (
                <StyledButton
                  disabled={!isOriginal || claimable.isZero() || claimPending}
                  onClickHandler={() => {
                    onClaim()
                  }}
                  content={isOriginal ? 'CLAIM FEES' : 'NOT ORIGINAL MINTER'}
                  className='
          relative w-full  text-shadow-10 py-3 md:py-[17.36px] leading-[21px] md:leading-[22px] mt-[5.36px] f-f-fg font-bold   text-grey  text-sm md:text-lg tracking-[2.1px] lg:tracking-[3.6px] rounded-[3px] transition-all duration-300 ease-in-out'
                />
              ) : (
                <StyledButton
                  content={'CONNECT WALLET'}
                  onClickHandler={() => {
                    openWalletModal()
                  }}
                  className='relative w-full  text-shadow-10 py-3 md:py-[17.36px] leading-[21px] md:leading-[22px] mt-[5.36px] f-f-fg font-bold   text-grey  text-sm md:text-lg tracking-[2.1px] lg:tracking-[3.6px] rounded-[3px] transition-all duration-300 ease-in-out'
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {isOpen && <StakeModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  )
}

export default Index
