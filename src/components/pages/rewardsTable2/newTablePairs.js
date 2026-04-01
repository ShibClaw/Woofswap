import React, { useState } from 'react'
import TransparentButton from '../../common/Buttons/transparentButton'
import ReactTooltip from 'react-tooltip'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import Sticky from 'react-stickynode'
import useWalletModal from '../../../hooks/useWalletModal'
import { formatAmount, getLP0Symbol, getLP1Symbol, ZERO_ADDRESS } from '../../../utils/formatNumber'
import { useNavigate } from 'react-router-dom'
import { useHarvest } from '../../../hooks/useGauge'
import DepositModal from '../liquidity/depositModal'
import { getRewardTokenSymbol } from '../../../utils/addressHelpers'

const Item = ({ usd, content, account, idx, type }) => {
  const [arrowReverse, setArrowReverse] = useState()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  return account || type === 'tvl' ? (
    <div className='flex flex-col items-start justify-center'>
      <div
        data-tip
        data-for={`new-${type}-${idx}`}
        onMouseEnter={() => {
          setArrowReverse(`new-${type}-${idx}`)
        }}
        onMouseLeave={() => {
          setArrowReverse(null)
        }}
        className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px] flex items-center cursor-pointer space-x-1.5'
      >
        <p>{'$' + formatAmount(usd, true)}</p>
        <button className={`${arrowReverse === `new-${type}-${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
          <img alt='' src='/image/liquidity/small-arrow-bottom.svg' />
        </button>
      </div>
      <ReactTooltip
        className='max-w-[180px] !bg-[#090333] !border !border-white !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body'
        id={`new-${type}-${idx}`}
        place='right'
        effect='solid'
      >
        {content}
      </ReactTooltip>
    </div>
  ) : (
    <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>-</div>
  )
}

const TableRow = ({ item, isLast, idx }) => {
  const [isOpen, setIsOpen] = useState(!item.account.gaugeBalance.isZero())
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { openWalletModal } = useWalletModal()
  const navigate = useNavigate()
  const { onHarvest, pending } = useHarvest()
  const [manage, setManage] = useState(false)

  return (
    <div
      key={idx}
      className={`
    ${isLast ? 'rounded-b-[5px]' : ''}
    ${idx === 0 && 'rounded-t-lg'}
    no-b-radius mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-[#DEDBF2] p-4 lg:py-5 px-4 xl:px-6 gradient-bg-new`}
    >
      <div className='w-full  lg:w-[20%]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3 mr:0 lg:mr-2'>
            <div className='flex items-center -space-x-2'>
              <img className='relative z-10' alt='' src={item.token0.logoURI?item.token0.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={30} height={30} />
              <img className='relative z-[5]' alt='' src={item.token1.logoURI?item.token1.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={30} height={30} />
            </div>
            <div>
              <div className='flex flex-wrap text-base xl:text-[12px] leading-[30px] font-medium'>
                <span>{getLP0Symbol(item)}</span>/<span>{getLP1Symbol(item)}</span>
              </div>
              <p className='tracking-[0.78px] text-[12px] leading-none'>{item.stable ? 'STABLE' : 'VOLATILE'}</p>
            </div>
          </div>
          <button
            className='lg:hidden'
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          >
            <img alt='' className={`${isOpen ? 'rotate-180' : ''} transform`} src='/image/swap/dropdown-arrow.png' />
          </button>
        </div>
      </div>
      <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[14%] items-start justify-center'>
        <p className='lg:hidden text-sm f-f-fg font-semibold'>Projected APR</p>
        <div className='flex flex-col items-start justify-center text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>
          {formatAmount(item.gauge.projectedApr, true)}%
        </div>
      </div>
      <div className='flex flex-col w-1/2 mt-2 lg:mt-0 items-start lg:w-[11%] justify-center'>
        <p className='lg:hidden text-sm f-f-fg font-semibold'>Total Staked</p>
        <Item
          account={address}
          type={'tvl'}
          usd={item.gauge.tvl}
          content={
            <>
              {formatAmount(item.gauge.pairInfo_pooled0)} {item.token0.symbol}
              <br />
              {formatAmount(item.gauge.pairInfo_pooled1)} {item.token1.symbol}
            </>
          }
          idx={idx}
        />
      </div>
      {/* second row */}
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-start mt-3 lg:mt-0 w-1/2 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm f-f-fg font-semibold'>My Pool</p>
        <Item
          account={address}
          type={'pool'}
          usd={item.account.totalUsd}
          content={
            <>
              {formatAmount(item.account.total0)} {item.token0.symbol}
              <br />
              {formatAmount(item.account.total1)} {item.token1.symbol}
            </>
          }
          idx={idx}
        />
      </div>
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col items-start w-1/2 mt-3 lg:mt-0 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm f-f-fg font-semibold'>My Stake</p>
        <Item
          account={address}
          type={'stake'}
          usd={item.account.stakedUsd}
          content={
            <>
              {formatAmount(item.account.staked0)} {item.token0.symbol}
              <br />
              {formatAmount(item.account.staked1)} {item.token1.symbol}
            </>
          }
          idx={idx}
        />
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block  w-1/2 lg:w-[8%] mt-2 lg:mt-0`}>
        <p className='lg:hidden text-sm f-f-fg font-semibold'>Earnings</p>
        <Item account={address} type={'earning'} usd={item.account.earnedUsd} content={<>{formatAmount(item.account.gaugeEarned)} {getRewardTokenSymbol(chainId)}</>} idx={idx} />
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[25%] mt-3.5 lg:mt-0`}>
        {address ? (
          <div className='space-x-5 xl:space-x-6 w-full flex items-center lg:justify-end'>
            <TransparentButton
              content={'Manage'}

              onClickHandler={() => {
                if (item && item.gauge.address === ZERO_ADDRESS) {
                  navigate(`/liquidity/manage/${item.address}`)
                } else {
                  setManage(true)
                }
              }}
              fontWeight={'font-medium'}
              className='border-img h-10 px-[26px] text-grey flex  max-w-[96px] whitespace-nowrap flex-col items-center justify-center tex-sm xl:text-[17px] w-full'
            />
            <button
              disabled={item.account.gaugeEarned.isZero() || pending}
              className={`${item.account.gaugeEarned.isZero() || pending ? 'opacity-[0.33] cursor-not-allowed ' : 'text-d-u'} text-base`}
              onClick={() => {
                onHarvest(item)
              }}
            >
              Claim Earnings
            </button>
          </div>
        ) : (
          <div className='w-full flex items-center lg:justify-end'>
            <TransparentButton
              onClickHandler={openWalletModal}
              content={'Connect Wallet'}
              className='h-10 btn-con-wallet px-[26px] flex lg:max-w-[140px] whitespace-nowrap flex-col items-center justify-center tex-sm xl:text-[17px] '
            />
          </div>
        )}
      </div>
      {manage && <DepositModal isOpen={manage} setIsOpen={setManage} pair={item} />}
    </div>
  )
}

const NewTablePairs = ({ pairsData, sort, setSort, sortOptions }) => {
  return (
    <>
      {/* for desktop */}
      <div className='w-full'>
        <div className='w-full'>
          {pairsData.length > 0 && (
            <>
              <Sticky
                enabled={true}
                innerActiveClass={'gradientBorder'}
                top={95}
                bottomBoundary={1200}
                activeClass={''}
                innerClass={'table-border-b px-6 lg:flex justify-between hidden z-[100] py-[1rem] lg:!-mb-[19px] xl:!mb-0 lg:!top-[-19px] xl:!top-[0]'}
                className={`z-[100]`}
              >
                <div className='w-[20%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'></div>
                {sortOptions.map((option, index) => (
                  <div
                    className={`${index === 4 ? 'w-[8%]' : index === 0 ? 'w-[14%]' : 'w-[11%]'} font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg`}
                    key={`header-${index}`}
                  >
                    <div
                      onClick={() => {
                        setSort({
                          ...option,
                          isDesc: sort.value === option.value ? !sort.isDesc : true,
                        })
                      }}
                      className='flex items-center cursor-pointer space-x-1 -ml-1 relative'
                    >
                      {sort.value === option.value && (
                        <button className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-3.5`}>
                          <img alt='' src='/image/liquidity/arrow-bottom.svg' />
                        </button>
                      )}
                      <p className='flex items-center'>{option.label}</p>
                    </div>
                  </div>
                ))}
                <div className='w-[25%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'></div>
              </Sticky>
              <div className='flex flex-col rounded-[5px] gradient-bg p-px shadow-box'>
                {pairsData.map((item, idx) => {
                  return <TableRow isLast={idx === pairsData.length - 1} idx={idx} item={item} key={`row-${idx}`} />
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default NewTablePairs
