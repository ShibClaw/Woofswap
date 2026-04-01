import React, { useState, useContext, useEffect } from 'react'
import { veWOOFsContext } from '../../../context/veWOOFsConetext'
import VeWOOFPopup from '../VeWOOFPopup'

const VeWOOFSelect = ({ className, isSelected, setIsSelected }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [init, setIsInit] = useState(false)
  const veWOOFs = useContext(veWOOFsContext)

  useEffect(() => {
    if (veWOOFs.length > 0) {
      if (!init) {
        setIsInit(true)
        setIsSelected(veWOOFs[0])
      }
    } else {
      setIsSelected(null)
    }
  }, [veWOOFs, init])

  return (
    <div className={`dropdownwrapper${className ? ' ' + className : ''} flex items-center mobile-mt-12`}>
      <div className='text-color-2 font-semibold text-[13px] whitespace-nowrap pr-3 border-white f-f-fg'>SELECT veWOOF:</div>
      <div className={`w-full w-min-120 flex items-center h-[42px]  rounded-[3px] bg-[#000045] bg-opacity-80`}>
        <div
          className={`pl-3 w-full bg-body-white font-bold relative focus:outline-none py-2 rounded-[3px] text-grey-1 flex items-center justify-between cursor-pointer`}
          onClick={() => {
            if (veWOOFs.length > 0) {
              setIsOpen(true)
            }
          }}
        >
          {isSelected ? <span className='text-grey text-lg'>{`#${isSelected.id}`}</span> : <div className='text-dimGray text-lg'>Not found</div>}
          {/*<img*/}
          {/*  className={`${isOpen ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}*/}
          {/*  alt=''*/}
          {/*  src='/image/swap/dropdown-arrow.png'*/}
          {/*/>*/}
        </div>
      </div>
      <VeWOOFPopup popup={isOpen} setPopup={setIsOpen} setSelectedVeWOOF={setIsSelected} veWOOFs={veWOOFs} />
    </div>
  )
}

export default VeWOOFSelect
