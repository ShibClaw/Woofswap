import { isAddress } from '@ethersproject/address'
import { useMemo } from 'react'
import {
  getAlgebraContract,
  getDibsContract,
  getDibsLotteryContract,
  getERC20Contract,
  getFactoryContract,
  getGammaUNIProxyContract,
  getMinterContract,
  getMuonContract,
  getPairAPIContract,
  getQuoterContract,
  getRewardsAPIContract,
  getRewardsAPIV2Contract,
  getRouterContract,
  getRoyaltyContract,
  getStakingContract,
  getThenianContract,
  getV3VoterContract,
  getVeDistContract,
  getVeWOOFAPIContract,
  getVeWOOFContract,
  getVoterContract,
  getAbiContract,
  getQueryApirContract,
  getWhitelistContract,
  getUsdtContract,
  getVeWoofZeroContract,getDomainContract,
  getJaceContract,getTokenFactoryContract,getTokenContract,getTokenFactoryGdogContract,getNftContract
} from '../utils/contractHelpers'
import useWeb3 from './useWeb3'
import {queryApi} from "../config/abi";
import {
  getTokenFactoryAddress,
  getJaceAddress,
  getJaceAddressV2,
  getTokenFactoryAddressV2
} from "../utils/addressHelpers";

export const useERC20 = (address) => {
  const web3 = useWeb3()
  return useMemo(() => {
    if (!isAddress(address)) return null
    return getERC20Contract(address, web3)
  }, [address, web3])
}

export const useThenian = () => {
  const web3 = useWeb3()
  return useMemo(() => getThenianContract(web3), [web3])
}

export const useRouter = () => {
  const web3 = useWeb3()
  return useMemo(() => getRouterContract(web3), [web3])
}

export const useFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getFactoryContract(web3), [web3])
}

export const useVeWOOF = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeWOOFContract(web3), [web3])
}

export const useVeDist = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeDistContract(web3), [web3])
}

export const useVoter = () => {
  const web3 = useWeb3()
  return useMemo(() => getVoterContract(web3), [web3])
}

export const useMinter = () => {
  const web3 = useWeb3()
  return useMemo(() => getMinterContract(web3), [web3])
}

export const usePairAPI = () => {
  const web3 = useWeb3()
  return useMemo(() => getPairAPIContract(web3), [web3])
}

export const useVeWOOFAPI = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeWOOFAPIContract(web3), [web3])
}

export const useRewardsApi = () => {
  const web3 = useWeb3()
  return useMemo(() => getRewardsAPIContract(web3), [web3])
}

export const useRewardApiV2 = () => {
  const web3 = useWeb3()
  return useMemo(() => getRewardsAPIV2Contract(web3), [web3])
}

export const useStaking = () => {
  const web3 = useWeb3()
  return useMemo(() => getStakingContract(web3), [web3])
}

export const useRoyalty = () => {
  const web3 = useWeb3()
  return useMemo(() => getRoyaltyContract(web3), [web3])
}

export const useDibs = () => {
  const web3 = useWeb3()
  return useMemo(() => getDibsContract(web3), [web3])
}

export const useDibsLottery = () => {
  const web3 = useWeb3()
  return useMemo(() => getDibsLotteryContract(web3), [web3])
}

export const useMuon = () => {
  const web3 = useWeb3()
  return useMemo(() => getMuonContract(web3), [web3])
}

export const useQuoter = () => {
  const web3 = useWeb3()
  return useMemo(() => getQuoterContract(web3), [web3])
}

export const useGammaUNIProxy = () => {
  const web3 = useWeb3()
  return useMemo(() => getGammaUNIProxyContract(web3), [web3])
}

export const useAlgebra = () => {
  const web3 = useWeb3()
  return useMemo(() => getAlgebraContract(web3), [web3])
}

export const useV3Voter = () => {
  const web3 = useWeb3()
  return useMemo(() => getV3VoterContract(web3), [web3])
}
export const useQueryApi = () => {
  const web3 = useWeb3()
  return useMemo(() => getQueryApirContract(web3), [web3])
}


export const useVeWoofZeroContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeWoofZeroContract(web3), [web3])
}

export const useWhitelistContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getWhitelistContract(web3), [web3])
}

export const useUsdtContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getUsdtContract(web3), [web3])
}

export const usePIKAContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getERC20Contract(web3,"0x0b4FD6288b6d32171CC515bfFC9340026F56A358"), [web3])
}

export const useDAMNContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getERC20Contract(web3,"0xeCe898EdCc0AF91430603175F945D8de75291c70"), [web3])
}


export const useDomainContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getDomainContract(web3,"0xC3ad7bD7e434F4C1C023EbC6fe0AC4705e9518bC"), [web3])
}

export const useJaceFunContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getJaceContract(web3,getJaceAddress()), [web3])
}

export const useTokenFactoryContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getTokenFactoryContract(web3,getTokenFactoryAddress()), [web3])
}

export const useTokenFactoryGdogContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getTokenFactoryGdogContract(web3,getTokenFactoryAddress()), [web3])
}

export const useJaceFunContractV2 = () => {
  const web3 = useWeb3()
  return useMemo(() => getJaceContract(web3,getJaceAddressV2()), [web3])
}

export const useTokenFactoryContractV2 = () => {
  const web3 = useWeb3()
  return useMemo(() => getTokenFactoryContract(web3,getTokenFactoryAddressV2()), [web3])
}


// export const useTokenContract = () => {
//   const web3 = useWeb3()
//   return useMemo(() => getTokenContract(web3,"0x648aF9a39ce28c094721E24d173DC8070d6793a8"), [web3])
// }

// export const useNftContract = () => {
//   const web3 = useWeb3()
//   return useMemo(() => getNftContract(web3,"0xC3ad7bD7e434F4C1C023EbC6fe0AC4705e9518bC"), [web3])
// }


export const useAbiContract = (address,abi) => {
  const web3 = useWeb3()
  return useMemo(() => getAbiContract(web3,address,abi), [web3])
}

