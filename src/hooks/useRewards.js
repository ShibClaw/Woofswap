import { useCallback, useContext, useEffect, useState } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import useRefresh from './useRefresh'
import {useRewardsApi,useRewardApiV2, useThenian, useVeDist, useVoter,useQueryApi,usePIKAContract,useDAMNContract} from './useContract'
import { PairsContext } from '../context/PairsContext'
import {bribeAbi, rewardAPIAbi, rewardAPIAbiV2, veWOOFAPIAbi, queryApi, pairAbi} from '../config/abi'
import { multicall } from '../utils/multicall'
import {formatAmount, fromWei, toWei, ZERO_ADDRESS} from '../utils/formatNumber'
import { getRewardsAPIAddress,getRewardsAPIV2Address, getVeWOOFAPIAddress,getQueryApiAddress } from '../utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BaseAssetsConetext } from '../context/BaseAssetsConetext'
import { useDispatch } from 'react-redux'
import {getBribeContract, getERC20Contract, getPairContract} from '../utils/contractHelpers'
import useWeb3 from './useWeb3'
import { v4 as uuidv4 } from 'uuid'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import {TaxAssets, TransactionType} from '../config/constants'
import {getAllowance, sendContract} from '../utils/api'
import moment from "moment";
const useGetExpectedClaimForNextEpoch = (veWOOF) => {
    const [rewards, setRewards] = useState([])
    const { fastRefresh } = useRefresh()
    const { pairs } = useContext(PairsContext)
    const baseAssets = useContext(BaseAssetsConetext)
    const useQueryApiContract = useQueryApi()

    useEffect(() => {
        const fetchRewards = async () => {
            try {

                const pairAddrssArr = pairs
                    .filter((pool) => pool.gauge.address !== ZERO_ADDRESS && pool.isValid)
                    .map((pool) => {
                        return pool.address;
                    })
                const [resRewards] = await Promise.all([
                    useQueryApiContract.getExpectedClaimForNextEpoch(veWOOF.id+"", pairAddrssArr),
                ])

                setRewards(resRewards)
            } catch (error) {
                console.log('current rewards error :>> ', error)
                setRewards([])
            }
        }

        if (pairs.length > 0 && veWOOF) {
            fetchRewards()
        } else {
            setRewards([])
        }
    }, [pairs, baseAssets, fastRefresh, veWOOF])

    return rewards
}

