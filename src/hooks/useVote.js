import { useState, useCallback } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useDispatch } from 'react-redux'
import { completeTransaction, openTransaction } from '../state/transactions/actions'
import { TransactionType } from '../config/constants'
import { v4 as uuidv4 } from 'uuid'
import { sendContract } from '../utils/api'
import useWeb3 from './useWeb3'
import { useV3Voter } from './useContract'

const useVote = () => {
  const [pending, setPending] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const voterContract = useV3Voter()

  const handleVote = useCallback(
    async (id, votes) => {
      const key = uuidv4()
      const voteuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Cast vote using Token #${id}`,
          transactions: {
            [voteuuid]: {
              desc: `Cast votes`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      for (let i = 0; i < Object.keys(votes).length; i++) {
        const key = Object.keys(votes)[i]
        if (isNaN(Number(votes[key])) || Number(votes[key]) === 0) {
          delete votes[key]
        }
      }
      const tokens = Object.keys(votes)
      const voteCounts = Object.values(votes)

      setPending(true)
      const params = [Number(id), tokens, voteCounts]
      try {
        await sendContract(dispatch, key, voteuuid, voterContract, 'vote', params, address)
      } catch (err) {
        console.log('vote error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'You have voted!',
        }),
      )
      setPending(false)
    },
    [address, web3, voterContract],
  )

  return { onVote: handleVote, pending }
}

export { useVote }
