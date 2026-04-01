import { useContext, useEffect, useState } from 'react'
import { getETHAddress, getWoofAddress, getWBONE_WoofAddress } from '../utils/addressHelpers'
import { BaseAssetsConetext } from '../context/BaseAssetsConetext'

const usePrices = () => {
  const [prices, setPrices] = useState({
    WOOF: 0,
    BONE: 0,
    WBONE: 0,
  })
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    if (baseAssets.length > 0) {

      const theAsset = baseAssets.find((asset) =>asset.address ? asset.address.toLowerCase()
          === getWoofAddress().toLowerCase():null)
      const wethAsset = baseAssets.find((asset) =>asset.address ? asset.address.toLowerCase()
          === getWBONE_WoofAddress().toLowerCase():null)
      const ethAsset = baseAssets.find((asset) =>asset.address ? asset.address.toLowerCase()
          === getETHAddress().toLowerCase():null)
      setPrices({
        WOOF: theAsset ? theAsset.price : 0,
        WBONE: ethAsset ? ethAsset.price : 0,
        BONE: ethAsset ? ethAsset.price : 0,
      })
    }
  }, [baseAssets])

  return prices
}

export const useTokenPrice = (address) => {
  const [price, setPrice] = useState(0)
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    if (baseAssets.length > 0) {
      const asset = baseAssets.find((asset) => asset.address.toLowerCase() === address.toLowerCase())
      setPrice(asset ? asset.price : 0)
    }
  }, [baseAssets])

  return price
}

export const useAddLocalStorageToken = (asset) => {
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    if (baseAssets.length > 0) {
      const asset = baseAssets.find((asset) => asset.address.toLowerCase() === asset.toLowerCase())
      setPrice(asset ? asset.price : 0)
    }
  }, [baseAssets])

  return price
}

export default usePrices