const useGetVeRewards = (veWOOF) => {
  const [rewards, setRewards] = useState([])
  const { fastRefresh } = useRefresh()
  const { pairs } = useContext(PairsContext)
  const baseAssets = useContext(BaseAssetsConetext)
    const web3 = useWeb3()

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const callsRewards = pairs
          .filter((pool) => pool.gauge.address !== ZERO_ADDRESS && pool.isValid)
          .map((pool) => {
            return {
              address: getVeWOOFAPIAddress(),
              name: 'singlePairReward',
              params: [veWOOF.id+"", pool.address],
            }
          })

        const resRewards = await multicall(veWOOFAPIAbi, callsRewards,web3)
        const final = pairs
          .filter((pool) => pool.gauge.address !== ZERO_ADDRESS && pool.isValid)
          .map((pool, index) => {
            const result = {}
            let isFeeExist = false
            let isBribeExist = false
            resRewards[index][0].forEach((reward, idx) => {
              const { 1: amount, 2: decimals, 4: address } = reward
              if (idx < 2) {
                isFeeExist = isFeeExist || Number(amount) > 0
              } else {
                isBribeExist = isBribeExist || Number(amount) > 0
              }
              if (Number(amount) > 0) {
                result[address] = {
                  address,
                  amount: !result[address] ? fromWei(Number(amount), decimals) : result[address]['amount'].plus(fromWei(Number(amount), decimals)),
                }
              }
            })
            return {
              ...pool,
              rewards: Object.values(result),
              isFeeExist,
              isBribeExist,
            }
          })
          .filter((pool) => pool.rewards.length >= 0)
          .map((pool) => {
            let votes = {
              weight: new BigNumber(0),
              weightPercent: new BigNumber(0),
            }
            if (veWOOF.votes.length > 0) {
              const found = veWOOF.votes.find((ele) => ele.address.toLowerCase() === pool.address.toLowerCase())
              if (found) {
                votes = found
              }
            }
            let totalUsd = new BigNumber(0)
            const finalRewards = pool.rewards.map((reward) => {
              const found = baseAssets.find((ele) => ele.address.toLowerCase() === reward.address.toLowerCase())
              if (found) {
                totalUsd = totalUsd.plus(reward.amount.times(found.price))
                return {
                  ...reward,
                  symbol: found.symbol,
                }
              }
              return reward
            })
            return {
              ...pool,
              rewards: finalRewards,
              totalUsd,
              votes,
            }
          })
        setRewards(final)
      } catch (error) {
        console.log('current rewards error :>> ', error)
        setRewards([])
      }
    }

    if (pairs.length > 0 && veWOOF) {
      fetchRewards()
    } else {
      setRewards([])
    }
  }, [pairs, baseAssets, fastRefresh, veWOOF])

  return rewards
}
const useAllRewards = (veWOOF) => {
    const [rewards, setRewards] = useState([])
    const { fastRefresh } = useRefresh()
    const { pairs } = useContext(PairsContext)
    const { userPairs } = useContext(PairsContext)
    const baseAssets = useContext(BaseAssetsConetext)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const rewardApiV2Contract = useRewardApiV2()


    useEffect(() => {
        const fetchRewardsV2 = async () => {
            try {
                const gaugePools = userPairs.filter((pool) => pool.pairInfo_gauge !== ZERO_ADDRESS)
                const arr = []
                 gaugePools.map((pool) => {
                    arr.push(pool.address)
                })

                // const [resRewards] = await Promise.all([
                //     rewardApiV2Contract.methods.getVeNftRewards(veWOOF.id, arr).call(),
                // ])
                const resRewards = await rewardApiV2Contract.getVeNftRewards(veWOOF.id+"", arr)



                const finalArr=[];
                 gaugePools
                    .map((pool, index) => {
                        let result = {}
                        let tokens = resRewards.bribes[index].externalBribes.tokens
                        let decimals = resRewards.bribes[index].externalBribes.decimals
                        let amounts  = resRewards.bribes[index].externalBribes.amounts
                        let symbols  = resRewards.bribes[index].externalBribes.symbols
                        let isExternalBribes = false
                        // bribes
                        //const { 0: tokens, 2: decimals, 3: amounts } = resRewards[index][0][0][0][0]
                        tokens.map((token, index) => {
                            if (Number(amounts[index]) > 0) {
                                isExternalBribes = true;
                                result[token] = {
                                    address: token,
                                    decimal: decimals[index],
                                    symbol: symbols[index],
                                    amount: !result[token]
                                        ? fromWei(Number(amounts[index]), Number(decimals[index]))
                                        : result[token]['amount'].plus(fromWei(Number(amounts[index]), Number(decimals[index]))),
                                }
                            }
                        })

                        if(isExternalBribes){
                            finalArr.push(
                                {
                                    ...pool,
                                    rewardsType:"Bribes",
                                    rewards: Object.values(result),
                                })
                        }

                        result = {}
                         tokens = resRewards.bribes[index].internalBribes.tokens
                         decimals = resRewards.bribes[index].internalBribes.decimals
                         amounts  = resRewards.bribes[index].internalBribes.amounts
                         symbols  = resRewards.bribes[index].internalBribes.symbols
                         let isInternalBribes = false
                        // bribes
                        //const { 0: tokens, 2: decimals, 3: amounts } = resRewards[index][0][0][0][0]
                        tokens.map((token, index) => {
                            if (Number(amounts[index]) > 0) {
                                isInternalBribes = true;
                                result[token] = {
                                    address: token,
                                    decimal: decimals[index],
                                    symbol: symbols[index],
                                    amount: !result[token]
                                        ? fromWei(Number(amounts[index]), Number(decimals[index]))
                                        : result[token]['amount'].plus(fromWei(Number(amounts[index]), Number(decimals[index]))),
                                }
                            }
                        })

                        if(isInternalBribes){
                            finalArr.push(
                                {
                                    ...pool,
                                    rewardsType:"Fees",
                                    rewards: Object.values(result),
                                })
                        }

                    })


                const final = finalArr.filter((pool) => pool.rewards.length > 0)
                    .map((pool) => {
                        let totalUsd = new BigNumber(0)
                        const finalRewards = pool.rewards.map((reward) => {
                            const found = baseAssets.find((ele) => ele.address.toLowerCase() === reward.address.toLowerCase())
                            if (found) {
                                totalUsd = totalUsd.plus(reward.amount.times(found.price))
                                return {
                                    ...reward,
                                    symbol: found.symbol,
                                }
                            }
                            return reward
                        })
                        return {
                            ...pool,
                            rewards: finalRewards,
                            totalUsd,
                        }
                    })

                setRewards(final)
            } catch (error) {
                console.log('expected rewards error :>> ', error)
                setRewards([])
            }
        }

        if (userPairs.length > 0 && veWOOF) {
            fetchRewardsV2()
        } else {
            setRewards([])
        }
    }, [userPairs, rewardApiV2Contract, baseAssets, fastRefresh, veWOOF,chainId])

    return rewards
}

