import React, { useContext, useMemo, useState } from 'react'
import { formatAmount } from '../../../utils/formatNumber'
import StyledButton from '../../common/Buttons/styledButton'
import VeWOOFPopup from '../../common/VeWOOFPopup'
import { veWOOFsContext } from '../../../context/veWOOFsConetext'
import { useMerge } from '../../../hooks/useLock'
import BigNumber from 'bignumber.js'
import Warning from '../../common/Warning'

const MergeTab = ({ selected }) => {
  const [veWOOF, setVeWOOF] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const veWOOFs = useContext(veWOOFsContext)
  const filtered = useMemo(() => {
    return veWOOFs.filter((item) => item.id !== selected.id && item.voting_amount.gt(0))
  }, [veWOOFs])

  const { onMerge, pending } = useMerge()

  const errorMsg = useMemo(() => {
    if (!veWOOF) {
      return 'SELECT veWOOF'
    }
    return null
  }, [veWOOF])

  const votingPower = useMemo(() => {
    if (veWOOF) {
      const end = Math.max(selected.lockEnd, veWOOF.lockEnd)
      const current = new Date().getTime() / 1000
      return selected.amount
        .plus(veWOOF.amount)
        .times(end - current)
        .div(86400 * 730)
    }
    return new BigNumber(0)
  }, [selected, veWOOF])

  return (
    <>
      <div className='mt-5 flex flex-col items-center justify-center'>
        <div className='w-full'>
          <div className='flex items-center justify-between'>
            <p className='text-grey-2 text-sm md:text-base leading-10'>veWOOF ID</p>
            <p className='text-grey-2 text-sm md:text-base leading-10'>veWOOF Balance: {formatAmount(selected.voting_amount)}</p>
          </div>
          <div className='gradient-bg mt-1.5 lg:mt-2.5 p-px w-full rounded-[3px]'>
            <div className='bg-body-white px-2.5 h-12 lg:h-[70px] rounded-[3px] flex items-center justify-between'>
              <p className='text-grey py-[8px] lg:py-[15px] text-xl lg:text-2xl font-medium'>{`Token #${selected.id}`}</p>
            </div>
          </div>
        </div>
        <button className='focus:outline-none mt-5 z-[8]'>
          <img className='invert-img' src='/image/header/lock/arrow-down.svg' />
        </button>
      </div>
      <div className={`flex flex-col w-full items-center justify-center`}>
        <div className={`w-full mb-5`}>
          <div className='flex items-center justify-between'>
            <p className='text-grey-2 texts-[13px] md:text-base'>Merge To</p>
            <p className='text-grey-2 texts-[13px] md:text-base'>veWOOF Balance: {veWOOF ? formatAmount(veWOOF.voting_amount) : '-'}</p>
          </div>
          <div className={`gradient-bg mt-1.5 md:mt-2.5 p-px w-full rounded-[3px] relative`}>
            <div className='bg-body-white h-12 lg:h-[70px] rounded-[3px] flex items-center'>
              <div
                onClick={() => {
                  if (filtered && filtered.length > 0) {
                    setIsOpen(true)
                  }
                }}
                className={`bg-transparent w-full cursor-pointer flex items-center relative z-10 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4`}
              >
                <div className={`w-full h-full font-normal ${veWOOF ? 'text-grey-1 font-medium' : 'text-[#757384]'} text-lg md:text-2xl md:leading-10`}>
                  {veWOOF ? 'Token #' + veWOOF.id : filtered.length > 0 ? 'Select' : 'Not Found'}
                </div>
              </div>
              <img
                className={`${isOpen ? 'rotate-180' : 'rotate-0'}  icon-size-normal transform transition-all duration-300 ease-in-out absolute right-4 top-4 md:top-7 `}
                alt=''
                src='/image/icons/dropdown-arrow-black.svg'
              />
            </div>
            <VeWOOFPopup popup={isOpen} setPopup={setIsOpen} setSelectedVeWOOF={setVeWOOF} veWOOFs={filtered} />
          </div>
        </div>
      </div>
      {veWOOF && (
        <div className='mb-[9px] sm:flex items-center justify-between'>
          <span className='text-base lg:text-xl text-grey-2 font-light'>Token #{veWOOF.id} veWOOF Balance:</span>
          <div className='flex space-x-2'>
            <span className='text-lg lg:text-[22px] text-white font-medium'>{formatAmount(votingPower)}</span>
            <span className='text-lg lg:text-[22px] text-dimGray font-light'>(+{formatAmount(votingPower.minus(veWOOF.voting_amount))})</span>
          </div>
        </div>
      )}
      <StyledButton
        disabled={errorMsg || pending}
        pending={pending}
        onClickHandler={() => {
          onMerge(selected, veWOOF)
        }}
        content={errorMsg || 'MERGE'}
        className='py-[13px] md:py-[18.53px] text-grey-1 text-sm  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
      />
      <Warning text='Merging/splitting will cause a loss of unclaimed and pending rewards, make sure to claim everything behorehand.' />
    </>
  )
}

export default MergeTab
