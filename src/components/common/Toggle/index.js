import React from 'react'

const Toggle = ({ onChange, toggleId, small, checked = false, rounded }) => (
  <label htmlFor={toggleId} className='inline-flex relative items-center cursor-pointer'>
    <input onChange={onChange} type='checkbox' checked={checked} id={toggleId} className='sr-only peer' />
    <div
      className={`${
        small
          ? 'w-[41.68px] h-[22px] after:h-[18px] after:w-[18px] after:top-[2px] after:left-[2px]'
          : 'w-44 h-[22px] after:h-[26px] after:w-[26px] after:top-[1.5px] after:left-[2px]'
      } ${
        rounded ? 'rounded-full after:rounded-full' : 'rounded-full after:rounded-full'
      } bd-[#A0A3B5]  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:transition-all peer-checked`}
    />
  </label>
)

export default Toggle