const useUnstakedFeeRewards = () => {
    const [unstakedRewards, setUnstakedRewards] = useState([])
    const { fastRefresh } = useRefresh()
    const { userPairs } = useContext(PairsContext)
    const baseAssets = useContext(BaseAssetsConetext)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const rewardApiV2Contract = useRewardApiV2()
    const web3 = useWeb3()

    useEffect(() => {
        const fetchRewardsV2 = async () => {
            try {

                const final = []

                //Fees From Unstaked Position
                const callsRewards0 = userPairs.map((pool) => {
                    return {
                        address: pool.address,
                        name: 'claimable0',
                        params: [address?address:'0x0000000000000000000000000000000000000000'],
                    }
                })
                const callsRewards1 = userPairs.map((pool) => {
                    return {
                        address: pool.address,
                        name: 'claimable1',
                        params: [address?address:'0x0000000000000000000000000000000000000000'],
                    }
                })
                const resRewards0 = await multicall(pairAbi, callsRewards0,web3)
                const resRewards1 = await multicall(pairAbi, callsRewards1,web3)


                const balanceOf = userPairs.map((pool) => {
                    return {
                        address: pool.address,
                        name: 'balanceOf',
                        params: [address?address:'0x0000000000000000000000000000000000000000'],
                    }
                })
                const resBalanceOf = await multicall(pairAbi, balanceOf,web3)


                const index0 = userPairs.map((pool) => {
                    return {
                        address: pool.address,
                        name: 'index0',
                        params: [],
                    }
                })
                const resIndex0 = await multicall(pairAbi, index0,web3)

                const index1 = userPairs.map((pool) => {
                    return {
                        address: pool.address,
                        name: 'index1',
                        params: [],
                    }
                })
                const resIndex1 = await multicall(pairAbi, index1,web3)

                const supplyIndex0 = userPairs.map((pool) => {
                    return {
                        address: pool.address,
                        name: 'supplyIndex0',
                        params: [address?address:'0x0000000000000000000000000000000000000000'],
                    }
                })
                const resSupplyIndex0 = await multicall(pairAbi, supplyIndex0,web3)

                const supplyIndex1 = userPairs.map((pool) => {
                    return {
                        address: pool.address,
                        name: 'supplyIndex1',
                        params: [address?address:'0x0000000000000000000000000000000000000000'],
                    }
                })
                const resSupplyIndex1 = await multicall(pairAbi, supplyIndex1,web3)



                for(let i=0;i<userPairs.length;i++){
                    if(resBalanceOf[i][0].gt(0)){

                        // uint _delta0 = index0 - supplyIndex0[recipient]; // see if there is any difference that need to be accrued
                        // uint _delta1 = index1 - supplyIndex1[recipient];
                        // if (_delta0 > 0) {
                        //     uint _share = balanceOf[recipient] * _delta0 / 1e18; // add accrued difference for each supplied token
                        //
                        //     claimable0[recipient] += _share;
                        // }
                        // if (_delta1 > 0) {
                        //
                        //     uint _share = balanceOf[recipient] * _delta1 / 1e18;
                        //
                        //     claimable1[recipient] += _share;
                        // }

                        //uint _delta0 = index0 - supplyIndex0[recipient]
                        const _delta0 = new BigNumber(resIndex0[i][0]._hex).minus( new BigNumber(resSupplyIndex0[i][0]._hex) ) ; // see if there is any difference that need to be accrued
                       //uint _delta1 = index1 - supplyIndex1[recipient]
                        const _delta1 = new BigNumber(resIndex1[i][0]._hex).minus(  new BigNumber(resSupplyIndex1[i][0]._hex) );
                        const _share0 = new BigNumber( resBalanceOf[i][0]._hex).times(_delta0).div(new BigNumber(10).pow(18) ); // add accrued difference for each supplied token
                        const _share1 =new BigNumber( resBalanceOf[i][0]._hex).times(_delta1).div(new BigNumber(10).pow(18) ); // add accrued difference for each supplied token


                        // if(!_share0.isZero() || !_share1.isZero()){

                            let totalUsd = new BigNumber(0)
                            const found0 = baseAssets.find((ele) => ele.address.toLowerCase() === userPairs[i].token0.address.toLowerCase())
                            if (found0) {
                                totalUsd = totalUsd.plus(fromWei(_share0, Number(userPairs[i].token0.decimals)).times(found0.price))
                            }
                            const found1 = baseAssets.find((ele) => ele.address.toLowerCase() === userPairs[i].token1.address.toLowerCase())
                            if (found1) {
                                totalUsd = totalUsd.plus(fromWei(_share1, Number(userPairs[i].token1.decimals)).times(found1.price))
                            }
                            final.push(
                                {
                                    ...userPairs[i],
                                    rewardsType:"Unstaked Fees",
                                    token0claimable: fromWei(_share0, Number(userPairs[i].token0.decimals)), // claimable 1st token from fees (for unstaked positions)
                                    token1claimable: fromWei(_share1, Number(userPairs[i].token1.decimals)),
                                    totalUsd
                                })
                        }


                    // }
                }
                // for(let i=0;i<userPairs.length;i++){
                //     if(resRewards0.length >0 || resRewards0.length > 0)
                //
                //         if((resRewards0.length >0 && resRewards0[i][0].gt(0)) || (resRewards1.length>0 && resRewards1[i][0].gt(0) )){
                //
                //             let totalUsd = new BigNumber(0)
                //             const found0 = baseAssets.find((ele) => ele.address.toLowerCase() === userPairs[i].token0.address.toLowerCase())
                //             if (found0) {
                //                 totalUsd = totalUsd.plus(fromWei(resRewards0[i][0]._hex, Number(userPairs[i].token0.decimals)).times(found0.price))
                //             }
                //             const found1 = baseAssets.find((ele) => ele.address.toLowerCase() === userPairs[i].token1.address.toLowerCase())
                //             if (found1) {
                //                 totalUsd = totalUsd.plus(fromWei(resRewards1[i][0]._hex, Number(userPairs[i].token1.decimals)).times(found1.price))
                //             }
                //             final.push(
                //                 {
                //                     ...userPairs[i],
                //                     rewardsType:"Unstaked Fees",
                //                     token0claimable: fromWei(resRewards0[i][0]._hex, Number(userPairs[i].token0.decimals)), // claimable 1st token from fees (for unstaked positions)
                //                     token1claimable: fromWei(resRewards1[i][0]._hex, Number(userPairs[i].token1.decimals)),
                //                     totalUsd
                //                 })
                //         }else if(!new BigNumber(userPairs[i].account_lp_balance).isZero()){
                //             final.push(
                //                 {
                //                     ...userPairs[i],
                //                     rewardsType:"Unstaked Fees",
                //                     token0claimable: fromWei(0, Number(userPairs[i].token0.decimals)), // claimable 1st token from fees (for unstaked positions)
                //                     token1claimable: fromWei(0, Number(userPairs[i].token1.decimals)),
                //                     totalUsd:new BigNumber(0)
                //                 })
                //         }
                // }
                //

                setUnstakedRewards(final)
            } catch (error) {
                console.log('expected rewards error :>> ', error)
                setUnstakedRewards([])
            }
        }

        if (userPairs.length > 0) {
            fetchRewardsV2()
        } else {
            setUnstakedRewards([])
        }
    }, [userPairs, rewardApiV2Contract, baseAssets, fastRefresh,chainId])

    return unstakedRewards
}

