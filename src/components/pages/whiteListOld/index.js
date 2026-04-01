import React, {useEffect, useState} from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import './index.scss'
import BigNumber from "bignumber.js";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import {useUsdtContract, useVeWoofZeroContract} from "../../../hooks/useContract";


const WhiteListOld = () => {
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const [createValue, setCreateValue] = useState(1)
    const [burnValue, setBurnValue] = useState(1)
    const [currUsdt, setUsdt] = useState('0.0')
    const [currWoof, setWoof] = useState('0.0')

    const whitelistContract = useVeWoofZeroContract()
    const usdtContract = useUsdtContract()

    const addCreateInput = () => {
        setCreateValue(prevValue => prevValue + 1);
    };
    const addBurnInput = () => {
        setBurnValue(prevValue => prevValue + 1);
    };
    const reduceCreateInput = () => {
        setCreateValue(prevValue => prevValue - 1);
    };
    const reduceBurnInput = () => {
        setBurnValue(prevValue => prevValue - 1);
    };

    const confirmCreate = () => {
        alert('confirm')
    };

    const confirmBurn = () => {
        alert('confirm')
    };

    const confirmClaim = () => {
        alert('confirm')
    };

    useEffect(async () => {
        // const wValue = await whitelistContract.methods.user(address).call()
        // setWoof(new BigNumber(wValue).div(new BigNumber(10).pow(19)).toFixed(2))

        const uValue = await usdtContract.balanceOf(address)
        //const allowance = await getAllowance(tokenContract, pair.gauge.address, address)
        setUsdt(new BigNumber(uValue).div(new BigNumber(10).pow(19)).toFixed(2))

    }, [address])

    return (
        <>
            <div
                className={`min-h-80 flex justify-center px-5 xl:px-0 mx-auto relative  pt-[140px] pb-28 xl:pb-0 2xl:pb-[150px]`}>
                <OutsideClickHandler
                    onOutsideClick={() => {
                    }}
                >
                    <div className='gradient-bg m-t-40px shadow-[0_0_50px_#48003d] relative z-[10] rounded-[5px]'>
                        <div className='screen-w-600px solid-bg rounded-[15px]'>
                            <div className='flex items-center justify-between'>
                                <div className='flex w-full justify-between items-center f-f-fg normal-family text-[23px] md:text-[27px] leading-10 text-white font-normal'>
                                    <span>My WhiteList: </span>
                                    {/*<img className="hover-img" src="/image/swap/question-mark.png"/>*/}
                                </div>
                            </div>

                            <div className="flex flex-column box-row">
                                <div className='flex items-center justify-between'>
                                    <div className='flex w-full justify-between items-center f-f-fg normal-family text-[23px] md:text-[27px] leading-10 text-white font-normal'>
                                        <div className='flex items-center'>
                                            {
                                                createValue <= 1 ?
                                                    (
                                                        <img className="hover-img icon-size-big"
                                                             src="/image/swap/reduce-btn-grey.svg"/>
                                                    ) : (

                                                        <img onClick={reduceCreateInput} className="hover-img icon-size-big"
                                                             src="/image/swap/reduce-btn.svg"/>
                                                    )
                                            }
                                            <input
                                                className='input-number rounded-[3px]'
                                                value={createValue}
                                                type={'number'}
                                                min={1}
                                                onChange={(event) => {
                                                    const inputValue = Number(event.target.value);
                                                    if (inputValue < 1) {
                                                        setCreateValue(1);
                                                    } else {
                                                        setCreateValue(inputValue);
                                                    }
                                                }}
                                            />
                                            {
                                                true ?
                                                    (
                                                        <img onClick={addCreateInput} className="hover-img icon-size-big"
                                                             src="/image/swap/add-btn.svg"/>
                                                    ) : (
                                                        <img className="hover-img icon-size-big"
                                                             src="/image/swap/add-btn-grey.svg"/>

                                                    )
                                            }
                                        </div>

                                        <span className="font-13 text-grey-666">price: 10 USDT/1</span>
                                    </div>
                                </div>
                                <div className='flex justify-end'>
                                    <span className="font-13 text-grey-666">{ currUsdt } USDT</span>
                                </div>
                                {
                                    true ? (
                                        <button
                                            onClick={() => confirmCreate()}
                                            className='thin-wallet-btn w-full text-white py-[13px] md:py-[10.53px] text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-[8px] font-semibold rounded-[3px]'
                                        >
                                            Create
                                        </button>
                                    ) : (
                                        <button
                                            className='grey-wallet-btn w-full text-white py-[13px] md:py-[10.53px] text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-[8px] font-semibold rounded-[3px]'
                                        >
                                            Create
                                        </button>
                                    )
                                }


                            </div>
                            <div className="flex flex-column m-t-30px box-row">
                                <div className='flex items-center justify-between'>
                                    <div className='flex w-full justify-between items-center f-f-fg normal-family text-[23px] md:text-[27px] leading-10 text-white font-normal'>
                                        <div className='flex items-center'>
                                            {
                                                burnValue <= 1 ?
                                                    (
                                                        <img className="hover-img icon-size-big"
                                                             src="/image/swap/reduce-btn-grey.svg"/>
                                                    ) : (

                                                        <img onClick={reduceBurnInput} className="hover-img icon-size-big"
                                                             src="/image/swap/reduce-btn.svg"/>
                                                    )
                                            }
                                            <input
                                                className='input-number rounded-[3px]'
                                                value={burnValue}
                                                type={'number'}
                                                min={1}
                                                onChange={(event) => {
                                                    const inputValue = Number(event.target.value);
                                                    if (inputValue < 1) {
                                                        setBurnValue(1);
                                                    } else {
                                                        setBurnValue(inputValue);
                                                    }
                                                }}
                                            />
                                            {
                                                true ?
                                                    (
                                                        <img onClick={addBurnInput} className="hover-img icon-size-big"
                                                             src="/image/swap/add-btn.svg"/>
                                                    ) : (
                                                        <img className="hover-img icon-size-big"
                                                             src="/image/swap/add-btn-grey.svg"/>

                                                    )
                                            }
                                        </div>
                                        <span className="font-13 text-grey-666">price: 10 woof/1</span>
                                    </div>
                                </div>
                                <div className='flex justify-end'>
                                    <span className="font-13 text-grey-666">{ currWoof } WOOF</span>
                                </div>
                                {
                                    true ? (
                                        <button
                                            onClick={() => confirmBurn()}
                                            className='thin-wallet-btn w-full text-white w-full py-[13px] md:py-[10.53px] text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-[8px] font-semibold rounded-[3px]'
                                        >
                                            Burn
                                        </button>
                                    ) : (
                                        <button
                                            className='grey-wallet-btn w-full text-white w-full py-[13px] md:py-[10.53px] text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-[8px] font-semibold rounded-[3px]'
                                        >
                                            Burn
                                        </button>
                                    )
                                }
                            </div>
                            <div className='flex m-t-30px w-full justify-between items-center f-f-fg normal-family text-[23px] md:text-[27px] leading-10 text-white font-normal'>
                                <span>Reward: </span>
                            </div>
                            <div className="flex flex-column box-row">
                                <div className='flex items-center justify-between'>
                                    <div className='flex w-full flex-column items-start f-f-fg normal-family text-[23px] md:text-[27px] leading-10 text-white font-normal'>
                                        <div className='flex justify-end w-full'>
                                            <span className="font-13 text-grey-666">6.4 woof/day</span>
                                        </div>
                                        <div className='flex justify-between items-center w-full'>
                                            <div className='flex items-center'>
                                                <span className="font-13 text-grey-666 m-r-8px">3 GKEY</span>
                                                <img className="hover-img icon-size-20"
                                                     src="/image/swap/reduce-btn-grey.svg"/>
                                            </div>
                                            <span className="font-13 text-grey-666">206.8 WOOF</span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    true ? (
                                        <button
                                            onClick={() => confirmClaim()}
                                            className='thin-wallet-btn w-full  text-white w-full py-[13px] md:py-[10.53px] text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-[8px] font-semibold rounded-[3px]'
                                        >
                                            Claim
                                        </button>
                                    ) : (
                                        <button
                                            className='grey-wallet-btn w-full  text-white w-full py-[13px] md:py-[10.53px] text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-[8px] font-semibold rounded-[3px]'
                                        >
                                            Claim
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </OutsideClickHandler>
            </div>
        </>
    )
}

export default WhiteListOld
