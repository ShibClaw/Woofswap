import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {NetworksData, TransactionType} from '../../../config/constants'
import { closeTransaction } from '../../../state/transactions/actions'
import Modal from '../Modal'
import Spinner from '../Spinner'
import { useNavigate } from 'react-router-dom'
import {BigNumber as EthersBigNumber} from "@ethersproject/bignumber/lib/bignumber";
import BigNumber from 'bignumber.js'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

const Transaction = () => {
  const { popup, title, transactions, final, link } = useSelector((state) => state.transactions)
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const { address, chainId, isConnected } = useWeb3ModalAccount()

  const setPopup = useCallback(
    (value) => {
      if (!value) {
        dispatch(closeTransaction())
      }
    },
    [dispatch],
  )

  const txns = useMemo(() => {
    return transactions ? Object.values(transactions) : []
  }, [transactions])


    return (
    <Modal isTransaction={true} width={540} popup={popup} setPopup={setPopup} title={final ? '' : title} disableOutside={true}>
      {final ? (
        <div className='w-full flex flex-col items-center justify-center sm:min-w-[450px] lg:max-w-[540px]'>
          <img alt='' className='my-8' src='/image/swap/big-checkmark.svg' />
          <div className='max-w-[266px] md:max-w-[330px] w-full flex flex-col items-center'>
            <p className='text-white text-[27px] f-f-fg text-center'>{final}</p>
            <p className='my-3 text-dimGray text-base md:text-[19px] leading-6 text-center'>Transaction has been confirmed by the blockchain.</p>
            { txns
              .filter((tx) => !!tx.hash)
              .map((tx, index) => (
                  <div key={`tx1-${index}`}>
                <p
                  className='mb-1 text-green text-sm md:text-base leading-6 cursor-pointer flex items-center underline underline-offset-4'
                  onClick={() => {

                    window.open(NetworksData[109].blockExplorerUrls[0] + `tx/${tx.hash}`, '_blank')
                  }}

                >
                  {tx.desc}
                  <img src='/image/icons/link.svg' className='ml-1 text-green' alt='link' />
                </p>

                </div>
              ))}
          </div>
          <button
            onClick={() => {
              if (link) {
                navigate(link)
              }
              setPopup(false)
            }}
            className={`w-full py-2 md:py-5 connect-wallet-btn text-grey text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-9 font-bold rounded-[3px]`}
          >
            {link ? 'CLOSE AND REDIRECT' : 'CLOSE'}
          </button>
        </div>
      ) : (
        <div className='bg-[#0D1238] px-6 py-[18px] rounded-[3px] mt-4 sm:min-w-[450px] lg:max-w-[540px]'>
          {txns.map((tx, index) => {
            return txns.length === index + 1 ? (
                <div key={`tx2-${index}`}>
                <div className='flex items-center justify-between'>
              <p className={`text-grey-1-0 text-sm md:text-base leading-5`}>{tx.desc}</p>
                  {tx.status === TransactionType.SUCCESS && <img alt='' src='/image/swap/success-mark.svg' />}
                  {tx.status === TransactionType.WAITING && <img alt='' src='/image/swap/pending-mark.svg' />}
                  {tx.status === TransactionType.PENDING && <Spinner />}
                  {tx.status === TransactionType.FAILED && <img alt='' src='/image/swap/failed-mark.svg' />}
              </div>



                </div>

            ) : (
                <div key={`tx3-${index}`}>
                  <div className='flex items-center justify-between pb-3 mb-3 border-b border-[#5E6282]'>
                  <p className={`text-grey-1-0 text-sm md:text-base leading-5`}>{tx.desc}</p>
                      {tx.status === TransactionType.SUCCESS && <img alt='' src='/image/swap/success-mark.svg' />}
                      {tx.status === TransactionType.WAITING && <img alt='' src='/image/swap/pending-mark.svg' />}
                      {tx.status === TransactionType.PENDING && <Spinner />}
                      {tx.status === TransactionType.FAILED && <img alt='' src='/image/swap/failed-mark.svg' />}
                  </div>




               </div>

            )
          })}



        </div>

      )}
    </Modal>
  )
}

export default Transaction