const useExpectedRewards = (veWOOF) => {
  const [rewards, setRewards] = useState([])
  const { fastRefresh } = useRefresh()
  const { pairs } = useContext(PairsContext)
  const baseAssets = useContext(BaseAssetsConetext)
  const rewardsApiContract = useRewardsApi()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const gaugePools = pairs.filter((pool) => pool.gauge.address !== ZERO_ADDRESS)
        const callsRewards = gaugePools.map((pool) => {
          const arr = []
          arr.push(pool.address)
          return {
            address: getRewardsAPIAddress(),
            name: 'getExpectedClaimForNextEpoch',
            params: [veWOOF.id+"", arr],
          }
        })
        const resRewards = await multicall(rewardAPIAbi, callsRewards,web3)
        const final = gaugePools
          .map((pool, index) => {
            let result = {}
            // bribes
            const { 0: tokens, 2: decimals, 3: amounts } = resRewards[index][0][0][0][0]
            tokens.map((token, index) => {
              if (Number(amounts[index]) > 0) {
                result[token] = {
                  address: token,
                  amount: !result[token]
                    ? fromWei(Number(amounts[index]), Number(decimals[index]))
                    : result[token]['amount'].plus(fromWei(Number(amounts[index]), Number(decimals[index]))),
                }
              }
            })

            // fees
            const { 0: feeTokens, 2: feeDecimals, 3: feeAmounts } = resRewards[index][0][0][0][1]
            feeTokens.map((token, index) => {
              if (Number(feeAmounts[index]) > 0) {
                result[token] = {
                  address: token,
                  amount: !result[token]
                    ? fromWei(Number(feeAmounts[index]), Number(feeDecimals[index]))
                    : result[token]['amount'].plus(fromWei(Number(feeAmounts[index]), Number(feeDecimals[index]))),
                }
              }
            })
            return {
              ...pool,
              rewards: Object.values(result),
            }
          })
          .filter((pool) => pool.rewards.length > 0)
          .map((pool) => {
            let totalUsd = new BigNumber(0)
            const finalRewards = pool.rewards.map((reward) => {
              const found = baseAssets.find((ele) => ele.address.toLowerCase() === reward.address.toLowerCase())
              if (found) {
                totalUsd = totalUsd.plus(reward.amount.times(found.price))
                return {
                  ...reward,
                  symbol: found.symbol,
                }
              }
              return reward
            })
            return {
              ...pool,
              rewards: finalRewards,
              totalUsd,
            }
          })
        setRewards(final)
      } catch (error) {
        console.log('expected rewards error :>> ', error)
        setRewards([])
      }
    }

    if (pairs.length > 0 && veWOOF) {
      fetchRewards()
    } else {
      setRewards([])
    }
  }, [pairs, rewardsApiContract, baseAssets, fastRefresh, veWOOF])

  return rewards
}

