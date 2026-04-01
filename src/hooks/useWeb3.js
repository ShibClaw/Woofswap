import { useEffect, useState, useRef } from 'react'
import Web3 from 'web3'
// import { useWeb3React } from 'ffffffff'
// import { getWeb3NoAccount } from '../utils/web3'
 import {getRpcUrl} from "../config/constants/index";

import { ethers } from "ethers";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { SafeAppWeb3Modal } from '@safe-global/safe-apps-web3modal';
import { web3modalOptions } from '../config/constants'


const useWeb3 = () => {
  // const { library ,chainId } = useWeb3React()
  // const refEth = useRef(library)
  //
  // const RPC_URL = getRpcUrl(chainId)
  // const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })
  // const web3NoAccount = new Web3(httpProvider)
  // const { walletProvider } = useWeb3ModalProvider()
  // const [web3, setweb3] = useState(library ? new Web3(library) : web3NoAccount)
  //
  // useEffect(() => {
  //   if (library !== refEth.current) {
  //     setweb3(library ? new Web3(library) : web3NoAccount)
  //     refEth.current = library
  //   }
  //   window.currWeb3 = library ? new Web3(library) : web3NoAccount
  // }, [library,chainId])

  const { walletProvider } = useWeb3ModalProvider()
  const modal = new SafeAppWeb3Modal(web3modalOptions);

  const [web3, setweb3] = useState(null)
  const { address, chainId, isConnected } = useWeb3ModalAccount()

  useEffect(async () => {
    const provider = await modal.requestProvider();
    if(provider){
      //console.log("SafeAppWeb3Modal------------1111")
      const ethersProvider = new ethers.BrowserProvider(provider)
      const loadedAsSafeApp = await modal.isSafeApp();
      //console.log("loadedAsSafeApp",loadedAsSafeApp)
      const signer = await ethersProvider.getSigner()
      setweb3(signer)
    }else {
      if (walletProvider) {
        //console.log("walletProvider------------")
        const ethersProvider = new ethers.BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()
        setweb3(signer)
      }
    }

    window.currWeb3 = web3
  }, [walletProvider,chainId,isConnected,address])

  return web3
}

//
// export const wssProvider = new ethers.WebSocketProvider(
//     'https://rpc.shibarium.shib.io'
// );

export default useWeb3
