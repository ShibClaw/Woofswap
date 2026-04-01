import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getLPSymbol } from '../../../utils/formatNumber'
import Modal from '../Modal'
import NoFound from '../NoFound'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

const PoolPopup = ({ popup, setPopup, setSelectedPool, pools }) => {
  const [searchText, setSearchText] = useState('')
  const inputRef = useRef()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const filteredPools = useMemo(() => {
    return searchText
      ? pools.filter((pool) => pool.symbol.toLowerCase().includes(searchText.toLowerCase()) || pool.address.toLowerCase().includes(searchText.toLowerCase()))
      : pools
  }, [pools, searchText])

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
    <Modal popup={popup} setPopup={setPopup} title={'Select a Pool'} width={540} isToken={true}>
      <div className='w-full'>
        <div className='px-3 md:px-6'>
          <div className='border border-white w-full mt-3 md:mt-5 rounded-[3px]'>
            <input
              ref={inputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Search by name, symbol or address'
              className='bg-body-white placeholder-[#757384] h-14 w-full text-grey text-base md:text-lg px-4 py-[18px] rounded-[3px]'
            />
          </div>
        </div>
      </div>
      <div className='w-full mt-5'>
        <div className='flex justify-between text-[13px] md:text-sm tracking-[0.52px] md:tracking-[0.56px] f-f-fg text-dimGray mb-1 px-3 md:px-6'>
          <span>POOL NAME</span>
        </div>
        <div className='w-full mt-3 md:mt-[13px] max-h-[400px] overflow-auto'>
          {filteredPools.length > 0 ? (
            filteredPools.map((pool, idx) => {
              return (
                <div
                  key={`pool-${idx}`}
                  className={`flex items-center justify-between py-[15px] px-3 md:px-6 cursor-pointer hover:bg-body`}
                  onClick={() => {
                    setSelectedPool(pool)
                    setPopup(false)
                  }}
                >
                  <div className='flex items-center space-x-2.5 md:space-x-3'>
                    <div className='flex items-center -space-x-2 img-bac'>
                      <img className='relative z-10' width={28} height={28} alt='' src={pool.token0.logoURI?pool.token0.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                      <img className='relative z-[5]' width={28} height={28} alt='' src={pool.token1.logoURI?pool.token1.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                    </div>
                    <div className='ml-[14px]'>
                      <p className='text-black-or-grey text-sm md:text-base f-f-fg'>{getLPSymbol(pool)}</p>
                      <p className='text-[13px] md:text-sm tracking-[0.52px] text-dimGray'>{pool.title}</p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <NoFound title='No pools found' />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default PoolPopup
