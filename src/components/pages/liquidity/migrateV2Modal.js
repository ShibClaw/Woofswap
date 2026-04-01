import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import StyledButton from '../../common/Buttons/styledButton'
import CommonHollowModal from '../../common/CommonHollowModal'
import { formatAmount } from '../../../utils/formatNumber'
import { useMigrateToFusion } from '../../../hooks/useMigration'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

const ItemWithTooltip = ({ pair }) => {
  const [arrowReverse, setArrowReverse] = useState()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  return (
    <div className='flex flex-col items-start justify-center'>
      <div
        data-tip
        data-for={`migrate-v2`}
        onMouseEnter={() => {
          setArrowReverse(`migrate-v2`)
        }}
        onMouseLeave={() => {
          setArrowReverse(null)
        }}
        className='text-grey font-semibold text-[18px] lg:text-[13px] flex items-center cursor-pointer space-x-1.5'
      >
        <p>{'$' + formatAmount(pair.gauge.tvl, true)}</p>
        <button className={`${arrowReverse === `migrate-v2` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
          <img alt='' src='/image/liquidity/small-arrow-bottom.svg' />
        </button>
      </div>
      <ReactTooltip
        className='max-w-[180px] !bg-[#090333] !border !border-white !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body'
        id={`migrate-v2`}
        place='right'
        effect='solid'
      >
        {formatAmount(pair.gauge.pooled0)} {pair.token0.symbol}
        <br />
        {formatAmount(pair.gauge.pooled1)} {pair.token1.symbol}
      </ReactTooltip>
    </div>
  )
}

const MigrateV2Modal = ({ isOpen, setIsOpen, pair, fusion }) => {
  const { onMigrateToFusion, pending } = useMigrateToFusion()

  return (
    <CommonHollowModal popup={isOpen} width={588} setPopup={setIsOpen} title={`Migrate ${pair.token0.symbol}-${pair.token1.symbol} (${pair.title})`}>
      <div className='w-full mt-[14px]'>
        <div className='flex items-center space-x-3'>
          <div className='text-[13px] lg:text-[13px] text-[#E1E1F2] font-semibold f-f-fg'>
            {pair.token0.symbol}-{pair.token1.symbol} (old)
          </div>
          <img src='/image/common/smaller-arrow.png' alt='' className='w-6 h-4' />
          <div className='text-[13px] lg:text-[13px] text-[#E1E1F2] font-semibold f-f-fg'>
            {pair.token0.symbol}-{pair.token1.symbol} (new)
          </div>
        </div>
        <div className='mt-[7px] text-[15px] lg:text-[12px] color-[#DEDBF2]'>
          To complete the migration, you have to unstake assets from the current pool and stake them to the new FUSION pool.
        </div>
        <div className='border-img mt-[18px] flex flex-col lg:flex-row py-[18px] px-[16px] border border-[#ED00C9] rounded-[5px]'>
          <div className='w-full lg:w-1/2 flex'>
            <div className='flex items-center -space-x-2'>
              <img className='relative z-10' alt='' src={pair.token0.logoURI?pair.token0.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={30} height={30} />
              <img className='relative z-[5]' alt='' src={pair.token1.logoURI?pair.token1.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={30} height={30} />
            </div>
            <div className='ml-2'>
              <div className='text-grey font-semibold text-[14px] lg:text-[14px] f-f-fg'>
                {pair.token0.symbol}-{pair.token1.symbol}
              </div>
              <div className='text-grey font-semibold text-[11px] lg:text-[12px]'>{pair.title}</div>
            </div>
          </div>
          <div className='w-full lg:w-1/2 flex mt-[10px] lg:mt-0'>
            <div className='w-[50%]'>
              <div className='text-grey font-semibold text-[13px] lg:text-[14px] f-f-fg'>TVL</div>
              <ItemWithTooltip pair={fusion} />
            </div>
            <div className='w-[50%]'>
              <div className='text-grey font-semibold text-[13px] lg:text-[14px] f-f-fg'>Projected APR</div>
              <div className='text-grey font-semibold text-[18px] lg:text-[12px]'>{formatAmount(fusion.gauge.projectedApr)}%</div>
            </div>
          </div>
        </div>
        <StyledButton
          disabled={pending}
          onClickHandler={() => {
            onMigrateToFusion(pair, fusion)
          }}
          content={pending ? 'PENDING...' : 'UNSTAKE AND STAKE TO NEW GAUGE'}
          className='mt-[18px] py-[13px] md:py-[14.53px] w-full tracking-[1.12px] md:tracking-[1.44px] text-white flex items-center justify-center text-[13px] md:text-[17px] font-bold px-[23px] rounded-[10px]'
        />
      </div>
    </CommonHollowModal>
  )
}

export default MigrateV2Modal
