import { useMemo } from 'react'
import { GAMMA_UNIPROXY_ADDRESSES, MULTICALL_ADDRESS, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, QUOTER_ADDRESSES } from '../config/constants/v3/addresses'
import { algebraAbi, gammaUniProxyAbi, multicallV3Abi, quoterAbi } from '../config/abi/v3'
import { getContract } from '../utils/contract'
import { useActiveWeb3React } from './useActiveWeb3React'

export function useContract(addressOrAddressMap, ABI, withSignerIfPossible = true) {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account])
}

export function useContracts(addressOrAddressMaps, ABI, withSignerIfPossible = true) {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMaps || !ABI || !library || !chainId) return []
    return addressOrAddressMaps.map((addressOrAddressMap) => {
      let address
      if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
      else address = addressOrAddressMap[chainId]
      if (!address) return null
      try {
        return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    })
  }, [addressOrAddressMaps, ABI, library, chainId, withSignerIfPossible, account])
}

export function useMulticall2Contract() {
  return useContract(MULTICALL_ADDRESS, multicallV3Abi, false)
}

export function useV3Quoter() {
  return useContract(QUOTER_ADDRESSES, quoterAbi, false)
}

export function useV3GammaUniproxy() {
  return useContract(GAMMA_UNIPROXY_ADDRESSES, gammaUniProxyAbi, false)
}

export function useV3Algebra() {
  return useContract(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, algebraAbi, false)
}
