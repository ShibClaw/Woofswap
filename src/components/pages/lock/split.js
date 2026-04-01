import React, { useState, useEffect, useMemo } from 'react'
import { useSplit } from '../../../hooks/useLock'
import { formatAmount, isInvalidAmount } from '../../../utils/formatNumber'
import StyledButton from '../../common/Buttons/styledButton'
import Warning from '../../common/Warning'

const arrayPercent = [2, 3, 4]
const validNumber = (val) => {
  return val === '' ? 0 : Number(val)
}

const SplitTab = ({ selected }) => {
  const [numberOfInputs, setNumberOfInputs] = useState(2)
  const [customInput, setCustomInput] = useState('')
  const [percentArr, setPercentArr] = useState([])

  const { onSplit, pending } = useSplit()

  useEffect(() => {
    const fixedArr = []
    const target = customInput !== '' ? customInput : numberOfInputs
    for (let i = 0; i < target; i++) {
      fixedArr.push('')
    }
    setPercentArr(fixedArr)
  }, [numberOfInputs, customInput])

  const total = useMemo(() => {
    return percentArr.reduce((sum, cur) => {
      return sum + validNumber(cur)
    }, 0)
  }, [percentArr])

  const errorMsg = useMemo(() => {
    let isError = false
    for (let i = 0; i < percentArr.length; i++) {
      if (validNumber(percentArr[i]) === 0) {
        isError = true
        break
      }
    }
    if(selected.voted){
        return 'VOTED , UNABLE TO SPLIT.'
    }

    if (isError) {
      return 'ALL WOOF PERCENTAGES SHOULD BE FILLED.'
    }
    if (total !== 100) {
      return 'TOTAL PERCENT SHOULD BE 100%.'
    }
    return null
  }, [percentArr, total])

  return (
    <>
      <div className='mt-5 flex items-center justify-between'>
        <span className='text-base lg:text-xl text-grey-2 font-light'>Token #{selected.id} veWOOF to:</span>
        <p className='text-[#B8B6CB] text-[13px] md:text-base'>veWOOF Balance: {formatAmount(selected.voting_amount)}</p>
      </div>
      <div className='md:mt-2.5 -mt-1  flex items-center flex-wrap w-full text-grey-2 text-sm md:text-lg'>
        {arrayPercent.map((item, index) => {
          return (
            <div
              className={`h-10  md:h-[48px] px-10 sm:px-[19px] flex-grow sm:flex-grow-0 mt-3 md:mt-0  flex-shrink-0 ${
                index === 1 ? 'ml-[11px] sm:mr-[11px]' : index === 0 ? '' : 'mr-[11px]'
              }  ${
                item === numberOfInputs && customInput === '' ? 'bg-blue font-medium' : 'border bg-[#05032B] border-white font-light'
              } rounded-[3px]  flex items-center justify-center cursor-pointer`}
              key={`level-${index}`}
              onClick={() => {
                setCustomInput('')
                setNumberOfInputs(item)
              }}
            >
              {item} Tokens
            </div>
          )
        })}
        <div className='max-w-[160px] md:max-w-[156px] mt-3 md:mt-0  w-full relative'>
          <input
            className='placeholder-dimGray  flex-shrink-0  font-normal bg-body w-full h-10 md:h-[48px] rounded-[3px] text-color-main pl-2.5 pr-2 text-sm md:text-lg !border focus:!border-[#55A361] !border-white focus:!border-[2px] block focus-visible:!outline-none'
            type='number'
            min={5}
            max={10}
            value={customInput}
            onChange={(e) => {
              if (!isInvalidAmount(e.target.value)) {
                const nums = Number(e.target.value)
                setCustomInput(Math.max(Math.min(10, nums), 5))
              } else {
                setCustomInput('')
              }
            }}
            placeholder='Enter Amount'
          />
          {customInput !== '' && <span className='absolute z-10 text-grey-2 text-base md:text-lg top-2.5 font-light right-[14px]'>Tokens</span>}
        </div>

        <div className='  flex justify-between  w-full mt-5'>
          <div className='w-[25%] font-medium text-[13px] md:text-[17px] text-grey-2 f-f-fg pl-[15px]'>No</div>
          <div className='w-[50%] font-medium text-[13px] md:text-[17px] text-grey-2 f-f-fg'>veWOOF Amount</div>
          <div className='w-[25%] font-medium text-[13px] md:text-[17px] text-grey-2 f-f-fg'>Percentage</div>
        </div>
        <div className='w-full max-h-[260px] overflow-auto'>
          {percentArr.map((item, idx) => {
            return (
              <div key={idx} className={`gradient-bg p-px w-full space-y-2.5 lg:space-y-0 ${idx === 0 ? 'mt-[7px]' : 'mt-4'} rounded-[3px]`}>
                <div className=' flex flex-row justify-between items-center rounded-[3px] bg-gradient-to-r from-left to-right'>
                  <div className='w-[25%] py-[11px] pl-2 md:py-5 lg:pl-[15px] text-color-main'>
                    <div className='text-base lg:text-xl font-medium'>{idx + 1}</div>
                  </div>
                  <div className='w-[50%] text-color-main'>
                    <div className='text-base lg:text-xl font-medium'>{formatAmount(selected.voting_amount.times(validNumber(item)).div(100))}</div>
                  </div>
                  <div className='pl-px rounded-tr-[3px] rounded-br-[3px] w-[25%]'>
                    <div className=' w-full relative text-[#fff]  b-r-10px bg-[#090333]'>
                      <input
                        type={'number'}
                        value={item}
                        onChange={(e) => {
                          const val = validNumber(e.target.value)
                          let temp = [...percentArr]
                          if (val > 0) {
                            const newVal = total - validNumber(percentArr[idx]) + val > 100 ? 100 - total + validNumber(percentArr[idx]) : val
                            temp[idx] = newVal > 0 ? newVal : ''
                            setPercentArr(temp)
                          } else {
                            temp[idx] = ''
                            setPercentArr(temp)
                          }
                        }}
                        className=' py-[11px] px-3.5 w-[90%]  md:py-5 lg:pl-[15px] text-grey font-medium text-base lg:text-xl bg-transparent'
                      />
                      <span className='text-grey-2 font-medium text-base lg:text-xl absolute right-[10px] md:right-[14px] z-10 mt-[11px] md:mt-5'>%</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className='mt-5 flex items-center w-full justify-between'>
          <span className='text-base lg:text-xl text-grey-2 font-light'>
            Total Split Amount: <span className='text-lg lg:text-[22px] text-white font-medium'>{total}%</span>
          </span>
          <button
            className='text-lg font-medium text-[#26FFFE]'
            onClick={() => {
              const fixedArr = []
              for (let i = 0; i < percentArr.length; i++) {
                fixedArr.push('')
              }
              setPercentArr(fixedArr)
            }}
          >
            Reset
          </button>
        </div>
        <StyledButton
          disabled={errorMsg || pending}
          pending={pending}
          onClickHandler={() => {
            onSplit(selected, percentArr)
          }}
          content={errorMsg || 'SPLIT--'}
          className='py-[13px] md:py-[18.53px] text-grey-1  mt-[9px] text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
        />
        <Warning text='Merging/splitting will cause a loss of unclaimed and pending rewards, make sure to claim everything behorehand.' />
      </div>
    </>
  )
}

export default SplitTab
