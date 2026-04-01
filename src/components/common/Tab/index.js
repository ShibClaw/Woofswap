import React from 'react'

const Tab = ({ leftTitle, rightTitle, isLeft, setIsLeft, className, multi, tabData, tab, setTab }) => (
  <div className={`${className} w-full f-f-fg text-base tracking-[1.6px] flex `}>
    {multi ? (
      <div className='flex items-center w-full'>
        {tabData.map((item, idx) => {
          return (
            <button
              onClick={() => {
                setTab(idx)
              }}
              key={idx}
              className={`${tab === idx ? ' border-green text-select font-medium' : 'text-dimGray border-black'} w-1/3 uppercase border-b-2 pb-3`}
            >
              {item}
            </button>
          )
        })}
      </div>
    ) : (
      <>
        <button
          onClick={() => {
            setIsLeft(true)
          }}
          className={`${isLeft ? ' border-green text-select font-medium' : 'text-dimGray border-black'} w-1/2 uppercase border-b-2 pb-3`}
        >
          {leftTitle}
        </button>
        <button
          onClick={() => {
            setIsLeft(false)
          }}
          className={`${!isLeft ? ' border-green text-select font-medium' : 'text-dimGray border-black'} w-1/2 uppercase border-b-2 pb-3`}
        >
          {rightTitle}
        </button>
      </>
    )}
  </div>
)

export default Tab
