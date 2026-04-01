import BigNumber from 'bignumber.js'
import { useContext, useMemo, useState, useEffect } from 'react'
import { BaseAssetsConetext } from '../context/BaseAssetsConetext'
import { PairsContext } from '../context/PairsContext'
import { getWoofAddress } from '../utils/addressHelpers'
import { fromWei } from '../utils/formatNumber'
import { useMinter, useV3Voter } from './useContract'
import useRefresh from './useRefresh'
// import { TOTAL_VOLUME_DATA } from '../apollo/queries'
// import client from '../apollo/client'
import useWeb3 from './useWeb3'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

const useWOOFAsset = () => {
  const baseAssets = useContext(BaseAssetsConetext)
  const theAsset = useMemo(() => {
    return baseAssets.length > 0 ? baseAssets.find((item) => item.address.toLowerCase() === getWoofAddress().toLowerCase()) : null
  }, [baseAssets])

  return theAsset
}

const useTVL = () => {
  const { pairs } = useContext(PairsContext)

  return useMemo(() => {
    return pairs.reduce((sum, current) => {
      return sum.plus(current.tvl)
    }, new BigNumber(0))
  }, [pairs])
}

const useVoteEmissions = () => {
  const [voteEmssions, setVoteEmissions] = useState(null)
  const [lpEmission, setLpEmission] = useState(new BigNumber(0))
  const voterContract = useV3Voter()
  const minterContract = useMinter()
  const theAsset = useWOOFAsset()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchSupply = async () => {
      const [totalWeight, weekly_emission] = await Promise.all([voterContract.totalWeight(), minterContract.weekly_emission()])
      const lpEmissionRes = fromWei(weekly_emission).times(0.675)
      setLpEmission(lpEmissionRes)
      setVoteEmissions(Number(totalWeight) > 0 ? lpEmissionRes.times(theAsset.price).div(100) : new BigNumber(0))
    }
    if (voterContract && minterContract && theAsset) {
      fetchSupply()
    }
  }, [voterContract, minterContract, theAsset, fastRefresh])
  return { voteEmssions, lpEmission }
}

const useEpochTimer = () => {
  const [epochInfo, setEpochInfo] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    epoch: 0,
  })
  const { fastRefresh } = useRefresh()

  const { address, chainId, isConnected } = useWeb3ModalAccount()

  useEffect(() => {
    const curTime = new Date().getTime() / 1000
    const epoch1 = chainId == 2420? 1684972800 : 1693440000
    const epoch = Math.floor((curTime - epoch1) / 604800) + 1
    const nextEpoch = Math.ceil(curTime / (86400 * 7)) * (86400 * 7)
    const days = Math.floor((nextEpoch - curTime) / 86400)
    const hours = Math.floor((nextEpoch - curTime - days * 86400) / 3600)
    const mins = Math.floor((nextEpoch - curTime - days * 86400 - hours * 3600) / 60)
    setEpochInfo({
      days,
      hours: hours < 10 ?  hours : hours,
      mins: mins < 10 ?  mins : mins,
      epoch,
    })
  }, [fastRefresh,chainId])

  return epochInfo
}

const useOneDayVolume = () => {
  const [oneDayVolume, setOneDayVolume] = useState(0)
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchVolume = async () => {
      const curblockNumber = await web3.provider.getBlockNumber()
      const last = curblockNumber - 28800

      const [result, oneDayResult] = await Promise.all([
        client.query({
          query: TOTAL_VOLUME_DATA(),
          fetchPolicy: 'cache-first',
        }),
        client.query({
          query: TOTAL_VOLUME_DATA(last),
          fetchPolicy: 'cache-first',
        }),
      ])

      if (result?.data?.factories[0]?.totalVolumeUSD && oneDayResult?.data?.factories[0]?.totalVolumeUSD) {
        setOneDayVolume(Number(result?.data?.factories[0]?.totalVolumeUSD) - Number(oneDayResult?.data?.factories[0]?.totalVolumeUSD))
      }
    }
    fetchVolume()
  }, [fastRefresh, web3])

  return oneDayVolume
}

export { useWOOFAsset, useTVL, useVoteEmissions, useEpochTimer, useOneDayVolume }
