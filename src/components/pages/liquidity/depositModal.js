import React, {useState, useMemo, useCallback, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import TransparentButton from '../../common/Buttons/transparentButton'
import StyledButton from '../../common/Buttons/styledButton'
import CommonHollowModal from '../../common/CommonHollowModal'
import Tab from '../../common/Tab'
import BalanceInput from '../../common/Input/BalanceInput'
import { useStake, useUnstake } from '../../../hooks/useGauge'
import { getLPSymbol, isInvalidAmount } from '../../../utils/formatNumber'
import { customNotify } from '../../../utils/notify'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import {PairsContext} from "../../../context/PairsContext";

const DepositModal = ({ isOpen, setIsOpen, pair }) => {
    const [isStake, setIsStake] = useState(true)
    const [stakeAmount, setStakeAmount] = useState('')
  const { onStake, pending: stakePending, } = useStake()
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const { onUnstake, pending: unstakePending } = useUnstake()
  const navigate = useNavigate()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { pairs } = useContext(PairsContext)


    const canStake = useMemo(() => {
        if (pair) {
            const resultApi = pairs.filter((item) => {
                //const isCorrect = item.gauge.address !== ZERO_ADDRESS && item.isValid
                const isCorrect =  item.isValid
                // return isCorrect && ((isStaked && !item.account.gaugeBalance.isZero()))
                return isCorrect;
            })
           // debugger
            for(let i=0;i<resultApi.length;i++){
                if(resultApi[i].address == pair.address && resultApi[i].isApiData){
                    return true;
                }
            }
        }
        return false

  }, [ pair,pairs])
    const stakeErrorMsg = useMemo(() => {
        if (pair) {
            if (isInvalidAmount(stakeAmount)) {
                return 'Invalid Amount'
            }
            if (pair.account.lpBalance.lt(stakeAmount)) {
                return 'Insufficient ' + pair.symbol + ' Balance'
            }
        }
        return null
    }, [stakeAmount, pair,pairs])

  const unstakeErrorMsg = useMemo(() => {
    if (pair) {
      if (isInvalidAmount(withdrawAmount)) {
        return 'Invalid Amount'
      }
      if (pair.account.gaugeBalance.lt(withdrawAmount)) {
        return 'Insufficient ' + pair.symbol + ' Balance'
      }
    }
    return null
  }, [withdrawAmount, pair])

  const onRedirect = useCallback(() => {
    if (pair.isGamma) {
      navigate(`/liquidity/managev3?currency0=${pair.token0.address}&currency1=${pair.token1.address}`)
    } else {
      navigate(`/liquidity/manage/${pair.address.toLowerCase()}`)
    }
  }, [pair])

  return (
    <CommonHollowModal popup={isOpen} width={588} setPopup={setIsOpen} title={`Manage ${getLPSymbol(pair)} LP (${pair.stable ? 'STABLE' : 'VOLATILE'})`}>
      <div className='w-full mt-[29px] flex items-center justify-center flex-col'>
        <Tab leftTitle={'STAKE'} rightTitle={'UNSTAKE'} isLeft={isStake} setIsLeft={setIsStake} />
        {isStake ? (
          <div className='w-full flex items-center justify-center flex-col mt-5'>
            <BalanceInput
              title='Amount'
              inputAmount={stakeAmount}
              setInputAmount={setStakeAmount}
              symbol={pair.symbol}
              balance={pair.account.lpBalance}
              logoURIs={[pair.token0.logoURI?pair.token0.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png", pair.token1.logoURI?pair.token1.logoURI:"/image/tokens/ERC20_"+ chainId+".png"]}
            />
            <div className='flex items-center space-x-3.5 mt-5 group cursor-pointer' href='#' onClick={() => onRedirect()}>
              <p className='text-[1.17rem] md:text-xl text-green font-medium'>Get {pair.symbol} LP</p>
              <img className='group-hover:w-[40px] w-[30px] duration-300 ease-in-out' alt='' src='/image/common/spear.svg' />
            </div>
            <div className='flex items-center mt-[26px] w-full space-x-5'>
              <StyledButton
                disabled={stakePending || !canStake}
                onClickHandler={() => {
                  if (stakePending) {
                    return
                  }
                  if (stakeErrorMsg) {
                    customNotify(stakeErrorMsg, 'warn')
                    return
                  }
                  onStake(pair, stakeAmount)
                }}
                content={stakePending ? 'PENDING...' : 'STAKE LP'}
                className='py-[13px] md:py-[14.53px] w-1/2 tracking-[1.12px] md:tracking-[1.44px] text-white flex items-center justify-center text-[13px] md:text-[17px] font-bold px-[23px] rounded-[3px]'
              />
              <TransparentButton
                onClickHandler={() => setIsOpen(false)}
                content={'CANCEL'}
                className='
                bg-body-grey b-r-10px py-[13px] md:py-[14.53px] px-[26px] text-grey-1 flex items-center justify-center text-[13px] md:text-[17px] w-1/2 tracking-[1.12px] md:tracking-[1.44px] font-semibold'
              />
            </div>
          </div>
        ) : (
          <div className='w-full flex items-center justify-center flex-col mt-5'>
            <BalanceInput
              title='Amount'
              inputAmount={withdrawAmount}
              setInputAmount={setWithdrawAmount}
              symbol={pair.symbol}
              balance={pair.account.gaugeBalance}
              logoURIs={[pair.token0.logoURI?pair.token0.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png", pair.token1.logoURI?pair.token1.logoURI:"/image/tokens/ERC20_"+ chainId+".png"]}
            />
            <div className='flex items-center mt-[26px] w-full space-x-5'>
              <StyledButton
                disabled={unstakePending}
                onClickHandler={() => {
                  if (unstakeErrorMsg) {
                    customNotify(unstakeErrorMsg, 'warn')
                    return
                  }
                  onUnstake(pair, withdrawAmount)
                }}
                content={unstakePending ? 'PENDING...' : 'UNSTAKE LP'}
                className='py-[13px] md:py-[14.53px] w-1/2 tracking-[1.12px] md:tracking-[1.44px] text-white flex items-center justify-center text-[13px] md:text-[17px] font-bold px-[23px] rounded-[3px]'
              />
              <TransparentButton
                onClickHandler={() => setIsOpen(false)}
                content={'CANCEL'}
                className='
                bg-body-grey b-r-10px py-[13px] md:py-[14.53px] px-[26px] text-grey-1 flex items-center justify-center text-[13px] md:text-[17px] w-1/2 tracking-[1.12px] md:tracking-[1.44px] font-semibold'
              />
            </div>
          </div>
        )}
      </div>
    </CommonHollowModal>
  )
}

export default DepositModal
