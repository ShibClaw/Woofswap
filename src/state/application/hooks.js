import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useSelector } from 'react-redux'

export function useBlockNumber() {
  const { address, chainId, isConnected } = useWeb3ModalAccount()

  return useSelector((state) => state.application.blockNumber[chainId ?? -1])
}
