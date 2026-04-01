import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

const MobileDropDown = ({ options, sort, setSort }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={`max-w-[300px] w-full dropdownwrapper`}>
      <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
        <div
          onClick={() => {
            setIsOpen(!isOpen)
          }}
          className={`w-full flex items-center h-[42px] md:h-[52px] rounded-[3px] bg-body-white bg-opacity-80 px-4 cursor-pointer`}
        >
          <div className={`w-full relative focus:outline-none py-2 bg-transparent rounded-[3px] text-grey flex items-center justify-between`}>
            <p className='text-grey'>{sort.label}</p>
            <img
              className={`${isOpen ? 'rotate-180' : 'rotate-0'} icon-size-normal transform transition-all duration-300 ease-in-out`}
              alt=''
              src='/image/icons/dropdown-arrow-black.svg'
            />
            {isOpen && (
              <div className='bg-[#000045] w-full border z-[102] border-white -right-4 top-12 md:top-14 absolute p-3.5 bg-clip-padding rounded-[3px]'>
                {options.map((item, idx) => {
                  return (
                    <div
                      onClick={() => {
                        setSort(item)
                        setIsOpen(false)
                      }}
                      key={idx}
                      className='z-[10]'
                    >
                      <p className='text-white text-base md:text-lg leading-7 tracking-wide'>{item.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default MobileDropDown
