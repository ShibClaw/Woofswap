import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import React from 'react'
import { formatAmount } from '../../../utils/formatNumber'

const percentArray = [25, 50, 75, 100]

const BalanceInput = ({ title, inputAmount, setInputAmount, symbol = '', logoURIs, balance = null }) => {
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        {title && <p className='m-r-8px text-grey-2 text-sm md:text-base leading-10'>{title}</p>}
        {address && balance && (
          <div className={`flex items-center text-sm lg:text-base space-x-3 ${!title && 'justify-between w-full'}`}>
            <div className='flex items-center space-x-2.5'>
              {percentArray.map((percent, index) => {
                return (
                  <div
                    className={`flex items-center justify-center border-r-5 bg-white bg-opacity-[0.08] round-[3px] text-color-main text-[13px] md:text-base w-[40px] md:w-[56px] h-[22px] md:h-[28px] cursor-pointer`}
                    onClick={() => setInputAmount(balance.times(percent).div(100).toString(10) || 0)}
                    key={`percent-${index}`}
                  >
                    {percent}%
                  </div>
                )
              })}
            </div>
            <p className='text-grey-2'>Balance: {formatAmount(balance)}</p>
          </div>
        )}
      </div>
      <div className='gradient-bg mt-1.5 lg:mt-2.5  p-px w-full rounded-[3px]'>
        <div className='bg-body-white px-3  rounded-[3px] flex items-center justify-between'>
          <input
            className={`bg-transparent ${
              logoURIs.length > 1 ? 'w-[35%] md:w-[50%]' : 'w-[80%]'
            } py-[10px] lg:py-[15px] text-xl lg:text-2xl leading-10 placeholder-[#757384] text-grey`}
            value={inputAmount}
            onChange={(e) => {
              setInputAmount(Number(e.target.value) < 0 ? '' : e.target.value)
            }}
            placeholder='0.00'
            type={'number'}
            min={0}
          />
          {logoURIs.length > 0 && (
            <div className='flex items-center justify-between space-x-2'>
              {logoURIs.length > 1 ? (
                <div className='flex items-center -space-x-2 img-bac'>
                  <img className='relative z-10' width={28} height={28} alt='' src={logoURIs[0]} />
                  <img className='relative z-[5]' width={28} height={28} alt='' src={logoURIs[1]} />
                </div>
              ) : (
                  <div className='img-bac'>
                      <img alt='' width={28} height={28} src={logoURIs[0]} />
                  </div>
              )}
              <p className='font-medium text-sm lg:text-[1.2rem] leading-6 text-grey-or-black normal-family'>{symbol}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BalanceInput
