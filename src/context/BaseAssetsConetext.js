import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import React, { useState, useEffect } from 'react'
import useRefresh from '../hooks/useRefresh'
import useWeb3 from '../hooks/useWeb3'
import { getBaseAssets,getWhitelist } from '../utils/api'
import { fetchUserAssetsDataAsync } from '../utils/fetchUserAssets'

const BaseAssetsConetext = React.createContext([])

const BaseAssetsConetextProvider = ({ children }) => {
  const [baseAssets, setBaseAssets] = useState([])
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()
  const { address, chainId, isConnected } = useWeb3ModalAccount()

  useEffect(() => {
    getBaseAssets(chainId)
      .then(async (res) => {
        if (res) {
          if (web3 && address) {
            try {
              const data = await fetchUserAssetsDataAsync(web3, res, address,chainId)
              const sortedData = data.sort((a, b) => {
                if (a.balance.times(a.price).lt(b.balance.times(b.price))) return 1
                if (a.balance.times(a.price).gt(b.balance.times(b.price))) return -1
              })
              setBaseAssets(sortedData)
            } catch (e) {
              console.error('User Assets fetch had error', e)
              setBaseAssets(res)
            }
          } else {
            setBaseAssets(res)
          }
        }
      })
      .catch((error) => {
        console.error('Base Assets fetched had error', error)
      })
  }, [fastRefresh, web3, address,chainId])

  return <BaseAssetsConetext.Provider value={baseAssets}>{children}</BaseAssetsConetext.Provider>
}

export { BaseAssetsConetext, BaseAssetsConetextProvider }
