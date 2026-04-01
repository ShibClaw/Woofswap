import React, { useState, useMemo, useEffect } from 'react'
import Sticky from 'react-stickynode'
import { NumberOfRows } from '../../../config/constants'
import Pagination from '../../common/Pagination'
import TabFilter from '../../common/TabFilter'
import ReactTooltip from 'react-tooltip'
import Timer from '../../common/Timer'
import { useEpochTimer } from '../../../hooks/useGeneral'
import { formatAmount } from '../../../utils/formatNumber'

const rewardsTypes = ['Current Epoch', 'Previous Epoch']

const TableRow = ({ item, idx, isLast }) => {
  return (
    <div
      key={idx}
      className={`
  ${isLast ? 'rounded-b-[5px]' : ''}
  ${idx === 0 && 'rounded-t-lg'}
  table-border-b mb-px flex flex-wrap lg:flex-nowrap items-start lg:min-h-[85px] lg:items-center w-full justify-between  text-[#DEDBF2] p-4 lg:py-5 px-4 xl:px-6 bg-[#16033A]`}
    >
      <div className='w-1/2  lg:w-[20%]'>
        <p className='lg:hidden f-f-fg text-[13px] leading-[15px] font-semibold '>Rank</p>
        {typeof item.rank === 'number' ? (
          <p className='text-[22px] f-f-fg leading-6 text-[#DEDBF2]'>{item.rank}</p>
        ) : (
          <img alt='token image' className='mt-0.5 w-[34px] lg:w-auto' src={item.rank} />
        )}
      </div>
      <div className='w-1/2  lg:w-[35%]'>
        <p className='lg:hidden f-f-fg text-[13px] leading-[15px] font-semibold '>Codename</p>
        {item.code}
      </div>
      <div className='w-1/2  lg:w-[20%] mt-[18px] lg:mt-0'>
        <p className='lg:hidden f-f-fg text-[13px] leading-[15px] font-semibold '>Volume</p>${formatAmount(item.volume)}
      </div>
      <div className='w-1/2  lg:w-[25%] flex lg:items-end flex-col mt-[18px] lg:mt-0 lg:justify-end'>
        <div className='w-full lg:hidden'>
          <div data-tip data-for={`custom-tooltip2`} className=' f-f-fg text-[13px] leading-[15px] font-semibold flex items-center cursor-pointer space-x-1.5'>
            <p>Potential Reward</p>
            <img alt='' className='invert-img' src='/image/swap/question-mark.png' />
          </div>
          <ReactTooltip
            className='max-w-[180px] !bg-[#090333] !border !border-white !text-[#E6E6E6] !text-sm !py-[6px] !px-3 !opacity-100 after:!bg-body '
            id={`custom-tooltip2`}
            place='top'
            effect='solid'
          >
            <p>
              {' '}
              The amount of rewards you will receive if you hold a current ranking in the leaderboard by the time we conclude the Ranking Score index
              calculation at the end of every Epoch.
            </p>
          </ReactTooltip>
        </div>
        {item.amount}
      </div>
    </div>
  )
}

const prizes = [1500, 1200, 1000, 800, 600, 400, 200, 100]

