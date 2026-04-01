import React, { useState } from 'react'
import { getLPSymbol } from '../../../utils/formatNumber'
// import React, { useEffect, useState } from 'react'
import PoolPopup from '../PoolPopup'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

const PoolSelect = ({ setPool, pool, pools }) => {
  const [isOpen, setIsOpen] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  // useEffect(() => {
  //   if (!pool) {
  //     setPool(pools[0])
  //   }
  // }, [pool, pools])

  return (
    <>
      <div className={`gradient-bg mt-1.5 md:mt-2.5 p-px w-full rounded-[3px]`}>
        <div className='bg-body-white h-12 md:h-[70px] z-[90] rounded-[3px] flex items-center relative'>
          <div
            onClick={() => {
              setIsOpen(!isOpen)
            }}
            className={`bg-transparent w-full h-full flex items-center cursor-pointer py-[8px] lg:py-[15px] pl-2.5 lg:pl-4`}
          >
            {pool ? (
              <div className={`flex items-center absolute left-2.5 lg:left-4 space-x-3 mdLg:mt-1 lg:-mt-[3px] xl:-mt-[5px]`}>
                <div className='flex items-center  -space-x-2'>
                  <img className='relative z-10 w-[26px] h-[26px] md:w-[30px] md:h-[30px]' alt='' src={pool.token0.logoURI?pool.token0.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                  <img className='relative z-[5] w-[26px] h-[26px] md:w-[30px] md:h-[30px]' alt='' src={pool.token1.logoURI?pool.token1.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                </div>
                <div className='text-grey'>
                  <p className='text-base md:text-[19px] font-medium leading-5 md:leading-[30px] f-f-fg'>{getLPSymbol(pool)}</p>
                  <p className='tracking-[0.66px] text-grey md:text-[13px] leading-none'>{pool.title}</p>
                </div>
              </div>
            ) : (
              <div className={`w-full font-normal text-[#757384] text-lg md:text-2xl md:leading-10`}>Select</div>
            )}
          </div>
          <img
              className={`${isOpen ? 'rotate-180' : 'rotate-0'} icon-size-normal transform transition-all duration-300 ease-in-out absolute right-4 top-4 md:top-7 `}
              alt=''
              src='/image/icons/dropdown-arrow-black.svg'
          />
        </div>
        <PoolPopup setSelectedPool={setPool} popup={isOpen} setPopup={setIsOpen} pools={pools} />
      </div>
    </>
  )
}

export default PoolSelect
