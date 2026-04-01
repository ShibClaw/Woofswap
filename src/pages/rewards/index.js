import React, {useContext, useEffect, useMemo, useState} from 'react'
import BigNumber from 'bignumber.js'
import StyledButton from '../../components/common/Buttons/styledButton'
import VeWOOFSelect from '../../components/common/VeWOOFSelect'
import Table from '../../components/pages/rewards'
import {veWOOFsContext} from '../../context/veWOOFsConetext'
import {useClaimAll, useExpectedRewards,useAllRewards,   useGetFees, useGetVeRewards} from '../../hooks/useRewards'
import {formatAmount} from '../../utils/formatNumber'
import usePrices from '../../hooks/usePrices'
import Liquidity from "../../components/pages/rewardsTable2/index";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

const claim = true


const Index = () => {
    const [veWOOF, setVeWOOF] = useState(null)
    const veWOOFs = useContext(veWOOFsContext)
    // const veRewards = useGetVeRewards(veWOOF)
    // const expectedRewards = useExpectedRewards(veWOOF)
    const allRewards = useAllRewards(veWOOF)
    const {onClaimAll, pending:feePending} = useClaimAll()
    // const fees = useGetFees()
    const prices = usePrices()

    const { address, chainId, isConnected } = useWeb3ModalAccount()


    const rewards = useMemo(() => {
        return veWOOF && veWOOF.rebase_amount.gt(0) ? [veWOOF,...allRewards] : [...allRewards]
        //return veWOOF && veWOOF.rebase_amount.gt(0) ? [veWOOF,...allRewards, ...fees] : [...allRewards, ...fees]

    }, [veWOOF, allRewards,chainId])

    useEffect(() => {
        if (veWOOF) {
            setVeWOOF(veWOOFs.find((item) => item.id === veWOOF.id))
        }
    }, [veWOOFs, veWOOF])

    const totalUsd = useMemo(() => {
        let total = [...allRewards].reduce((sum, current) => {
            return sum.plus(current.totalUsd)
        }, new BigNumber(0))
        if (veWOOF) {
            total = total.plus(veWOOF.rebase_amount.times(prices['WOOF']))
        }
        return total
    }, [allRewards, veWOOF, prices])

    // const totalExpectedUsd = useMemo(() => {
    //     return expectedRewards.reduce((sum, current) => {
    //         return sum.plus(current.totalUsd)
    //     }, new BigNumber(0))
    // }, [expectedRewards])

    return (
        <>
            <div
                className='min-h-80 px-5 sm:px-16 md:px-28 mdLg:px-40  lg:px-5 xl:px-0 pt-20  md:pt-[120px] mx-auto'>
                <div className='lg:flex items-end justify-between lg:space-x-[60px]'>
                    <div className='w-full lg:w-1/2'>
                        <div className='max-w-[450px]'>
                            <h1 className='text-page-title'>Rewards</h1>
                            <p className='text-page-title-tips text-[#b8b6cb] text-base md:text-lg leading-[22px] md:leading-6 mt-24px pr-10 md:pr-0'>Choose
                                your veWOOF and claim your rewards.</p>
                        </div>
                    </div>
                    <div
                        className='md:flex items-center justify-between mt-3 md:mt-1.5 md:space-x-5 lg:space-x-[60px] relative '>
                        {/* for desktop */}
                    </div>
                </div>

                <div className="table-normal-header-title mt-48px">
                    <span className="text-white">VOTING REWARDS</span>
                    <div className='lg:max-w-[600px] xl:max-w-[680px] gradient-bg  p-px rounded-[5px] mt-3 lg:mt-0'>
                        <div
                            className='rounded-[5px] lg:flex items-center justify-between w-full lg:space-x-10  lg:px-5'>
                            {claim ? (
                                <div
                                    className='flex items-center justify-between md:justify-start space-x-1 xl:space-x-3'>
                                    <p className='normal-family text-[16px] lg:text-[13px] text-white f-f-fg font-light'>Total
                                        Claimable Rewards:</p>
                                    <p className='text-[16px] lg:text-[17px] font-medium text-white'>${formatAmount(totalUsd)}</p>
                                </div>
                            ) : (
                                <p className='text-[15px] lg:text-[17px] text-grey f-f-fg'>

                                </p>
                            )}
                        </div>
                    </div>
                    <VeWOOFSelect className={'lg:w-[320px] w-full'} isSelected={veWOOF} setIsSelected={setVeWOOF}/>
                    <StyledButton
                        disabled={ feePending}
                        onClickHandler={() => {
                            onClaimAll(rewards, veWOOF)
                        }}
                        className={`text-grey rounded-[3px] px-[35px] py-2 md:py-[9px] mt-3 lg:mt-0 w-full lg:w-auto`}
                        content={`Claim All`}
                    />
                </div>

                <Table rewards={rewards} veWOOF={veWOOF}/>
                <Liquidity></Liquidity>
            </div>
        </>
    )
}

export default Index
