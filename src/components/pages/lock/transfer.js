import React, { useMemo, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import StyledButton from '../../common/Buttons/styledButton'
import { useTransfer } from '../../../hooks/useLock'

const TransferTab = ({ selected }) => {
  const [address, setAddress] = useState('')
  const { onTransfer, pending } = useTransfer()

  const errorMsg = useMemo(() => {
  if(selected.voted){
      return 'VOTED , UNABLE TO TRANSFER.'
  }
    if (!address) {
      return 'ENTER ADDRESS'
    }
    if (!isAddress(address)) {
      return 'INVALID ADDRESS'
    }
    return null
  }, [address])

  return (
    <>
      <div className='mt-5'>
        <p className='text-grey-2 text-[16px] md:text-[22px] font-medium'>Transfer veWOOF to</p>
        <p className='mt-[13px] text-grey-2 text-[13px] md:text-[16px] normal-family font-medium'>Address</p>
        <div className='gradient-bg mt-1.5 lg:mt-2.5  p-px w-full rounded-[3px]'>
          <div className='bg-body-white px-3  rounded-[3px] flex items-center justify-between'>
            <input
              className={`bg-transparent w-full py-[10px] lg:py-[15px] text-xl lg:text-[20px] font-medium leading-10 placeholder-[#757384] text-grey`}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
              }}
              placeholder='0x...'
            />
          </div>
        </div>
      </div>
      <StyledButton
        disabled={errorMsg || pending}
        pending={pending}
        onClickHandler={() => {
          onTransfer(selected, address)
        }}
        content={errorMsg || 'TRANSFER'}
        className='py-[13px] md:py-[18.53px] mt-5 text-white text-sm  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
      />
    </>
  )
}

export default TransferTab
