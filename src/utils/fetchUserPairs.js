import { pairV3APIAbi } from '../config/abi'
import { getPairV3APIAddress } from './addressHelpers'
import { getFactoryContract, getPairAPIContract,getPairSwapAPIContract,getVoterContract } from './contractHelpers'
import { fromWei } from './formatNumber'
import { multicall } from './multicall'
export const fetchVoteTotalWeight = async (web3) => {

  const voterContract = getVoterContract(web3)
  if (!voterContract) return 0
  const totalWeight = await voterContract.totalWeight()
  return totalWeight;
}

export const fetchUserPairs = async (web3, account,chainId) => {

  const factoryContract = getFactoryContract(web3)
  if (!factoryContract) return []
  let pairLength
  try {
    pairLength = parseInt( await factoryContract.allPairsLength())
  } catch (e) {
    console.warn('allPairsLength call failed for chainId', chainId, e.message)
    return []
  }



    const pairSwapAPIContract = getPairSwapAPIContract(web3)
    if (!pairSwapAPIContract) return []
    try{
      //const pairInfos = await pairSwapAPIContract.getAllPair(account ? account :'0x0000000000000000000000000000000000000000', pairLength, 0)
      let pairInfos = [],pindex=0,plen=80;
      while (pindex<pairLength){
        let currLen = 0;
        if(pindex+plen<=pairLength) {
          currLen = plen;
        }else {
          currLen = pairLength - pindex;
        }
        let parr = await pairSwapAPIContract.getAllPair(account ? account :'0x0000000000000000000000000000000000000000', currLen+0, pindex+0)
        pairInfos = [...pairInfos,...parr];
        pindex = pindex + plen;


      }

      return pairInfos.map((pair) => {

        return {
          address: pair[0], // pair contract address
          pairInfo_symbol: pair[1], 				    // pair symbol
          pairInfo_name: pair[2],                    // pair name
          pairInfo_decimals: pair[3], 			        // pair decimals
          pairInfo_stable: pair[4], 				    // pair pool type (stable = false, means it's a variable type of pool)
          pairInfo_total_supply: pair[5], 			    // pair tokens supply

          // token pair info
          pairInfo_token0: pair[6], 				// pair 1st token address
          pairInfo_token0_symbol: pair[7], 			// pair 1st token symbol
          pairInfo_token0_decimals: pair[8], 		    // pair 1st token decimals
          pairInfo_reserve0: pair[9], 			        // pair 1st token reserves (nr. of tokens in the contract)
          pairInfo_claimable0: pair[10],                // claimable 1st token from fees (for unstaked positions)

          pairInfo_token1: pair[11], 				// pair 2nd token address
          pairInfo_token1_symbol: pair[12],           // pair 2nd token symbol
          pairInfo_token1_decimals: pair[13],    		// pair 2nd token decimals
          pairInfo_reserve1: pair[14], 			        // pair 2nd token reserves (nr. of tokens in the contract)
          pairInfo_claimable1: pair[15], 			    // claimable 2nd token from fees (for unstaked positions)

          // pairs gauge
          pairInfo_gauge: pair[16], 				    // pair gauge address
          pairInfo_gauge_total_supply: pair[17], 		// pair staked tokens (less/eq than/to pair total supply)
          pairInfo_fee: pair[18], 				    // pair fees contract address
          pairInfo_bribe: pair[19], 				    // pair bribes contract address
          pairInfo_emissions: pair[20], 			    // pair emissions (per second)
          pairInfo_emissions_token: pair[21], 		// pair emissions token address
          pairInfo_emissions_token_decimals: pair[22], 	// pair emissions token decimals

          // User deposit
          account_lp_balance: pair[23], 		// account LP tokens balance
          account_token0_balance: pair[24], 	// account 1st token balance
          account_token1_balance: pair[25], 	// account 2nd token balance
          account_gauge_balance: pair[26],     // account pair staked in gauge balance
          account_gauge_earned: pair[27], 		// account earned emissions for this pair


          lpBalance: fromWei(pair[23], Number(pair[3])), // account LP tokens balance
          gaugeBalance: fromWei(pair[26], Number(pair[3])), // account pair staked in gauge balance
          gaugeEarned: fromWei(pair[27], Number(pair[22])), // account earned emissions for this pair
          totalLp: fromWei(pair[23], Number(pair[3])).plus(fromWei(pair[26], Number(pair[3]))), // account total LP tokens balance
          token0claimable: fromWei(pair[10], Number(pair[8])), // claimable 1st token from fees (for unstaked positions)
          token1claimable: fromWei(pair[15], Number(pair[13])), // claimable 2nd token from fees (for unstaked positions)
        }
      })
    }catch (e) {
      return []
    }



}

const fetchGammaInfo = async (account, pools,web3) => {
  const calls = pools.map((pool) => {
    return {
      address: getPairV3APIAddress(),
      name: 'getPair',
      params: [pool.address, account],
    }
  })

  const res = await multicall(pairV3APIAbi, calls,web3)
  return res
}

export const fetchUserV3Pairs = async (account, pools,web3) => {
  let pairInfos = []
  try {
    pairInfos = await fetchGammaInfo(account, pools,web3 )
  }catch (e) {
  }
  return pairInfos.map((pool) => {
    const pair = pool[0]
    return {
      address: pair[0], // pair contract address
      lpBalance: fromWei(pair[23]._hex, Number(pair[3])), // account LP tokens balance
      gaugeBalance: fromWei(pair[26]._hex, Number(pair[3])), // account pair staked in gauge balance
      gaugeEarned: fromWei(pair[27]._hex, Number(pair[22])), // account earned emissions for this pair
      totalLp: fromWei(pair[23]._hex, Number(pair[3])).plus(fromWei(pair[26]._hex, Number(pair[3]))), // account total LP tokens balance
      token0claimable: fromWei(pair[10]._hex, Number(pair[8])), // claimable 1st token from fees (for unstaked positions)
      token1claimable: fromWei(pair[15]._hex, Number(pair[13])), // claimable 2nd token from fees (for unstaked positions)
    }
  })
}
