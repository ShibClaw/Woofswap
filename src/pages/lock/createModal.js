import React, { useState, useEffect, useMemo, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import BalanceInput from '../../components/common/Input/BalanceInput'
import StyledButton from '../../components/common/Buttons/styledButton'
import { formatAmount, isInvalidAmount } from '../../utils/formatNumber'
import CommonHollowModal from '../../components/common/CommonHollowModal'
import { useCreateLock } from '../../hooks/useLock'
import { customNotify } from '../../utils/notify'
import { periodLevels } from '../../config/constants'
import { getRewardTokenSymbol } from '../../utils/addressHelpers'

const week = 86400 * 7 * 1000

const minTimeStamp = 86400 * 14 * 1000
const maxTimeStamp = 86400 * 728 * 1000
const minDate = new Date(Math.floor((new Date().getTime() + minTimeStamp) / week) * week)
const maxDate = new Date(Math.floor((new Date().getTime() + maxTimeStamp) / week) * week)

const CreateModal = ({ isOpen, setIsOpen, theAsset }) => {
  const [amount, setAmount] = useState('')
  const [selectedDate, setSelectedDate] = useState(minDate)
  const [periodLevel, setPeriodLevel] = useState(0)
  const unlockTime = useMemo(() => {
    return moment(selectedDate).diff(moment(), 'seconds')
  }, [selectedDate])
  const { onCreateLock, pending } = useCreateLock(amount, selectedDate)

  const errorMsg = useMemo(() => {
    if (isInvalidAmount(amount)) {
      return 'ENTER AN AMOUNT'
    }
    if (!theAsset || theAsset.balance.lt(amount)) {
      return 'INSUFFICIENT BALANCE'
    }
    return null
  }, [amount, theAsset])

  const votingPower = useMemo(() => {
    if (amount && amount > 0) {
      return formatAmount((amount * unlockTime) / (86400 * 365 * 2))
    } else {
      return '-'
    }
  }, [amount, unlockTime])

  useEffect(() => {
    let timestamp = 0
    if (periodLevel < 0) return
    switch (periodLevel) {
      case 0:
        timestamp = minTimeStamp
        break
      case 1:
        timestamp = 86400 * 180 * 1000
        break
      case 2:
        timestamp = 86400 * 364 * 1000
        break
      case 3:
        timestamp = 86400 * 730 * 1000
        break

      default:
        break
    }
    const date = new Date(Math.floor((new Date().getTime() + timestamp) / week) * week)
    setSelectedDate(date)
  }, [periodLevel])

  const onCreate = useCallback(() => {
    if (errorMsg) {
      customNotify(errorMsg, 'warn')
      return
    }
    onCreateLock(amount, unlockTime)
  }, [amount, unlockTime, errorMsg])

  return (
    <CommonHollowModal popup={isOpen} width={588} setPopup={setIsOpen} title='Create New Lock'>
      <div className='mt-5'>
        <BalanceInput
          title='Amount'
          inputAmount={amount}
          setInputAmount={setAmount}
          symbol={getRewardTokenSymbol()}
          balance={theAsset?.balance}
          logoURIs={['/image/tokens/WOOF.png']}
        />
        <p className='mt-6 text-grey-2 text-sm md:text-lg'>Lock Until</p>
        <div className='gradient-bg mt-1.5 md:mt-2.5 p-px w-full rounded-[3px]'>
          <div className='bg-body flex items-center px-2.5 h-[48px] lg:h-[62px] rounded-[3px]'>
            <img alt='' className='w-[32px] lg:w-[40px] h-[32px] lg:h-[40px]' src='/image/header/lock/calendar-icon.svg' />
            <DatePicker
              className='bg-transparent w-full pl-[6px] text-xl lg:text-2xl leading-10 placeholder-[#757384] text-grey-2 font-light '
              selected={selectedDate}
              dateFormat='yyyy/MM/dd'
              onChange={(date) => {
                if (periodLevel >= 0) {
                  setPeriodLevel(-1)
                }
                if (date.getTime() === selectedDate.getTime()) {
                  return
                }
                setSelectedDate(new Date(Math.floor(date.getTime() / week) * week))
              }}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </div>
        <div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-[11px] text-grey-2 text-[14px] lg:text-base'>
          {periodLevels.map((level, index) => {
            if (level.value === periodLevel) {
              return (
                <div
                  className='h-[40px] bg-blue rounded-[3px] flex items-center justify-center cursor-pointer font-medium'
                  key={`level-${index}`}
                  onClick={() => setPeriodLevel(level.value)}
                >
                  {level.label}
                </div>
              )
            } else {
              return (
                <div
                  className='h-[40px] bg-body rounded-[3px] flex items-center justify-center cursor-pointer border border-white font-light'
                  key={`level-${index}`}
                  onClick={() => setPeriodLevel(level.value)}
                >
                  {level.label}
                </div>
              )
            }
          })}
        </div>
        <div className='my-3 lg:my-5 flex items-center justify-between'>
          <span className='text-base lg:text-xl text-grey-2 font-light'>veWOOF Voting Power:</span>
          <span className='text-lg lg:text-[22px] text-white font-medium'>{votingPower}</span>
        </div>
        <StyledButton
          disabled={errorMsg || pending}
          pending={pending}
          onClickHandler={onCreate}
          content={errorMsg || 'LOCK'}
          className='py-[13px] md:py-[14.53px] text-white mt-4 text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
        />
      </div>
    </CommonHollowModal>
  )
}

export default CreateModal
