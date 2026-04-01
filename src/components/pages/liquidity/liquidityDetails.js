import React from 'react'
import { formatAmount } from '../../../utils/formatNumber'

const LiquidityDetails = ({ pair, slippage }) => {
  return (
    <div className='w-full my-4'>
      <div className='text-grey-2 text-sm md:text-base font-medium pb-1 border-b border-[#757384]'>Reserve Info</div>
      <div className='flex justify-around mt-4 w-full'>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-grey-1-0 text-sm md:text-base leading-5 font-medium'>{formatAmount(pair.token0.reserve)}</p>
          <p className='text-grey-1-0 text-sm md:text-base leading-5'>{pair.token0.symbol}</p>
        </div>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-grey-1-0 text-sm md:text-base leading-5 font-medium'>{formatAmount(pair.token1.reserve)}</p>
          <p className='text-grey-1-0 text-sm md:text-base leading-5'>{pair.token1.symbol}</p>
        </div>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-grey-1-0 text-sm md:text-base leading-5 font-medium'>{slippage}%</p>
          <p className='text-grey-1-0 text-sm md:text-base leading-5'>Slippage</p>
        </div>
      </div>
      <div className='text-grey text-sm md:text-base font-medium mt-4 pb-1 border-b border-[#757384]'>Your Balances</div>
      <div className='flex justify-around mt-4 w-full'>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-grey-1-0 text-sm md:text-base leading-5 font-medium'>{formatAmount(pair.account.totalLp)}</p>
          <p className='text-grey-1-0 text-sm md:text-base leading-5'>Pooled {pair.symbol}</p>
        </div>
        <div className='flex flex-col items-center justify-between'>
          <p className='text-grey-1-0 text-sm md:text-base leading-5 font-medium'>{formatAmount(pair.account.gaugeBalance)}</p>
          <p className='text-grey-1-0 text-sm md:text-base leading-5'>Staked {pair.symbol}</p>
        </div>
      </div>
    </div>
  )
}

export default LiquidityDetails
