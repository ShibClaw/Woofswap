import { multicall } from './multicall'
import { fromWei } from './formatNumber'
import { ERC20Abi } from '../config/abi'

export const fetchAssetsBalances = async (baseAssets, account,web3) => {

  const calls = baseAssets.map((asset) => {
    return {
      address: asset.address,
      name: 'balanceOf',
      params: [account],
    }
  })

  try{
    const rawTokenBalances = await multicall(ERC20Abi, calls ,web3)
    const parsedTokenBalances = rawTokenBalances.map((tokenBalance, index) => {
      return fromWei(tokenBalance, baseAssets[index].decimals || 18)
    })
    return parsedTokenBalances
  }catch (e) {
    //console.log(e)
    return baseAssets.map((asset, index) => {
      return fromWei(0, 18)
    })
  }

}

export const fetchUserAssetsDataAsync = async (web3, baseAssets, account,chainId) => {
  const nonEthAssets = baseAssets.slice(1)
  try {
    // const [ethBalance, userBalances] = await Promise.all([web3.eth.getBalance(account), fetchAssetsBalances(nonEthAssets, account)])
    const ethBalance = await web3.provider.getBalance(account)

    let localAssetsStr = window.localStorage.getItem('localStorageAssets' + chainId)

    if (localAssetsStr != null && localAssetsStr != '') {

      const arr = JSON.parse(localAssetsStr)
      if (arr.length > 0) {
        arr.map((asset) => {
          if (asset.address) {
            nonEthAssets.push(asset)
          }
        })
      }
    }

  // if(nonEthAssets.length >0){
  //   debugger
  // }

  const userBalances = await fetchAssetsBalances(nonEthAssets, account,web3)

  const ethAssetInfo = {
    ...baseAssets[0],
    balance: fromWei(ethBalance),
  }

  const nonEthAssetsInfo = nonEthAssets.map((asset, index) => {
    return {
      ...asset,
      balance: userBalances[index],
    }
  })
  return [ethAssetInfo, ...nonEthAssetsInfo]
  }catch (e) {
    console.log("error11",e)
    return [];
  }
}
