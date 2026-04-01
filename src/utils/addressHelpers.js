import { defaultChainId } from '../config/constants'
import addresses from '../config/constants/contracts'
import { GAMMA_UNIPROXY_ADDRESSES, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, QUOTER_ADDRESSES } from '../config/constants/v3/addresses'

export const getAddress = (address) => {


  const cid = isNaN(window.currChainId) ? defaultChainId:window.currChainId

  //console.log("getAddress:" + address[cid])
  return address[cid]
}

export const getMultiCallAddress = () => {
  return getAddress(addresses.multiCall)
}

export const getWoofAddress = () => {
  return getAddress(addresses.WOOF)
}

export const getWBONE_WoofAddress = () => {
  return getAddress(addresses.WBONE_WOOF)
}

export const getWBONE_ShibAddress = () => {
  return getAddress(addresses.WBONE_SHIB)
}

export const getETHAddress = () => {
  return getAddress(addresses.ETH)
}

export const getThenianAddress = () => {
  return getAddress(addresses.thenian)
}

export const getRouterAddress = () => {
  return getAddress(addresses.router)
}

export const getFactoryAddress = () => {
  return getAddress(addresses.factory)
}

export const getVeWOOFAddress = () => {
  return getAddress(addresses.veWOOF)
}

export const getVeDistAddress = () => {
  return getAddress(addresses.veDist)
}

export const getVoterAddress = () => {
  return getAddress(addresses.voter)
}

export const getMinterAddress = () => {
  return getAddress(addresses.minter)
}

export const getPairAPIAddress = () => {
  return getAddress(addresses.pairAPI)
}

export const getRewardsAPIAddress = () => {
  return getAddress(addresses.rewardsAPI)
}

export const getRewardsAPIV2Address = () => {
  return getAddress(addresses.rewardsAPIV2)
}

export const getVeWOOFAPIAddress = () => {
  return getAddress(addresses.veWOOFAPI)
}
export const getQueryApiAddress = () => {
  return getAddress(addresses.queryAPI)
}

export const getPairV3APIAddress = () => {
  return getAddress(addresses.pairV3API)
}

export const getRewardsV3APIAddress = () => {
  return getAddress(addresses.rewardsV3API)
}

export const getVeWOOFV3APIAddress = () => {
  return getAddress(addresses.veWOOFV3API)
}

export const getStakingAddress = () => {
  return getAddress(addresses.staking)
}

export const getRoyaltyAddress = () => {
  return getAddress(addresses.royalty)
}

export const getDibsAddress = () => {
  return getAddress(addresses.dibs)
}

export const getDibsLotteryAddress = () => {
  return getAddress(addresses.dibsLottery)
}

export const getMuonAddress = () => {
  return getAddress(addresses.muon)
}

export const getQuoterAddress = () => {
  return getAddress(QUOTER_ADDRESSES)
}

export const getGammaUNIProxyAddress = () => {
  return getAddress(GAMMA_UNIPROXY_ADDRESSES)
}

export const getAlgebraAddress = () => {
  return getAddress(NONFUNGIBLE_POSITION_MANAGER_ADDRESSES)
}

export const getV3VoterAddress = () => {
  return getAddress(addresses.v3voter)
}

export const getVeWoofZeroAddress = () => {
  return getAddress(addresses.VeWoofZero)
}

export const getUsdtAddress = () => {
  return getAddress(addresses.USDT)
}

export const getWhitelistAddress = () => {
  return getAddress(addresses.Whitelist)
}


export const getJaceAddress = () => {
  return getAddress(addresses.Jace)
}

export const getTokenFactoryAddress = () => {
  return getAddress(addresses.TokenFactory)
}

export const getJaceAddressV2 = () => {
  return getAddress(addresses.JaceV2)
}

export const getTokenFactoryAddressV2 = () => {
  return getAddress(addresses.TokenFactoryV2)
}