const useGetFees = () => {
  const [fees, setFees] = useState([])
  const { fastRefresh } = useRefresh()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { pairs } = useContext(PairsContext)
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    const fetchRewards = () => {
      try {
        const result = pairs
          .filter((pool) => !pool.account.token0claimable.isZero() || !pool.account.token1claimable.isZero())
          .map((pool) => {
            const found0 = baseAssets.find((ele) => ele.address.toLowerCase() === pool.token0.address.toLowerCase())
            const found1 = baseAssets.find((ele) => ele.address.toLowerCase() === pool.token1.address.toLowerCase())
            const totalUsd = pool.address.token0claimable.times(found0?.price).plus(pool.account.token1claimable.times(found1?.price))
            return {
              ...pool,
              totalUsd,
            }
          })
        setFees(result)
      } catch (error) {
        console.log('fees error :>> ', error)
        setFees([])
      }
    }

    if (pairs.length > 0 && address) {
      fetchRewards()
    } else {
      setFees([])
    }
  }, [fastRefresh, address, pairs, baseAssets])

  return fees
}

const useClaimBribes = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const voterContract = useVoter()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleClaimBribes = useCallback(
    async (pool, veWOOF,) => {
      const key = uuidv4()

        if(pool.rewardsType == "Bribes"){

            const bribes = [pool.pairInfo_bribe],bribeTokens=[]
            const callsBribes = pool.rewards.map((reward) => {
                if (Number(reward.amount) > 0)
                    bribeTokens.push(reward.address)
            })

            const result = {}
            const bribesuuid = uuidv4()
            const feeuuid = uuidv4()
            if (bribeTokens.length > 0) {
                result[bribesuuid] = {
                    desc: `Claim Bribes`,
                    status: TransactionType.START,
                    hash: null,
                }
            }
            // if (feeTokens.length > 0) {
            //     result[feeuuid] = {
            //         desc: `Claim Fees`,
            //         status: TransactionType.START,
            //         hash: null,
            //     }
            // }
            dispatch(
                openTransaction({
                    key,
                    title: `Claim Bribes for ${pool.symbol}`,
                    transactions: result,
                }),
            )
            setPending(true)

            const bribeParams = [bribes, [bribeTokens], parseInt(veWOOF.id+"")]
            try {
                await sendContract(dispatch, key, bribesuuid, voterContract, 'claimBribes', bribeParams, address?address:'0x0000000000000000000000000000000000000000')
            } catch (err) {
                console.log('bribes claim error :>> ', err)
                setPending(false)
                return
            }
            dispatch(
                completeTransaction({
                    key,
                    final: 'Claimed Bribes',
                }),
            )
            setPending(false)
        }else if( pool.rewardsType == "Fees"){

            const bribes = [pool.pairInfo_fee],bribeTokens=[]
            const callsBribes = pool.rewards.map((reward) => {
                if (Number(reward.amount) > 0)
                    bribeTokens.push(reward.address)
            })

            const result = {}
            const bribesuuid = uuidv4()
            const feeuuid = uuidv4()
            if (bribeTokens.length > 0) {
                result[bribesuuid] = {
                    desc: `Claim Fees`,
                    status: TransactionType.START,
                    hash: null,
                }
            }
            // if (feeTokens.length > 0) {
            //     result[feeuuid] = {
            //         desc: `Claim Fees`,
            //         status: TransactionType.START,
            //         hash: null,
            //     }
            // }
            dispatch(
                openTransaction({
                    key,
                    title: `Claim  Fees for ${pool.symbol}`,
                    transactions: result,
                }),
            )
            setPending(true)

            const bribeParams1 = [bribes, [bribeTokens], parseInt(veWOOF.id+"")+"" ]
            try {
                await sendContract(dispatch, key, bribesuuid, voterContract, 'claimFees', bribeParams1, address?address:'0x0000000000000000000000000000000000000000')
            } catch (err) {
                console.log('bribes Bribes error :>> ', err)
                setPending(false)
                return
            }
            dispatch(
                completeTransaction({
                    key,
                    final: 'Claimed Bribes + Fees',
                }),
            )
            setPending(false)
        }

      //
      //   // fees claim
      // const callsFees = pool.rewards.map((reward) => {
      //   return {
      //     address: pool.pairInfo_fee,
      //     name: 'earned',
      //     params: [veWOOF.id, reward.address],
      //   }
      // })
      // // bribes claim
      // const callsBribes = pool.rewards.map((reward) => {
      //   return {
      //     address: pool.pairInfo_gauge,
      //     name: 'earned',
      //     params: [veWOOF.id, reward.address],
      //   }
      // })
      // const [resFees, resBribes] = await Promise.all([multicall(bribeAbi, callsFees), multicall(bribeAbi, callsBribes)])
      // const feeTokens = []
      // resFees.forEach((item, index) => {
      //   if (Number(item) > 0) feeTokens.push(pool.rewards[index].address)
      // })
      // const bribeTokens = []
      // resBribes.forEach((item, index) => {
      //   if (Number(item) > 0) bribeTokens.push(pool.rewards[index].address)
      // })
      // const result = {}
      // const bribesuuid = uuidv4()
      // const feeuuid = uuidv4()
      // if (bribeTokens.length > 0) {
      //   result[bribesuuid] = {
      //     desc: `Claim Bribes`,
      //     status: TransactionType.START,
      //     hash: null,
      //   }
      // }
      // if (feeTokens.length > 0) {
      //   result[feeuuid] = {
      //     desc: `Claim Fees`,
      //     status: TransactionType.START,
      //     hash: null,
      //   }
      // }
      // dispatch(
      //   openTransaction({
      //     key,
      //     title: `Claim Bribes + Fees for ${pool.symbol}`,
      //     transactions: result,
      //   }),
      // )
      // if (bribeTokens.length > 0) {
      //   const bribeContract = getBribeContract(web3, pool.pairInfo_gauge)
      //   const params = [veWOOF.id, bribeTokens]
      //   setPending(true)
      //   try {
      //     await sendContract(dispatch, key, bribesuuid, bribeContract, 'getReward', params, address)
      //   } catch (err) {
      //     console.log('bribes claim error :>> ', err)
      //     setPending(false)
      //     return
      //   }
      // }
      // if (feeTokens.length > 0) {
      //   const feeContract = getBribeContract(web3, pool.pairInfo_fee)
      //   const params = [veWOOF.id, feeTokens]
      //   console.log('feeTokens :>> ', feeTokens)
      //   setPending(true)
      //   try {
      //     await sendContract(dispatch, key, feeuuid, feeContract, 'getReward', params, address)
      //   } catch (err) {
      //     console.log('fees claim error :>> ', err)
      //     setPending(false)
      //     return
      //   }
      // }
      //
      // dispatch(
      //   completeTransaction({
      //     key,
      //     final: 'Claimed Bribes + Fees',
      //   }),
      // )
      // setPending(false)
    },
    [address, web3],
  )

  return { onClaimBribes: handleClaimBribes, pending }
}

