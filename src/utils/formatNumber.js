import BigNumber from 'bignumber.js'
import { routeAssets,NetworksData } from '../config/constants'
import { getWBONE_WoofAddress } from './addressHelpers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
})

export const fromWei = (number, decimals = 18) => new BigNumber(number).div(new BigNumber(10).pow(decimals))
export const toWei = (number, decimals = 18) => new BigNumber(number).times(new BigNumber(10).pow(decimals))
export const sendValueToWei = (number, decimals = 18) => new BigNumber(number).times(new BigNumber(10).pow(decimals)).dp(0).toString(10)

export const formatAmount = (amount = null, shorted = false, fixed = 3) => {
  if (!amount || new BigNumber(amount).isZero()) return '0'
  const bigAmount = new BigNumber(amount)
  if (bigAmount.lt(new BigNumber(1).div(new BigNumber(10).pow(fixed)))) return `< ${new BigNumber(1).div(new BigNumber(10).pow(fixed)).toString(10)}`

  if (bigAmount.gt(1) && bigAmount.lt(1000)) {
    return bigAmount.dp(2).toFormat()
  }

  if (shorted) {
    if (bigAmount.gte(1e9)) {
      return bigAmount.div(1e9).dp(2).toFormat() + 'B'
    }

    if (bigAmount.gte(1e6)) {
      return bigAmount.div(1e6).dp(2).toFormat() + 'M'
    }

    if (bigAmount.gte(1e3)) {
      return bigAmount.div(1e3).dp(2).toFormat() + 'K'
    }
  }

  if (bigAmount.gte(1e3)) {
    return bigAmount.dp(0).toFormat()
  }

  return bigAmount.dp(fixed).toFormat()
}

export const isInvalidAmount = (amount) => {
  return !amount || Number(amount) === isNaN || Number(amount) <= 0
}

export const isEqualAsset = (asset0, asset1) => {
  return asset0.address.toLowerCase() === asset1.address.toLowerCase()
}

export const wrappedAddress = (address) => {
  //return address === 'BONE' ? getWBONE_WoofAddress() : address
  return address.length<42 ? getWBONE_WoofAddress() : address
}

export const wrappedAsset = (asset) => {
  //return asset && asset.address === 'BONE' ? routeAssets[0] : asset
  if(asset  && asset.address.length<42){
    let currItem = {}
    routeAssets.map(
        (baseItem, idx) => {
          if(baseItem.chainId == window.currChainId  && baseItem.symbol  == 'W'+ NetworksData[window.currChainId].nativeCurrency.symbol)
            currItem =  baseItem
        }
    )
    return currItem
  }else {
    return asset
  }
}

export const getLPSymbol = (pool) => {
  //return `${pool.token0.symbol === 'WBONE' ? 'BONE' : pool.token0.symbol}/${pool.token1.symbol === 'WBONE' ? 'BONE' : pool.token1.symbol}`
  return `${pool.token0.symbol}/${pool.token1.symbol}`
}

export const getLP0Symbol = (pool) => {
  //return `${pool.token0.symbol === 'WBONE' ? 'BONE' : pool.token0.symbol}`
  return `${pool.token0.symbol}`
}

export const getLP1Symbol = (pool) => {
  //return `${pool.token1.symbol === 'WBONE' ? 'BONE' : pool.token1.symbol}`
  return `${pool.token1.symbol}`
}


export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1).toFixed(0)
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_VALUE = new BigNumber(0)
