import React, { useContext, useMemo, useState } from 'react'
import TablePairs from '../../components/pages/liquidity/tablePairs'
import StyledButton from '../../components/common/Buttons/styledButton'
import Toggle from '../../components/common/Toggle'
import TransparentButton from '../../components/common/Buttons/transparentButton'
import { useNavigate } from 'react-router-dom'
import TabFilter from '../../components/common/TabFilter'
import MobileFilter from '../../components/common/MobileFilterModal'
import { useAllHarvest } from '../../hooks/useGauge'
import { NewPools, PoolTitles } from '../../config/constants'
import NewTablePairs from '../../components/pages/liquidity/newTablePairs'
import { ZERO_ADDRESS } from '../../utils/formatNumber'
import { GammasContext } from '../../context/GammasContext'
import { PairsContext } from '../../context/PairsContext'
import SearchInput from "../../components/common/Input/SearchInput";
import {useUnstakedFeeRewards} from '../../hooks/useRewards'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import BigNumber from "bignumber.js";

// const tabs = ['ALL', 'STABLE', 'VOLATILE', 'V3 NARROW', 'V3 WIDE', 'V3 STABLE']
const tabs = ['ALL', 'STABLE', 'VOLATILE']
// const activeTabs = ['ACTIVE', 'INACTIVE']
const activeTabs = []
const sortOptions = [
  {
    label: 'APR',
    value: 'apr',
    isDesc: true,
  },
  {
    label: 'Total Staked',
    value: 'tvl',
    isDesc: true,
  },
  {
    label: 'My Stake',
    value: 'stake',
    isDesc: true,
  },
  {
    label: 'Total Pool',
    value: 'tp',
    isDesc: true,
  },
  {
    label: 'My Pool',
    value: 'pool',
    isDesc: true,
  },

  // {
  //   label: 'Earnings',
  //   value: 'earn',
  //   isDesc: true,
  // },
]
const newSortOptions = [
  {
    label: 'Projected APR',
    value: 'apr',
    isDesc: true,
  },
  {
    label: 'Total Staked',
    value: 'tvl',
    isDesc: true,
  },
  {
    label: 'My Pool',
    value: 'pool',
    isDesc: true,
  },
  {
    label: 'My Stake',
    value: 'stake',
    isDesc: true,
  },
  {
    label: 'Earnings',
    value: 'earn',
    isDesc: true,
  },
]

const timestamp = 1680739200

