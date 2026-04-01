import React, {useEffect, useMemo, useState} from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import './index.scss'
import BigNumber from "bignumber.js";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import {usePIKAContract,useDAMNContract, useVeWoofZeroContract} from "../../hooks/useContract";
import {useMintPIKA} from "../../hooks/useRewards";
import BalanceInput from "../../components/common/Input/BalanceInput";
import {customNotify} from "../../utils/notify";
import StyledButton from '../../components/common/Buttons/styledButton'
import {getWBONE_ShibAddress, getWBONE_WoofAddress} from "../../utils/addressHelpers";


const Launchpad = () => {
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const [createValue, setCreateValue] = useState(1)
    const [burnValue, setBurnValue] = useState(1)
    const [currPIKA, setPIKA] = useState('0.0')
    const [currDAMN, setDAMN] = useState('0.0')
    const [isOk, setIsOk] = useState(true)
    const [currWoof, setWoof] = useState('0.0')
    const {onMintPIKA, pending:feePending} = useMintPIKA()
    const [amount, setAmount] = useState('0')

    const whitelistContract = useVeWoofZeroContract()
    const usdtContract = usePIKAContract()
    const damnContract = useDAMNContract()

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
    const confirmMax = () => {

        let maxPIKA = 500000-parseInt(Math.ceil(parseFloat(currPIKA)));
        let maxDAMN = parseInt(maxPIKA/5);
        if(maxDAMN>currDAMN)
            maxDAMN = parseInt(currDAMN);
        setAmount(maxDAMN);
    };
    const isErrorNumber = useMemo(() => {
        //if (fromAsset && toAsset && toAsset.address === 'BONE' && fromAsset.address.toLowerCase() === getWBONE_WoofAddress().toLowerCase()) {

        debugger
        if(parseInt(amount)<1)
            return true
        let maxPIKA = 500000-parseInt(Math.ceil(parseFloat(currPIKA)));
        let maxDAMN = parseInt(maxPIKA/5);
        if(maxDAMN>currDAMN)
            maxDAMN = parseInt(currDAMN);
        if(parseInt(amount)>maxDAMN)
            return true;
        if(parseInt(amount)>parseInt(currDAMN))
            return true;
        return false
    }, [currPIKA, currDAMN,amount])

    const confirmCreate = () => {
        let maxPIKA = 500000-parseInt(Math.ceil(parseFloat(currPIKA)));
        let maxDAMN = parseInt(maxPIKA/5);
        if(maxDAMN>currDAMN)
            maxDAMN = parseInt(currDAMN);
        if(parseInt(amount)>maxDAMN){
            customNotify("The maximum value is 100000 DAMN!", 'info')
            setAmount(maxDAMN);
            return ;
        }
        onMintPIKA(amount)
    };


    useEffect(async () => {
        // const wValue = await whitelistContract.methods.user(address).call()
        // setWoof(new BigNumber(wValue).div(new BigNumber(10).pow(19)).toFixed(2))

        const uValue = await usdtContract.balanceOf(address)
        //const allowance = await getAllowance(tokenContract, pair.gauge.address, address)
        setPIKA(new BigNumber(uValue).div(new BigNumber(10).pow(18)).toFixed(2))

        const damnValue = await damnContract.balanceOf(address)
        setDAMN(new BigNumber(damnValue).div(new BigNumber(10).pow(18)).toFixed(2))


    }, [address,feePending])

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
        <span>Launchpad: </span>
    {/*<img className="hover-img" src="/image/swap/question-mark.png"/>*/}
</div>
    </div>

    <BalanceInput
    title=''
    inputAmount={amount}
    setInputAmount={setAmount}
    symbol=''
    logoURIs={[]}
    />
    <div className="flex flex-column box-row">
        <div className='flex items-center justify-between'>

        <div className='flex w-full justify-between items-center f-f-fg normal-family text-[23px] md:text-[27px] leading-10 text-white font-normal'>

        <button className='flex items-center font-13 text-error-red cursor-pointer'
    onClick={() =>
    {confirmMax()}}>
            MAX
        </button>

    <span className="font-13 text-grey-666"> 5 PIKA / 1 DAMN</span>
    </div>
    </div>
    <div className='flex justify-end'>
        <span className="font-13 text-grey-666">{ currPIKA } PIKA</span>
    </div>
    <StyledButton
    disabled={isErrorNumber || feePending}
    pending={feePending}
    onClickHandler={() => { confirmCreate()}}
    content={'Mint'}
    className={'py-[13px] md:py-[14.53px] text-white mt-2 md:mt-5 text-base md:text-lg tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[30px] px-[19px] w-full rounded-[3px] '}
    />


</div>


    <div className="flex flex-column box-row">

        <div className='flex items-center justify-between'>
        <div className='flex w-full flex-column items-start f-f-fg normal-family text-[23px] md:text-[27px] leading-10 text-white font-normal'>
        <div className='flex justify-end w-full'>
        <span className="font-13 text-grey-666">{currDAMN} DAMN</span>
    </div>

    </div>
    </div>

</div>
    </div>
    </div>
    </OutsideClickHandler>
    </div>
    </>
)
}

export default Launchpad
