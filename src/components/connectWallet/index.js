import React, { useState, useEffect, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import useAuth from '../../hooks/useAuth'
import { connectors } from '../../config/constants'
import useWalletModal from '../../hooks/useWalletModal'

const Index = ({ setConnector, setSelected }) => {
  const { login } = useAuth()
  const [activeConnector, setActiveConnector] = useState(null)
  const { closeWalletModal } = useWalletModal()
    const { address, chainId, isConnected } = useWeb3ModalAccount()

  useEffect(() => {
    if (address && activeConnector) {
      closeWalletModal()
      setConnector(activeConnector)
    }
  }, [address, activeConnector])

  const onConnect = useCallback(
    (type) => {
      login(type)
    },
    [login],
  )

  return (
    <>
      <div className='model-body bg-opacity-[0.88] fixed z-[1000] inset-0 w-full h-full' />
      <div className='pt-[15px] pb-[20px] px-3 lg:px-5 max-w-[90%] lg:max-w-[544px] fixed w-full h-fit bg-body-connect-box rounded-lg border inset-0 mx-auto top-[45px] lg:m-auto z-[1001] border-white rounded-[3px]'>
        <div className='flex items-center justify-between'>
          <p className='text-[23px] md:text-[27px] text-white leading-10 font-medium f-f-fg'></p>
          <button onClick={() => closeWalletModal()}>
            <img className='icon-size-20 invert-img' alt='' src='/image/icons/icon-close-btn.svg' />
          </button>
        </div>
        <div className='connect-box mt-[15px] lg:mt-[23px] grid lg:grid-cols-2'>
          {connectors.map((item, idx) => {
            return (
              <div
                onClick={() => {
                  setSelected(true)
                  onConnect(item.connector)
                  setActiveConnector(item)
                }}
                key={idx}
                role={'button'}
                className='connect-box-row group flex items-center px-2.5 lg:pl-[30px] hover:border-[#0000FF] border transition-all duration-300 ease-in-out'
              >
                <img
                  className='group-hover:shadow-[#0000FF] drop--xl w-10 h-10 lg:w-11 lg:h-11 transition-all duration-300 ease-in-out'
                  alt={idx}
                  src={item.logo}
                />
                <p className='ml-3 text-white f-f-fg text-[15px] lg:text-[17px] font-medium leading-none'>{item.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Index
