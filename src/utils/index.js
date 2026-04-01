import { ethers } from 'ethers'
import { getAddress } from '@ethersproject/address'
import { defaultChainId } from '../config/constants'
// import getRpcUrl from './getRpcUrl'

export const getLibrary = (provider = null) => provider

export const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-6)}`
}



// export const getNetworkLibrary = () => {
//   return new ethers.providers.JsonRpcProvider(getRpcUrl(), defaultChainId)
// }

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}

export const isAddress = (value) => {
  try {
    return getAddress(value || '')
  } catch {
    return false
  }
}
