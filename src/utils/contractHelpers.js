// import web3NoAccount from './web3'
import domainContractABI from '../config/abi/domainContractABI.json'
import jaceFunABI from '../config/abi/jaceFunABI.json'
import tokenFactoryABI from '../config/abi/tokenFactoryABI.json'
import tokenFactoryGdogABI from '../config/abi/tokenFactoryGdogABI.json'
import tokenABI from '../config/abi/tokenABI.json'
import nftABI from '../config/abi/nftABI.json'
import {
  getAlgebraAddress,
  getDibsAddress,
  getDibsLotteryAddress,
  getFactoryAddress,
  getGammaUNIProxyAddress,
  getMinterAddress,
  getMultiCallAddress,
  getMuonAddress,
  getPairAPIAddress,
  getPairV3APIAddress,
  getQuoterAddress,
  getRewardsAPIAddress,
  getRewardsAPIV2Address,
  getRewardsV3APIAddress,
  getRouterAddress,
  getRoyaltyAddress,
  getStakingAddress,
  getThenianAddress,
  getV3VoterAddress,
  getVeDistAddress,
  getVeWOOFAddress,
  getVeWOOFAPIAddress,
  getVeWOOFV3APIAddress,
  getVoterAddress,
  getWBONE_WoofAddress,
  getQueryApiAddress,
  getVeWoofZeroAddress,
  getUsdtAddress,
  getWhitelistAddress
} from './addressHelpers'
import {
  ERC20Abi,
  factoryAbi,
  gaugeAbi,
  multiCallAbi,
  pairAPIAbi,
  routerAbi,
  ThenianAbi,
  veDistAbi,
  veWOOFAbi,
  veWOOFAPIAbi,
  voterAbi,
  bribeAbi,
  minterAbi,
  pairAbi,
  stakingAbi,
  royaltyAbi,
  rewardAPIAbi,
  rewardAPIAbiV2,
  dibsAbi,
  muonAbi,
  wethAbi,
  dibsLotteryAbi,
  pairV3APIAbi,
  veWoofV3ApiAbi,
  rewardsV3APIAbi,
  v3voterAbi,
  queryApi,
  woofZeroAbi,
  whitelistAbi,
  pairSwapAPIAbi
} from '../config/abi'
import { algebraAbi, gammaHypervisorAbi, gammaUniProxyAbi, quoterAbi } from '../config/abi/v3'
import {getRpcUrl} from "../config/constants";
import Web3 from "web3";
import { BrowserProvider, Contract, formatUnits,ZeroAddress,getAddress } from 'ethers'
import { ethers } from "ethers";

export const readOnlyProvider = {
      109:   new ethers.JsonRpcProvider(
          'https://rpc.shibarium.shib.io'
      ),
      2420:   new ethers.JsonRpcProvider(
          'https://rufus.calderachain.xyz/http'
      ),
      86:   new ethers.JsonRpcProvider(
          'https://evm.nodeinfo.cc'
      ),
      10088:   new ethers.JsonRpcProvider(
          'https://gatelayer-mainnet.gatenode.cc'
      ),
      196:   new ethers.JsonRpcProvider(
          'https://rpc.xlayer.tech'
      ),
      177:   new ethers.JsonRpcProvider(
          'https://mainnet.hsk.xyz'
      ),
      860621:   new ethers.JsonRpcProvider(
          'https://pgpnode.pgachain.org'
      ),

    }
    ;
const getContract = (abi, address, web3) => {
  // const RPC_URL = getRpcUrl()
  // const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })
  // const web3NoAccount = new Web3(httpProvider)
  //
  // const _web3 = web3 ?? web3NoAccount
  // return new _web3.eth.Contract(abi, address)

  if(web3 == null){
    return new ethers.Contract(
        address,
        abi,
        readOnlyProvider[window.currChainId?window.currChainId:10088]
    );

  }else
  return new ethers.Contract(
      address,
      abi,
      web3
  );

}

export const getERC20Contract = (web3, address) => {
  return getContract(ERC20Abi, address, web3)
}

export const getWETHContract = (web3,wboneAddress) => {
  return getContract(wethAbi,wboneAddress, web3)
}

export const getMulticallContract = (web3) => {
  return getContract(multiCallAbi, getMultiCallAddress(), web3)
}

export const getThenianContract = (web3) => {
  return getContract(ThenianAbi, getThenianAddress(), web3)
}

export const getRouterContract = (web3) => {
  return getContract(routerAbi, getRouterAddress(), web3)
}

export const getFactoryContract = (web3) => {
  return getContract(factoryAbi, getFactoryAddress(), web3)
}

