import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import BigNumber from 'bignumber.js'
import {useNavigate, useSearchParams} from 'react-router-dom'
import Settings from '../../common/Settings'
import TokenInput from '../../common/Input/TokenInput'
import useWalletModal from '../../../hooks/useWalletModal'
import {BaseAssetsConetext} from '../../../context/BaseAssetsConetext'
import {formatAmount, isInvalidAmount, wrappedAsset} from '../../../utils/formatNumber'
import {useInvite, useExcWoofZero} from '../../../hooks/useWhitelist'
import Spinner from '../../common/Spinner'
import StyledButton from '../../common/Buttons/styledButton'
import './index.scss'
import {getWBONE_WoofAddress} from '../../../utils/addressHelpers'
import useDebounce from '../../../hooks/useDebounce'
import {isAddress} from "@ethersproject/address";
import {customNotify} from "../../../utils/notify";
import {PairsContext} from "../../../context/PairsContext";
import {useUsdtContract, useVeWoofZeroContract} from "../../../hooks/useContract";
import {openWallet} from "../../../state/wallet/actions";
import {getERC20Contract} from "../../../utils/contractHelpers";
import {getAllowance} from "../../../utils/api";


const WhiteList = () => {
    const {onInvite, pending} = useInvite()
    const {onExcWoofZero, excWoofZeroPending} = useExcWoofZero()
    const baseAssets = useContext(BaseAssetsConetext)
    const {whitelistObj, whitelistAll} = useContext(PairsContext)
    const [vewoofValue, setVewoofValue] = useState('0.0')
    const [usdtValue, setUsdtValue] = useState('0.0')
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const [searchParams] = useSearchParams()
    const inputRef = useRef()
    const [searchText, setSearchText] = useState('')
    const whitelistContract = useVeWoofZeroContract()
    const usdtContract = useUsdtContract()

    const btnMsg = useMemo(() => {
        if (!address) {
            return {
                isError: true,
                label: 'CONNECT WALLET',
            }
        }

        if (!isAddress(searchText)) {
            return {
                isError: true,
                label: 'WOOF!',
            }
        }

        return {
            isError: false,
            label: 'WOOF!',
        }
    }, [address, searchText, baseAssets, whitelistObj])


    useEffect(async () => {

        setTimeout(() => {
            inputRef.current && inputRef.current.focus()
        }, 300)


        if (isAddress(searchText)) {

        }

    }, [searchText])

    useEffect(async () => {
        const wValue = await whitelistContract.user(address)
        setVewoofValue(new BigNumber(wValue).div(new BigNumber(10).pow(19)).toFixed())

        const uValue = await usdtContract.balanceOf(address)
        //const allowance = await getAllowance(tokenContract, pair.gauge.address, address)
        setUsdtValue(new BigNumber(uValue).div(new BigNumber(10).pow(19)).toFixed())

    }, [address])

    return (
        <>
            <div
                className={`${isDarkMode === 'light' ? 'dark-mode' : 'light-mode'} min-h-80 flex justify-center px-5 xl:px-0 mx-auto relative  pt-[140px] pb-28 xl:pb-0 2xl:pb-[150px]`}>

                <OutsideClickHandler
                    onOutsideClick={() => {
                        //setSetting(false)
                    }}
                >
                            <div className="flex justify-center items-start text-white white-list-layout p-t-40px-web">
                                <div className="mr-40px-web white-layout">
                                    <div className="text-white whitelist-title text-[23px] normal-family">WOOF RANK</div>
                                    <div className="white-num-item m-t-10px">
                                        <div className="text-pass">{whitelistObj.rank?whitelistObj.rank:(whitelistObj.voList?whitelistObj.voList[whitelistObj.voList.length-1].rank:0)}</div>
                                        <div className="white-list-all">/{whitelistAll.voList?whitelistAll.voList[whitelistAll.voList.length-1].rank:'-'}</div>
                                    </div>
                                    <div className="white-num-item m-t-10px">
                                        <span className="white-num-list">{whitelistObj.voList?whitelistObj.voList[whitelistObj.voList.length-3<0?0:whitelistObj.voList.length-3].rank:0}</span>
                                        <span className="white-num-list">{whitelistObj.voList?whitelistObj.voList[whitelistObj.voList.length-2<0?0:whitelistObj.voList.length-2].rank:0}</span>
                                        <span className="white-num-list"> {whitelistObj.voList?whitelistObj.voList[whitelistObj.voList.length-1?0:whitelistObj.voList.length-1].rank:0}</span>
                                        <span className="white-num-list">MY RANK</span>
                                    </div>
                                   <div className="white-num-item m-t-10px">
                                        <span className="white-num-list">
                                            <span className="bac-orange">{whitelistObj.voList?whitelistObj.voList[whitelistObj.voList.length-3<0?0:whitelistObj.voList.length-3].childCnt:0}</span>
                                        </span>
                                        <span className="white-num-list">
                                            <span className="bac-orange">{whitelistObj.voList?whitelistObj.voList[whitelistObj.voList.length-2<0?0:whitelistObj.voList.length-2].childCnt:0}</span>
                                        </span>
                                        <span className="white-num-list">
                                             <span className="bac-orange">{whitelistObj.voList?whitelistObj.voList[whitelistObj.voList.length-1<0?0:whitelistObj.voList.length-1].childCnt:0}</span>
                                        </span>
                                        <span className="white-num-list">
                                             <span className="bac-orange">{whitelistObj.rank?whitelistObj.childCnt:0}</span>
                                        </span>
                                    </div>
                                    <div className='gradient-bg m-t-40px shadow-[0_0_50px_#48003d] relative z-[10] rounded-[5px]'>
                                        <div className='solid-bg  rounded-[15px] px-3 md:px-6 py-3 md:py-4'>
                                            <div className='flex items-center justify-between'>
                                                <p className='flex w-full justify-between items-center f-f-fg normal-family text-[23px] md:text-[27px] leading-10 text-white font-normal'>
                                                    <span>WhiteList</span>
                                                    <span></span>
                                                    {/*<img src="/image/swap/question-mark.png" />*/}
                                                </p>

                                            </div>

                                            {
                                                whitelistObj.address ?
                                                    (
                                                    <div>
                                                    <p className='flex w-full justify-between m-t-10px items-center f-f-fg normal-family text-grey-1 leading-10 font-normal'>
                                                            <span>Your referre's address</span>

                                                    </p>
                                                        <p className='px-10'>{ `${whitelistObj.address.slice(0, 8)}...${whitelistObj.address.slice(-6)}` }</p>
                                                    </div>
                                                    ):
                                                    (
                                                    <div className='w-full'>
                                                        <div className='min-w-300px'>
                                                            <div className='w-full mt-3 rounded-[3px]'>
                                                            <input
                                                            ref={inputRef}
                                                            value={searchText}
                                                            onChange={(e) => setSearchText(e.target.value)}
                                                            placeholder="Your referre's address"
                                                            className='bg-body-white placeholder-[#757384] h-14 w-full text-grey text-base md:text-lg px-4 py-[18px] rounded-[3px]'
                                                                />
                                                                </div>
                                                            </div>
                                                    </div>
                                                    )
                                            }

                    {
                        whitelistObj.address ?
                            null
                            :(
                            <p className='flex w-full justify-between m-t-10px items-center f-f-fg normal-family text-grey-1 leading-10 font-normal'>
                        <span>pirce</span>
                        <span>0.05Test BONE</span>
                    </p>
                    )}


                    {
                        whitelistObj.address ?
                            null
                            :
                            (address ? (
                                    <div>
                                    <StyledButton
                                    disabled={btnMsg.isError || pending || baseAssets.length == 0}
                                pending={pending}
                                onClickHandler={() => {
                        if(baseAssets[0].balance.toNumber() >= 0.051){
                            onInvite(searchText)
                        }else {
                            customNotify('INSUFFICIENT BONE BALANCE', 'warn')
                        }

                    }}
                        content={btnMsg.label}
                        className='text-white text-base md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px]'
                            />


                            </div>
                    ) : (
                    <button
                        onClick={() => openWalletModal()}
                        className='connect-wallet-btn text-white w-full py-[13px] md:py-[14.53px] text-base md:text-lg leading-8 tracking-[1.44px] f-f-fg transition-all duration-300 ease-out mt-[8px] font-semibold rounded-[3px]'
                            >
                            CONNECT WALLET
                    </button>
                    ))
                    }


                                        </div>
                                    </div>

                                    <img className="whitelist-bac" src='/image/whiteList/woof_bg.png' />
                                </div>
                            </div>
                </OutsideClickHandler>

            </div>
            <div className="text-grey fixed-right-bottom flex-d flex justify-center items-center">
                <div
                    className={`normal-btn ${
                        baseAssets.length === 0 ? 'not-allowed-btn' : 'normal-btn'
                    } `}
                    onClick={() => {
                        console.log(whitelistObj)
                        if (baseAssets[0].balance.toNumber() >= 0.101) {
                            onExcWoofZero()
                        } else {
                            customNotify('INSUFFICIENT BONE BALANCE', 'warn')
                        }

                    }}
                >0.1 TEST BONE
                </div>
                <div className="box-white m-t-10px">WOOF AND WOOF - 0.01 veWOOF</div>
                <div className="m-t-10px text-white">{vewoofValue} veWOOF</div>
            </div>
        </>
    )
}

export default WhiteList
