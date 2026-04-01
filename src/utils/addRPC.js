import { defaultChainId } from '../config/constants'

export const addRPC = async () => {

  const provider = window.stargate?.wallet?.ethereum?.signer?.provider?.provider ?? window.ethereum
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${defaultChainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      if (switchError?.code === 4902 || switchError?.code === -32603) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${defaultChainId.toString(16)}`,
                chainName: 'Shibarium',
                nativeCurrency: {
                  name: 'BONE Coin',
                  symbol: 'BONE',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.shibarium.shib.io/'],
                blockExplorerUrls: ['https://www.shibariumscan.io/'],
              },
              // {
              //   chainId: '0x362b',
              //   chainName: 'APES Mainnet',
              //   nativeCurrency: {
              //     name: 'Apes Coin',
              //     symbol: 'APES',
              //     decimals: 18,
              //   },
              //   rpcUrls: ['https://mainnet-node.apeschain.org/'],
              //   blockExplorerUrls: ['https://explorer.apeschain.org/'],
              // },
            ],
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network', error)
          return false
        }
      }
      return false
    }
  }
}

