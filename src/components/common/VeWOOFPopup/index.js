import React, { useEffect, useMemo, useRef, useState } from 'react'
import { formatAmount } from '../../../utils/formatNumber'
import Modal from '../Modal'
import NoFound from '../NoFound'

const VeWOOFPopup = ({ popup, setPopup, setSelectedVeWOOF, veWOOFs }) => {
  const [searchText, setSearchText] = useState('')
  const inputRef = useRef()

  const filteredVeWOOFs = useMemo(() => {
    return searchText ? veWOOFs.filter((veWOOF) => veWOOF.id.includes(searchText.toLowerCase())) : veWOOFs
  }, [veWOOFs, searchText])

  useEffect(() => {
    if (!popup) {
      setSearchText('')
    } else {
      setTimeout(() => {
        inputRef.current && inputRef.current.focus()
      }, 300)
    }
  }, [popup])

  return (
    <Modal popup={popup} setPopup={setPopup} title={'Choose your veWOOF'} width={540} isToken={true}>
      <div className='w-full'>
        <div className='px-3 md:px-6'>
          <div className=' w-full mt-3 md:mt-5 rounded-[3px]'>
            <input
              type='number'
              ref={inputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Search by ID'
              className='bg-body-white placeholder-[#757384] h-14 w-full text-grey text-base md:text-lg px-4 py-[18px] rounded-[3px]'
            />
          </div>
        </div>
      </div>
      <div className='w-full mt-5'>
        <div className='flex justify-between text-[13px] md:text-sm tracking-[0.52px] md:tracking-[0.56px] f-f-fg text-dimGray mb-1 px-3 md:px-6'>
          <span>veWOOF ID</span>
          <span>veWOOF BALANCE</span>
        </div>
        <div className='w-full mt-3 md:mt-[13px] max-h-[400px] overflow-auto'>
          {filteredVeWOOFs.length > 0 ? (
            filteredVeWOOFs.map((veWOOF, idx) => {
              return (
                <div
                  key={`asset-${idx}`}
                  className={`flex items-center justify-between py-[15px] px-3 md:px-6 cursor-pointer hover:bg-body`}
                  onClick={() => {
                    setSelectedVeWOOF(veWOOF)
                    setPopup(false)
                  }}
                >
                  <p className='text-black-or-grey text-sm md:text-base f-f-fg'>Token #{veWOOF.id}</p>
                  <p className='text-sm md:text-base text-grey-2'>{formatAmount(veWOOF.voting_amount)}</p>
                </div>
              )
            })
          ) : (
            <NoFound title='No veWOOFs found' />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default VeWOOFPopup