const useClaimFees = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleClaimFees = useCallback(
    async (pool) => {
      const key = uuidv4()
      const harvestuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim fees for ${pool.symbol}`,
          transactions: {
            [harvestuuid]: {
              desc: `Claim fees`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )
      const pairContract = getPairContract(web3, pool.address)
      const params = []
      setPending(true)
      try {
        await sendContract(dispatch, key, harvestuuid, pairContract, 'claimFees', params, address?address:'0x0000000000000000000000000000000000000000')
      } catch (err) {
        console.log('fees claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed Fees',
        }),
      )
      setPending(false)
    },
    [address, web3],
  )

  return { onClaimFees: handleClaimFees, pending }
}

const useClaimRebase = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const veDistContract = useVeDist()

  const handleClaimRebase = useCallback(
    async (veWOOF) => {
      const key = uuidv4()
      const veClaimuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim rebase for veWOOF #${veWOOF.id+""}`,
          transactions: {
            [veClaimuuid]: {
              desc: `Claim rebase`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )
      const params = [veWOOF.id+""]
      setPending(true)
      try {
        await sendContract(dispatch, key, veClaimuuid, veDistContract, 'claim', params, address?address:'0x0000000000000000000000000000000000000000')
      } catch (err) {
        console.log('rebase claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed rebase',
        }),
      )
      setPending(false)
    },
    [address, veDistContract],
  )

  return { onClaimRebase: handleClaimRebase, pending }
}

