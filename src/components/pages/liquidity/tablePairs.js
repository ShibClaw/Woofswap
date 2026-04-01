import React, { useState, useMemo, useEffect, useContext } from 'react'
import TransparentButton from '../../common/Buttons/transparentButton'
import ReactTooltip from 'react-tooltip'
import Pagination from '../../common/Pagination'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import Sticky from 'react-stickynode'
import useWalletModal from '../../../hooks/useWalletModal'
import { formatAmount, getLP0Symbol, getLP1Symbol, ZERO_ADDRESS ,toWei,fromWei} from '../../../utils/formatNumber'
import { useNavigate } from 'react-router-dom'
import { useHarvest } from '../../../hooks/useGauge'
import DepositModal from './depositModal'
import { NumberOfRows } from '../../../config/constants'
import NoFound from '../../common/NoFound'
import MigrateV2Modal from './migrateV2Modal'
import MigrateV3Modal from './migrateV3Modal'
import { GammasContext } from '../../../context/GammasContext'
import {useClaimFees} from "../../../hooks/useRewards";

const ItemWithTooltip = ({ usd, content, account, idx, type }) => {
  const [arrowReverse, setArrowReverse] = useState()
  return account || type === 'tvl' ? (
    <div className='flex flex-col items-start justify-center'>
      <div
        data-tip
        data-for={`${type}-${idx}`}
        onMouseEnter={() => {
          setArrowReverse(`${type}-${idx}`)
        }}
        onMouseLeave={() => {
          setArrowReverse(null)
        }}
        className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px] flex items-center cursor-pointer space-x-1.5'
      >
        <p>{'$' + formatAmount(usd, true)}</p>
        <button className={`${arrowReverse === `${type}-${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
          <img alt='' src='/image/liquidity/small-arrow-bottom.svg' />
        </button>
      </div>
      <ReactTooltip
        className='max-w-[180px] !bg-[#090333] !border !border-white !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body'
        id={`${type}-${idx}`}
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

const TableRow = ({ item, isLast, idx, isMigration }) => {
  const [isOpen, setIsOpen] = useState(!item.account.gaugeBalance.isZero())
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { openWalletModal } = useWalletModal()
  const navigate = useNavigate()
  const { onHarvest, pending } = useHarvest()
    const { onClaimFees, pending: feePending } = useClaimFees()
  const [manage, setManage] = useState(false)
  const [migrateV2, setMigrateV2] = useState(false)
  const [migrateV3, setMigrateV3] = useState(false)
  const fusions = useContext(GammasContext)
  const fusion = fusions.find((ele) => ele.address.toLowerCase() === item.address.toLowerCase() && ele.gauge.address !== ZERO_ADDRESS)
  const gammas = useMemo(() => {
    return fusions.filter((ele) => ele.isGamma && ele.gauge.address !== ZERO_ADDRESS)
  }, [fusions])
  const gamma = gammas.find((ele) => {
    return (
      (ele.token0.address === item.token0.address && ele.token1.address === item.token1.address) ||
      (ele.token0.address === item.token1.address && ele.token1.address === item.token0.address)
    )
  })
  return (
    <div
      key={idx}
      className={`
    ${isLast ? 'rounded-b-[5px]' : ''}
    ${idx === 0 && 'rounded-t-lg'}
     no-b-radius hover-row mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-[#DEDBF2] p-4 lg:py-5 px-4 xl:px-6 bg-[#16033A]`}
    >
      <div className='w-full lg:w-[15%]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3 mr:0 lg:mr-3'>
            <div className='flex items-center -space-x-2'>
              <img className='relative z-10' alt='' src={item.token0.logoURI?item.token0.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={30} height={30} />
              <img className='relative z-[5]' alt='' src={item.token1.logoURI?item.token1.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={30} height={30} />
            </div>
            <div>
              <div className='flex flex-wrap text-base xl:text-[12px] leading-[30px] font-medium'>
                <span>{getLP0Symbol(item)}</span>/<span>{getLP1Symbol(item)}</span>
              </div>
              <p className='tracking-[0.78px] text-[12px] leading-none'>{item.title}</p>
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
      <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[8%] items-start justify-center'>
        <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>APR</p>
        <div className='flex flex-col w-full web-table-row justify-center text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>
          {formatAmount(item.gauge.apr, true)}%
        </div>
      </div>
      <div className='flex flex-col w-1/2 mt-2 lg:mt-0  web-table-row lg:w-[15%] justify-center'>
        <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Total Staked</p>
        <div className='web-table-row'>
          <div>{item.gauge.pairInfo_pooled0 ? formatAmount(item.gauge.pairInfo_pooled0):formatAmount(item.gauge.pooled0)} {item.token0.symbol}</div>
          <div>{item.gauge.pairInfo_pooled1 ? formatAmount(item.gauge.pairInfo_pooled1):formatAmount(item.gauge.pooled1)} {item.token1.symbol}</div>
        </div>
      </div>
      {/* second row */}
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col  web-table-row w-1/2 mt-3 lg:mt-0 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>My Stake</p>
        <div className='web-table-row'>
          <div>{item.account.myStaked0?formatAmount( fromWei(item.account.myStaked0,item.account.pairInfo_token0_decimals)):"-"} {item.token0.symbol}</div>
          <div> {item.account.myStaked1?formatAmount( fromWei(item.account.myStaked1,item.account.pairInfo_token1_decimals)):"-"} {item.token1.symbol}</div>
        </div>
      </div>
      <div className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col  web-table-row mt-3 lg:mt-0 w-1/2 lg:w-[11%] justify-center`}>
        <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Total Pool</p>
        <div className='web-table-row'>
          <div className='word-break-normal'> { item.account.pairInfo_reserve0?formatAmount( fromWei(item.account.pairInfo_reserve0,item.account.pairInfo_token0_decimals)):"-"} {item.token0.symbol}</div>
          <div className='word-break-normal'>  {item.account.pairInfo_reserve1?formatAmount(fromWei(item.account.pairInfo_reserve1,item.account.pairInfo_token1_decimals)):"-"} {item.token1.symbol}</div>
        </div>
      </div>

      {/*<div className={`${isOpen ? 'block' : 'hidden'} lg:block  w-1/2 lg:w-[8%] mt-2 lg:mt-0`}>*/}
      {/*  <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Earnings</p>*/}
      {/*  <ItemWithTooltip*/}
      {/*    account={account}*/}
      {/*    type={'earning'}*/}
      {/*    usd={item.account.earnedUsd}*/}
      {/*    content={<>{formatAmount(item.account.gaugeEarned)} WOOF</>}*/}
      {/*    idx={idx}*/}
      {/*  />*/}
      {/*</div>*/}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block  w-1/2 lg:w-[11%]  web-table-row  mt-2 lg:mt-0`}>
        <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>My Pool</p>
        <div className='web-table-row'>
          <div>{item.account.myPool0?formatAmount(fromWei( item.account.myPool0,item.account.pairInfo_token0_decimals)):"-" } {item.token0.symbol}</div>
          <div>{item.account.myPool1?formatAmount(fromWei( item.account.myPool1,item.account.pairInfo_token1_decimals)):"-"} {item.token1.symbol}</div>
        </div>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[25%] mt-3.5 lg:mt-0`}>
        {address ? (
          !isMigration ? (
            <div className='space-x-5 xl:space-x-6 w-full flex items-center lg:justify-end'>

              {

                  item.token0claimable && item.token1claimable &&  (!item.token0claimable.isZero() || !item.token1claimable.isZero())?(
                      <div className=''
                                  className={`${ feePending ? 'opacity-[0.33] cursor-not-allowed ' : 'text-d-u'} web-table-row`}
                            onClick={() => {
                            onClaimFees(item)
                        }}
                        >
                                <div>{formatAmount(item.token0claimable)} {item.token0.symbol}</div>
                                <div>{formatAmount(item.token1claimable)} {item.token1.symbol}</div>
                        </div>
                    ):null
                        }
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
                className='h-10 border-img  px-[26px] text-grey flex  max-w-[96px] whitespace-nowrap flex-col items-center justify-center tex-sm xl:text-[17px] w-full'
              />




            </div>
          ) : (null
          )
        ) : (
          <div className='w-full flex items-center lg:justify-end'>
            <TransparentButton
              onClickHandler={openWalletModal}
              content={'Connect Wallet'}
              className='btn-con-wallet h-10 px-[26px]  flex lg:max-w-[140px] whitespace-nowrap flex-col items-center justify-center tex-sm xl:text-[17px]'
            />
          </div>
        )}
      </div>
      {manage && <DepositModal isOpen={manage} setIsOpen={setManage} pair={item} />}
      {migrateV2 && <MigrateV2Modal isOpen={migrateV2} setIsOpen={setMigrateV2} pair={item} fusion={fusion} />}
      {migrateV3 && <MigrateV3Modal isOpen={migrateV3} setIsOpen={setMigrateV3} pair={item} gamma={gamma} />}
    </div>
  )
}

const TablePairs = ({ pairsData, sort, setSort, sortOptions, /* active, */ filter, searchText, isStaked, isMigration = false }) => {
  const [pageSize, setPageSize] = useState(NumberOfRows[0])
  const [currentPage, setCurrentPage] = useState(0)

  const pageCount = useMemo(() => {
    return Math.ceil(pairsData.length / pageSize)
  }, [pairsData, pageSize])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  // useEffect(() => {
  //   setCurrentPage(0)
  // }, [pageSize, active, filter])

  useEffect(() => {
    setCurrentPage(0)
  }, [pageSize, filter, searchText, isStaked])

  return (
    <>
      {/* for desktop */}
      <div className='w-full '>
        <div className='table-normal w-full'>
          {pairsData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
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
                <div className='w-[14%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'></div>
                {sortOptions.map((option, index) => (
                  <div
                    className={`${index === 1 ? 'w-[15%]' : index === 0 ? 'w-[8%]' : 'w-[11%]'} font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg`}
                    key={`header-${index}`}
                  >
                    <div
                      onClick={() => {
                        setSort({
                          ...option,
                          isDesc: sort.value === option.value ? !sort.isDesc : true,
                        })
                      }}
                      className='flex items-center justify-end cursor-pointer space-x-1 relative'
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
                <div className='w-[25%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'>
                    <div className='flex items-center justify-end cursor-pointer space-x-1 relative'>
        <p className='flex items-center'>Fees / Manage</p>
                    </div>

                </div>
              </Sticky>

              <div className='flex flex-col rounded-[5px] gradient-bg p-px shadow-box'>
                {pairsData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((item, idx) => {
                  return (
                    <TableRow
                      isLast={idx === pairsData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length - 1}
                      idx={idx}
                      item={item}
                      key={`row-${idx}`}
                      isMigration={isMigration}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <NoFound title='No pools found' />
          )}
        </div>
        <Pagination
            pageSize={pageSize}
            setPageSize={setPageSize}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            currentPage={currentPage}
            total={pairsData.length}
        />
      </div>
    </>
  )
}

export default TablePairs
