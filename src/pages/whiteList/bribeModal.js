import React, { useContext, useState, useMemo } from 'react'
import StyledButton from '../../components/common/Buttons/styledButton'
import BalanceInput from '../../components/common/Input/BalanceInput'
import SubPage from '../../components/common/SubPage'
import PoolSelect from '../../components/common/PoolSelect'
import { isInvalidAmount, ZERO_ADDRESS } from '../../utils/formatNumber'
import RewardSelect from '../../components/common/RewardSelect'
import { useAddBribe } from '../../hooks/useWhitelist'
import useWalletModal from '../../hooks/useWalletModal'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { GammasContext } from '../../context/GammasContext'

const BribeModal = () => {
  const [pool, setPool] = useState(null)
  const [rewardToken, setRewardToken] = useState(null)
  const [amount, setAmount] = useState('')
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { openWalletModal } = useWalletModal()
  const pairs = useContext(GammasContext)
  const pools = useMemo(() => {
    return pairs.filter((pair) => pair && pair.gauge.address !== ZERO_ADDRESS && pair.isValid)
  }, [pairs])

  const { onAddBribe, pending } = useAddBribe()

  const errorMsg = useMemo(() => {
    if (!pool) {
      return 'CHOOSE POOL'
    }
    if (!rewardToken) {
      return 'CHOOSE REWARD TOKEN'
    }
    if (isInvalidAmount(amount)) {
      return 'ENTER AN AMOUNT'
    }
    if (rewardToken.balance.lt(amount)) {
      return 'INSUFFICIENT BALANCE'
    }
    return null
  }, [pool, rewardToken, amount])

  return (
    <>
      <SubPage hideBack={true}>
        {/* <CommonHollowModal popup={isOpen} width={588} setPopup={setIsOpen} title='Add Bribe'> */}
        <p className='box-title f-f-fg text-[23px] md:text-[27px] leading-10 text-white font-normal'>
          Create Bribe
        </p>
        <div className='mt-5'>
          <div className={`flex flex-col w-full items-center justify-center`}>
            <div className={`w-full`}>
              <p className='text-dimGray texts-[13px] md:text-base'>Choose Pool</p>
              <PoolSelect pool={pool} setPool={setPool} pools={pools} />
            </div>
          </div>
          <div className={`flex flex-col w-full items-center justify-center my-3 md:my-5`}>
            <div className={`w-full`}>
              <p className='text-[#B8B6CB] texts-[13px] md:text-base'>Choose Reward Token</p>
              <RewardSelect asset={rewardToken} setAsset={setRewardToken} />
            </div>
          </div>
          <BalanceInput
            title='Amount'
            inputAmount={amount}
            setInputAmount={setAmount}
            symbol=''
            balance={rewardToken ? rewardToken.balance : null}
            logoURIs={[]}
          />
          {address ? (
            <StyledButton
              disabled={errorMsg || pending}
              pending={pending}
              onClickHandler={() => {
                onAddBribe(pool, rewardToken, amount)
              }}
              content={errorMsg || 'CONFIRM'}
              className='w-full h-[42px] tracking-[1.36px] sm:h-12 mdLg:h-[60px] mt-[18px] text-grey flex items-center justify-center text-[14px] mdLg:text-lg font-bold px-[23px] rounded-[3px]'
            />
          ) : (
            <StyledButton
              onClickHandler={openWalletModal}
              content={'CONNECT WALLET'}
              className='py-[13px] md:py-[14.53px] text-white  mt-4 text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
            />
          )}
        </div>
      </SubPage>
    </>
  )
}

export default BribeModal
