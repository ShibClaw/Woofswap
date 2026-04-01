import BigNumber from 'bignumber.js'
import {L2_ETH_TOKEN_ADDRESS, TransactionType,SignatureHash,BOOTLOADER_FORMAL_ADDRESS} from '../config/constants'
import { updateTransaction } from '../state/transactions/actions'
import { getWBONE_WoofAddress } from './addressHelpers'
import { customNotify } from './notify'
// import { BigNumber as EthersBigNumber } from 'ethers'
import {NetworksData} from "../config/constants";
const backendApi = process.env.REACT_APP_BACKEND_API

const getWhitelist = async (account) => {
    // try {
    //     // const response = await fetch(`${backendApi}/assets`, {
    //     const response = await fetch(`https://api.woofswap.finance/wl/`+account, {
    //         method: 'get',
    //     })
    //     const baseAssetsCall = await response.json()
    //     let whitelistObj = baseAssetsCall.responseObj
    //
    //     return whitelistObj
    // } catch (ex) {
    //     console.error('get baseAssets had error', ex)
    //     return null
    // }
    return null
}

const getBaseAssets = async (cid) => {
  try {
    let chainId = cid;
    let baseUrl = 'https://api.woofswap.finance/assets/shib'
      if(chainId == 109)
          baseUrl = "https://api.woofswap.finance/assets/shib"
      if(chainId == 196)
          baseUrl = "https://api.woofswap.finance/assets/okb"
      if(chainId == 177)
          baseUrl = "https://api.woofswap.finance/assets/hashkey"
      if(chainId == 10088)
          baseUrl = "https://api.woofswap.finance/assets/gatelayer"
      let baseAssetsCall

     try{
          const response = await fetch(baseUrl, {
              method: 'get',
          })
           baseAssetsCall = await response.json()
      }catch (e) {
         baseAssetsCall  = {"responseObj":{"keywords":["layer2","shib","amm"],"name":"WoofSwap Finance","tokens":[],"logoURI":"https://docs.woofswap.finance/woof.svg","timestamp":1711336713},"code":200,"msg":"Success"}     }

    let baseAssets = baseAssetsCall.responseObj.tokens

    //const wethPrice = baseAssets.find((asset) => asset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase())?.price
      if(true){

              // const wethPrice = 1500;
          // const nativeETH = {
          //     address: 'BONE',
          //     name: 'BONE Coin',
          //     symbol: 'BONE',
          //     decimals: 18,
          //     logoURI: '/image/tokens/BONE.png',
          //     price: wethPrice,
          // }
          const nativeETH = JSON.parse( JSON.stringify(NetworksData[chainId ? chainId : 109].nativeCurrency) )
          nativeETH.address = nativeETH.symbol
          nativeETH.logoURI = '/image/tokens/' + nativeETH.symbol + '.png'
          nativeETH.chainId = chainId
          let wethPrice = 0;
          baseAssets.map((item) => {
              if(item.symbol == "W" + nativeETH.symbol){
                  wethPrice = parseFloat(item.price)
              }
          })
          nativeETH.price = wethPrice
          baseAssets.unshift(nativeETH)


          // const nativeWBONE_SHIB = JSON.parse( JSON.stringify(NetworksData[chainId?chainId:109].nativeCurrency) )
          // nativeWBONE_SHIB.address = nativeWBONE_SHIB.symbol
          // nativeWBONE_SHIB.logoURI = '/image/tokens/' + nativeWBONE_SHIB.symbol + '.png'
          // nativeWBONE_SHIB.chainId = chainId
          //
          // baseAssets.map((item) => {
          //     if(item.symbol == "W" + nativeWBONE_SHIB.symbol){
          //         wethPrice = parseFloat(item.price)
          //     }
          // })
          // nativeWBONE_SHIB.price = wethPrice
          // baseAssets.unshift(nativeWBONE_SHIB)
      }

    return baseAssets.map((item) => {
      return {
        ...item,
        balance: new BigNumber(0),
        chainId: chainId,
      }
    })
  } catch (ex) {
    console.error('get baseAssets had error', ex)
    return null
  }
}

