import { useEffect, useState, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import { TransactionType } from '../config/constants'
import { v4 as uuidv4 } from 'uuid'
import { fromWei } from '../utils/formatNumber'
import { getFloorPrice, sendContract } from '../utils/api'
import useWeb3 from './useWeb3'
import { useRoyalty, useStaking, useThenian } from './useContract'
import { getThenianContract } from '../utils/contractHelpers'
import { getStakingAddress } from '../utils/addressHelpers'
import useRefresh from './useRefresh'

const useTheNftInfo = () => {
  const [walletIds, setWalletIds] = useState([])
  const [stakedIds, setStakedIds] = useState([])
  const [pendingReward, setPendingReward] = useState(new BigNumber(0))
  const [rewardPerSecond, setRewardPerSecond] = useState(new BigNumber(0))
  const [claimable, setClaimable] = useState(new BigNumber(0))
  const [isOriginal, setIsOriginal] = useState(false)
  const [totalStaked, setTotalStaked] = useState(0)
  const [floorPrice, setFloorPrice] = useState(0)
  const theNftContract = useThenian()
  const stakingContract = useStaking()
  const royaltyContract = useRoyalty()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const [res0, res1, res2, res3, res4] = await Promise.all([
        theNftContract.tokensOfOwner(address),
        stakingContract.stakedTokenIds(address),
        stakingContract.pendingReward(address),
        royaltyContract.claimable(address),
        theNftContract.originalMinters(address),
      ])
      setWalletIds(res0)
      setStakedIds(res1)
      setPendingReward(fromWei(res2))
      setClaimable(fromWei(res3))
      setIsOriginal(Number(res4) > 0)
    }
    const fetchTotalInfo = async () => {
      const [res0, res1, res2] = await Promise.all([
        theNftContract.balanceOf(getStakingAddress()),
        stakingContract.rewardPerSecond(),
        getFloorPrice(),
      ])
      setTotalStaked(res0)
      setRewardPerSecond(fromWei(res1))
      setFloorPrice(res2.floor_price)
    }

    fetchTotalInfo()
    if (address) {
      fetchAccountInfo()
    } else {
      setWalletIds([])
      setStakedIds([])
      setPendingReward(new BigNumber(0))
    }
  }, [theNftContract, stakingContract, royaltyContract, address, fastRefresh])

  return { walletIds, stakedIds, pendingReward, rewardPerSecond, totalStaked, floorPrice, claimable, isOriginal }
}

const useStakeNft = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const stakingContract = useStaking()

  const handleStake = useCallback(
    async (ids) => {
      const key = uuidv4()
      const approveuuid = uuidv4()
      const voteuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Stake ${ids.length} theNFT`,
          transactions: {
            [approveuuid]: {
              desc: `Approve theNFT`,
              status: TransactionType.START,
              hash: null,
            },
            [voteuuid]: {
              desc: `Stake your theNFTs`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      const theNFTContract = getThenianContract(web3)
      const isApproved = await theNFTContract.isApprovedForAll(address, getStakingAddress())
      if (!isApproved) {
        try {
          await sendContract(dispatch, key, approveuuid, theNFTContract, 'setApprovalForAll', [getStakingAddress(), true], address)
        } catch (err) {
          console.log('approve error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: approveuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }
      const params = [ids]
      try {
        await sendContract(dispatch, key, voteuuid, stakingContract, 'deposit', params, address)
      } catch (err) {
        console.log('deposit error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Stake Successful',
        }),
      )
      setPending(false)
    },
    [address, web3, stakingContract],
  )

  return { onStake: handleStake, pending }
}

const useUnstakeNft = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const stakingContract = useStaking()

  const handleUnstake = useCallback(
    async (ids) => {
      const key = uuidv4()
      const unstakeuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Unstake ${ids.length} theNFT`,
          transactions: {
            [unstakeuuid]: {
              desc: `Unstake your theNFTs`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      const params = [ids]
      try {
        await sendContract(dispatch, key, unstakeuuid, stakingContract, 'withdraw', params, address)
      } catch (err) {
        console.log('unstake error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Unstake Successful',
        }),
      )
      setPending(false)
    },
    [address, web3, stakingContract],
  )

  return { onUnstake: handleUnstake, pending }
}

const useHarvest = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const stakingContract = useStaking()

  const handleHarvest = useCallback(async () => {
    const key = uuidv4()
    const harvestuuid = uuidv4()
    dispatch(
      openTransaction({
        key,
        title: `Claim Fees`,
        transactions: {
          [harvestuuid]: {
            desc: `Claim Fees`,
            status: TransactionType.START,
            hash: null,
          },
        },
      }),
    )

    setPending(true)
    try {
      await sendContract(dispatch, key, harvestuuid, stakingContract, 'harvest', [], address)
    } catch (err) {
      console.log('harvest error :>> ', err)
      setPending(false)
      return
    }

    dispatch(
      completeTransaction({
        key,
        final: 'Claim Successful',
      }),
    )
    setPending(false)
  }, [address, web3, stakingContract])

  return { onHarvest: handleHarvest, pending }
}

const useRoyaltyClaim = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const royaltyContract = useRoyalty()

  const handleClaim = useCallback(async () => {
    const key = uuidv4()
    const claimuuid = uuidv4()
    dispatch(
      openTransaction({
        key,
        title: `Claim Royalty Fees`,
        transactions: {
          [claimuuid]: {
            desc: `Claim Royalty Fees`,
            status: TransactionType.START,
            hash: null,
          },
        },
      }),
    )

    setPending(true)
    try {
      await sendContract(dispatch, key, claimuuid, royaltyContract, 'claim', [address], address)
    } catch (err) {
      console.log('claim error :>> ', err)
      setPending(false)
      return
    }

    dispatch(
      completeTransaction({
        key,
        final: 'Claim Successful',
      }),
    )
    setPending(false)
  }, [address, web3, royaltyContract])

  return { onClaim: handleClaim, pending }
}

export { useTheNftInfo, useStakeNft, useUnstakeNft, useHarvest, useRoyaltyClaim }
