import React from 'react'
import Toggle from '../Toggle'
import TabFilter from '../TabFilter'
import MobileDropDown from '../MobileDropDown'
const MobileFilterModal = ({
  setMobileFilter,
  setFilter,
  filter,
  tabs,
  // active,
  // setActive,
  isStaked,
  setIsStaked,
  sortOptions,
  sort,
  setSort,
  isVote = false,
  isVoted,
  setIsVoted,
  activeTab,
  setActiveTab,
  activeTabs,
}) => {
  return (
    <>
      <div className='fixed bg-transparent bg-mask w-full h-full lg:hidden inset-0 z-40' onClick={() => setMobileFilter(false)} />
      <div className={`absolute w-full bg-[#101645] lg:hidden border-white border rounded-[5px] p-3 z-50 top-14`}>
        <p className='text-white normal-family font-semibold f-f-fg text-xl mb-3'>Filters</p>
        <TabFilter data={tabs} filter={filter} setFilter={setFilter} className={'max-w-[339px]'} />
        <div className='w-full flex items-center space-x-7 mt-4'>
          <p className='text-grey-1 font-medium whitespace-nowrap'>Sort by</p>
          <MobileDropDown options={sortOptions} sort={sort} setSort={setSort} />
        </div>
        {isVote ? (
          <div className='flex items-center space-x-2 mt-4'>
            <Toggle checked={isVoted} onChange={() => setIsVoted(!isVoted)} small toggleId='votes' />
            <p className='text-[#DEDBF2] text-[16px] whitespace-nowrap'>Show My Votes</p>
          </div>
        ) : (
          <>
            <div className='flex items-center space-x-2 mt-4'>
              <Toggle checked={isStaked} onChange={() => setIsStaked(!isStaked)} small toggleId='pools' />
              <p className='text-[#DEDBF2] text-[16px] whitespace-nowrap'>Staked Only</p>
            </div>
            {activeTab && <TabFilter data={activeTabs} filter={activeTab} setFilter={setActiveTab} className={'max-w-[339px] mt-4'} />}
            {/* <div className='flex items-center space-x-2 mt-4'>
              <Toggle checked={active} onChange={() => setActive(!active)} small toggleId='active-pools' />
              <p className='text-[#DEDBF2] text-[16px] whitespace-nowrap'>Gauges Only</p>
            </div> */}
          </>
        )}
      </div>
    </>
  )
}

export default MobileFilterModal
