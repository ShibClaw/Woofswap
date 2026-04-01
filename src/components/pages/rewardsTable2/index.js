import React, { useContext, useMemo, useState } from 'react'
import TablePairs from '../rewardsTable2/tablePairs'
import StyledButton from '../../common/Buttons/styledButton'
import Toggle from '../../common/Toggle'
import TransparentButton from '../../common/Buttons/transparentButton'
import { useNavigate } from 'react-router-dom'
import TabFilter from '../../common/TabFilter'
import MobileFilter from '../../common/MobileFilterModal'
import { useAllHarvest } from '../../../hooks/useGauge'
import { NewPools, PoolTitles } from '../../../config/constants'
import NewTablePairs from '../../pages/rewardsTable2/newTablePairs'
import { ZERO_ADDRESS } from '../../../utils/formatNumber'
import { GammasContext } from '../../../context/GammasContext'
import { PairsContext } from '../../../context/PairsContext'
import SearchInput from "../../common/Input/SearchInput";

// const tabs = ['ALL', 'STABLE', 'VOLATILE', 'V3 NARROW', 'V3 WIDE', 'V3 STABLE']
const tabs = ['ALL', 'STABLE', 'VOLATILE']
const activeTabs = ['ACTIVE', 'INACTIVE']
const sortOptions = [

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
    label: 'Earnings',
    value: 'earn',
    isDesc: true,
  },
]
const newSortOptions = [

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
  const [sort, setSort] = useState({})
  const [newSort, setNewSort] = useState({})
  const { pairs } = useContext(PairsContext)
  const gammas = useContext(GammasContext)
  const { onAllHarvest } = useAllHarvest()

  const filteredPairs = useMemo(() => {
    const final = activeTab === activeTabs[0] ? pairs : gammas
    const result = final.filter((item) => {
      const isCorrect = item.gauge.address !== ZERO_ADDRESS && item.isValid
      return isCorrect && ((isStaked && !item.account.gaugeBalance.isZero()) || !isStaked)
    })
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
  }, [gammas, pairs, filter, searchText, isStaked, activeTab])

  const newFilteredPairs = useMemo(() => {
    if (new Date().getTime() / 1000 < timestamp) {
      return filteredPairs.filter((item) => NewPools.includes(item.address))
    }
    return filteredPairs.filter((item) => NewPools.includes(item.address) )
  }, [filteredPairs])

  const oldFilteredPairs = useMemo(() => {
    if (new Date().getTime() / 1000 < timestamp) {
      return filteredPairs.filter((item) => !NewPools.includes(item.address))
    }
    return filteredPairs.filter((item) => !(NewPools.includes(item.address) ))
  }, [filteredPairs])

  const sortedPairs = useMemo(() => {
    return oldFilteredPairs.sort((a, b) => {
      let res
      switch (sort.value) {
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

  const newSortedPairs = useMemo(() => {
    return newFilteredPairs.sort((a, b) => {
      let res
      switch (newSort.value) {
        case 'apr':
          res = a.gauge.projectedApr
              .minus(b.gauge.projectedApr)
              .times(newSort.isDesc ? -1 : 1)
              .toNumber()
          break
        case 'tvl':
          res = a.gauge.tvl
              .minus(b.gauge.tvl)
              .times(newSort.isDesc ? -1 : 1)
              .toNumber()
          break
        case 'pool':
          res = a.account.totalUsd
              .minus(b.account.totalUsd)
              .times(newSort.isDesc ? -1 : 1)
              .toNumber()
          break
        case 'stake':
          res = a.account.stakedUsd
              .minus(b.account.stakedUsd)
              .times(newSort.isDesc ? -1 : 1)
              .toNumber()
          break
        case 'earn':
          res = a.account.earnedUsd
              .minus(b.account.earnedUsd)
              .times(newSort.isDesc ? -1 : 1)
              .toNumber()
          break

        default:
          break
      }
      return res
    })
  }, [newFilteredPairs, newSort])

  const earnedPairs = useMemo(() => {
    return pairs.filter((pair) => !pair.account.gaugeEarned.isZero())
  }, [pairs, activeTab])

  const navigate = useNavigate()

  const handlePopup = () => {
    navigate('/liquidity/manage')
  }

  return (
      <>
        <div className='max-w-[1200px] mt-48px  xl:px-0 mx-auto'>
          <div className="table-normal-header-title mt-48px">
            <span>POOL REWARDS</span>
            <StyledButton
                disabled={earnedPairs.length === 0}
                onClickHandler={() => {
                  onAllHarvest(earnedPairs)
                }}
                content={`Claim All (${earnedPairs.length})`}
                className='text-white rounded-[3px] px-[35px] py-2 md:py-[9px] mt-3 lg:mt-0 w-full lg:w-auto'
            />
          </div>
          <div className=' table-normal-header-b  flex items-center justify-between w-full lg:space-x-8 xl:space-x-[60px] relative'>
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
                <div className=' w-full rounded-[3px] flex items-center lg:max-w-[250px] relative'>
                  <img className='pointer-events-none absolute left-3 w-6 h-6' alt='' src='/image/icons/icon-search.svg' />
                  <input
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder='Search Pair or Token'
                      className='bg-body-white placeholder-[#757384] h-[42px] xl:h-[52px] w-full  text-grey text-sm xl:text-base pl-10 xl:pl-[41px] pr-4 py-3 md:py-[18px] rounded-[3px]'
                  />
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
          <NewTablePairs pairsData={newSortedPairs} sort={newSort} setSort={setNewSort} sortOptions={newSortOptions} filter={filter} searchText={searchText} />
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