const Leaderboard = ({ currentData, prevData, isDaily }) => {
  const [pageSize, setPageSize] = useState(NumberOfRows[0])
  const [currentPage, setCurrentPage] = useState(0)
  const [filter, setFilter] = useState(rewardsTypes[0])
  const { days, hours, mins } = useEpochTimer()
  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }
  const totalPrize = prizes.reduce((sum, cur) => {
    return sum + cur
  }, 0)
  const updatedData = useMemo(() => {
    const final = filter === rewardsTypes[0] ? currentData : prevData
    return final.map((data, index) => {
      if (index < 8) {
        return {
          ...data,
          rank: `/image/referral/${index + 1}.png`,
          amount: formatAmount(isDaily ? prizes[index] / 7 : prizes[index]) + ' USD',
        }
      } else {
        return {
          ...data,
          rank: index + 1,
          amount: '-',
        }
      }
    })
  }, [currentData, prevData, filter, isDaily])

  useEffect(() => {
    setCurrentPage(0)
  }, [pageSize, filter])

  const pageCount = useMemo(() => {
    return Math.ceil(updatedData.length / pageSize)
  }, [updatedData, pageSize])

  const totalInfo = useMemo(() => {
    return [
      {
        title: isDaily ? 'Daily Reward' : 'Weekly Reward',
        balance: `${formatAmount(isDaily ? totalPrize / 7 : totalPrize)} USD`,
      },
      {
        title: 'Epoch Timer',
        balance: isDaily ? `${hours}h ${mins}m` : `${days}d ${hours}h ${mins}m`,
      },
    ]
  }, [days, hours, mins, isDaily])

  return (
    <div className='lg:ml-6 w-full mt-3 lg:mt-0'>
      <div className=' lg:flex items-center justify-between'>
        <div className='lg:max-w-[357px]'>
          <h3 className='f-f-fg text-[27px] leading-6  md:text-4xl f-f-fg font-medium gradient-text'>Leaderboard</h3>
          <p className='text-[#B8B6CB] mt-2 leading-6'>
            {isDaily ? 'Top 8 referrers receive a bonus each day.' : 'Top 8 referrers of each round receive a bonus.'}
          </p>
        </div>
        <Timer className={'mt-3 lg:mt-0 w-full lg:max-w-[410px]'} arr={totalInfo} />
      </div>
      <TabFilter data={rewardsTypes} filter={filter} setFilter={setFilter} className={'max-w-[440px] xl:max-w-[480px] mt-4 lg:mt-10'} />

      <div className='mt-5 lg:mt-7 w-full'>
        <div className='w-full'>
          {updatedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
            <>
              <Sticky
                enabled={true}
                innerActiveClass={'gradientBorder'}
                top={95}
                bottomBoundary={1200}
                activeClass={''}
                innerClass={'table-border-t table-border-b px-6 lg:flex justify-between hidden z-[100] py-[1rem] lg:!-mb-[19px] xl:!mb-0 lg:!top-[-19px] xl:!top-[0]'}
                className={`z-[100]`}
              >
                <div className='w-[20%] font-semibold text-[17px] xl:text-[18px] text-grey f-f-fg'>Rank</div>
                <div className='w-[35%] font-semibold text-[17px] xl:text-[18px] text-grey f-f-fg'>Codename</div>
                <div className='w-[20%] font-semibold text-[17px] xl:text-[18px] text-grey f-f-fg'>Volume</div>
                <div className='w-[25%] font-semibold text-[17px] xl:text-[18px] text-grey f-f-fg flex items-center justify-end'>
                  <div data-tip data-for={`custom-tooltip`} className='flex items-center cursor-pointer space-x-1.5'>
                    <p>Potential Reward</p>
                    <img alt='' className='invert-img' src='/image/swap/question-mark.png' />
                  </div>
                  <ReactTooltip
                    className=' !bg-[#090333]  !max-w-[200px] !border !border-white  !text-[#E6E6E6] !text-sm !py-[6px] !px-2 !opacity-100 after:!bg-body '
                    id={`custom-tooltip`}
                    place='top'
                    effect='solid'
                  >
                    <p>
                      {' '}
                      The amount of rewards you will receive if you hold a current ranking in the leaderboard by the time we conclude the Ranking Score index
                      calculation at the end of every Epoch.
                    </p>
                  </ReactTooltip>
                </div>
              </Sticky>
              <div className='flex flex-col rounded-[5px] gradient-bg p-px shadow-box'>
                {updatedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((item, idx) => {
                  return (
                    <TableRow
                      isLast={idx === updatedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length - 1}
                      idx={idx}
                      item={item}
                      key={`row-${idx}`}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <div className='rounded-[3px] gradient-bg p-px shadow-box'>
              <div className='py-9 px-4 flex flex-col items-center justify-center bg-[#16033A] rounded-[3px]'>
                <p className='f-f-fg text-[23px] md:text-[27px] leading-[33px] text-grey font-medium'>No Data</p>
                {/* <div className='flex items-center  space-x-3.5 cursor-pointer group mt-1'>
                  <span className='text-lg md:text-xl text-green'>Invite a Friend</span>
                  <img className={`group-hover:w-[40px] w-[30px] duration-300 ease-in-out`} src='/image/common/spear.svg' alt='' />
                </div> */}
              </div>
            </div>
          )}
        </div>
        {updatedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
          <Pagination
            pageSize={pageSize}
            setPageSize={setPageSize}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            currentPage={currentPage}
            total={updatedData.length}
          />
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default Leaderboard