const Liquidity = () => {
  const [filter, setFilter] = useState(tabs[0])
  const [mobileFilter, setMobileFilter] = useState(false)
  const [isStaked, setIsStaked] = useState(false)
  const [activeTab, setActiveTab] = useState(activeTabs[0])
  const [searchText, setSearchText] = useState('')
  const [sort, setSort] = useState({value:"index",isDesc:false})
  const [newSort, setNewSort] = useState({})
  const { pairs,userPairs } = useContext(PairsContext)
  const unstakedFeeRewards =   useUnstakedFeeRewards()
  const gammas = useContext(GammasContext)
  const { onAllHarvest } = useAllHarvest()
    const { address, chainId, isConnected } = useWeb3ModalAccount()

  const filteredPairs = useMemo(() => {
    const final = activeTab === activeTabs[0] ? pairs : gammas
      for(let i=0;i<final.length;i++){
          const found = unstakedFeeRewards.find((ele) => ele.address.toLowerCase() === final[i].address.toLowerCase())
          if(found){
              final[i].token0claimable = found.token0claimable;
              final[i].token1claimable = found.token1claimable;
          }
          //debugger
      }

      for(let i=0;i<unstakedFeeRewards.length;i++){
          const found = final.find((ele) => ele.address.toLowerCase() === unstakedFeeRewards[i].address.toLowerCase())
          if(!found){
              final.push(unstakedFeeRewards[i])
          }
      }

      const resultGauge = userPairs.filter((item) => {
          //const isCorrect = item.gauge.address !== ZERO_ADDRESS && item.isValid
          return   !new BigNumber(item.account_gauge_balance).isZero()
      })

    const resultApi = final.filter((item) => {
        //const isCorrect = item.gauge.address !== ZERO_ADDRESS && item.isValid
        const isCorrect =  item.isValid
        return isCorrect && ((isStaked && !item.account.gaugeBalance.isZero()) || !isStaked)
    })
      for(let i=0;i<resultGauge.length;i++){
          let isIn = false;
          for(let n=0;n<resultGauge.length;n++){
              if(resultGauge[n].address==resultGauge[i].address)
                  isIn=true;
          }
          if(!isIn)
            resultApi.push(resultGauge[i])
      }

          const result = resultApi;// resultApi.concat(resultGauge);
      for(let i=0;i<result.length;i++)
          result[i].index = i;

          const res = filter === PoolTitles.ALL ? result : result.filter((item) => item.title === filter)
    if (!searchText || searchText === '') {
      return res
    }
    return (
        res &&
        res.filter((item) => {
          const withSpace = item.symbol.replace('/', ' ')
          const withComma = item.symbol.replace('/', ',')
          return (
              item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
              withSpace.toLowerCase().includes(searchText.toLowerCase()) ||
              withComma.toLowerCase().includes(searchText.toLowerCase())
          )
        })
    )
  }, [gammas, pairs,unstakedFeeRewards, filter, searchText, isStaked, activeTab,chainId])

  const newFilteredPairs = useMemo(() => {
    if (new Date().getTime() / 1000 < timestamp) {
      return filteredPairs.filter((item) => NewPools.includes(item.address))
    }
    return filteredPairs.filter((item) => NewPools.includes(item.address) && item.gauge.apr.isZero())
  }, [filteredPairs])

  const oldFilteredPairs = useMemo(() => {
    if (new Date().getTime() / 1000 < timestamp) {
      return filteredPairs.filter((item) => !NewPools.includes(item.address))
    }
    return filteredPairs.filter((item) => !(NewPools.includes(item.address) && item.gauge.apr.isZero()))
  }, [filteredPairs])

  const sortedPairs = useMemo(() => {

      if(!sort.value)
          return oldFilteredPairs;

    return oldFilteredPairs.sort((a, b) => {
      let res
      switch (sort.value) {
          case 'index':
              res = a.index>b.index ?((sort.isDesc)? -1 : 1):((sort.isDesc)? 1 : -1)
              break
        case 'apr':
          res = a.gauge.apr
              .minus(b.gauge.apr)
              .times(sort.isDesc ? -1 : 1)
              .toNumber()
          break
        case 'tvl':
          res = a.gauge.tvl
              .minus(b.gauge.tvl)
              .times(sort.isDesc ? -1 : 1)
              .toNumber()
          break
        case 'pool':
          res = a.account.totalUsd
              .minus(b.account.totalUsd)
              .times(sort.isDesc ? -1 : 1)
              .toNumber()
          break
        case 'stake':
          res = a.account.stakedUsd
              .minus(b.account.stakedUsd)
              .times(sort.isDesc ? -1 : 1)
              .toNumber()
          break
        case 'earn':
          res = a.account.earnedUsd
              .minus(b.account.earnedUsd)
              .times(sort.isDesc ? -1 : 1)
              .toNumber()
          break

        default:
          break
      }
      return res
    })
  }, [oldFilteredPairs, sort])


  const navigate = useNavigate()

  const handlePopup = () => {
    navigate('/liquidity/manage')
  }

  return (
      <>
        <div className='min-h-80  px-5 sm:px-16 md:px-28 mdLg:px-40 lg:px-5 xl:px-0 pt-20  md:pt-[120px] mx-auto'>
          <div className='lg:flex items-end justify-between'>
            <div className='max-w-[425px] w-full'>
              <h1 className='text-page-title text-[34px] md:text-[42px] font-medium text-white  f-f-fg'>Liquidity</h1>
              <p className='text-page-title-tips text-[#b8b6cb] text-base md:text-lg leading-[22px] md:leading-6 mt-24px'>
                Pair your tokens to provide liquidity. Stake the LP tokens to earn WOOF.{' '}
                <a href='https://woofswap.gitbook.io/woofswap/introduction/woofswap' target='_blank' rel='noreferrer'>
                  <img className="icon-size-help icon-help invert-img" src="/image/swap/question-mark.png" />
                  {/*<span className='!text-lg text-green'>Learn More</span>*/}
                </a>
              </p>
            </div>
            <div className="flex items-center">
              <div className='mt-3 lg:mt-0 flex-col flex md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3 '>

                <TransparentButton
                    content={'ADD/REMOVE LIQUIDITY'}
                    className={
                      'border-img  h-[42px] md:h-[52px] px-7 text-grey lg:hidden flex flex-col items-center justify-center w-full md:w-1/2 mdLg:w-auto text-sm mdLg:text-[17px] tracking-[1.12px] md:tracking-[1.36px]'
                    }
                    onClickHandler={handlePopup}
                />
              </div>
              <TransparentButton
                  showIcon={true}
                  content={'Add/Remove Liquidity'}
                  className={
                    'normal-btn-1 border-img unset-flex-direction text-grey hidden lg:flex flex-col items-center justify-center text-sm xl:text-[17px]'
                  }
                  onClickHandler={handlePopup}
              />
            </div>
          </div>

          <div className=' table-normal-header mt-48px flex items-center justify-between w-full lg:space-x-8 xl:space-x-[60px] relative'>
            {/* for desktop */}
            <div className='w-[40%] hidden lg:flex items-center space-x-8'>
              <TabFilter data={tabs} filter={filter} setFilter={setFilter} />
              <div className='flex items-center space-x-2'>
                <Toggle checked={isStaked} onChange={() => setIsStaked(!isStaked)} toggleId='isStaked' />
                <p className='text-color-2 text-sm xl:text-[17px] whitespace-nowrap'>Staked Only</p>
              </div>
              {/*<TabFilter data={activeTabs} filter={activeTab} setFilter={setActiveTab} className={'max-w-[360px] xl:max-w-[339px]'} />*/}
            </div>

            <div className='flex mobile-flex-1 flex-col lg:flex-row justify-between'>
              <div className='w-full mt-3 lg:mt-0 flex lg:items-center space-x-3 lg:space-x-5'>
                <div className='border-white w-full rounded-[3px] flex items-center lg:max-w-[250px] relative'>
                  <input
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder='Search Pair or Token'
                      className='input-style bg-body-white placeholder-[#757384] h-[42px] xl:h-[52px] w-full  text-grey text-sm xl:text-base pl-10 xl:pl-[41px] pr-4 py-3 md:py-[18px] rounded-[3px]'
                  />
                  <div className='input-search-box flex items-center justify-center'onClick={() => setSearchText(searchText)}>
                    <img className='icon-size-normal' alt='' src='/image/icons/icon-search-white.svg' />
                  </div>
                </div>

                {/* filter button for mobile */}
                <button
                    onClick={() => {
                      setMobileFilter(!mobileFilter)
                    }}
                    className='w-12 flex-shrink-0 h-[42px] lg:hidden'
                >
                  <img alt='' className='w-12 h-[42px]' src='/image/liquidity/filter.svg' />
                </button>
              </div>
            </div>

            {/* mobile filters popup */}
            {mobileFilter && (
                <MobileFilter
                    setMobileFilter={setMobileFilter}
                    setFilter={setFilter}
                    filter={filter}
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    activeTabs={activeTabs}
                    // active={active}
                    // setActive={setActive}
                    isStaked={isStaked}
                    setIsStaked={setIsStaked}
                    sort={sort}
                    setSort={setSort}
                    sortOptions={sortOptions}
                />
            )}
          </div>
          {/* <TablePairs pairsData={sortedPairs} sort={sort} setSort={setSort} sortOptions={sortOptions} active={active} filter={filter} /> */}
          <TablePairs
              pairsData={sortedPairs}
              sort={sort}
              setSort={setSort}
              sortOptions={sortOptions}
              filter={filter}
              searchText={searchText}
              isStaked={isStaked}
          />
        </div>
      </>
  )
}

export default Liquidity