export const getVeWOOFContract = (web3) => {
  return getContract(veWOOFAbi, getVeWOOFAddress(), web3)
}

export const getVeDistContract = (web3) => {
  return getContract(veDistAbi, getVeDistAddress(), web3)
}

export const getVoterContract = (web3) => {
  return getContract(voterAbi, getVoterAddress(), web3)
}

export const getMinterContract = (web3) => {
  return getContract(minterAbi, getMinterAddress(), web3)
}

export const getPairAPIContract = (web3) => {
  return getContract(pairAPIAbi, getPairAPIAddress(), web3)
}
export const getPairSwapAPIContract = (web3) => {
  return getContract(pairSwapAPIAbi, getPairAPIAddress(), web3)
}

export const getVeWOOFAPIContract = (web3) => {
  return getContract(veWOOFAPIAbi, getVeWOOFAPIAddress(), web3)
}

export const getRewardsAPIContract = (web3) => {
  return getContract(rewardAPIAbi, getRewardsAPIAddress(), web3)
}
export const getRewardsAPIV2Contract = (web3) => {
  return getContract(rewardAPIAbiV2, getRewardsAPIV2Address(), web3)
}

export const getPairV3APIContract = (web3) => {
  return getContract(pairV3APIAbi, getPairV3APIAddress(), web3)
}

export const getVeWOOFV3APIContract = (web3) => {
  return getContract(veWoofV3ApiAbi, getVeWOOFV3APIAddress(), web3)
}

export const getRewardsV3APIContract = (web3) => {
  return getContract(rewardsV3APIAbi, getRewardsV3APIAddress(), web3)
}

export const getGaugeContract = (web3, address) => {
  return getContract(gaugeAbi, address, web3)
}

export const getBribeContract = (web3, address) => {
  return getContract(bribeAbi, address, web3)
}

export const getPairContract = (web3, address) => {
  return getContract(pairAbi, address, web3)
}

export const getStakingContract = (web3) => {
  return getContract(stakingAbi, getStakingAddress(), web3)
}

export const getRoyaltyContract = (web3) => {
  return getContract(royaltyAbi, getRoyaltyAddress(), web3)
}

export const getDibsContract = (web3) => {
  return getContract(dibsAbi, getDibsAddress(), web3)
}

export const getDibsLotteryContract = (web3) => {
  return getContract(dibsLotteryAbi, getDibsLotteryAddress(), web3)
}

export const getMuonContract = (web3) => {
  return getContract(muonAbi, getMuonAddress(), web3)
}

export const getQuoterContract = (web3) => {
  return getContract(quoterAbi, getQuoterAddress(), web3)
}

export const getGammaUNIProxyContract = (web3) => {
  return getContract(gammaUniProxyAbi, getGammaUNIProxyAddress(), web3)
}

export const getGammaHyperVisorContract = (web3, address) => {
  //mychange
  //return getContract(gammaHypervisorAbi, address, web3)
  return null;
}

export const getAlgebraContract = (web3) => {
  return getContract(algebraAbi, getAlgebraAddress(), web3)
}

export const getV3VoterContract = (web3) => {
  return getContract(v3voterAbi, getV3VoterAddress(), web3)
}
export const getQueryApirContract = (web3) => {
  return getContract(queryApi, getQueryApiAddress(), web3)
}

export const getVeWoofZeroContract = (web3) => {
  return getContract(woofZeroAbi, getVeWoofZeroAddress(), web3)
}

export const getUsdtContract = (web3) => {
  return getContract(ERC20Abi, getUsdtAddress(), web3)
}

export const getWhitelistContract = (web3) => {
  return getContract(whitelistAbi, getWhitelistAddress(), web3)
}

export const getAbiContract = (web3,address,abi) => {
  return getContract(abi, address, web3)
}


export const getDomainContract = (web3, address) => {
  return getContract(domainContractABI, address, web3)
}

export const getJaceContract = (web3, address) => {
  return getContract(jaceFunABI, address, web3)
}

export const getTokenFactoryContract = (web3, address) => {
  return getContract(tokenFactoryABI, address, web3)
}

export const getTokenFactoryGdogContract = (web3, address) => {
  return getContract(tokenFactoryGdogABI, address, web3)
}

export const getTokenContract = (web3, address) => {
  return getContract(tokenABI, address, web3)
}

export const getNftContract = (web3, address) => {
  return getContract(nftABI, address, web3)
}

export const getJsonRpcContract = (address,abi) => {
  return getContract(abi, address, null)
}
