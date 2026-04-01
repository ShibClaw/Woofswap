import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import React, { useState, useEffect } from 'react'
import useRefresh from '../hooks/useRefresh'
import useWeb3 from '../hooks/useWeb3'
import { fetchUserVeWOOFs } from '../utils/fetchUserVeWOOFs'

const veWOOFsContext = React.createContext([])

const VeWOOFsContextProvider = ({ children }) => {
  const [veWOOFs, setVeWOOFs] = useState([])

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserVeWOOFs(web3, address)
        setVeWOOFs(data)
      } catch (e) {
        //console.error('user veWOOFs fetched had error', e)
      }
    }
    if (address) {
      getUserData()
    } else {
      setVeWOOFs([])
    }
  }, [address, fastRefresh])

  return <veWOOFsContext.Provider value={veWOOFs}>{children}</veWOOFsContext.Provider>
}

export { veWOOFsContext, VeWOOFsContextProvider }