const useClaimAll = () => {
    //all1111

  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const voterContract = useVoter()
    const veDistContract = useVeDist()
    const dispatch = useDispatch()
  const web3 = useWeb3()


  const handleClaimAll = useCallback(
    async (veRewards, veWOOF) => {

      const key = uuidv4()
      const bribesuuid = uuidv4()
      const feeuuid = uuidv4()
        const veuuid = uuidv4()
        const harvestuuid = uuidv4()

      dispatch(
        openTransaction({
          key,
          title: `Claim All Rewards for veWOOF #${veWOOF.id+""}`,
          transactions: {
            [bribesuuid]: {
              desc: `Claim bribes`,
              status: TransactionType.START,
              hash: null,
            },
            [feeuuid]: {
              desc: `Claim fees`,
              status: TransactionType.START,
              hash: null,
            },
            [veuuid]: {
              desc: `Claim rebase`,
              status: TransactionType.START,
              hash: null,
            },
              // [harvestuuid]: {
              //     desc: `Claimed Fees From Unstaked Position`,
              //     status: TransactionType.START,
              //     hash: null,
              // },
          },
        }),
      )

      setPending(true)
      // claim bribes
      const bribeRewards = veRewards.filter((item) => item.rewardsType == 'Bribes')
      if (bribeRewards.length > 0) {
        const bribes = bribeRewards.map((item) => item.pairInfo_bribe)
        const bribeTokens = bribeRewards.map((item) => {
          return item.rewards.map((token) => token.address)
        })
        const bribeParams = [bribes, bribeTokens, veWOOF.id+""]
        try {
          await sendContract(dispatch, key, bribesuuid, voterContract, 'claimBribes', bribeParams, address?address:'0x0000000000000000000000000000000000000000')
        } catch (err) {
          console.log('bribes claim error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: bribesuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      // claim fees
      const feeRewards = veRewards.filter((item) => item.rewardsType == 'Fees' )
      if (feeRewards.length > 0) {
        const fees = feeRewards.map((item) => item.pairInfo_fee)
        const feeTokens = feeRewards.map((item) => {
          return item.rewards.map((token) => token.address)
        })
        const feeParams = [fees, feeTokens, parseInt(veWOOF.id+"")+""]
        try {
          await sendContract(dispatch, key, feeuuid, voterContract, 'claimFees', feeParams, address?address:'0x0000000000000000000000000000000000000000')
        } catch (err) {
          console.log('fees claim error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: feeuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      // claim rebase
      if (veWOOF.rebase_amount.gt(0)) {
        const params = [veWOOF.id+""]
        try {
          await sendContract(dispatch, key, veuuid, veDistContract, 'claim', params, address?address:'0x0000000000000000000000000000000000000000')
        } catch (err) {
          console.log('rebase claim error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: veuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      //Fees From Unstaked Position
      //   const unstakedFees = veRewards.filter((item) => item.rewardsType == 'Unstaked Fees')
      //   if (unstakedFees.length > 0) {
      //
      //       const pairContract = getPairContract(web3, pool.address)
      //       const params = []
      //       setPending(true)
      //       try {
      //           await sendContract(dispatch, key, harvestuuid, pairContract, 'claimFees', params, address)
      //       } catch (err) {
      //           console.log('fees claim error :>> ', err)
      //           setPending(false)
      //           return
      //       }
      //   }else {
      //       dispatch(
      //           updateTransaction({
      //               key,
      //               uuid: harvestuuid,
      //               status: TransactionType.SUCCESS,
      //           }),
      //       )
      //   }



      dispatch(
        completeTransaction({
          key,
          final: 'Claimed All Rewards',
        }),
      )
      setPending(false)
    },
    [address, web3,voterContract,veDistContract],
  )

  return { onClaimAll: handleClaimAll, pending }
}

const useMintPIKA = () => {
    const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const pikaContract = usePIKAContract()
    const dispatch = useDispatch()
    const web3 = useWeb3()


    const handleMintPIKA = useCallback(
        async (mintNumber) => {

            const key = uuidv4()
            const approveuuid = uuidv4()
            const swapuuid = uuidv4()
            setPending(true)
            dispatch(
                openTransaction({
                    key,
                    title: `Mint PIKA`,
                    transactions: {
                        [approveuuid]: {
                            desc: `Approve DAMN`,
                            status: TransactionType.WAITING,
                            hash: null,
                        },
                        [swapuuid]: {
                            desc: `Mint ${formatAmount(parseFloat(mintNumber)*5)} PIKA `,
                            status: TransactionType.START,
                            hash: null,
                        },
                    },
                }),
            )

            let isApproved = true
            //if (fromAsset.address !== 'BONE') {

                try {
                    //
                    const tokenContract = getERC20Contract(web3, '0xeCe898EdCc0AF91430603175F945D8de75291c70')
                    const balance = await tokenContract.balanceOf(address);


                    const  pikaAddress = '0x0b4FD6288b6d32171CC515bfFC9340026F56A358';
                    const allowance = await getAllowance(tokenContract, pikaAddress, address)
                    if (fromWei(allowance, 18).lt(mintNumber)) {
                        isApproved = false
                        try {
                            await sendContract(dispatch, key, approveuuid, tokenContract, 'approve', [pikaAddress, balance], address)
                        } catch (err) {
                            console.log('approve 0 error :>> ', err)
                            setPending(false)
                            return
                        }
                    }
                }catch (e) {
                    console.log(e)
                    return ;
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

            const sendFromAmount = toWei(mintNumber, 18).toFixed(0)

            let params = [ sendFromAmount]

            try {
                let txObj =   await sendContract(dispatch, key, swapuuid, pikaContract, 'mint', params, address, '0')

            } catch (err) {
                console.log('mint error :>> ', err)
                setPending(false)
                return
            }

            dispatch(
                completeTransaction({
                    key,
                    final: 'Mint Successful',
                }),
            )
            setPending(false)
        },
        [address, web3,pikaContract],
    )

    return { onMintPIKA: handleMintPIKA, pending }
}

export { useGetVeRewards, useGetExpectedClaimForNextEpoch,useExpectedRewards,useUnstakedFeeRewards,useAllRewards, useGetFees, useClaimBribes, useClaimFees, useClaimRebase, useClaimAll,useMintPIKA }
