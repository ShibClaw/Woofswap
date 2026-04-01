// import { InjectedConnector } from '@web3-react/injected-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { BscConnector } from '@binance-chain/bsc-connector'
import {getRpcUrl,NetworksData} from '../config/constants'
// import { supportedChainIds } from '../config/constants'

const POLLING_INTERVAL = 12000

const defaultChainId = process.env.REACT_APP_CHAIN_ID
const rpcUrl = 'https://rpc.shibarium.shib.io'
//NetworksData[defaultChainId].rpcUrls[0]
// const supportedChainIds = [Number(defaultChainId)]
const supportedChainIds = [Number(109)]
// export const injected = new InjectedConnector({
//   supportedChainIds,
// })
//
// const walletconnect = new WalletConnectConnector({
//   rpc: { [defaultChainId]: rpcUrl },
//   qrcode: true,
//   pollingInterval: POLLING_INTERVAL,
// })
//
// const walletlink = new WalletLinkConnector({
//   url: rpcUrl,
//   appName: 'woof',
//   supportedChainIds: supportedChainIds,
// })
//
// const binanceChainWalletConnector = new BscConnector({ supportedChainIds })

export const ConnectorNames = {
  MetaMask: 'MetaMask',
  TrustWallet: 'TrustWallet',
  WalletConnect: 'WalletConnect',
  Coinbase: 'Coinbase',
  GateWeb3: 'GateWeb3',
  OKXWallet: 'OKXWallet',
  BitgetWallet:"BitgetWallet",
  BinanceChainWallet: 'BinanceChainWallet',
  Coin98Wallet: 'Coin98Wallet',
}

export const connectorsByName = {
  // [ConnectorNames.MetaMask]: injected,
  // [ConnectorNames.GateWeb3]: injected,
  // [ConnectorNames.OKXWallet]: injected,
  // [ConnectorNames.BitgetWallet]: injected,
  // [ConnectorNames.TrustWallet]: injected,
  // [ConnectorNames.WalletConnect]: walletconnect,
  // [ConnectorNames.Coinbase]: walletlink,
  // [ConnectorNames.BinanceChainWallet]: binanceChainWalletConnector,
  // [ConnectorNames.Coin98Wallet]: injected,
}
