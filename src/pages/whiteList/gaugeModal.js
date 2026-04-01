import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import StyledButton from '../../components/common/Buttons/styledButton'
import PoolSelect from '../../components/common/PoolSelect'
import SubPage from '../../components/common/SubPage'
import { useV3Voter } from '../../hooks/useContract'
import useWalletModal from '../../hooks/useWalletModal'
import { useAddGauge } from '../../hooks/useWhitelist'
import { ZERO_ADDRESS } from '../../utils/formatNumber'
import { customNotify } from '../../utils/notify'
import { GammasContext } from '../../context/GammasContext'
import { PairsContext } from '../../../context/PairsContext'

const GaugeModal = () => {
  const [pool, setPool] = useState(null)
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const pairs = useContext(PairsContext)
  const pools = useMemo(() => {
    return pairs.filter((pair) => pair && pair.gauge.address === ZERO_ADDRESS && pair.isValid)
  }, [pairs])
  const { onAddGauge, pending } = useAddGauge()
  const { openWalletModal } = useWalletModal()
  const voterContract = useV3Voter()
  const { final } = useSelector((state) => state.transactions)

  const errorMsg = useMemo(() => {
    if (!pool) {
      return 'CHOOSE POOL'
    }
    return null
  }, [pool])

  useEffect(() => {
    if (final) {
      setPool(null)
    }
  }, [final])

  return (
    <SubPage title='Add Gauge'>
      <div className='w-full pt-3 md:pt-5'>
        {!address ? (
          <StyledButton
            onClickHandler={openWalletModal}
            content={'CONNECT WALLET'}
            className='py-[13px] md:py-[14.53px] text-grey  mt-4 text-base  md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
          />
        ) : (
          <>
            <div className={`flex flex-col w-full items-center justify-center mt-3 md:mt-5`}>
              <div className={`w-full`}>
                <p className='text-dimGray texts-[13px] md:text-base'>Choose Pool</p>
                <PoolSelect pool={pool} setPool={setPool} pools={pools} />
              </div>
            </div>
            <StyledButton
              disabled={errorMsg || pending}
              pending={pending}
              onClickHandler={async () => {
                const res = await Promise.all([
                  voterContract.isWhitelisted(pool.token0.address),
                  voterContract.isWhitelisted(pool.token1.address),
                ])
                if (res[0] && res[1]) {
                  onAddGauge(pool)
                } else {
                  customNotify('Tokens are not whitelisted', 'warn')
                }
              }}
              content={errorMsg || 'CONFIRM'}
              className='w-full h-[42px] tracking-[1.36px] sm:h-12 mdLg:h-[60px] mt-[18px] text-grey flex items-center justify-center text-[14px] mdLg:text-lg font-bold px-[23px] rounded-[3px]'
            />
          </>
        )}
      </div>
    </SubPage>
    // </CommonHollowModal>
  )
}

export default GaugeModal
