import React, { useContext, useMemo, useState } from 'react'
import TablePairs from '../../components/pages/liquidity/tablePairs'
import StyledButton from '../../components/common/Buttons/styledButton'
import Toggle from '../../components/common/Toggle'
import TabFilter from '../../components/common/TabFilter'
import MobileFilter from '../../components/common/MobileFilterModal'
import { PairsContext } from '../../context/PairsContext'
import { useAllHarvest } from '../../hooks/useGauge'
import { NewPools } from '../../config/constants'
import NewTablePairs from '../../components/pages/liquidity/newTablePairs'
import { ZERO_ADDRESS } from '../../utils/formatNumber'

const tabs = ['ALL', 'STABLE', 'VOLATILE']
const sortOptions = [
  {
    label: 'AP2R',
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

const Migration = () => {
  const [filter, setFilter] = useState(tabs[0])
  const [mobileFilter, setMobileFilter] = useState(false)
  const [isStaked, setIsStaked] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [sort, setSort] = useState(sortOptions[2])
  const [newSort, setNewSort] = useState({})
  const { pairs } = useContext(PairsContext)
  const { onAllHarvest } = useAllHarvest()

  const filteredPairs = useMemo(() => {
    const result = pairs.filter((item) => {
      let isCorrect = item.gauge.address !== ZERO_ADDRESS && item.isValid
      // return isCorrect && ((isStaked && !item.account.gaugeBalance.isZero()) || !isStaked)
      return isCorrect && item.account.gaugeBalance.gt(0)
    })
    let res
    switch (filter) {
      case tabs[0]:
        res = result
        break
      case tabs[1]:
        res = result.filter((item) => item.stable)
        break
      case tabs[2]:
        res = result.filter((item) => !item.stable)
        break

      default:
        break
    }
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
  }, [pairs, filter, searchText, isStaked])

  const newFilteredPairs = useMemo(() => {
    return filteredPairs.filter((item) => NewPools.includes(item.address) && item.gauge.apr.isZero())
  }, [filteredPairs])

  const oldFilteredPairs = useMemo(() => {
    return filteredPairs.filter((item) => !(NewPools.includes(item.address) && item.gauge.apr.isZero()))
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
    return pairs.filter((pair) => !pair.account.earnedUsd.isZero())
  }, [pairs])

  return (
    <>
      <div className='min-h-80  px-5 sm:px-16 md:px-28 mdLg:px-40 lg:px-5 xl:px-0 pt-20  md:pt-[120px] mx-auto'>
        <div className='lg:flex items-end justify-between'>
          <div className='max-w-[720px] w-full'>
            <h1 className='text-[34px] md:text-[48px] font-semibold text-white  f-f-fg'>Migration</h1>
            <p className='text-page-title-tips text-[#b8b6cb] text-base md:text-lg leading-[22px] md:leading-6 mt-24px'>
              Some of our pools are migrating. In order to keep adding liquidity or staking to your pool you have to migrate. Keep in mind that new gauges won't
              receive emissions until Thursday April 21st 00:00 GMT.
            </p>
          </div>
          <div className="flex justify-between">
            <div className='mt-3 lg:mt-0  flex-col flex md:flex-row items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3 '>
              <StyledButton
                  disabled={earnedPairs.length === 0}
                  onClickHandler={() => {
                    onAllHarvest(earnedPairs)
                  }}
                  content={`CLAIM ALL EARNINGS (${earnedPairs.length})`}
                  className='py-[13px] md:py-[14.53px] text-grey w-full md:w-1/2 mdLg:w-auto flex items-center justify-center text-sm tracking-[0.84px] xl:text-[17px] md:tracking-[1.36px] px-[33px] lg:px-[43px] xl:px-[33px] rounded-[3px]'
              />
            </div>

            <div className='hidden lg:flex items-center space-x-8'>
              <TabFilter data={tabs} filter={filter} setFilter={setFilter} className={'max-w-[360px] xl:max-w-[339px]'} />
              <div className='flex items-center space-x-2'>
                <Toggle checked={isStaked} onChange={() => setIsStaked(!isStaked)} toggleId='isStaked' />
                <p className='text-color-2 text-sm xl:text-[17px] whitespace-nowrap'>Staked Only</p>
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between w-full mt-[23px] lg:space-x-8 xl:space-x-[60px] relative'>
          {/* for desktop */}
          <div className='w-full lg:w-1/2 flex justify-end lg:items-center space-x-3 lg:space-x-5'>
            <div className='w-full rounded-[3px] flex items-center lg:max-w-[250px] relative'>
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

          {/* mobile filters popup */}
          {mobileFilter && (
            <MobileFilter
              setMobileFilter={setMobileFilter}
              setFilter={setFilter}
              filter={filter}
              tabs={tabs}
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
          isMigration={true}
        />
      </div>
    </>
  )
}

export default Migration
