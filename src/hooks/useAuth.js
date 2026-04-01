import { useCallback } from 'react'
import {
    createWeb3Modal,
    defaultConfig,
    useWeb3Modal,
    useWeb3ModalEvents,
    useWeb3ModalState,
    useWeb3ModalTheme
} from '@web3modal/ethers/react'
// import { UnsupportedChainIdError, useWeb3React } from 'ffffffff'
// import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
// import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorsByName } from '../utils/connectors'
import { connectorLocalStorageKey } from '../config/constants'
import { addRPC } from '../utils/addRPC'
import { customNotify } from '../utils/notify'

const useAuth = () => {
  const modal = useWeb3Modal()
  const login = useCallback(
      (connectorID) => {
        modal.open();
      },[modal])
  const logout = useCallback(() => {

  }, [modal])
  // const { activate, deactivate } = useWeb3React()
  const { activate, deactivate } = {activate:0, deactivate:0}
//   const login = useCallback(
//     (connectorID) => {
//       const connector = connectorsByName[connectorID]
//       if (connector) {
//         if (connectorID === ConnectorNames.Coin98Wallet) {
//           if (!window.coin98 && !window.binanceChain && !window.binanceChain?.isCoin98) {
//             customNotify('Coin98 Extension is not installed!', 'warn')
//             return
//           }
//         }
//         if (connectorID === 'GateWeb3') {
//           if (!window.gatewallet) {
//             customNotify('Gate Wallet is not installed!', 'warn')
//             return
//           }
//           async function  requestAccounts() {
//             const newAccounts = await gatewallet.request({ method: 'eth_requestAccounts' })
//                 .then(async (res) => {  //.then(handleAccountsChanged)
//                   //window.ethereum = window.gatewallet
//                   console.log(res)
//                 })
//                 .catch((error) => {
//                   if (error.code === 4001) {
// // EIP-1193 userRejectedRequest error
//                     console.log('Please connect to Gate Wallet.');
//                   } else {
//                     console.error(error);
//                   }
//                 });
//           }
//           requestAccounts();
//
//         }
//         if (connectorID === 'OKXWallet') {
//           if (!window.okxwallet) {
//             customNotify('OKX Wallet is not installed!', 'warn')
//             return
//           }
//           async function  requestAccounts() {
//             const newAccounts = await okxwallet.request({ method: 'eth_requestAccounts' })
//                 .then(async (res) => {  //.then(handleAccountsChanged)
//                   //window.ethereum = window.gatewallet
//                   console.log(res)
//                 })
//                 .catch((error) => {
//                   if (error.code === 4001) {
// // EIP-1193 userRejectedRequest error
//                     console.log('Please connect to Gate Wallet.');
//                   } else {
//                     console.error(error);
//                   }
//                 });
//           }
//           requestAccounts();
//
//         }
//         if (connectorID === 'BitgetWallet') {
//           const provider = window.bitkeep && window.bitkeep.ethereum;
//           if (!provider) {
//             customNotify('Bitget Wallet is not installed!', 'warn')
//             return
//           }
//           async function  requestAccounts() {
//             const newAccounts = await provider.request({ method: 'eth_requestAccounts' })
//                 .then(async (res) => {  //.then(handleAccountsChanged)
//                   //window.ethereum = window.gatewallet
//                   console.log(res)
//                 })
//                 .catch((error) => {
//                   if (error.code === 4001) {
// // EIP-1193 userRejectedRequest error
//                     console.log('Please connect to Gate Wallet.');
//                   } else {
//                     console.error(error);
//                   }
//                 });
//           }
//           requestAccounts();
//
//         }
//
//
//         activate(connector, async (error) => {
//           if (error instanceof UnsupportedChainIdError) {
//             if ([ConnectorNames.MetaMask, ConnectorNames.Coinbase, ConnectorNames.TrustWallet,ConnectorNames.GateWeb3,ConnectorNames.OKXWallet,ConnectorNames.BitgetWallet].includes(connectorID)) {
//               const hasSetup = await addRPC()
//               if (hasSetup) {
//                 activate(connector)
//               }
//             } else {
//               customNotify('Please connect your wallet to Puppy Net-719 Chain.', 'warn')
//             }
//           } else {
//             window.localStorage.removeItem(connectorLocalStorageKey)
//             if (error instanceof NoEthereumProviderError) {
//               customNotify('No provider was found', 'error')
//             } else if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
//               if (connector instanceof WalletConnectConnector) {
//                 const walletConnector = connector
//                 walletConnector.walletConnectProvider = null
//               }
//               customNotify('User denied account authorization', 'error')
//             } else {
//               customNotify(error.message, 'error')
//             }
//           }
//         })
//       } else {
//         customNotify('The connector config is wrong', 'error')
//       }
//     },
//     [activate],
//   )

  // const logout = useCallback(() => {
  //   deactivate()
  //   // This localStorage key is set by @web3-react/walletconnect-connector
  //   if (window.localStorage.getItem('walletconnect')) {
  //     connectorsByName[ConnectorNames.WalletConnect].close()
  //     connectorsByName[ConnectorNames.WalletConnect].walletConnectProvider = null
  //   }
  //   window.localStorage.removeItem(connectorLocalStorageKey)
  // }, [deactivate])

  return { login, logout }
}

export default useAuth
