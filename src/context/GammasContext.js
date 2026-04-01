import React, { useState, useEffect } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import BigNumber from 'bignumber.js'
import useRefresh from '../hooks/useRefresh'
import { fetchUserV3Pairs } from '../utils/fetchUserPairs'
import usePrices from '../hooks/usePrices'
import { getV3Pairs } from '../utils/api'
import { ZERO_VALUE } from '../utils/formatNumber'
import { PoolTitles } from '../config/constants'
import { Presets } from '../state/mintV3/reducer'
import useWeb3 from "../hooks/useWeb3";

const GammasContext = React.createContext([])

const GammasContextProvider = ({ children }) => {
    const [pairs, setPairs] = useState([])
    const { fastRefresh } = useRefresh()
    const prices = usePrices()
    const web3 = useWeb3()
    const { address, chainId, isConnected } = useWeb3ModalAccount()

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await getV3Pairs(chainId)
                const  pools = data.data ? data.data :[]
                if (pools.length > 0) {
                    var ethwoof = '0x63Db6ba9E512186C2FAaDaCEF342FB4A40dc577c'
                    var usdtwoof = '0xA051eF9A6FBea340Bb734d022e7B6a3aD9fD9B06'
                    let userInfos = []
                    if (address) {
                        userInfos = await fetchUserV3Pairs(address, pools,web3)
                    }
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
                                }
                            }
                            return {
                                ...pair,
                                stable: pair.type === 'Stable',
                                title: PoolTitles[pair.isGamma ? 'V3_' + pair.type.toUpperCase() : pair.type.toUpperCase()],
                                preset: Presets[pair.isGamma ? 'GAMMA_' + pair.type.toUpperCase() : pair.type.toUpperCase()],
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
                                },
                                account: user,
                            }
                        })
                        .sort((a, b) => {
                            return a.gauge.tvl.minus(b.gauge.tvl).times(-1).toNumber()
                        })
                        .sort(function (x, y) {
                            return x.address == ethwoof.toLowerCase() ? -1 : y.address == ethwoof ? 1 : 0
                        })
                        .sort(function (x, y) {
                            return x.address == usdtwoof.toLowerCase() ? -1 : y.address == usdtwoof ? 1 : 0
                        })

                    setPairs(userInfo)
                }
            } catch (e) {
                console.error('user pairs fetched had error', e)
            }
        }
        getUserData()
    }, [address,chainId])

    return <GammasContext.Provider value={pairs}>{children}</GammasContext.Provider>
}

export { GammasContext, GammasContextProvider }
