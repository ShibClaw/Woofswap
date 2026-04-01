// import { useWeb3React } from '@web3-react/core'
// import { Web3Provider } from '@ethersproject/providers'
import { ethers } from "ethers";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

export function useActiveWeb3React() {
  const { walletProvider } = useWeb3ModalProvider()
  // const context = useWeb3React()
  const library = walletProvider ? new ethers.BrowserProvider(walletProvider) : undefined
  return {
    // ...context,
    library,
  }
}
