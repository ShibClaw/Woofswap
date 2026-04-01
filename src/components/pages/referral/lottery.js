import React, { useMemo } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useDibsLotteryData, useDibsLotteryUserData } from '../../../hooks/useReferral'
import { LotteryStatus } from '../../../config/constants'
import Timer from '../../common/Timer'
import { formatAmount } from '../../../utils/formatNumber'
import { useEpochTimer } from '../../../hooks/useGeneral'

const Lottery = () => {
  const { totalTickets, lastWinners } = useDibsLotteryData()
  const { userLotteryStatus, userLotteryTickets } = useDibsLotteryUserData()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { days, hours, mins } = useEpochTimer()

  const wonLottery = useMemo(() => userLotteryStatus === LotteryStatus.WON, [userLotteryStatus])
  const totalInfo = useMemo(() => {
    return [
      {
        title: 'Weekly Rewards in USD',
        balance: `$2,000`,
        toolTip: '2,000 USD',
      },
      {
        title: 'Epoch Timer',
        balance: `${days}d ${hours}h ${mins}m`,
      },
    ]
  }, [days, hours, mins])

  return (
    <div className='lg:ml-6 w-full mt-3 lg:mt-0'>
      <div className='lg:flex items-center justify-between'>
        <div className='lg:max-w-[357px]'>
          <h3 className='f-f-fg text-[27px] leading-6  md:text-4xl f-f-fg font-medium gradient-text'>Weekly Lottery</h3>
          <p className='text-[#B8B6CB] mt-2 leading-6'>Earn tickets by trading on WOOF to participate in the weekly lottery.</p>
        </div>
        <Timer arr={totalInfo} className={`w-full lg:max-w-[440px]  mt-3 lg:mt-0`} />
      </div>
      <div className='mt-5 w-full'>
        <div className='gradient-bg p-px shadow-[0_0_50px_#48003d] rounded-[3px] w-full mt-3 lg:mt-3.5'>
          <div className='solid-bg relative px-3 py-4 lg:p-6 rounded-[3px] h-full md:flex-row flex flex-col items-center justify-center md:justify-between'>
            <div className='w-full'>
              <div className='w-full'>
                <p className='text-sm lg:text-lg f-f-fg text-grey leading-[17px] lg:leading-[22px]'>Your Tickets For Next Draw:</p>
                {address ? (
                  <div className='text-[23px] lg:text-[27px] text-[#E9E9F2] leading-7 lg:leading-8 lg:mt-1 '>
                    {userLotteryTickets.length > 0 ? userLotteryTickets[0].tickets : 0} Tickets{' '}
                  </div>
                ) : (
                  <div className='text-[23px] lg:text-[27px] text-[#E9E9F2] leading-7 lg:leading-8 lg:mt-1 '>-</div>
                )}
              </div>
              <div className='w-full mt-6'>
                <p className='text-sm lg:text-lg f-f-fg text-grey leading-[17px] lg:leading-[22px]'>Total Tickets Minted for Next Draw:</p>
                <p className='text-[23px] lg:text-[27px] text-[#E9E9F2] leading-7 lg:leading-8 lg:mt-1'>{`${formatAmount(totalTickets)} Tickets`}</p>
              </div>
            </div>
            <img className='mt-[26px] md:mt-0 md:mr-6' alt='lottery image' src='/image/referral/lottery-balls-image.png' />
          </div>
        </div>
      </div>

      <div className='mt-10 lg:mt-[50px]'>
        <h3 className='f-f-fg text-[27px] leading-6  md:text-4xl f-f-fg font-medium gradient-text'>Amazing Prizes</h3>
        <p className='text-[#B8B6CB] leading-[22px] lg:leading-6 mt-2 lg:mt-1'>
          The 8 winners of the weekly draw are chosen randomly. The more tickets you have earned, the higher your chances are!
        </p>
      </div>

      <div className='mt-5 w-full'>
        <div className='gradient-bg p-px shadow-[0_0_50px_#48003d] rounded-[3px] w-full mt-3 lg:mt-3.5'>
          <div className='solid-bg relative px-3 py-4 lg:p-6 rounded-[3px] h-full md:flex-row flex flex-col items-end  justify-center md:justify-between'>
            <div className='w-full md:max-w-[320px] lg:max-w-[480px] xl:max-w-[550px]'>
              <div className='w-full pb-3.5 border-bottom-gradient flex flex-col lg:flex-row justify-between'>
                <div>
                  <p className='text-sm lg:text-lg f-f-fg text-grey leading-[17px] lg:leading-[22px]'>Last Week Result:</p>
                  <p className='text-[23px] lg:text-[27px] text-[#E9E9F2] leading-7 lg:leading-8 lg:mt-1'>
                    {!address ? '-' : wonLottery ? 'You won the lottery.' : `You didn't win any prize.`}
                  </p>
                </div>
              </div>
              <div className='w-full mt-5 md:min-h-[167px]'>
                <p className='text-sm lg:text-lg f-f-fg text-grey leading-[17px] lg:leading-[22px]'>Last Week Winners:</p>
                {lastWinners.length > 0 ? (
                  <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-4 mt-2.5 w-full'>
                    {lastWinners.map((winner, index) => {
                      return (
                        <div className='w-full' key={`winner-${index}`}>
                          <p className='text-sm lg:text-[17px] text-[#26FFFE] leading-[17px] lg:leading-5'>{winner.code}</p>
                          <p className='mt-0.5 text-[23px]  xl:text-[27px] text-[#E9E9F2] leading-[26px] lg:leading-8'>250 USD</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className='text-[23px] lg:text-[27px] text-[#E9E9F2] leading-7 lg:leading-8 lg:mt-1 '>-</div>
                )}
              </div>
            </div>
            <img
              className='md:absolute  md:w-1/3 lg:w-1/4 xl:w-auto right-0 bottom-0 -mb-4 md:mb-0 -mr-3 md:mr-0'
              alt='lottery image'
              src='/image/referral/illustration.png'
            />
          </div>
        </div>
      </div>
      {/* <Modal
        popup={popup}
        setPopup={setPopup}
        width={540}
        height={298}
        title={`Your Tickets (${userLotteryTickets.length})`}
        isBack={false}
        disableOutside={false}
        isToken={true}
      >
        <div className='px-3 md:px-6 '>
          <p className='text-[#B8B6CB] f-f-fg text-sm leading-[17px] mt-6'>TICKET ID</p>
          <div className='grid grid-cols-5 md:grid-cols-6 gap-2 md:gap-2.5 mt-2.5'>
            {userLotteryTickets.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className='px-3.5 md:px-4 py-1.5 md:py-[7px] bg-[#0B0B38] flex items-center justify-center rounded-full text-grey md:text-lg leading-5'
                >
                  {item.tickets}
                </div>
              )
            })}
          </div>
        </div>
      </Modal> */}
    </div>
  )
}

export default Lottery
