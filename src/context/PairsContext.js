import React, { useState, useEffect,useContext } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import BigNumber from 'bignumber.js'
import useRefresh from '../hooks/useRefresh'
import useWeb3 from '../hooks/useWeb3'
import { fetchUserPairs,fetchVoteTotalWeight } from '../utils/fetchUserPairs'
import usePrices from '../hooks/usePrices'
import {getPairs, getV3Pairs, getWhitelist} from '../utils/api'
import { ZERO_VALUE } from '../utils/formatNumber'
import { formatAmount, fromWei, isInvalidAmount, MAX_UINT256, toWei } from '../utils/formatNumber'
import {BaseAssetsConetext,} from "./BaseAssetsConetext";

import {readOnlyProvider} from "../utils/contractHelpers";

const PairsContext = React.createContext({
  pairs: [],
  userPairs: [],
  voteTotalWeight:ZERO_VALUE,
  supply: {
    totalSupply: ZERO_VALUE,
    circSupply: ZERO_VALUE,
    lockedSupply: ZERO_VALUE,
  },
})

const PairsContextProvider = ({ children }) => {
  const [pairs, setPairs] = useState([])
  const [userPairs, setUserPairs] = useState([])
  const [whitelistObj, setWhitelistObj] = useState({})
  const [whitelistAll, setWhitelistAll] = useState({})
  const [voteTotalWeight, setVoteTotalWeight] = useState(ZERO_VALUE)
  const baseAssets = useContext(BaseAssetsConetext)

  const [supply, setSupply] = useState({
    totalSupply: ZERO_VALUE,
    circSupply: ZERO_VALUE,
    lockedSupply: ZERO_VALUE,
  })
  const { fastRefresh,setfastestRefresh } = useRefresh()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const web3 = useWeb3()

  const prices = usePrices()

  useEffect(() => {
    const getUserData = async () => {
      try {

        const data = await getPairs(chainId)
        const  pools = data.data ? data.data :[]
        // const { data: pools, meta } = await getPairs(chainId)
        //const { total_supply, circulating_supply, locked_supply } = meta
        const { total_supply, circulating_supply, locked_supply } = { total_supply:0, circulating_supply:0, locked_supply:0 };
        setSupply({
          totalSupply: new BigNumber(total_supply),
          circSupply: new BigNumber(circulating_supply),
          lockedSupply: new BigNumber(locked_supply),
        })
        if (pools.length >= 0) {
          var ethwoof = '0x63Db6ba9E512186C2FAaDaCEF342FB4A40dc577c'
          var usdtwoof = '0xA051eF9A6FBea340Bb734d022e7B6a3aD9fD9B06'
          let userInfos = []
          if (address) {
            userInfos = await fetchUserPairs(readOnlyProvider[chainId], address,chainId)
          }

          const userInfosNew = userInfos
              .map((found) => {
                const pair = {}
                ///const found = userInfos.find((item) => item.address.toLowerCase() === pair.address.toLowerCase())
                let user = {
                  lpBalance: ZERO_VALUE,
                  gaugeBalance: ZERO_VALUE,
                  gaugeEarned: ZERO_VALUE,
                  totalLp: ZERO_VALUE,
                  token0claimable: ZERO_VALUE,
                  token1claimable: ZERO_VALUE,
                  staked0: ZERO_VALUE,
                  staked1: ZERO_VALUE,
                  stakedUsd: ZERO_VALUE,
                  earnedUsd: ZERO_VALUE,
                  total0: ZERO_VALUE,
                  total1: ZERO_VALUE,
                  totalUsd: ZERO_VALUE,
                }
                if (found) {
                  const lpPrice = new BigNumber(pair.totalSupply).isZero() ? ZERO_VALUE : new BigNumber(pair.tvl).div(pair.totalSupply)
                  user = {
                    ...found,
                    staked0: pair.totalSupply ? found.gaugeBalance.times(pair.token0.reserve).div(pair.totalSupply) : ZERO_VALUE,
                    staked1: pair.totalSupply ? found.gaugeBalance.times(pair.token1.reserve).div(pair.totalSupply) : ZERO_VALUE,
                    stakedUsd: found.gaugeBalance.times(lpPrice),
                    earnedUsd: found.gaugeEarned.times(prices['WOOF']),
                    total0: pair.totalSupply ? found.totalLp.times(pair.token0.reserve).div(pair.totalSupply) : ZERO_VALUE,
                    total1: pair.totalSupply ? found.totalLp.times(pair.token1.reserve).div(pair.totalSupply) : ZERO_VALUE,
                    totalUsd: found.totalLp.times(lpPrice),
                    myPool0:new BigNumber(found.account_lp_balance).times(found.pairInfo_reserve0).div(found.pairInfo_total_supply),
                    myPool1:new BigNumber(found.account_lp_balance).times(found.pairInfo_reserve1).div(found.pairInfo_total_supply),
                    myStaked0:new BigNumber(found.account_gauge_balance).times(found.pairInfo_reserve0).div(found.pairInfo_total_supply),
                    myStaked1:new BigNumber(found.account_gauge_balance).times(found.pairInfo_reserve1).div(found.pairInfo_total_supply),
                  }

                }


                const found0 = baseAssets.find((ele) => ele.address.toLowerCase() === found.pairInfo_token0.toLowerCase())
                const found1 = baseAssets.find((ele) => ele.address.toLowerCase() === found.pairInfo_token1.toLowerCase())


                return {
                  ...found,
                  address:found.address,
                  symbol:found.pairInfo_symbol,
                  isValid: true,
                  type:found.pairInfo_stable ? 'STABLE' : 'VOLATILE',
                  isStable:found.pairInfo_stable,
                  stable: found.pairInfo_stable,
                  title: found.pairInfo_stable ? 'STABLE' : 'VOLATILE',
                  tvl: new BigNumber(0),
                  token0: {
                    address:found.pairInfo_token0,
                    symbol:found.pairInfo_token0_symbol,
                    decimals:found.pairInfo_token0_decimals,
                    reserve: new BigNumber(found.pairInfo_reserve0).div(new BigNumber(10).pow(found.pairInfo_token1_decimals)),
                    logoURI:found0?found0.logoURI: "/image/tokens/ERC20_"+ chainId+".png",
                  },
                  token1: {
                    address:found.pairInfo_token1,
                    symbol:found.pairInfo_token1_symbol,
                    decimals:found.pairInfo_token1_decimals,
                    reserve: new BigNumber(found.pairInfo_reserve1).div(new BigNumber(10).pow(found.pairInfo_token1_decimals)),
                    logoURI:found1?found1.logoURI: "/image/tokens/ERC20_"+ chainId+".png",
                  },
                  gauge: {
                    address:found.pairInfo_gauge,
                    fee:found.pairInfo_fee,
                    bribe:found.pairInfo_bribe,
                    tvl: new BigNumber(0),
                    apr: new BigNumber(0),
                    voteApr: new BigNumber(0),
                    projectedApr: new BigNumber(0),
                    weight: new BigNumber(0),
                    weightPercent: new BigNumber(0),
                    bribeUsd: new BigNumber(0),
                    pooled0:found? fromWei(new BigNumber(found.pairInfo_reserve0).times( new BigNumber(found.pairInfo_gauge_total_supply) ).div( new BigNumber(found.pairInfo_total_supply) ), found.pairInfo_token0_decimals)  : null,
                    pooled1:found? fromWei(new BigNumber(found.pairInfo_reserve1).times( new BigNumber(found.pairInfo_gauge_total_supply) ).div( new BigNumber(found.pairInfo_total_supply) ), found.pairInfo_token1_decimals) : null,
                    pairInfo_pooled0:found? fromWei(new BigNumber(found.pairInfo_reserve0).times( new BigNumber(found.pairInfo_gauge_total_supply) ).div( new BigNumber(found.pairInfo_total_supply) ), found.pairInfo_token0_decimals)  : null,
                    pairInfo_pooled1:found? fromWei(new BigNumber(found.pairInfo_reserve1).times( new BigNumber(found.pairInfo_gauge_total_supply) ).div( new BigNumber(found.pairInfo_total_supply) ), found.pairInfo_token1_decimals) : null,

                  },
                  account: user,
                }
              })
              .sort((a, b) => {
                return a.gauge.tvl.minus(b.gauge.tvl).times(-1).toNumber()
              })
              .sort(function (x, y) {
                return x.address == ethwoof ? -1 : y.address == ethwoof ? 1 : 0
              })
              .sort(function (x, y) {
                return x.address == usdtwoof ? -1 : y.address == usdtwoof ? 1 : 0
              })
          const userInfosFilter = userInfosNew.filter((item) => {
            if(new BigNumber(item.pairInfo_total_supply).gt(100000.0)){
              return true
            }
            return  false
          })

          setUserPairs(userInfosFilter)

          let totalWeight = 0
          try{
            totalWeight =  await fetchVoteTotalWeight(readOnlyProvider[chainId])
          }catch (es1) {
          }
          setVoteTotalWeight(new BigNumber(totalWeight));

          const userInfo = pools
            .map((pair) => {
              const found = userInfos.find((item) => item.address.toLowerCase() === pair.address.toLowerCase())
              let user = {
                lpBalance: ZERO_VALUE,
                gaugeBalance: ZERO_VALUE,
                gaugeEarned: ZERO_VALUE,
                totalLp: ZERO_VALUE,
                token0claimable: ZERO_VALUE,
                token1claimable: ZERO_VALUE,
                staked0: ZERO_VALUE,
                staked1: ZERO_VALUE,
                stakedUsd: ZERO_VALUE,
                earnedUsd: ZERO_VALUE,
                total0: ZERO_VALUE,
                total1: ZERO_VALUE,
                totalUsd: ZERO_VALUE,
              }
              if (found) {
                const lpPrice = new BigNumber(pair.totalSupply).isZero() ? ZERO_VALUE : new BigNumber(pair.tvl).div(pair.totalSupply)
                user = {
                  ...found,
                  staked0: pair.totalSupply ? found.gaugeBalance.times(pair.token0.reserve).div(pair.totalSupply) : ZERO_VALUE,
                  staked1: pair.totalSupply ? found.gaugeBalance.times(pair.token1.reserve).div(pair.totalSupply) : ZERO_VALUE,
                  stakedUsd: found.gaugeBalance.times(lpPrice),
                  earnedUsd: found.gaugeEarned.times(prices['WOOF']),
                  total0: pair.totalSupply ? found.totalLp.times(pair.token0.reserve).div(pair.totalSupply) : ZERO_VALUE,
                  total1: pair.totalSupply ? found.totalLp.times(pair.token1.reserve).div(pair.totalSupply) : ZERO_VALUE,
                  totalUsd: found.totalLp.times(lpPrice),
                  myPool0:new BigNumber(found.account_lp_balance).times(found.pairInfo_reserve0).div(found.pairInfo_total_supply),
                  myPool1:new BigNumber(found.account_lp_balance).times(found.pairInfo_reserve1).div(found.pairInfo_total_supply),
                  myStaked0:new BigNumber(found.account_gauge_balance).times(found.pairInfo_reserve0).div(found.pairInfo_total_supply),
                  myStaked1:new BigNumber(found.account_gauge_balance).times(found.pairInfo_reserve1).div(found.pairInfo_total_supply),
                }

              }
              return {
                ...pair,
                isApiData:true,
                stable: pair.isStable,
                title: pair.isStable ? 'STABLE' : 'VOLATILE',
                tvl: new BigNumber(pair.tvl),
                token0: {
                  ...pair.token0,
                  reserve: new BigNumber(pair.token0.reserve),
                },
                token1: {
                  ...pair.token1,
                  reserve: new BigNumber(pair.token1.reserve),
                },
                gauge: {
                  ...pair.gauge,
                  tvl: new BigNumber(pair.gauge.tvl),
                  apr: new BigNumber(pair.gauge.apr),
                  voteApr: new BigNumber(pair.gauge.voteApr),
                  projectedApr: new BigNumber(pair.gauge.projectedApr),
                  weight: new BigNumber(pair.gauge.weight),
                  weightPercent: new BigNumber(pair.gauge.weightPercent),
                  bribeUsd: new BigNumber(pair.gauge.bribesInUsd),
                  pooled0: pair.totalSupply ? new BigNumber(pair.token0.reserve).times(pair.gauge.totalSupply).div(pair.totalSupply) : new BigNumber(0),
                  pooled1: pair.totalSupply ? new BigNumber(pair.token1.reserve).times(pair.gauge.totalSupply).div(pair.totalSupply) : new BigNumber(0),
                  pairInfo_pooled0:found? fromWei(new BigNumber(found.pairInfo_reserve0).times( new BigNumber(found.pairInfo_gauge_total_supply) ).div( new BigNumber(found.pairInfo_total_supply) ), found.pairInfo_token0_decimals)  : null,
                  pairInfo_pooled1:found? fromWei(new BigNumber(found.pairInfo_reserve1).times( new BigNumber(found.pairInfo_gauge_total_supply) ).div( new BigNumber(found.pairInfo_total_supply) ), found.pairInfo_token1_decimals) : null,

                },
                account: user,
              }
            })
            // .sort((a, b) => {
            //   return a.gauge.tvl.minus(b.gauge.tvl).times(-1).toNumber()
            // })
            // .sort(function (x, y) {
            //   return x.address == ethwoof ? -1 : y.address == ethwoof ? 1 : 0
            // })
            // .sort(function (x, y) {
            //   return x.address == usdtwoof ? -1 : y.address == usdtwoof ? 1 : 0
            // })

          setPairs(userInfo)
        }
      } catch (e) {
        console.error('user pairs fetched had error', e)
      }
      if(address){

        getWhitelist("0x")
            .then(async (res1) => {
              if (res1) {
                if(res1.voList.length == 0)
                  res1.voList = [{}]
                if (readOnlyProvider[chainId] && address) {
                  setWhitelistAll(res1)
                } else {
                  setWhitelistAll(res1)
                }
              }
            })
            .catch((error) => {
              console.error('Base Assets fetched had error', error)
            })
        getWhitelist(address)
            .then(async (res1) => {
              if (res1) {
                if(res1.voList.length == 0)
                  res1.voList = [{}]
                if (readOnlyProvider[chainId] && address) {

                  setWhitelistObj(res1)
                } else {
                  setWhitelistObj(res1)
                }
              }
            })
            .catch((error) => {
              console.error('Base Assets fetched had error', error)
            })
      }else {
        setWhitelistObj({})
      }

    }
    if (web3) {
      getUserData()
    }
  }, [address, web3,chainId, fastRefresh])

  return (
    <PairsContext.Provider
      value={{
        pairs,
        userPairs,
            voteTotalWeight,
        supply,
            whitelistObj,
            whitelistAll
      }}
    >
      {children}
    </PairsContext.Provider>
  )
}

export { PairsContext, PairsContextProvider }
