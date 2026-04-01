import { ConnectorNames } from '../../utils/connectors'
import {
  defaultConfig
} from '@web3modal/ethers/react'

const connectorLocalStorageKey = 'woof-local-key'
// eslint-disable-next-line no-use-before-define
let defaultChainId = Number(process.env.REACT_APP_CHAIN_ID)
const privateSaleStartTimeStamp = 1669993200

const REACT_APP_MUON_API_URL = 'https://dibs-shield.muon.net/'

const projectId = '006f5cc5e5d3173ee2e2bc499ba6eecd'
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

// 2. Set chains
const chains = [
  {
    chainId: 109,
    name: 'Shibarium',
    currency: 'BONE',
    explorerUrl: 'https://www.shibariumscan.io',
    rpcUrl: 'https://rpc.shibarium.shib.io'
  },
  {
    chainId: 10088,
    name: 'GateLayer',
    currency: 'GT',
    explorerUrl: 'https://gatelayer-mainnet.gatenode.cc',
    rpcUrl: 'https://gatelayer-mainnet.gatenode.cc'
  },
  {
    chainId: 196,
    name: 'X Layer',
    currency: 'OKB',
    explorerUrl: 'https://www.oklink.com/xlayer',
    rpcUrl: 'https://rpc.xlayer.tech'
  },
  {
    chainId: 177,
    name: 'HashKey Mainnet',
    currency: 'HSK',
    explorerUrl: 'https://hashkey.blockscout.com',
    rpcUrl: 'https://mainnet.hsk.xyz'
  }
]

const metadata = {
  name: 'WoofSwap',
  description: 'WoofSwap - Decentralized Exchange',
  url: 'https://woofswap.finance',
  icons: ['https://woofswap.finance/logo.png']
}

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://rpc.shibarium.shib.io',
  defaultChainId: 109,
})

const  web3modalOptions = {
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true,
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#e06d2b',
    '--w3m-color-mix-strength': 20
  }
}

