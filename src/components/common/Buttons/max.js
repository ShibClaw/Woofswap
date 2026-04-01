import React from 'react'

const Max = ({ onClickHanlder, className }) => {
  return (
    <button
      onClick={() => {
        onClickHanlder && onClickHanlder()
      }}
      className={`${className} text-white px-[13px] py-1.5 font-light text-sm md:text-base leading-6 hover:bg-opacity-50 transition-all duration-300 ease-in-out btn-mini-blue`}
    >
      MAX
    </button>
  )
}

export default Max
