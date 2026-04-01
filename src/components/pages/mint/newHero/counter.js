import React from 'react'

const Counter = ({ title, count, className, small }) => {
  return (
    <div className={`${className}`}>
      <p className='text-sm md:text-lg leading-5 font-medium f-f-fg text-[#DEDBF2]'>{title}</p>
      <p
        className={`${
          small
            ? 'mt-[5.29px] text-[22px] lg:text-[27px] leading-[33px] font-regular'
            : 'mt-1 md:mt-0.5 text-2xl md:text-[27px] lg:text-[32px] leading-none md:leading-[39px] font-semibold'
        }  text-grey`}
      >
        {count}
      </p>
    </div>
  )
}

export default Counter
