import React from 'react'

const Warning = ({ text }) => (
  <div className={`mt-4 bg-white flex items-start bg-opacity-[0.05] rounded-[3px] bg-clip-padding p-4`}>
    <img className='w-4 h-4 lg:w-5 lg:h-5 mt-1' alt='info' src='/image/mark/info-mark.svg' />
    <p className='text-grey-2 text-[15px] lg:text-[17px] ml-[10px] f-f-fg'>{text}</p>
  </div>
)

export default Warning
