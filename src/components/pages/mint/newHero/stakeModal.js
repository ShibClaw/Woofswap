import React, { useState, useMemo, useEffect } from 'react'
import { useStakeNft, useTheNftInfo, useUnstakeNft } from '../../../../hooks/useTheNft'
import StyledButton from '../../../common/Buttons/styledButton'
import CommonHollowModal from '../../../common/CommonHollowModal'
import Tab from '../../../common/Tab'
import CheckBoxDropDown from '../../../common/checkBoxInputDropDown'
import { useSelector } from 'react-redux'

const StakeModal = ({ isOpen, setIsOpen }) => {
  const [isStake, setIsStake] = useState(true)
  const [stakingIds, setStakingsIds] = useState([])
  const [unstakingIds, setUnStakingIds] = useState([])
  const { walletIds, stakedIds } = useTheNftInfo()
  const { onStake, pending } = useStakeNft()
  const { onUnstake, pending: unstakePending } = useUnstakeNft()
  const { final } = useSelector((state) => state.transactions)

  useEffect(() => {
    if (['Unstake Successful'].includes(final)) {
      setUnStakingIds([])
    }
    if (['Stake Successful'].includes(final)) {
      setStakingsIds([])
    }
  }, [final])

  const stakeErrorMsg = useMemo(() => {
    if (stakingIds.length === 0) {
      return 'SELECT theNFTs'
    }
    return null
  }, [stakingIds])

  const unstakeErrorMsg = useMemo(() => {
    if (unstakingIds.length === 0) {
      return 'SELECT theNFTs'
    }
    return null
  }, [unstakingIds])

  return (
    <CommonHollowModal popup={isOpen} width={588} setPopup={setIsOpen} title={`Manage theNFTs`}>
      <Tab className={'mt-4 md:mt-[29px]'} leftTitle={'STAKE'} rightTitle={'UNSTAKE'} isLeft={isStake} setIsLeft={setIsStake} />
      {isStake ? (
        <>
          <CheckBoxDropDown tokenIds={stakingIds} setTokenIds={setStakingsIds} className={'mt-4 md:mt-5'} data={walletIds} />
          <StyledButton
            content={stakeErrorMsg || 'STAKE'}
            disabled={stakingIds.length == 0 || pending}
            onClickHandler={() => {
              onStake(stakingIds)
            }}
            className='
        relative w-full  text-shadow-10 py-[13px] md:py-[18px] mt-2.5 md:mt-6 f-f-fg font-bold leading-4 md:leading-[20px]  text-grey  text-lg tracking-[1.12px] md:tracking-[1.44px] rounded-[3px] transition-all duration-300 ease-in-out'
          />
        </>
      ) : (
        <>
          <CheckBoxDropDown tokenIds={unstakingIds} setTokenIds={setUnStakingIds} className={'mt-4 md:mt-5'} data={stakedIds} />
          <StyledButton
            content={unstakeErrorMsg || 'UNSTAKE'}
            disabled={unstakingIds.length == 0 || unstakePending}
            onClickHandler={() => {
              onUnstake(unstakingIds)
            }}
            className='
        relative w-full  text-shadow-10 py-[13px] md:py-[18px] mt-2.5 md:mt-6 f-f-fg font-bold leading-4 md:leading-[20px]  text-grey  text-lg tracking-[1.12px] md:tracking-[1.44px] rounded-[3px] transition-all duration-300 ease-in-out'
          />
        </>
      )}
    </CommonHollowModal>
  )
}

export default StakeModal
