// // import gql from 'graphql-tag'
//
// export const TOTAL_VOLUME_DATA = (block) => {
//   const queryString = `query factories {
//         factories(
//          ${block ? `block: { number: ${block}}` : `first: 1`}) {
//           totalVolumeUSD
//         }
//       }`
//   return gql(queryString)
// }
//
// export const ACCUMULATIVE_TOKEN_BALANCES = (user) => {
//   const queryString = `query accumulativeTokenBalances {
//     accumulativeTokenBalances(where: {user: "${user}"}) {
//       id
//       user
//       token
//       amount
//     }
//   }`
//   return gql(queryString)
// }
//
// export const USER_TICKETS = (user, round) => {
//   const queryString = `query UserLotteriesQuery {
//     userLotteries(where: {user: "${user}", round: ${round}}) {
//       id
//       user
//       round
//       tickets
//     }
//   }`
//   return gql(queryString)
// }
//
// export const TOTAL_TICKETS = (round) => {
//   const queryString = `query TotalTicketsQuery {
//     lotteries(where: {round: ${round}}) {
//       id
//       totalTikets
//     }
//   }`
//   return gql(queryString)
// }
//
// export const LeaderboardData = (begin, end, skip) => {
//   const queryString = `query LeaderboardDataQuery {
//     accumulativeGeneratedVolumes(first: 100, skip: ${skip}, where: {amountAsReferrer_gt: 0, lastUpdate_gte: ${begin}, lastUpdate_lt: ${end}} orderBy: lastUpdate, orderDirection: desc) {
//       user
//       amountAsReferrer
//     }
//   }`
//   return gql(queryString)
// }
//
// export const WeeklyData = (epoch, skip) => {
//   const queryString = `query WeeklyDataQuery {
//     weeklyGeneratedVolumes(first: 100, skip: ${skip},  where: {epoch: ${epoch}, amountAsReferrer_gt: 0} orderBy: amountAsReferrer orderDirection: desc) {
//       user
//       amountAsReferrer
//     }
//   }`
//   return gql(queryString)
// }
//
// export const DailyData = (day, skip) => {
//   const queryString = `query DailyDataQuery {
//     dailyGeneratedVolumes(first: 100, skip: ${skip},  where: {day: ${day}, amountAsReferrer_gt: 0} orderBy: amountAsReferrer orderDirection: desc) {
//       user
//       amountAsReferrer
//     }
//   }`
//   return gql(queryString)
// }
//
// export const FETCH_POOL_FROM_TOKENS = () => gql`
//   query fetchPoolFromTokens($token0: String, $token1: String) {
//     pools0: pools(where: { token0: $token0, token1: $token1 }) {
//       id
//       fee
//       token0 {
//         id
//         decimals
//         symbol
//       }
//       token1 {
//         id
//         decimals
//         symbol
//       }
//       sqrtPrice
//       liquidity
//       tick
//       feesUSD
//       untrackedFeesUSD
//     }
//     pools1: pools(where: { token0: $token1, token1: $token0 }) {
//       id
//       fee
//       token0 {
//         id
//         decimals
//         symbol
//       }
//       token1 {
//         id
//         decimals
//         symbol
//       }
//       sqrtPrice
//       liquidity
//       tick
//       feesUSD
//       untrackedFeesUSD
//     }
//   }
// `
//
// export const FETCH_ETERNAL_FARM_FROM_POOL = (pools) => {
//   let poolString = `[`
//   pools.map((address) => {
//     return (poolString += `"${address}",`)
//   })
//   poolString += ']'
//   const queryString = `
//       query eternalFarmingsFromPools {
//         eternalFarmings(where: {pool_in: ${poolString}, isDetached: false}) {
//           id
//           rewardToken
//           bonusRewardToken
//           pool
//           startTime
//           endTime
//           reward
//           bonusReward
//           rewardRate
//           bonusRewardRate
//           isDetached
//           minRangeLength
//         }
//       }
//       `
//   return gql(queryString)
// }
//
// export const TRANSFERED_POSITIONS = (tierFarming) => gql`
//     query transferedPositions ($account: Bytes) {
//         deposits (orderBy: id, orderDirection: desc, where: {owner: $account}) {
//             id
//             owner
//             pool
//             L2tokenId
//             limitFarming
//             eternalFarming
//             onFarmingCenter
//             rangeLength
//             ${
//               tierFarming
//                 ? `
//               enteredInEternalFarming
//               tokensLockedEternal
//               tokensLockedLimit
//               tierLimit
//               tierEternal`
//                 : ''
//             }
//     }
// }
// `