const getRouteAssets = async () => {
  // try {
  //   const response = await fetch(`${backendApi}/routeAssets`, {
  //     method: 'get',
  //   })
  //   const routeAssetsCall = await response.json()
  //   return routeAssetsCall.data
  // } catch (ex) {
  //   console.error('Route Assets fetched had error', ex)
  //   return []
  // }
}

const getPairs = async (chainId) => {
  try {
      let baseUrl = 'https://api.woofswap.finance/pools/shib'
      if(chainId == 109)
          baseUrl = "https://api.woofswap.finance/pools/shib"
      if(chainId == 196)
          baseUrl = "https://api.woofswap.finance/pools/okb"
      if(chainId == 177)
          baseUrl = "https://api.woofswap.finance/pools/hashkey"
      if(chainId == 10088)
          baseUrl = "https://api.woofswap.finance/pools/gatelayer"


      let pairsCall
      try{
          const response = await fetch(baseUrl, {
              method: 'get',
          })
          pairsCall = await response.json()
      }catch (e) {
          pairsCall = {"responseObj":{"data":[{"gauge":{"apr":"468.353029","address":"0x0bc0b80141859f35f1913873354d9db3f4d3c105","bribe":"0x65e9f634894b2f07ada606e56b1b400ce931850b","totalSupply":"144.934190641089145989","fee":"0xf48c8a208f987d1758d9dec6c7308e83e4c75e43","tvl":"8452.56"},"symbol":"vAMM-WBONE/WETH","address":"0xe4dbee5fa46fb8a4d00fb719dedcaedc91ae5f13","totalSupply":"144.934190641089146989","token0":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"8493.446042380725929863","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"isValid":true,"token1":{"symbol":"WETH","address":"0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce","decimals":18,"reserve":"2.476618018848857470","logoURI":"https://woofswap.finance/image/tokens/ETH.png"},"tvl":"8452.56","type":"Volatile","isStable":false},{"gauge":{"apr":"28.285535","address":"0xef7c771e9bcec2821a6743c3a8d9accfae016af0","bribe":"0xe865ef2d188eae0f027897c2859aee470d96a35d","totalSupply":"147858.529306916131315640","fee":"0x325ba3f48503f685a0a20d221c3b43d9d9978a1f","tvl":"7933.16"},"symbol":"vAMM-WBONE/WOOF","address":"0xe7481d3bb7ae1f11e17d64244102044922cf565f","totalSupply":"149074.511398073610296820","token0":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"8746.559332233922201053","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"isValid":true,"token1":{"symbol":"WOOF","address":"0xD0daa7B6ff1B40d3cc6F0B2Cf7E85cB993D1c834","decimals":18,"reserve":"2541740.084730660583822628","logoURI":"https://woofswap.finance/image/tokens/WOOF.png"},"tvl":"7985.16","type":"Volatile","isStable":false},{"gauge":{"apr":"25.872","address":"0x072e2322018e15b006a1a130002df414d938b6cf","bribe":"0x9e5fe4b3f04f653df63318ee73a674f4712c8755","totalSupply":"999999.999999999999999000","fee":"0x6df59493899c568cb71350c3b6b4c813bd443979","tvl":"5000"},"symbol":"vAMM-stWOOF/Bribe","address":"0xdd73b00bea4443155a3e0249a5929e53dc83b95c","totalSupply":"1000000.000000000000000000","token0":{"symbol":"stWOOF","address":"0x3e7647cf066916bB81C3a7A9B5943BFE78fE7BB6","decimals":18,"reserve":"1000000.000000000000000000","logoURI":"https://woofswap.finance/image/tokens/stWOOF.png"},"isValid":true,"token1":{"symbol":"Bribe","address":"0x8b3539ad84e5186fb4d4718558cd184bb83b7df5","decimals":18,"reserve":"1000000.000000000000000000","logoURI":"https://woofswap.finance/image/tokens/Bribe.png"},"tvl":"5000","type":"Volatile","isStable":false},{"gauge":{"apr":"12.113","address":"0x5bbdf85138415d48c9a5bc64baa41761d68eca55","bribe":"0x2179f7263d4ec9a028d47f3a35db73bd35f2dc02","totalSupply":"343729.569294681469349653","fee":"0xbc59d68001b216736f4aa0cdac395071b33b028e","tvl":"8.7408"},"symbol":"vAMM-SHIB/WBONE","address":"0x71813baf6a3a01d2d87c6fb2c9a5e3143ca78616","totalSupply":"343729.569294681469350653","token0":{"symbol":"SHIB","address":"0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0","decimals":18,"reserve":"68164016.450805574797861265","logoURI":"https://woofswap.finance/image/tokens/SHIB.png"},"isValid":true,"token1":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"1981.645616705726229318","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"tvl":"0","type":"Volatile","isStable":false},{"gauge":{"apr":"5.8711","address":"0xd98f821efdc29467498aaf8c12465000ce18d44e","bribe":"0xa3f073203543f82885811dd8d19b82b5d6c1b9b7","totalSupply":"0.000005558419269696","fee":"0x9e9f2532f590e8c3e004641b326283c78331d76d","tvl":"0.39843"},"symbol":"vAMM-WBONE/USDT","address":"0x4fc0db98a912829b803d2fcfb40c12d5e9afae2c","totalSupply":"0.000005558419271285","token0":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"190.309866615044893889","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"isValid":true,"token1":{"symbol":"USDT","address":"0xaB082b8ad96c7f47ED70ED971Ce2116469954cFB","decimals":6,"reserve":"188.070307000000000000","logoURI":"https://woofswap.finance/image/tokens/USDT.png"},"tvl":"0","type":"Volatile","isStable":false},{"gauge":{"apr":"0","address":"0xf82389ecfc174536e952bba360a3ed832c5547ed","bribe":"0xb77c3e50da3a0e43cd7553a1c61eeaa0a97d77be","totalSupply":"126.396154317824179132","fee":"0x4832c71a2f403c27989109c4eee96faa06f93df8","tvl":"0"},"symbol":"sAMM-WBONE/WBONE","address":"0x7636f8299af8d2f576b93446543bd3b0f7ac80e3","totalSupply":"126.396154317824180132","token0":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"138.588267412098758355","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"isValid":true,"token1":{"symbol":"WBONE-SHIB","address":"0xC76F4c819D820369Fb2d7C1531aB3Bb18e6fE8d8","decimals":18,"reserve":"114.215246343964275098","logoURI":"https://woofswap.finance/image/tokens/WBONE_SHIB.png"},"tvl":"0","type":"Stable","isStable":true}]},"code":200,"msg":"Success"}
      }

    return pairsCall.responseObj
  } catch (ex) {
    console.error('Pairs fetched had error', ex)
    return []
  }
}

const getV3Pairs = async (chainId) => {
  try {
      let baseUrl = 'https://api.woofswap.finance/pools/shib'
      if(chainId == 109)
          baseUrl = "https://api.woofswap.finance/pools/shib"
      if(chainId == 196)
          baseUrl = "https://api.woofswap.finance/pools/okb"
      if(chainId == 177)
          baseUrl = "https://api.woofswap.finance/pools/hashkey"
      if(chainId == 10088)
          baseUrl = "https://api.woofswap.finance/pools/gatelayer"

      let pairsCall

      try{
          const response = await fetch(baseUrl, {
              method: 'get',
          })
          pairsCall = await response.json()
      }catch (e) {
          pairsCall = {"responseObj":{"data":[{"gauge":{"apr":"468.353029","address":"0x0bc0b80141859f35f1913873354d9db3f4d3c105","bribe":"0x65e9f634894b2f07ada606e56b1b400ce931850b","totalSupply":"144.934190641089145989","fee":"0xf48c8a208f987d1758d9dec6c7308e83e4c75e43","tvl":"8452.56"},"symbol":"vAMM-WBONE/WETH","address":"0xe4dbee5fa46fb8a4d00fb719dedcaedc91ae5f13","totalSupply":"144.934190641089146989","token0":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"8493.446042380725929863","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"isValid":true,"token1":{"symbol":"WETH","address":"0x8ed7d143Ef452316Ab1123d28Ab302dC3b80d3ce","decimals":18,"reserve":"2.476618018848857470","logoURI":"https://woofswap.finance/image/tokens/ETH.png"},"tvl":"8452.56","type":"Volatile","isStable":false},{"gauge":{"apr":"28.285535","address":"0xef7c771e9bcec2821a6743c3a8d9accfae016af0","bribe":"0xe865ef2d188eae0f027897c2859aee470d96a35d","totalSupply":"147858.529306916131315640","fee":"0x325ba3f48503f685a0a20d221c3b43d9d9978a1f","tvl":"7933.16"},"symbol":"vAMM-WBONE/WOOF","address":"0xe7481d3bb7ae1f11e17d64244102044922cf565f","totalSupply":"149074.511398073610296820","token0":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"8746.559332233922201053","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"isValid":true,"token1":{"symbol":"WOOF","address":"0xD0daa7B6ff1B40d3cc6F0B2Cf7E85cB993D1c834","decimals":18,"reserve":"2541740.084730660583822628","logoURI":"https://woofswap.finance/image/tokens/WOOF.png"},"tvl":"7985.16","type":"Volatile","isStable":false},{"gauge":{"apr":"25.872","address":"0x072e2322018e15b006a1a130002df414d938b6cf","bribe":"0x9e5fe4b3f04f653df63318ee73a674f4712c8755","totalSupply":"999999.999999999999999000","fee":"0x6df59493899c568cb71350c3b6b4c813bd443979","tvl":"5000"},"symbol":"vAMM-stWOOF/Bribe","address":"0xdd73b00bea4443155a3e0249a5929e53dc83b95c","totalSupply":"1000000.000000000000000000","token0":{"symbol":"stWOOF","address":"0x3e7647cf066916bB81C3a7A9B5943BFE78fE7BB6","decimals":18,"reserve":"1000000.000000000000000000","logoURI":"https://woofswap.finance/image/tokens/stWOOF.png"},"isValid":true,"token1":{"symbol":"Bribe","address":"0x8b3539ad84e5186fb4d4718558cd184bb83b7df5","decimals":18,"reserve":"1000000.000000000000000000","logoURI":"https://woofswap.finance/image/tokens/Bribe.png"},"tvl":"5000","type":"Volatile","isStable":false},{"gauge":{"apr":"12.113","address":"0x5bbdf85138415d48c9a5bc64baa41761d68eca55","bribe":"0x2179f7263d4ec9a028d47f3a35db73bd35f2dc02","totalSupply":"343729.569294681469349653","fee":"0xbc59d68001b216736f4aa0cdac395071b33b028e","tvl":"8.7408"},"symbol":"vAMM-SHIB/WBONE","address":"0x71813baf6a3a01d2d87c6fb2c9a5e3143ca78616","totalSupply":"343729.569294681469350653","token0":{"symbol":"SHIB","address":"0x495eea66B0f8b636D441dC6a98d8F5C3D455C4c0","decimals":18,"reserve":"68164016.450805574797861265","logoURI":"https://woofswap.finance/image/tokens/SHIB.png"},"isValid":true,"token1":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"1981.645616705726229318","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"tvl":"0","type":"Volatile","isStable":false},{"gauge":{"apr":"5.8711","address":"0xd98f821efdc29467498aaf8c12465000ce18d44e","bribe":"0xa3f073203543f82885811dd8d19b82b5d6c1b9b7","totalSupply":"0.000005558419269696","fee":"0x9e9f2532f590e8c3e004641b326283c78331d76d","tvl":"0.39843"},"symbol":"vAMM-WBONE/USDT","address":"0x4fc0db98a912829b803d2fcfb40c12d5e9afae2c","totalSupply":"0.000005558419271285","token0":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"190.309866615044893889","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"isValid":true,"token1":{"symbol":"USDT","address":"0xaB082b8ad96c7f47ED70ED971Ce2116469954cFB","decimals":6,"reserve":"188.070307000000000000","logoURI":"https://woofswap.finance/image/tokens/USDT.png"},"tvl":"0","type":"Volatile","isStable":false},{"gauge":{"apr":"0","address":"0xf82389ecfc174536e952bba360a3ed832c5547ed","bribe":"0xb77c3e50da3a0e43cd7553a1c61eeaa0a97d77be","totalSupply":"126.396154317824179132","fee":"0x4832c71a2f403c27989109c4eee96faa06f93df8","tvl":"0"},"symbol":"sAMM-WBONE/WBONE","address":"0x7636f8299af8d2f576b93446543bd3b0f7ac80e3","totalSupply":"126.396154317824180132","token0":{"symbol":"WBONE","address":"0x839FdB6cc98342B428E074C1573ADF6D48CA3bFd","decimals":18,"reserve":"138.588267412098758355","logoURI":"https://woofswap.finance/image/tokens/BONE.png"},"isValid":true,"token1":{"symbol":"WBONE-SHIB","address":"0xC76F4c819D820369Fb2d7C1531aB3Bb18e6fE8d8","decimals":18,"reserve":"114.215246343964275098","logoURI":"https://woofswap.finance/image/tokens/WBONE_SHIB.png"},"tvl":"0","type":"Stable","isStable":true}]},"code":200,"msg":"Success"}

      }


      return pairsCall.responseObj
  } catch (ex) {
    console.error('v3 Pairs fetched had error', ex)
    return []
  }
}

const getFloorPrice = async () => {
  try {
    const response = await fetch(`https://api.opensea.io/api/v1/collection/thenian/stats`, {
      method: 'get',
    })
    const res = await response.json()

    return res.stats
  } catch (ex) {
    console.error('opensea api fetch had error', ex)
    return []
  }
}
// add 10%
const calculateGasMargin =  function (value) {
    return parseInt(value*1.1)+200000;
    // return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

const sendContract = (dispatch, key, uuid, contract, method, params, account, msgValue = '0') => {
  let hash,calculateGasLimit
  dispatch(
    updateTransaction({
      key,
      uuid,
      status: TransactionType.WAITING,
    }),
  )
  return new Promise(async(resolve, reject) => {

      let hash = "",gasPrice=0,gasUsedEthNumber=0,refundedEthNumber=0,calculateGasLimit=0;
      //new
      try {
          let px = await contract[method](...params,{
                              from: account,
                              value: msgValue,
                          })
          hash = px.hash
          dispatch(
              updateTransaction({
                  key,
                  uuid,
                  status: TransactionType.PENDING,
                  hash,
              }),
          )

          const receipt = await px.wait();
          if (receipt.status) {

              dispatch(
                  updateTransaction({
                      key,
                      uuid,
                      status: TransactionType.SUCCESS,
                      hash,
                      gasPrice,
                      gasUsed:receipt.gasUsed+"",
                      gasUsedEthNumber:gasUsedEthNumber,
                      refundedEthNumber:refundedEthNumber,
                      gasLimit:calculateGasLimit
                  }),
              )
              customNotify('Transaction Successful!', 'success', hash)
              resolve(receipt)
          }else {
              dispatch(
                  updateTransaction({
                      key,
                      uuid,
                      status: TransactionType.FAILED,
                      hash,
                  }),
              )
              customNotify("Transaction Failed", 'error')
              reject(err)
          }
      }catch (err) {

          dispatch(
              updateTransaction({
                  key,
                  uuid,
                  status: TransactionType.FAILED,
                  hash,
              }),
          )
          customNotify('Transaction Failed', 'error')
          reject(err)

      }


      //old
      //    let px=  contract[method](...params)
      //         .send({
      //             from: account,
      //             value: msgValue,
      //         })
      //         .on('transactionHash', (tx) => {
      //             hash = tx
      //             dispatch(
      //                 updateTransaction({
      //                     key,
      //                     uuid,
      //                     status: TransactionType.PENDING,
      //                     hash,
      //                 }),
      //             )
      //         })
      //         .then((res) => {
      //
      //             let A = BigNumber.from(10).pow(18);
      //             let wc= BOOTLOADER_FORMAL_ADDRESS.replace("0x", "0x000000000000000000000000");
      //             let a = account.toLowerCase().replace("0x", "0x000000000000000000000000");
      //             let t = BigNumber.from(0);
      //             let transferArr = [];
      //             if(res.events.Transfer)
      //                 transferArr = res.events.Transfer;
      //             else {
      //                 for (let ti=0; ti< Object.keys(res.events).length;ti++ ) {
      //                     let eobj = res.events[Object.keys(res.events)[ti]];
      //                     if(eobj.address)
      //                         transferArr[ti] = eobj;
      //                 }
      //             }
      //             for (let ti=0; ti< transferArr.length;ti++ ) {
      //                 let s = transferArr[ti];
      //                 if (s.address.toLowerCase() == L2_ETH_TOKEN_ADDRESS) {
      //                     let l = s.raw.topics;
      //                     if (3 === l.length && l[0].toLowerCase() == SignatureHash && l[1].toLowerCase() == wc && l[2].toLowerCase() == a) {
      //                         let c =BigNumber.from(s.raw.data.replace("0x0000000000000000000000","0x"));
      //                         t = t.add(c)
      //                     }
      //                 }
      //             }
      //
      //             let refundedEth = t;
      //
      //             let refundedEthNumber = refundedEth.mul(1000000000).div(A).toNumber()/1000000000;
      //             let gasPrice = res.effectiveGasPrice ? res.effectiveGasPrice : res.gasPrice ? res.gasPrice : 1
      //                 , gasUsedEth = BigNumber.from( res.gasUsed).mul( BigNumber.from(gasPrice));
      //             let gasUsedEthNumber = gasUsedEth.mul(1000000000).div(A).toNumber()/1000000000;
      //
      //             dispatch(
      //                 updateTransaction({
      //                     key,
      //                     uuid,
      //                     status: TransactionType.SUCCESS,
      //                     hash,
      //                     gasPrice,
      //                     gasUsed:res.gasUsed,
      //                     gasUsedEthNumber:gasUsedEthNumber,
      //                     refundedEthNumber:refundedEthNumber,
      //                     gasLimit:calculateGasLimit
      //                 }),
      //             )
      //             customNotify('Transaction Successful!', 'success', hash)
      //             resolve(res)
      //         })
      //         .catch((err) => {
      //             dispatch(
      //                 updateTransaction({
      //                     key,
      //                     uuid,
      //                     status: TransactionType.FAILED,
      //                     hash,
      //                 }),
      //             )
      //             customNotify(err.message, 'error')
      //             reject(err)
      //         })







  })
}

const sendV3Contract = (dispatch, key, uuid, web3, from, to, data, msgValue = '0') => {
  let hash
  dispatch(
    updateTransaction({
      key,
      uuid,
      status: TransactionType.WAITING,
    }),
  )
  return new Promise((resolve, reject) => {
      web3.provider
      .sendTransaction({
        from,
        to,
        data,
        value: msgValue,
      })
      .on('transactionHash', (tx) => {
        hash = tx
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TransactionType.PENDING,
            hash,
          }),
        )
      })
      .then((res) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TransactionType.SUCCESS,
            hash,
          }),
        )
        customNotify('Transaction Successful!', 'success', hash)
        resolve(res)
      })
      .catch((err) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TransactionType.FAILED,
            hash,
          }),
        )
        customNotify(err.message, 'error')
        reject(err)
      })
  })
}

const getAllowance = async (contract, target, account) => {
  try {
    return await contract.allowance(account, target)
  } catch (ex) {
    console.error(ex)
    return 0
  }
}

export { getWhitelist,getBaseAssets, getRouteAssets, getPairs, getV3Pairs, sendContract, sendV3Contract, getAllowance, getFloorPrice }
