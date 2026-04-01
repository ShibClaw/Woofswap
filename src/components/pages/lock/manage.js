import React, { useState, useEffect, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import BalanceInput from '../../common/Input/BalanceInput'
import StyledButton from '../../common/Buttons/styledButton'
import { formatAmount, isInvalidAmount } from '../../../utils/formatNumber'
import { useIncreaseAmount, useIncreaseDuration } from '../../../hooks/useLock'
import { customNotify } from '../../../utils/notify'
import { periodLevels } from '../../../config/constants'
import { getRewardTokenSymbol } from '../../../utils/addressHelpers'

const week = 86400 * 7 * 1000
const minTimeStamp = 86400 * 14 * 1000
const maxTimeStamp = 86400 * 730 * 1000
const maxDate = new Date(Math.floor((new Date().getTime() + maxTimeStamp) / week) * week)

const ManageTab = ({ selected, theAsset }) => {
  const [amount, setAmount] = useState('')
  const [periodLevel, setPeriodLevel] = useState(0)

  const minDate = useMemo(() => {
    return new Date(selected.lockEnd * 1000 + minTimeStamp)
  }, [selected])
  const [selectedDate, setSelectedDate] = useState(minDate)

  const votingPower = useMemo(() => {
    return selected.amount.times(selectedDate.getTime() - new Date().getTime()).div(maxTimeStamp)
  }, [selected, selectedDate])

  const unlockTime = useMemo(() => {
    return moment(selectedDate).diff(moment(), 'seconds')
  }, [selectedDate])

  const { onIncreaseAmount, pending: amountPending } = useIncreaseAmount()
  const { onIncreaseDuration, pending: durationPending } = useIncreaseDuration()

  const errorMsg = useMemo(() => {
    if (isInvalidAmount(amount)) {
      return 'ENTER AN AMOUNT'
    }
    if (!theAsset || theAsset.balance.lt(amount)) {
      return 'INSUFFICIENT BALANCE'
    }
    return null
  }, [amount, theAsset])

  useEffect(() => {
    let timestamp = 0
    if (periodLevel < 0) return
    switch (periodLevel) {
      case 0:
        timestamp = minTimeStamp
        break
      case 1:
        timestamp = 3600 * 24 * (30 * 6) * 1000
        break
      case 2:
        timestamp = 3600 * 24 * 364 * 1000
        break
      case 3:
        timestamp = maxTimeStamp
        break

      default:
        break
    }
    let period
    if (periodLevel === 3) {
      period = new Date().getTime() + timestamp
    } else {
      period = selected.lockEnd * 1000 + timestamp
    }
    const date = new Date(Math.min(Math.floor(period / week) * week, maxDate))
    setSelectedDate(date)
  }, [periodLevel, selected])

  return (
    <div className='mt-5'>
      <BalanceInput
        title='Amount'
        inputAmount={amount}
        setInputAmount={setAmount}
        symbol={getRewardTokenSymbol()}
        balance={theAsset?.balance}
        logoURIs={['/image/tokens/WOOF.png']}
      />
      <StyledButton
        disabled={errorMsg || amountPending}
        pending={amountPending}
        onClickHandler={() => {
          if (errorMsg) {
            customNotify(errorMsg, 'warn')
            return
          }
          onIncreaseAmount(selected.id, amount)
        }}
        content={errorMsg || 'INCREASE LOCK AMOUNT'}
        className='py-[13px] md:py-[14.53px] text-white mt-4 text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
      />
      <p className='mt-6 text-grey-2 text-sm md:text-lg'>Lock Until</p>
      <div className='gradient-bg mt-1.5 md:mt-2.5 p-px w-full rounded-[3px]'>
        <div className='bg-body flex items-center px-2.5 h-[48px] md:h-[62px] rounded-[3px]'>
          <img alt='' className='w-[32px] lg:w-[40px] h-[32px] lg:h-[40px]' src='/image/header/lock/calendar-icon.svg' />
          <DatePicker
            className='bg-transparent w-full pl-[6px] text-xl lg:text-2xl leading-10 placeholder-[#757384] text-grey-2 font-light'
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
      <div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-[11px] text-grey-2 text-[14px] lg:text-base font-semibold'>
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
        <span className='text-base lg:text-xl text-grey-2 font-light'>New veWOOF Voting Power:</span>
        <div className='flex space-x-2'>
          <span className='text-lg lg:text-[22px] text-white font-medium'>{formatAmount(votingPower)}</span>
          <span className='text-lg lg:text-[22px] text-dimGray font-light'>{`(+${formatAmount(votingPower.minus(selected.voting_amount))})`}</span>
        </div>
      </div>
      <StyledButton
        disabled={durationPending}
        pending={durationPending}
        onClickHandler={() => {
          if (unlockTime === 0) {
            customNotify('Already Max Locked', 'warn')
            return
          }
          onIncreaseDuration(selected.id, unlockTime)
        }}
        content={'EXTEND DURATION'}
        className='py-[13px] md:py-[14.53px] text-white mt-4 text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
      />
    </div>
  )
}

export default ManageTab
