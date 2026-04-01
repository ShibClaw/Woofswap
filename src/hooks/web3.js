// import Web3 from 'web3'
// import {getRpcUrl} from '../config/constants/index'
//
// // const RPC_URL = getRpcUrl()
// // const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })
// // const web3NoAccount = new Web3(httpProvider)
// //
// // const getWeb3NoAccount = () => {
// //   return web3NoAccount
// // }
// //
// // export { getWeb3NoAccount }
// // export default web3NoAccount
//
//
// // export function useWeb3React<T = any>(key?: string): Web3ReactContextInterface<T> {
// //     return useContext(getWeb3ReactContext(key))
// // }
// //
// // export { useWeb3React } from './provider';
//
//
// import React, { createContext, useState, useContext } from 'react';
//
// import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
//
// const ThemeContext = createContext();
// export function ThemeProvider({ children }) {
//
//     const { address, chainId, isConnected } = useWeb3ModalAccount()
//     // const { account } = address;
//     const [account, setAccount] = useState(address)
//
//     return (
//         <ThemeContext.Provider value={{ address, account,chainId,isConnected }}>
//     {children}
// </ThemeContext.Provider>
// );
// }
//
// export function useWeb3React() {
//     return useContext(ThemeContext);
// }
