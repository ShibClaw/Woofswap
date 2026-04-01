import BigNumber from 'bignumber.js'
import { getVeWOOFV3APIContract } from './contractHelpers'
import { fromWei } from './formatNumber'

export const fetchUserVeWOOFs = async (web3, account) => {
  const veWOOFAPIContract = getVeWOOFV3APIContract(web3)
  const veWOOFInfos = await veWOOFAPIContract.getNFTFromAddress(account)
  return veWOOFInfos.map((veWOOF) => {
    const lockedEnd = Number(veWOOF[7])
    const diff = Math.ceil((lockedEnd - new Date().getTime() / 1000) / 86400)
    const totalVotes = veWOOF[9].reduce((sum, current) => {
      return sum.plus(current[1])
    }, new BigNumber(0))

    const votedWeek = Math.floor(Number(veWOOF[8]) / (86400 * 7))
    const currentWeek = Math.floor(new Date().getTime() / (86400 * 7 * 1000))
    const votedCurrentEpoch = votedWeek === currentWeek && veWOOF[1]

    return {
      decimals: Number(veWOOF[0]),
      voted: veWOOF[1],
      votedCurrentEpoch,
      attachments: veWOOF[2],
      id: Number(veWOOF[3]),
      amount: fromWei(veWOOF[4]),
      voting_amount: fromWei(veWOOF[5]),
      rebase_amount: fromWei(veWOOF[6]),
      lockEnd: lockedEnd,
      vote_ts: veWOOF[8],
      votes: veWOOF[9].map((item) => {
        return {
          address: item[0],
          weight: fromWei(item[1]),
          weightPercent: totalVotes.isZero() ? new BigNumber(0) : new BigNumber(item[1]).div(totalVotes).times(100),
        }
      }),
      diffDates: diff > 0 ? 'Expires in ' + diff + ' days' : 'Expired ' + diff * -1 + ' days ago',
    }
  })
}