const NetworksData = {
  196: {
    chainId: '0xc4',
    chainName: 'X Layer',
    nativeCurrency: {
      name: 'OKB Coin',
      symbol: 'OKB',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.xlayer.tech/'],
    blockExplorerUrls: ['https://www.oklink.com/xlayer/'],
    iconUrls: ['https://swap.woofingjace.com/okb-logo.png'],
  },177: {
    chainId: '0xb1',
    chainName: 'HashKey Mainnet',
    nativeCurrency: {
      name: 'HSK Coin',
      symbol: 'HSK',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.hsk.xyz/'],
    blockExplorerUrls: ['https://hashkey.blockscout.com/'],
    iconUrls: ['https://woofswap.finance/image/tokens/HSK.png'],
  },
  86: {
    chainId: '0x56',
    chainName: 'GateChain',
    nativeCurrency: {
      name: 'Gate Coin',
      symbol: 'GT',
      decimals: 18,
    },
    rpcUrls: ['https://evm.nodeinfo.cc/'],
    blockExplorerUrls: ['https://www.gatescan.org/'],
    iconUrls: ['https://woofswap.finance/image/tokens/GT.png'],
  },
  10088: {
    chainId: '0x2768',
    chainName: 'GateLayer',
    nativeCurrency: {
      name: 'Gate Coin',
      symbol: 'GT',
      decimals: 18,
    },
    rpcUrls: ['https://gatelayer-mainnet.gatenode.cc/'],
    blockExplorerUrls: ['https://www.gatescan.org/gatelayer/'],
    iconUrls: ['https://woofswap.finance/image/tokens/GT.png'],
  },
  109: {
    chainId: '0x6d',
    chainName: 'Shibarium',
    nativeCurrency: {
      name: 'BONE Coin',
      symbol: 'BONE',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.shibarium.shib.io/'],
    blockExplorerUrls: ['https://www.shibariumscan.io/'],
    iconUrls: ['https://woofswap.finance/image/icons/shib-logo.webp'],
  },
  56: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
    iconUrls: ['https://woofswap.finance//image/tokens/BNB.png'],
  },
  2420 : {
    chainId: '0x974',
    chainName: 'Rufus Chain',
    nativeCurrency: {
      name: 'Rufus Chain',
      symbol: 'ELON',
      decimals: 18,
    },
    rpcUrls: ['https://rufus.calderachain.xyz/http/'],
    blockExplorerUrls: ['https://rufus.calderaexplorer.xyz/'],
    iconUrls: ['https://woofswap.finance/image/tokens/ELON.png'],
  },
  860621 : {
    chainId: '0xd21cd',
    chainName: 'PGP Chain',
    nativeCurrency: {
      name: 'PGP Chain',
      symbol: 'PGA',
      decimals: 18,
    },
    rpcUrls: ['https://pgpnode.pgachain.org/'],
    blockExplorerUrls: ['https://pgp.elastos.io/'],
    iconUrls: ['https://woofswap.finance/image/tokens/PGA.png'],
  },
}


const ChainId ={
  MAINNET : 7119,
  TESTNET : 719
}
const TransactionType = {
  START: 'start',
  WAITING: 'waiting',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
}

const LotteryStatus = {
  UNKNOWN: 0,
  WON: 1,
  LOST: 2,
}

const connectors = [
  {
    key: 'metamask',
    logo: '/image/wallets/metamask-logo.svg',
    title: 'MetaMask',
    connector: ConnectorNames.MetaMask,
  },
  {
    key: 'trustwallet',
    logo: '/image/wallets/trustwallet-logo.svg',
    title: 'Trust Wallet',
    connector: ConnectorNames.TrustWallet,
  },
  {
    key: 'walletConnect',
    logo: '/image/wallets/walletconnect-logo.svg',
    title: 'Wallet Connect',
    connector: ConnectorNames.WalletConnect,
  },
  {
    key: 'coinbase',
    logo: '/image/wallets/coinbase-wallet-logo.svg',
    title: 'Coinbase Wallet',
    connector: ConnectorNames.Coinbase,
  },
  {
    key: 'GateWeb3',
    logo: '/image/wallets/gate.png',
    title: 'Gate Wallet',
    connector: ConnectorNames.GateWeb3,
  },
  {
    key: 'OKXWallet',
    logo: '/image/wallets/okxwallet.png',
    title: 'OKX Wallet',
    connector: ConnectorNames.OKXWallet,
  },
  {
    key: 'BitgetWallet',
    logo: '/image/wallets/BitKeep.png',
    title: 'Bitget Wallet',
    connector: ConnectorNames.BitgetWallet,
  }
]

const routeAssets = [
  {
    name: 'Wrapped BONE',
    symbol: 'WBONE',
    address: '0x888888888030f38cf1cda6ad34ccccb0f83cd86a',
    chainId: 719,
    decimals: 18,
    logoURI: '/image/tokens/BONE.png',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xddbbf815664a962474dbbb4daf987d6a3e9cbe38',
    chainId: 719,
    decimals: 6,
    logoURI: '/image/tokens/USDC.png',
  },
  {
    name: 'DAI Token',
    symbol: 'DAI',
    address: '0x53642958e33d67a9abf67205862b587b3d62898e',
    chainId: 719,
    decimals: 18,
    logoURI: '/image/tokens/DAI.png',
  },
  {
    name: 'Wrapped BONE',
    symbol: 'WBONE',
    address: '0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd',
    chainId: 109,
    decimals: 18,
    logoURI: '/image/tokens/BONE.png',
  },
  {
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    chainId: 56,
    decimals: 18,
    logoURI: '/image/tokens/BONE.png',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    chainId: 56,
    decimals: 6,
    logoURI: '/image/tokens/USDC.png',
  },
  {
    name: 'USDT Token',
    symbol: 'USDT',
    address: '0x55d398326f99059ff775485246999027b3197955',
    chainId: 56,
    decimals: 18,
    logoURI: '/image/tokens/USDT.png',
  },
  {
    name: 'Wrapped ELON',
    symbol: 'WELON',
    address: '0x19ecB643988dB8beA1Ff528E6D91dB559b70F181',
    chainId: 2420,
    decimals: 18,
    logoURI: '/image/tokens/ELON.png',
  },
  {
    name: 'Wrapped GT',
    symbol: 'WGT',
    address: '0x672f30407A71fa8737A3A14474ff37E09c7Fc44a',
    chainId: 86,
    decimals: 18,
    logoURI: '/image/tokens/GT.png',
  }
  ,
  {
    name: 'Wrapped OKB',
    symbol: 'WOKB',
    address: '0xe538905cf8410324e03a5a23c1c177a474d59b2b',
    chainId: 196,
    decimals: 18,
    logoURI: '/image/tokens/WOKB.png',
  },
  {
    name: 'Wrapped GT',
    symbol: 'WGT',
    address: '0x6803b8E93b13941F6B73b82E324B80251B3dE338',
    chainId: 10088,
    decimals: 18,
    logoURI: '/image/tokens/GT.png',
  },
  {
    name: 'Wrapped HSK',
    symbol: 'WHSK',
    address: '0xB210D2120d57b758EE163cFfb43e73728c471Cf1',
    chainId: 177,
    decimals: 18,
    logoURI: '/image/tokens/HSK.png',
  }
  ,
  {
    name: 'Wrapped PGA',
    symbol: 'WPGA',
    address: '0x1369a5f999618607bB0bb92892Ef69e2233F88f8',
    chainId: 860621,
    decimals: 18,
    logoURI: '/image/tokens/PGA.png',
  }
]
const periodLevels = [
  {
    value: 0,
    label: '2 weeks',
  },
  {
    value: 1,
    label: '6 months',
  },
  {
    value: 2,
    label: '1 year',
  },
  {
    value: 3,
    label: '2 years',
  },
]

const NumberOfRows = [10, 20, 30, 40]

const PoolTitles = {
  ALL: 'ALL',
  STABLE: 'STABLE',
  VOLATILE: 'VOLATILE',
}

const ReferralTabs = ['code', 'rewards', 'leaderboard', 'lottery']
const TaxAssets = [
  '0x74ccbe53f77b08632ce0cb91d3a545bf6b8e0979', // fBOMB
  '0xc95cd75dcea473a30c8470b232b36ee72ae5dcc2', // CHAM
  '0x3a806a3315e35b3f5f46111adb6e2baf4b14a70d', // LIBERA
]
const NewPools = [
  '0xd714206a7D63F5a2d613064815995E9CC7061988', // vAMM-UNW/WOOF
  '0x2475FF2A7C81da27eA2e08e0d3B0Ad01e16225eC', // sAMM-BTCB/multiBTC
]

const STABLE_TOKENS = {
  USDT: '0x55d398326f99059fF775485246999027B3197955',
  USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  DAI: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
  DEI: '0xDE1E704dae0B4051e80DAbB26ab6ad6c12262DA0',
  USD: '0xe80772eaf6e2e18b651f160bc9158b2a5cafca65',
  ETS: '0x5B852898CD47d2Be1d77D30377b3642290f5Ec75',
  HAY: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
  FRAX: '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40',
  CUSD: '0xFa4BA88Cf97e282c505BEa095297786c16070129',
  MAI: '0x3F56e0c36d275367b8C502090EDF38289b3dEa0d',
  DOLA: '0x2F29Bc0FFAF9bff337b31CBe6CB5Fb3bf12e5840',
  wUSDR: '0x2952beb1326acCbB5243725bd4Da2fC937BCa087',
}

const  SignatureHash = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const  BOOTLOADER_FORMAL_ADDRESS = '0x0000000000000000000000000000000000008001';
const  CONTRACT_DEPLOYER_ADDRESS = '0x0000000000000000000000000000000000008006';
const  L1_MESSENGER_ADDRESS = '0x0000000000000000000000000000000000008008';
const  L2_ETH_TOKEN_ADDRESS = '0x000000000000000000000000000000000000800a';
const  L1_TO_L2_ALIAS_OFFSET = '0x1111000000000000000000000000000000001111';
const getRpcUrl = (chainId=109) => {
  return NetworksData[chainId].rpcUrls[0]
}
export {
  SignatureHash,BOOTLOADER_FORMAL_ADDRESS,CONTRACT_DEPLOYER_ADDRESS,L1_MESSENGER_ADDRESS,L2_ETH_TOKEN_ADDRESS,L1_TO_L2_ALIAS_OFFSET,
  connectorLocalStorageKey,
  defaultChainId,
  privateSaleStartTimeStamp,
  connectors,
  TransactionType,
  routeAssets,
  periodLevels,
  NumberOfRows,
  PoolTitles,
  LotteryStatus,
  REACT_APP_MUON_API_URL,
  TaxAssets,
  STABLE_TOKENS,
  ReferralTabs,
  NewPools,
  ChainId,
  NetworksData,
  getRpcUrl,
  web3modalOptions
}
