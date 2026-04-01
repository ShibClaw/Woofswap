import {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { v4 as uuidv4 } from 'uuid'
import { routerAbi } from '../config/abi'
import erc20Abi from '../config/abi/erc20.json'
import { PairsContext } from '../context/PairsContext'
import { routeAssets, TaxAssets, TransactionType,NetworksData } from '../config/constants'
import {getRouterAddress, getStakingAddress, getWBONE_ShibAddress, getWBONE_WoofAddress} from '../utils/addressHelpers'
import {formatAmount, fromWei, isInvalidAmount, MAX_UINT256, toWei, wrappedAsset} from '../utils/formatNumber'
import { multicall } from '../utils/multicall'
import { getAllowance, sendContract } from '../utils/api'
import { useRouter,useAbiContract,useERC20 } from './useContract'
import useWeb3 from './useWeb3'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import {getERC20Contract, getFactoryContract,getRouterContract, getWETHContract} from '../utils/contractHelpers'
import moment from 'moment'
import {customNotify} from "../utils/notify";
import {BaseAssetsConetext} from "../context/BaseAssetsConetext";
import useDebounce from "./useDebounce";

// import { BrowserProvider, Contract, formatUnits } from 'ethers'
import {  Contract, formatUnits } from 'ethers'
import { ethers } from "ethers";
import useRefresh from "./useRefresh";

const useQuoteSwap = (fromAsset, toAsset, fromAmount) => {
  const [bestTrade, setBestTrade] = useState()
  const [priceImpact, setPriceImpact] = useState(new BigNumber(0))
  const [quotePending, setQuotePending] = useState(false)
  const { pairs,userPairs } = useContext(PairsContext)
  const web3 = useWeb3()
  const factoryContract = getFactoryContract(web3)
  const routerContract = getRouterContract(web3)
  // const { chainId } = useWeb3React()
  const baseAssets = useContext(BaseAssetsConetext)

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const { fastRefresh,setfastestRefresh } = useRefresh()


  useEffect(() => {
    const fetchAllowance = async () =>  {

      //const bases = routeAssets.filter((item) => chainId == item.chainId && ![fromAsset.address.toLowerCase(), toAsset.address.toLowerCase()].includes(item.address.toLowerCase()))
      const bases = routeAssets.filter((item) => chainId == item.chainId )
      const bases1 = routeAssets.filter((item) => chainId == item.chainId )
      // bases.push(fromAsset)
     // bases.push(toAsset)


      let isAdd = false;
      let isAddWoof = false;
      if((fromAsset.address.toLowerCase() == '0xee824089e12715c4072d5ec64f4e59e1f041f3db' //spet
              ||fromAsset.address.toLowerCase() == '0x0b4fd6288b6d32171cc515bffc9340026f56a358' //pika
              ||fromAsset.address.toLowerCase() == '0x7f816954bae96fdcc79a06583446232111613c7a' //SHIB314
          )
          && (toAsset.address.toLowerCase().length<32
              || toAsset.address.toLowerCase() == '0x839fdb6cc98342b428e074c1573adf6d48ca3bfd' //wbone-woof
              || toAsset.address.toLowerCase() == '0xc76f4c819d820369fb2d7c1531ab3bb18e6fe8d8')){//wbone-shib
        isAdd = true;
      }

      if((toAsset.address.toLowerCase() == '0xee824089e12715c4072d5ec64f4e59e1f041f3db' //spet
        ||toAsset.address.toLowerCase() == '0x0b4fd6288b6d32171cc515bffc9340026f56a358' //pika
              ||toAsset.address.toLowerCase() == '0x7f816954bae96fdcc79a06583446232111613c7a' //SHIB314
          )
        && (fromAsset.address.toLowerCase().length<32
              || fromAsset.address.toLowerCase() == '0x839fdb6cc98342b428e074c1573adf6d48ca3bfd' //wbone-woof
              || fromAsset.address.toLowerCase() == '0xc76f4c819d820369fb2d7c1531ab3bb18e6fe8d8')){//wbone-shib
        isAdd = true;
      }


    //isAddWoof
      if((fromAsset.address.toLowerCase() == '0x4b713b86be62b448b172da6d8144d3e55da63c9b' //MPEN
              ||fromAsset.address.toLowerCase() == '0xb9ae1d4e474cc154f48e5c2f0559eb3a78ad1f09' //shibs
              ||fromAsset.address.toLowerCase() == '0x3e07514349f5837fc6ae7a996b4d8e4d79a5f487' //SOME
          )
          && (toAsset.address.toLowerCase().length<32
              || toAsset.address.toLowerCase() == '0x839fdb6cc98342b428e074c1573adf6d48ca3bfd' //wbone-woof
              || toAsset.address.toLowerCase() == '0xc76f4c819d820369fb2d7c1531ab3bb18e6fe8d8')){//wbone-shib
        isAddWoof = true;
      }

      if((toAsset.address.toLowerCase() == '0x4b713b86be62b448b172da6d8144d3e55da63c9b' //MPEN
              ||toAsset.address.toLowerCase() == '0xb9ae1d4e474cc154f48e5c2f0559eb3a78ad1f09' //shibs
              ||toAsset.address.toLowerCase() == '0x3e07514349f5837fc6ae7a996b4d8e4d79a5f487' //SOME
          )
          && (fromAsset.address.toLowerCase().length<32
              || fromAsset.address.toLowerCase() == '0x839fdb6cc98342b428e074c1573adf6d48ca3bfd' //wbone-woof
              || fromAsset.address.toLowerCase() == '0xc76f4c819d820369fb2d7c1531ab3bb18e6fe8d8')){//wbone-shib
        isAddWoof = true;
      }


      if(isAdd){
        bases.push({
          "symbol": "DAMN",
          "address": "0xeCe898EdCc0AF91430603175F945D8de75291c70",
          "chainId": 109,
          "price": "0",
          "decimals": 18,
          "name": "Sol Killer",
          "logoURI": "/image/tokens/DAMN.png"
        });
        bases1.push({
          "symbol": "DAMN",
          "address": "0xeCe898EdCc0AF91430603175F945D8de75291c70",
          "chainId": 109,
          "price": "0",
          "decimals": 18,
          "name": "Sol Killer",
          "logoURI": "/image/tokens/DAMN.png"
        });
      }

      if(isAddWoof){
        bases.push({
          "symbol": "WOOF",
          "address": "0xD0daa7B6ff1B40d3cc6F0B2Cf7E85cB993D1c834",
          "chainId": 109,
          "price": "0",
          "decimals": 18,
          "name": "WOOF",
          "logoURI": "/image/tokens/WOOF.png"
        });
        bases1.push({
          "symbol": "WOOF",
          "address": "0xD0daa7B6ff1B40d3cc6F0B2Cf7E85cB993D1c834",
          "chainId": 109,
          "price": "0",
          "decimals": 18,
          "name": "WOOF",
          "logoURI": "/image/tokens/WOOF.png"
        });
      }

      isAddWoof= false;
      isAdd = false;

      userPairs.forEach((pair) => {
        let isOk = true;
            if( (pair.pairInfo_token0.toLowerCase() ==  fromAsset.address.toLowerCase()
                && pair.pairInfo_token1.toLowerCase() ==  toAsset.address.toLowerCase())
                ||  (pair.pairInfo_token1.toLowerCase() ==  fromAsset.address.toLowerCase()
                    && pair.pairInfo_token0.toLowerCase() ==  toAsset.address.toLowerCase())
                ) {
              isOk = false
            }

            if(isOk){
              if( fromAsset.address.toLowerCase()  == pair.pairInfo_token0.toLowerCase()){

                const found = baseAssets
                  .find(
                    (asset) =>
                        asset.address.toLowerCase() == pair.pairInfo_token1.toLowerCase()
                  )


                bases.push({"name":pair.pairInfo_token1_symbol,
                  "symbol":pair.pairInfo_token1_symbol,
                  "address":pair.pairInfo_token1.toLowerCase(),
                  "chainId":chainId,
                  "decimals":parseInt( pair.pairInfo_token1_decimals ),
                  "logoURI":found?found.logoURI:"/image/tokens/ERC20_109.png"})
              }

              if( fromAsset.address.toLowerCase()  == pair.pairInfo_token1.toLowerCase()){
                const found = baseAssets
                    .find(
                        (asset) =>
                            asset.address.toLowerCase() == pair.pairInfo_token0.toLowerCase()
                    )
                bases.push({"name":pair.pairInfo_token0_symbol,
                  "symbol":pair.pairInfo_token0_symbol,
                  "address":pair.pairInfo_token0.toLowerCase(),
                  "chainId":chainId,
                  "decimals":parseInt( pair.pairInfo_token0_decimals ),
                  "logoURI":found?found.logoURI:"/image/tokens/ERC20_109.png"})
              }

              if( toAsset.address.toLowerCase()  == pair.pairInfo_token0.toLowerCase()){
                const found = baseAssets
                    .find(
                        (asset) =>
                            asset.address.toLowerCase() == pair.pairInfo_token1.toLowerCase()
                    )
                bases.push({"name":pair.pairInfo_token1_symbol,
                  "symbol":pair.pairInfo_token1_symbol,
                  "address":pair.pairInfo_token1.toLowerCase(),
                  "chainId":chainId,
                  "decimals":parseInt( pair.pairInfo_token1_decimals ),
                  "logoURI":found?found.logoURI:"/image/tokens/ERC20_109.png"})
              }

              if( toAsset.address.toLowerCase()  == pair.pairInfo_token1.toLowerCase()){
                const found = baseAssets
                    .find(
                        (asset) =>
                            asset.address.toLowerCase() == pair.pairInfo_token0.toLowerCase()
                    )
                bases.push({"name":pair.pairInfo_token0_symbol,
                  "symbol":pair.pairInfo_token0_symbol,
                  "address":pair.pairInfo_token0.toLowerCase(),
                  "chainId":chainId,
                  "decimals":parseInt( pair.pairInfo_token0_decimals ),
                  "logoURI":found?found.logoURI:"/image/tokens/ERC20_109.png"})
              }
            }

      })

      const result = []
      // direct pairs
      result.push({
        routes: [
          {
            from: fromAsset.address,
            to: toAsset.address,
            fromSymbol: fromAsset.symbol,
            toSymbol: toAsset.symbol,
            stable: true,
          },
        ],
      })
      result.push({
        routes: [
          {
            from: fromAsset.address,
            to: toAsset.address,
            fromSymbol: fromAsset.symbol,
            toSymbol: toAsset.symbol,
            stable: false,
          },
        ],
      })
      //
      // 1 hop
      bases1.forEach((base) => {
        result.push({
          routes: [
            {
              from: fromAsset.address,
              to: base.address,
              fromSymbol: fromAsset.symbol,
              toSymbol: toAsset.symbol,
              stable: true,
            },
            {
              from: base.address,
              to: toAsset.address,
              fromSymbol: fromAsset.symbol,
              toSymbol: toAsset.symbol,
              stable: true,
            },
          ],
          base: [base],
        })
        result.push({
          routes: [
            {
              from: fromAsset.address,
              to: base.address,
              fromSymbol: fromAsset.symbol,
              toSymbol: base.symbol,
              stable: true,
            },
            {
              from: base.address,
              to: toAsset.address,
              fromSymbol: base.symbol,
              toSymbol: toAsset.symbol,
              stable: false,
            },
          ],
          base: [base],
        })
        result.push({
          routes: [
            {
              from: fromAsset.address,
              to: base.address,
              fromSymbol: fromAsset.symbol,
              toSymbol: base.symbol,
              stable: false,
            },
            {
              from: base.address,
              to: toAsset.address,
              fromSymbol: base.symbol,
              toSymbol: toAsset.symbol,
              stable: true,
            },
          ],
          base: [base],
        })
        result.push({
          routes: [
            {
              from: fromAsset.address,
              to: base.address,
              fromSymbol: fromAsset.symbol,
              toSymbol: base.symbol,
              stable: false,
            },
            {
              from: base.address,
              to: toAsset.address,
              fromSymbol: base.symbol,
              toSymbol: toAsset.symbol,
              stable: false,
            },
          ],
          base: [base],
        })
      })

      // // 2 hop
      // bases.forEach((base) => {
      //   const otherbases = bases.filter((ele) => ele.address !== base.address)
      //
      //   otherbases.forEach((otherbase) => {
      //     // true true true
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAsset.address,
      //           to: base.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: base.symbol,
      //           stable: true,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           fromSymbol: base.symbol,
      //           toSymbol: otherbase.symbol,
      //           stable: true,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAsset.address,
      //           fromSymbol: otherbase.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: true,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // true true false
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAsset.address,
      //           to: base.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: base.symbol,
      //           stable: true,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           fromSymbol: base.symbol,
      //           toSymbol: otherbase.symbol,
      //           stable: true,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAsset.address,
      //           fromSymbol: otherbase.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: false,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // true false true
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAsset.address,
      //           to: base.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: base.symbol,
      //           stable: true,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           fromSymbol: base.symbol,
      //           toSymbol: otherbase.symbol,
      //           stable: false,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAsset.address,
      //           fromSymbol: otherbase.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: true,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // true false false
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAsset.address,
      //           to: base.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: base.symbol,
      //           stable: true,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: false,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAsset.address,
      //           fromSymbol: otherbase.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: false,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // false true true
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAsset.address,
      //           to: base.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: base.symbol,
      //           stable: false,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           fromSymbol: base.symbol,
      //           toSymbol: otherbase.symbol,
      //           stable: true,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAsset.address,
      //           fromSymbol: otherbase.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: true,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // false true false
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAsset.address,
      //           to: base.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: base.symbol,
      //           stable: false,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           fromSymbol: base.symbol,
      //           toSymbol: otherbase.symbol,
      //           stable: true,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAsset.address,
      //           fromSymbol: otherbase.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: false,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // false false true
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAsset.address,
      //           to: base.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: base.symbol,
      //           stable: false,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           fromSymbol: base.symbol,
      //           toSymbol: otherbase.symbol,
      //           stable: false,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAsset.address,
      //           fromSymbol: otherbase.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: true,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //     // false false false
      //     result.push({
      //       routes: [
      //         {
      //           from: fromAsset.address,
      //           to: base.address,
      //           fromSymbol: fromAsset.symbol,
      //           toSymbol: base.symbol,
      //           stable: false,
      //         },
      //         {
      //           from: base.address,
      //           to: otherbase.address,
      //           fromSymbol: base.symbol,
      //           toSymbol: otherbase.symbol,
      //           stable: false,
      //         },
      //         {
      //           from: otherbase.address,
      //           to: toAsset.address,
      //           fromSymbol: otherbase.symbol,
      //           toSymbol: toAsset.symbol,
      //           stable: false,
      //         },
      //       ],
      //       base: [base, otherbase],
      //     })
      //   })
      // })


      const final = result.filter((item) => {
        let isExist = true
        //filter usdc and dai
        for (let i = 0; i < item.routes.length; i++) {
          const route = item.routes[i]
          // const found = pairs
          //   .filter((pair) => pair.isValid)
          //   .find(
          //     (pair) =>
          //       pair.stable === route.stable &&
          //       [pair.token0.address.toLowerCase(), pair.token1.address.toLowerCase()].includes(route.from.toLowerCase()) &&
          //       [pair.token0.address.toLowerCase(), pair.token1.address.toLowerCase()].includes(route.to.toLowerCase()),
          //   )
          if(route.from.toLowerCase() == "0x53642958E33d67A9abF67205862b587b3D62898e" && route.to.toLowerCase() == "0xddbbf815664a962474dbbb4daf987d6a3e9cbe38")
            isExist = false;
          if(route.to.toLowerCase() == "0x53642958E33d67A9abF67205862b587b3D62898e" && route.from.toLowerCase() == "0xddbbf815664a962474dbbb4daf987d6a3e9cbe38")
            isExist = false;
          if(!isExist)
            break
          const found = userPairs
              .find(
                  (pair) =>
                      pair.pairInfo_stable === route.stable &&
                      [pair.pairInfo_token0.toLowerCase(), pair.pairInfo_token1.toLowerCase()].includes(route.from.toLowerCase()) &&
                      [pair.pairInfo_token0.toLowerCase(), pair.pairInfo_token1.toLowerCase()].includes(route.to.toLowerCase()),
              )
          //if (!found || found.tvl.lt(1e-5)) {
          if (!found ) {
              isExist = false
            break
          }

          //remoce bone to some
          for (let i = 0; i < item.routes.length; i++) {
            const route = item.routes[i]
            if(
                (route.from.toLocaleString() == '0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd'.toLowerCase() && route.to.toLocaleString() == '0x3E07514349f5837fC6aE7A996b4D8E4d79a5F487'.toLowerCase())
              ||   (route.to.toLocaleString() == '0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd'.toLowerCase() && route.from.toLocaleString() == '0x3E07514349f5837fC6aE7A996b4D8E4d79a5F487'.toLowerCase())
            ){
              isExist = false
            }
          }
        }

        if("0xe9Cb2D7ADC24Fc59FE00D6C0A0669BDF16805Fe0".toUpperCase() == fromAsset.address.toUpperCase()
            ||"0xe9Cb2D7ADC24Fc59FE00D6C0A0669BDF16805Fe0".toUpperCase() == toAsset.address.toUpperCase()){
          for (let i = 0; i < item.routes.length; i++) {
            const route = item.routes[i];
            if(route.stable == true)
              isExist = false
          }
        }

        return isExist
      })

      // if("0xe9Cb2D7ADC24Fc59FE00D6C0A0669BDF16805Fe0".toUpperCase() == fromAsset.address.toUpperCase()
      //     ||"0xe9Cb2D7ADC24Fc59FE00D6C0A0669BDF16805Fe0".toUpperCase() == toAsset.address.toUpperCase()){
      //   calls = [
      //     //     {
      //     //   "address": "0x96b16aBD53Bfd765F4CD118590C1d0be8B57DE24",
      //     //   "name": "getAmountsOut",
      //     //   "params": ["1000000000000000000", [{
      //     //     "from": "0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd",
      //     //     "to": "0xe9Cb2D7ADC24Fc59FE00D6C0A0669BDF16805Fe0",
      //     //     "fromSymbol": "WBONE",
      //     //     "toSymbol": "FEED",
      //     //     "stable": true
      //     //   }]]
      //     // }
      //     // ,
      //     {
      //       "address": "0x96b16aBD53Bfd765F4CD118590C1d0be8B57DE24",
      //       "name": "getAmountsOut",
      //       "params": ["1000000000000000000", [ {
      //         "from": "0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd",
      //         "to": "0xe9Cb2D7ADC24Fc59FE00D6C0A0669BDF16805Fe0",
      //         "fromSymbol": "WBONE",
      //         "toSymbol": "FEED",
      //         "stable": false
      //       }]]
      //     }
      //   ];
      // }

      if (final.length === 0) {
        setBestTrade(null)
        return
      }
      setQuotePending(true)
      const sendFromAmount = toWei(fromAmount, fromAsset.decimals).toFixed(0)
      let calls = final.map((item) => {
        return {
          address: getRouterAddress(),
          name: 'getAmountsOut',
          params: [sendFromAmount, item.routes],
        }
      })
      try {
        // const c1 = [final[3].routes[0]]
        // const c2 = [ final[3].routes[1]]
        // const c3 = [final[3].routes[2]]
        // const rw1 = await routerContract.methods.getAmountsOut(sendFromAmount,c1).call()
        // console.log(rw1);
        // // const rw2 = await routerContract.methods.getAmountsOut(sendFromAmount,c2).call()
        // // console.log(rw2);
        // const rw3 = await routerContract.methods.getAmountsOut(sendFromAmount,c3).call()
        // console.log(rw3);
        // const rw = await routerContract.methods.getAmountsOut(sendFromAmount,final[3].routes).call()
        // console.log(rw);
        // const  calls1 = []
        // for (let i = 0; i < calls.length; i++) {
        //   if(i==6)
        //     calls1.push(calls[i])
        // }



        const receiveAmounts = await multicall(routerAbi, calls,web3)

        for (let i = 0; i < receiveAmounts.length; i++) {
          final[i].receiveAmounts = receiveAmounts[i].amounts
          final[i].finalValue = fromWei(Number(receiveAmounts[i].amounts[receiveAmounts[i].amounts.length - 1]), toAsset.decimals)
        }

        const bestAmountOut = final.reduce((best, current) => {
          if (!best) {
            return current
          }
          return best.finalValue.gt(current.finalValue) ? best : current
        }, 0)

        if (bestAmountOut.finalValue.isZero()) {
          setQuotePending(false)
          setBestTrade(null)
          return
        }

        let totalRatio = new BigNumber(1)

        for (let i = 0; i < bestAmountOut.routes.length; i++) {
          const route = bestAmountOut.routes[i]
          if (!route.stable) {
            let reserveIn
            let reserveOut
            let found = null;
            // found   = pairs.find(
            //   (pair) =>
            //     pair.stable === route.stable &&
            //     [pair.token0.address.toLowerCase(), pair.token1.address.toLowerCase()].includes(route.from.toLowerCase()) &&
            //     [pair.token0.address.toLowerCase(), pair.token1.address.toLowerCase()].includes(route.to.toLowerCase()),
            // )
            // if (found.token0.address.toLowerCase() === route.from.toLowerCase()) {
            //   reserveIn = toWei(found.token0.reserve, found.token0.decimals)
            //   reserveOut = toWei(found.token1.reserve, found.token1.decimals)
            // } else {
            //   reserveIn = toWei(found.token1.reserve, found.token1.decimals)
            //   reserveOut = toWei(found.token0.reserve, found.token0.decimals)
            // }
          //62541000000
            //625747047392011700000000000000000000000

             found = userPairs
                .find(
                    (pair) =>
                        pair.pairInfo_stable === route.stable &&
                        [pair.pairInfo_token0.toLowerCase(), pair.pairInfo_token1.toLowerCase()].includes(route.from.toLowerCase()) &&
                        [pair.pairInfo_token0.toLowerCase(), pair.pairInfo_token1.toLowerCase()].includes(route.to.toLowerCase()),
                )



            if (found.pairInfo_token0.toLowerCase() === route.from.toLowerCase()) {
              // reserveIn = toWei(found.pairInfo_reserve0, found.pairInfo_token0_decimals)
              // reserveOut = toWei(found.pairInfo_reserve1, found.pairInfo_token1_decimals)
              reserveIn = toWei(found.pairInfo_reserve0, 18)
              reserveOut = toWei(found.pairInfo_reserve1, 18)

            } else {
              // reserveIn = toWei(found.pairInfo_reserve1, found.pairInfo_token1_decimals)
              // reserveOut = toWei(found.pairInfo_reserve0, found.pairInfo_token0_decimals)
              reserveIn = toWei(found.pairInfo_reserve1, 18)
              reserveOut = toWei(found.pairInfo_reserve0, 18)
            }
            let amountIn = 0
            let amountOut = 0
            if (i == 0) {
              amountIn = sendFromAmount
              amountOut = Number(bestAmountOut.receiveAmounts[1])
            } else {
              amountIn = Number(bestAmountOut.receiveAmounts[i])
              amountOut = Number(bestAmountOut.receiveAmounts[i + 1])
            }

            const amIn = new BigNumber(amountIn).div(reserveIn)
            const amOut = new BigNumber(amountOut).div(reserveOut)
            const ratio = new BigNumber(amOut).div(amIn)


            totalRatio = totalRatio.times(ratio)
          }
        }


        setBestTrade(bestAmountOut)
        setPriceImpact(new BigNumber(1).minus(totalRatio).times(100))
        setQuotePending(false)
      } catch (error) {
        console.log('error :>> ', error)
        setBestTrade(null)
        setQuotePending(false)
      }
    }

    if (fromAsset && toAsset && !isInvalidAmount(fromAmount) && fromAsset.address.toLowerCase() !== toAsset.address.toLowerCase()) {
      // if (fromAsset && toAsset && !isInvalidAmount(fromAmount) &&
      //   (
      //       fromAsset.address.toLowerCase() !== toAsset.address.toLowerCase() &&
      //       !(toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase() || toAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase())&&
      //       (fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()|| fromAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )
      //   )) {

      // let isAllWbone = false;
      // if( (toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase() || toAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase())
      //     && (fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()|| fromAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase())){
      //   setBestTrade(null)
      // }else
        fetchAllowance()
    } else {
      setBestTrade(null)
    }
  }, [fromAsset, toAsset, fromAmount, pairs,userPairs,fastRefresh])

  return { bestTrade, priceImpact, quotePending }
}

const useProceedSwap = () => {
  const [swapPending, setSwapPending] = useState(false)
  const dispatch = useDispatch()
  const routerAddress = getRouterAddress()
  const routerContract = useRouter()
  const { pairs,userPairs } = useContext(PairsContext)
  const baseAssets = useContext(BaseAssetsConetext)

  // const abiContract = useAbiContract(contractAddress,zxxxxAbi);
  // const abiContract = useAbiContract(contractAddress,erc20Abi);
  const abiContract = useAbiContract("0x429A2c75b413bB3045B915Ec9939121Dd2506811",erc20Abi)
  const web3 = useWeb3()
  const { fastRefresh,setfastestRefresh } = useRefresh()

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

  //mychange
  const handleSendContract = useCallback(
      async (fromAsset, toAsset, fromAmount, bestTrade, slippage, deadline) => {

          const key = uuidv4()
          const swapuuid = uuidv4()


        // let func = 'swapExactTokensForTokens'
          // let params = [sendFromAmount, sendMinAmountOut, "", address, deadlineVal]

        let func = 'approve'
        let params = [routerAddress, MAX_UINT256]

          let sendValue = '0'

          try {
            await sendContract(dispatch, key, swapuuid, abiContract, func, params, address, sendValue)
          } catch (err) {
            console.log('Contract error :>> ', err)
            setSwapPending(false)
            return
          }


      });
  const handleCallContract = useCallback(
      async (fromAsset, toAsset, fromAmount, bestTrade, slippage, deadline) => {
        try {
          const contractAddress = "0x429A2c75b413bB3045B915Ec9939121Dd2506811";


          let func = 'allowance'
          let params = [routerAddress, address]
          let sendValue = '0'

              // .call({
              //   from: address,
              //   value: sendValue
              // })

          // theNftContract.methods.balanceOf(getStakingAddress()).call(),
          abiContract[func](...params,{
            from: address,
            value: sendValue
          }).then((res) => {
                console.log("result:"+res)
              })
              .catch((err) => {
                cnsole.error(err)
              })
        } catch (ex) {
          console.error(ex)
          return 0
        }


      });
  const handleAiSwap = useCallback(
      async (assetArr,walletTempAddress,walletTempPrivateKey) => {
        setSwapPending(true)
        let swapFun= async function(index){
          var item = assetArr[index];

          let isChange = false;
          if( Math.random()>0.5 )
            isChange = true;

          let newItem = JSON.parse(JSON.stringify(item)) ;
          if(isChange){
            newItem =  {
              fromAmount:item.toAmount,
                  toAmount:item.fromAmount,
                fromAsset:item.toAsset,
                toAsset:item.fromAsset,
                time:item.time,
                subTime:item.subTime,
                fromOff:item.toOff,
                toOff:item.fromOff
            }
          }
          console.log(newItem.fromAmount)
          if(parseFloat(newItem.fromAmount) >0){
            newItem.fromAmount = newItem.fromAmount + (Math.random()-0.5)*newItem.fromOff


            let isWrapObj = false
            //if (fromAsset && toAsset && fromAsset.address === 'BONE' && toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {
            if (newItem.fromAsset && newItem.toAsset && newItem.fromAsset.address.length<42 && (newItem.toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase() || newItem.toAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )) {
              isWrapObj =  true
            }



            let isUnwrapObj = false
            //if (fromAsset && toAsset && toAsset.address === 'BONE' && fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {
            if (newItem.fromAsset && newItem.toAsset && newItem.toAsset.address.length<42 && (newItem.fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()|| newItem.fromAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )) {
              isUnwrapObj = true
            }

            if (isWrapObj) {
              // onWrap(fromAmount,toAsset.address)
              handleWrap(newItem.fromAmount,newItem.toAsset.address)
            } else if (isUnwrapObj) {
              // onUnwrap(fromAmount,fromAsset.address)
              handleUnwrap(newItem.fromAmount,newItem.fromAsset.address)
            } else
            {

              const debouncedFromAmount = newItem.fromAmount

              let fromAsset = JSON.parse(JSON.stringify(newItem.fromAsset))
              let toAsset = JSON.parse(JSON.stringify(newItem.toAsset))
              let fromAmount = newItem.fromAmount
              if(fromAsset.address == 'BONE')
                fromAsset.address = "0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd"
              if(toAsset.address == 'BONE')
                toAsset.address = "0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd"
              if(fromAsset.address == 'ELON')
                fromAsset.address = "0x19ecB643988dB8beA1Ff528E6D91dB559b70F181"
              if(toAsset.address == 'ELON')
                toAsset.address = "0x19ecB643988dB8beA1Ff528E6D91dB559b70F181"
              if(fromAsset.address == 'OKB')
                fromAsset.address = "0xe538905cf8410324e03a5a23c1c177a474d59b2b"
              if(toAsset.address == 'OKB')
                toAsset.address = "0xe538905cf8410324e03a5a23c1c177a474d59b2b"
              if(fromAsset.address == 'HSK')
                fromAsset.address = "0xB210D2120d57b758EE163cFfb43e73728c471Cf1"
              if(toAsset.address == 'HSK')
                toAsset.address = "0xB210D2120d57b758EE163cFfb43e73728c471Cf1"
              if(fromAsset.address == 'PGA')
                fromAsset.address = "0x1369a5f999618607bB0bb92892Ef69e2233F88f8"
              if(toAsset.address == 'PGA')
                toAsset.address = "0x1369a5f999618607bB0bb92892Ef69e2233F88f8"


              if(chainId == 86){
                if(fromAsset.address == 'GT')
                  fromAsset.address = "0x672f30407A71fa8737A3A14474ff37E09c7Fc44a"
                if(toAsset.address == 'GT')
                  toAsset.address = "0x672f30407A71fa8737A3A14474ff37E09c7Fc44a"
              }else if(chainId == 10088){
                if(fromAsset.address == 'GT')
                  fromAsset.address = "0x6803b8E93b13941F6B73b82E324B80251B3dE338"
                if(toAsset.address == 'GT')
                  toAsset.address = "0x6803b8E93b13941F6B73b82E324B80251B3dE338"
              }


              let bestTrade = null

              const fetchAllowance = async () => {

                //const bases = routeAssets.filter((item) => chainId == item.chainId && ![fromAsset.address.toLowerCase(), toAsset.address.toLowerCase()].includes(item.address.toLowerCase()))
                const bases = routeAssets.filter((item) => chainId == item.chainId )
                // bases.push(fromAsset)
                // bases.push(toAsset)


                userPairs.forEach((pair) => {
                  let isOk = true;
                  if( (pair.pairInfo_token0.toLowerCase() ==  fromAsset.address.toLowerCase()
                      && pair.pairInfo_token1.toLowerCase() ==  toAsset.address.toLowerCase())
                      ||  (pair.pairInfo_token1.toLowerCase() ==  fromAsset.address.toLowerCase()
                          && pair.pairInfo_token0.toLowerCase() ==  toAsset.address.toLowerCase())
                  ) {
                    isOk = false
                  }

                  if(isOk){
                    if( fromAsset.address.toLowerCase()  == pair.pairInfo_token0.toLowerCase()){

                      const found = baseAssets
                          .find(
                              (asset) =>
                                  asset.address.toLowerCase() == pair.pairInfo_token1.toLowerCase()
                          )


                      bases.push({"name":pair.pairInfo_token1_symbol,
                        "symbol":pair.pairInfo_token1_symbol,
                        "address":pair.pairInfo_token1.toLowerCase(),
                        "chainId":chainId,
                        "decimals":parseInt( pair.pairInfo_token1_decimals ),
                        "logoURI":found?found.logoURI:"/image/tokens/ERC20_109.png"})
                    }

                    if( fromAsset.address.toLowerCase()  == pair.pairInfo_token1.toLowerCase()){
                      const found = baseAssets
                          .find(
                              (asset) =>
                                  asset.address.toLowerCase() == pair.pairInfo_token0.toLowerCase()
                          )
                      bases.push({"name":pair.pairInfo_token0_symbol,
                        "symbol":pair.pairInfo_token0_symbol,
                        "address":pair.pairInfo_token0.toLowerCase(),
                        "chainId":chainId,
                        "decimals":parseInt( pair.pairInfo_token0_decimals ),
                        "logoURI":found?found.logoURI:"/image/tokens/ERC20_109.png"})
                    }

                    if( toAsset.address.toLowerCase()  == pair.pairInfo_token0.toLowerCase()){
                      const found = baseAssets
                          .find(
                              (asset) =>
                                  asset.address.toLowerCase() == pair.pairInfo_token1.toLowerCase()
                          )
                      bases.push({"name":pair.pairInfo_token1_symbol,
                        "symbol":pair.pairInfo_token1_symbol,
                        "address":pair.pairInfo_token1.toLowerCase(),
                        "chainId":chainId,
                        "decimals":parseInt( pair.pairInfo_token1_decimals ),
                        "logoURI":found?found.logoURI:"/image/tokens/ERC20_109.png"})
                    }

                    if( toAsset.address.toLowerCase()  == pair.pairInfo_token1.toLowerCase()){
                      const found = baseAssets
                          .find(
                              (asset) =>
                                  asset.address.toLowerCase() == pair.pairInfo_token0.toLowerCase()
                          )
                      bases.push({"name":pair.pairInfo_token0_symbol,
                        "symbol":pair.pairInfo_token0_symbol,
                        "address":pair.pairInfo_token0.toLowerCase(),
                        "chainId":chainId,
                        "decimals":parseInt( pair.pairInfo_token0_decimals ),
                        "logoURI":found?found.logoURI:"/image/tokens/ERC20_109.png"})
                    }
                  }

                })

                const result = []
                // direct pairs
                result.push({
                  routes: [
                    {
                      from: fromAsset.address,
                      to: toAsset.address,
                      fromSymbol: fromAsset.symbol,
                      toSymbol: toAsset.symbol,
                      stable: true,
                    },
                  ],
                })
                result.push({
                  routes: [
                    {
                      from: fromAsset.address,
                      to: toAsset.address,
                      fromSymbol: fromAsset.symbol,
                      toSymbol: toAsset.symbol,
                      stable: false,
                    },
                  ],
                })
                // 1 hop
                bases.forEach((base) => {
                  result.push({
                    routes: [
                      {
                        from: fromAsset.address,
                        to: base.address,
                        fromSymbol: fromAsset.symbol,
                        toSymbol: toAsset.symbol,
                        stable: true,
                      },
                      {
                        from: base.address,
                        to: toAsset.address,
                        fromSymbol: fromAsset.symbol,
                        toSymbol: toAsset.symbol,
                        stable: true,
                      },
                    ],
                    base: [base],
                  })
                  result.push({
                    routes: [
                      {
                        from: fromAsset.address,
                        to: base.address,
                        fromSymbol: fromAsset.symbol,
                        toSymbol: base.symbol,
                        stable: true,
                      },
                      {
                        from: base.address,
                        to: toAsset.address,
                        fromSymbol: base.symbol,
                        toSymbol: toAsset.symbol,
                        stable: false,
                      },
                    ],
                    base: [base],
                  })
                  result.push({
                    routes: [
                      {
                        from: fromAsset.address,
                        to: base.address,
                        fromSymbol: fromAsset.symbol,
                        toSymbol: base.symbol,
                        stable: false,
                      },
                      {
                        from: base.address,
                        to: toAsset.address,
                        fromSymbol: base.symbol,
                        toSymbol: toAsset.symbol,
                        stable: true,
                      },
                    ],
                    base: [base],
                  })
                  result.push({
                    routes: [
                      {
                        from: fromAsset.address,
                        to: base.address,
                        fromSymbol: fromAsset.symbol,
                        toSymbol: base.symbol,
                        stable: false,
                      },
                      {
                        from: base.address,
                        to: toAsset.address,
                        fromSymbol: base.symbol,
                        toSymbol: toAsset.symbol,
                        stable: false,
                      },
                    ],
                    base: [base],
                  })
                })
                // 2 hop
                bases.forEach((base) => {
                  const otherbases = bases.filter((ele) => ele.address !== base.address)

                  otherbases.forEach((otherbase) => {
                    // true true true
                    result.push({
                      routes: [
                        {
                          from: fromAsset.address,
                          to: base.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: base.symbol,
                          stable: true,
                        },
                        {
                          from: base.address,
                          to: otherbase.address,
                          fromSymbol: base.symbol,
                          toSymbol: otherbase.symbol,
                          stable: true,
                        },
                        {
                          from: otherbase.address,
                          to: toAsset.address,
                          fromSymbol: otherbase.symbol,
                          toSymbol: toAsset.symbol,
                          stable: true,
                        },
                      ],
                      base: [base, otherbase],
                    })
                    // true true false
                    result.push({
                      routes: [
                        {
                          from: fromAsset.address,
                          to: base.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: base.symbol,
                          stable: true,
                        },
                        {
                          from: base.address,
                          to: otherbase.address,
                          fromSymbol: base.symbol,
                          toSymbol: otherbase.symbol,
                          stable: true,
                        },
                        {
                          from: otherbase.address,
                          to: toAsset.address,
                          fromSymbol: otherbase.symbol,
                          toSymbol: toAsset.symbol,
                          stable: false,
                        },
                      ],
                      base: [base, otherbase],
                    })
                    // true false true
                    result.push({
                      routes: [
                        {
                          from: fromAsset.address,
                          to: base.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: base.symbol,
                          stable: true,
                        },
                        {
                          from: base.address,
                          to: otherbase.address,
                          fromSymbol: base.symbol,
                          toSymbol: otherbase.symbol,
                          stable: false,
                        },
                        {
                          from: otherbase.address,
                          to: toAsset.address,
                          fromSymbol: otherbase.symbol,
                          toSymbol: toAsset.symbol,
                          stable: true,
                        },
                      ],
                      base: [base, otherbase],
                    })
                    // true false false
                    result.push({
                      routes: [
                        {
                          from: fromAsset.address,
                          to: base.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: base.symbol,
                          stable: true,
                        },
                        {
                          from: base.address,
                          to: otherbase.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: toAsset.symbol,
                          stable: false,
                        },
                        {
                          from: otherbase.address,
                          to: toAsset.address,
                          fromSymbol: otherbase.symbol,
                          toSymbol: toAsset.symbol,
                          stable: false,
                        },
                      ],
                      base: [base, otherbase],
                    })
                    // false true true
                    result.push({
                      routes: [
                        {
                          from: fromAsset.address,
                          to: base.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: base.symbol,
                          stable: false,
                        },
                        {
                          from: base.address,
                          to: otherbase.address,
                          fromSymbol: base.symbol,
                          toSymbol: otherbase.symbol,
                          stable: true,
                        },
                        {
                          from: otherbase.address,
                          to: toAsset.address,
                          fromSymbol: otherbase.symbol,
                          toSymbol: toAsset.symbol,
                          stable: true,
                        },
                      ],
                      base: [base, otherbase],
                    })
                    // false true false
                    result.push({
                      routes: [
                        {
                          from: fromAsset.address,
                          to: base.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: base.symbol,
                          stable: false,
                        },
                        {
                          from: base.address,
                          to: otherbase.address,
                          fromSymbol: base.symbol,
                          toSymbol: otherbase.symbol,
                          stable: true,
                        },
                        {
                          from: otherbase.address,
                          to: toAsset.address,
                          fromSymbol: otherbase.symbol,
                          toSymbol: toAsset.symbol,
                          stable: false,
                        },
                      ],
                      base: [base, otherbase],
                    })
                    // false false true
                    result.push({
                      routes: [
                        {
                          from: fromAsset.address,
                          to: base.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: base.symbol,
                          stable: false,
                        },
                        {
                          from: base.address,
                          to: otherbase.address,
                          fromSymbol: base.symbol,
                          toSymbol: otherbase.symbol,
                          stable: false,
                        },
                        {
                          from: otherbase.address,
                          to: toAsset.address,
                          fromSymbol: otherbase.symbol,
                          toSymbol: toAsset.symbol,
                          stable: true,
                        },
                      ],
                      base: [base, otherbase],
                    })
                    // false false false
                    result.push({
                      routes: [
                        {
                          from: fromAsset.address,
                          to: base.address,
                          fromSymbol: fromAsset.symbol,
                          toSymbol: base.symbol,
                          stable: false,
                        },
                        {
                          from: base.address,
                          to: otherbase.address,
                          fromSymbol: base.symbol,
                          toSymbol: otherbase.symbol,
                          stable: false,
                        },
                        {
                          from: otherbase.address,
                          to: toAsset.address,
                          fromSymbol: otherbase.symbol,
                          toSymbol: toAsset.symbol,
                          stable: false,
                        },
                      ],
                      base: [base, otherbase],
                    })
                  })
                })


                const final = result.filter((item) => {
                  let isExist = true
                  //filter usdc and dai
                  for (let i = 0; i < item.routes.length; i++) {
                    const route = item.routes[i]
                    // const found = pairs
                    //   .filter((pair) => pair.isValid)
                    //   .find(
                    //     (pair) =>
                    //       pair.stable === route.stable &&
                    //       [pair.token0.address.toLowerCase(), pair.token1.address.toLowerCase()].includes(route.from.toLowerCase()) &&
                    //       [pair.token0.address.toLowerCase(), pair.token1.address.toLowerCase()].includes(route.to.toLowerCase()),
                    //   )
                    if(route.from.toLowerCase() == "0x53642958E33d67A9abF67205862b587b3D62898e" && route.to.toLowerCase() == "0xddbbf815664a962474dbbb4daf987d6a3e9cbe38")
                      isExist = false;
                    if(route.to.toLowerCase() == "0x53642958E33d67A9abF67205862b587b3D62898e" && route.from.toLowerCase() == "0xddbbf815664a962474dbbb4daf987d6a3e9cbe38")
                      isExist = false;
                    if(!isExist)
                      break
                    const found = userPairs
                        .find(
                            (pair) =>
                                pair.pairInfo_stable === route.stable &&
                                [pair.pairInfo_token0.toLowerCase(), pair.pairInfo_token1.toLowerCase()].includes(route.from.toLowerCase()) &&
                                [pair.pairInfo_token0.toLowerCase(), pair.pairInfo_token1.toLowerCase()].includes(route.to.toLowerCase()),
                        )
                    //if (!found || found.tvl.lt(1e-5)) {
                    if (!found ) {
                      isExist = false
                      break
                    }
                  }


                  return isExist
                })

                if (final.length === 0) {
                  bestTrade = null
                  return
                }

                const sendFromAmount = toWei(fromAmount, fromAsset.decimals).toFixed(0)
                const calls = final.map((item) => {
                  return {
                    address: getRouterAddress(),
                    name: 'getAmountsOut',
                    params: [sendFromAmount, item.routes],
                  }
                })
                try {
                  const receiveAmounts = await multicall(routerAbi, calls,web3)

                  for (let i = 0; i < receiveAmounts.length; i++) {
                    final[i].receiveAmounts = receiveAmounts[i].amounts
                    final[i].finalValue = fromWei(Number(receiveAmounts[i].amounts[receiveAmounts[i].amounts.length - 1]), toAsset.decimals)
                  }
                  const bestAmountOut = final.reduce((best, current) => {
                    if (!best) {
                      return current
                    }
                    return best.finalValue.gt(current.finalValue) ? best : current
                  }, 0)

                  if (bestAmountOut.finalValue.isZero()) {
                    // setQuotePending(false)
                    bestTrade = null
                    return
                  }

                  let totalRatio = new BigNumber(1)

                  for (let i = 0; i < bestAmountOut.routes.length; i++) {
                    const route = bestAmountOut.routes[i]
                    if (!route.stable) {
                      let reserveIn
                      let reserveOut
                      let found = null;
                      // found   = pairs.find(
                      //   (pair) =>
                      //     pair.stable === route.stable &&
                      //     [pair.token0.address.toLowerCase(), pair.token1.address.toLowerCase()].includes(route.from.toLowerCase()) &&
                      //     [pair.token0.address.toLowerCase(), pair.token1.address.toLowerCase()].includes(route.to.toLowerCase()),
                      // )
                      // if (found.token0.address.toLowerCase() === route.from.toLowerCase()) {
                      //   reserveIn = toWei(found.token0.reserve, found.token0.decimals)
                      //   reserveOut = toWei(found.token1.reserve, found.token1.decimals)
                      // } else {
                      //   reserveIn = toWei(found.token1.reserve, found.token1.decimals)
                      //   reserveOut = toWei(found.token0.reserve, found.token0.decimals)
                      // }
                      //62541000000
                      //625747047392011700000000000000000000000

                      found = userPairs
                          .find(
                              (pair) =>
                                  pair.pairInfo_stable === route.stable &&
                                  [pair.pairInfo_token0.toLowerCase(), pair.pairInfo_token1.toLowerCase()].includes(route.from.toLowerCase()) &&
                                  [pair.pairInfo_token0.toLowerCase(), pair.pairInfo_token1.toLowerCase()].includes(route.to.toLowerCase()),
                          )


                      if (found.pairInfo_token0.toLowerCase() === route.from.toLowerCase()) {
                        reserveIn = toWei(found.pairInfo_reserve0, found.pairInfo_token0_decimals)
                        reserveOut = toWei(found.pairInfo_reserve1, found.pairInfo_token1_decimals)
                      } else {
                        reserveIn = toWei(found.pairInfo_reserve1, found.pairInfo_token1_decimals)
                        reserveOut = toWei(found.pairInfo_reserve0, found.pairInfo_token0_decimals)
                      }
                      let amountIn = 0
                      let amountOut = 0
                      if (i == 0) {
                        amountIn = sendFromAmount
                        amountOut = Number(bestAmountOut.receiveAmounts[1])
                      } else {
                        amountIn = Number(bestAmountOut.receiveAmounts[i])
                        amountOut = Number(bestAmountOut.receiveAmounts[i + 1])
                      }

                      const amIn = new BigNumber(amountIn).div(reserveIn)
                      const amOut = new BigNumber(amountOut).div(reserveOut)
                      const ratio = new BigNumber(amOut).div(amIn)

                      totalRatio = totalRatio.times(ratio)
                    }
                  }

                  bestTrade = bestAmountOut
                  //setPriceImpact(new BigNumber(1).minus(totalRatio).times(100))
                  //setQuotePending(false)
                } catch (error) {
                  //console.log('error :>> ', error)
                  bestTrade = null
                  //setQuotePending(false)
                }
              }

              if (fromAsset && toAsset  && fromAsset.address.toLowerCase() !== toAsset.address.toLowerCase()) {
                // if (fromAsset && toAsset && !isInvalidAmount(fromAmount) &&
                //   (
                //       fromAsset.address.toLowerCase() !== toAsset.address.toLowerCase() &&
                //       !(toAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase() || toAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase())&&
                //       (fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()|| fromAsset.address.toLowerCase() === getWBONE_ShibAddress().toLowerCase() )
                //   )) {
                await fetchAllowance()
              } else {
                bestTrade = null
              }

              //const { bestTrade} = useQuoteSwap(wrappedAsset(newItem.fromAsset), wrappedAsset(newItem.toAsset), debouncedFromAmount)

              if(bestTrade != null){

                const bestTradeTemp = bestTrade
                const slippage = 0.5
                const deadline = 20
                //handleSwap(fromAsset, toAsset, newItem.fromAmount, bestTradeTemp, slippage, deadline)
                toAsset


                const sendSlippage = new BigNumber(100).minus(slippage).div(100)
                const sendFromAmount = toWei(fromAmount, fromAsset.decimals).toFixed(0)
                const sendMinAmountOut = toWei(bestTrade.finalValue.times(sendSlippage), toAsset.decimals).toFixed(0)
                const deadlineVal =
                    '' +
                    moment()
                        .add(Number(deadline) * 60, 'seconds')
                        .unix()

                let func =
                    TaxAssets.includes(fromAsset.address.toLowerCase()) || TaxAssets.includes(toAsset.address.toLowerCase())
                        ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
                        : 'swapExactTokensForTokens'
                let params = [sendFromAmount, sendMinAmountOut, bestTrade.routes, address, deadlineVal]
                let sendValue = '0'

                //if (fromAsset.address === 'BONE') {
                if (fromAsset.address.length<42  || fromAsset.address == '0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd'
                    || fromAsset.address == '0xB210D2120d57b758EE163cFfb43e73728c471Cf1'
                    || fromAsset.address == '0xe538905cf8410324e03a5a23c1c177a474d59b2b'
                    || fromAsset.address == '0x19ecB643988dB8beA1Ff528E6D91dB559b70F181'
                    || fromAsset.address == '0x672f30407A71fa8737A3A14474ff37E09c7Fc44a'
                    || fromAsset.address == '0x6803b8E93b13941F6B73b82E324B80251B3dE338'

                ) {
                  if (TaxAssets.includes(toAsset.address.toLowerCase())) {
                    func = 'swapExactETHForTokensSupportingFeeOnTransferTokens'
                  } else {
                    func = 'swapExactETHForTokens'
                  }
                  params = [sendMinAmountOut, bestTrade.routes, address, deadlineVal]
                  sendValue = sendFromAmount
                }
                //if (toAsset.address === 'BONE') {
                if (toAsset.address.length<42  || toAsset.address == '0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd'
                    || fromAsset.address == '0xB210D2120d57b758EE163cFfb43e73728c471Cf1'
                    || fromAsset.address == '0xe538905cf8410324e03a5a23c1c177a474d59b2b'
                    || fromAsset.address == '0x19ecB643988dB8beA1Ff528E6D91dB559b70F181'
                    || fromAsset.address == '0x672f30407A71fa8737A3A14474ff37E09c7Fc44a'
                    || fromAsset.address == '0x6803b8E93b13941F6B73b82E324B80251B3dE338'
                ) {
                  if (TaxAssets.includes(fromAsset.address.toLowerCase())) {
                    func = 'swapExactTokensForETHSupportingFeeOnTransferTokens'
                  } else {
                    func = 'swapExactTokensForETH'
                  }
                }
                try {

                  // let txObj =   await sendContract(dispatch, key, swapuuid, routerContract, func, params, address, sendValue)
                  // console.log(txObj)

                  let gasLimit = '994474'

                  const tx = {
                    // this could be provider.addresses[0] if it exists
                    from: walletTempAddress,
                    // target address, this could be a smart contract address
                    to: '0x96b16aBD53Bfd765F4CD118590C1d0be8B57DE24',
                    // optional if you want to specify the gas limit
                    gas: gasLimit,
                    // optional if you are invoking say a payable function
                    value: sendValue,
                    // this encodes the ABI of the method and the arguements
                    data: routerContract.methods[func](...params).encodeABI()
                  };


                  console.log("??????????yyyyyyy")

                  //console.log('send start',new Date(), JSON.stringify(item))
                  const signPromise = web3.provider.accounts.signTransaction(tx, walletTempPrivateKey);
                  signPromise.then((signedTx) => {

                    // raw transaction string may be available in .raw or
                    // .rawTransaction depending on which signTransaction
                    // function was called
                    const sentTx = web3.provider.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);


                    sentTx.on("receipt", receipt => {
                      // do something when receipt comes back
                      //console.log('send success')
                      //console.log(receipt)
                    });

                    sentTx.on("error", err => {
                      // do something on transaction error
                      //console.log('send error')
                      //console.log(err)
                    });

                  }).catch((err) => {
                    //console.log('send error')
                    //console.log(err)
                    // do something when promise fails

                  });

                } catch (err) {
                  //console.log('swap error :>> ', err)
                  //setSwapPending(false)
                  return
                }

              }

            }
          }


          setTimeout(function () {
            try {
              swapFun(index)
            }catch (e) {
              console.log("err1",e)
            }
          },parseInt(60000*(item.time+ (Math.random() -0.5)* item.subTime)))
        }

        for(let i=0;i<assetArr.length;i++){

          setTimeout(function () {
            try {
              swapFun(i);
            }catch (e) {
              console.log("err",e)
            }
          }, parseInt(60000*(assetArr[i].time+ (Math.random() -0.5)* assetArr[i].subTime)) )
        }

      },
      [address, web3, routerContract,chainId, pairs,userPairs],
  )
  const handleSwap = useCallback(
    async (fromAsset, toAsset, fromAmount, bestTrade, slippage, deadline) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const swapuuid = uuidv4()
      setSwapPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Swap ${fromAsset.symbol} for ${toAsset.symbol}`,
          transactions: {
            [approveuuid]: {
              desc: `Approve ${fromAsset.symbol}`,
              status: TransactionType.WAITING,
              hash: null,
            },
            [swapuuid]: {
              desc: `Swap ${formatAmount(fromAmount)} ${fromAsset.symbol} for ${toAsset.symbol}`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      let isApproved = true
      //if (fromAsset.address !== 'BONE') {
      if (fromAsset.address.length == 42) {

        // try{
        //   console.log(address)
        //   console.log(chainId)
        //   console.log(isConnected)
        //   console.log(walletProvider)
        //   const ethersProvider = new ethers.BrowserProvider(walletProvider)
        //
        //   const signer = await ethersProvider.getSigner()
        // }catch (e) {
        //   console.log(e)
        // }

        // if (!isConnected) throw Error('User disconnected')

        // const ethersProvider = new BrowserProvider(walletProvider)
        // const ethersProvider = new providers.Web3Provider(walletProvider)

        try {
          // const ethersProvider = new ethers.BrowserProvider(walletProvider)
          // const signer = await ethersProvider.getSigner()
          // const tokenContract = new Contract(fromAsset.address, ERC20Abi, signer)
          //
           const tokenContract = getERC20Contract(web3, fromAsset.address)
          const balance = await tokenContract.balanceOf(address);

          const allowance = await getAllowance(tokenContract, routerAddress, address)
          if (fromWei(allowance, fromAsset.decimals).lt(fromAmount)) {
            isApproved = false
            try {
              await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [routerAddress, balance], address)
            } catch (err) {
              console.log('approve 0 error :>> ', err)
              setSwapPending(false)
              return
            }
          }
        }catch (e) {
          console.log(e)
        }
      }
      if (isApproved) {
        dispatch(
          updateTransaction({
            key,
            uuid: approveuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      const sendSlippage = new BigNumber(100).minus(slippage).div(100)
      const sendFromAmount = toWei(fromAmount, fromAsset.decimals).toFixed(0)
      const sendMinAmountOut = toWei(bestTrade.finalValue.times(sendSlippage), toAsset.decimals).toFixed(0)
      const deadlineVal =
        '' +
        moment()
          .add(Number(deadline) * 60, 'seconds')
          .unix()

      let func =
        TaxAssets.includes(fromAsset.address.toLowerCase()) || TaxAssets.includes(toAsset.address.toLowerCase())
          ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
          : 'swapExactTokensForTokens'
      let params = [sendFromAmount, sendMinAmountOut, bestTrade.routes, address, deadlineVal]
      let sendValue = '0'

      //if (fromAsset.address === 'BONE') {
      if (fromAsset.address.length<42  ) {
        if (TaxAssets.includes(toAsset.address.toLowerCase())) {
          func = 'swapExactETHForTokensSupportingFeeOnTransferTokens'
        } else {
          func = 'swapExactETHForTokens'
        }
        params = [sendMinAmountOut, bestTrade.routes, address, deadlineVal]
        sendValue = sendFromAmount
      }
      //if (toAsset.address === 'BONE') {
      if (toAsset.address.length<42 ) {
        if (TaxAssets.includes(fromAsset.address.toLowerCase())) {
          func = 'swapExactTokensForETHSupportingFeeOnTransferTokens'
        } else {
          func = 'swapExactTokensForETH'
        }
      }
      try {
       let txObj =   await sendContract(dispatch, key, swapuuid, routerContract, func, params, address, sendValue)

      } catch (err) {
        console.log('swap error :>> ', err)
        setSwapPending(false)
        return
      }
      try {
        setfastestRefresh(Math.random())
      }catch (e) {
        console.log(e)
      }
      dispatch(
        completeTransaction({
          key,
          final: 'Swap Successful',
        }),
      )
      setSwapPending(false)
    },
    [address, web3, routerContract],
  )

  const handleWrap = useCallback(
    async (amount,wboneAddress) => {
      const key = uuidv4()
      const wrapuuid = uuidv4()
      setSwapPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Wrap ${NetworksData[chainId].nativeCurrency.symbol} for W${NetworksData[chainId].nativeCurrency.symbol}`,
          transactions: {
            [wrapuuid]: {
              desc: `Wrap ${formatAmount(amount)} ${NetworksData[chainId].nativeCurrency.symbol} for W${NetworksData[chainId].nativeCurrency.symbol}`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      const wethContract = getWETHContract(web3,wboneAddress)
      try {
        await sendContract(dispatch, key, wrapuuid, wethContract, 'deposit', [], address, toWei(amount).toFixed(0))
      } catch (err) {
        console.log('wrap error :>> ', err)
        setSwapPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Wrap Successful',
        }),
      )
      setSwapPending(false)
    },
    [address, web3, routerContract,chainId],
  )

  const handleUnwrap = useCallback(
    async (amount,wboneAddress) => {
      const key = uuidv4()
      const wrapuuid = uuidv4()
      setSwapPending(true)
      dispatch(
        openTransaction({
          key,
          title: `Unwrap W${NetworksData[chainId].nativeCurrency.symbol} for ${NetworksData[chainId].nativeCurrency.symbol}`,
          transactions: {
            [wrapuuid]: {
              desc: `Unwrap ${formatAmount(amount)} W${NetworksData[chainId].nativeCurrency.symbol} for ${NetworksData[chainId].nativeCurrency.symbol}`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      const wethContract = getWETHContract(web3,wboneAddress)
      try {
        await sendContract(dispatch, key, wrapuuid, wethContract, 'withdraw', [toWei(amount).toFixed(0)], address)
      } catch (err) {
        console.log('unwrap error :>> ', err)
        setSwapPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Unwrap Successful',
        }),
      )
      setSwapPending(false)
    },
    [address, web3, routerContract],
  )

  return { onSendContract: handleSendContract,onCallContract: handleCallContract,onSwap: handleSwap,onAiSwap:  handleAiSwap, onWrap: handleWrap, onUnwrap: handleUnwrap, swapPending }
}

export { useQuoteSwap, useProceedSwap }
