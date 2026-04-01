import React, {useCallback, useContext, useEffect, useState} from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    useJaceFunContract, useTokenFactoryContract,useTokenFactoryGdogContract, useAbiContract
} from "../../hooks/useContract";


import { getContract } from '../../utils/contract'
import {getERC20Contract, getJsonRpcContract} from '../../utils/contractHelpers'
import erc20Abi from "../../config/abi/erc20.json";
import tokenABI from "../../config/abi/tokenABI.json";
import useWeb3 from "../../hooks/useWeb3";
import {BaseAssetsConetext} from "../../context/BaseAssetsConetext";
import {formatAmount, fromWei,toWei} from '../../utils/formatNumber'
import {useAddLiquidity} from "../../hooks/useLiquidity";
import {getTokenFactoryAddress} from "../../utils/addressHelpers";
import {NetworksData} from "../../config/constants";

const TokenOperations = () => {

    const [nameStatus, setNameStatus] = useState("");
    const [currentTokenAddress, setCurrentTokenAddress] = useState("");
    const [domainInput, setDomainInput] = useState("");
    const { tokenContractAddress,setTokenContractAddress } = useState("");
    // const { address } = useState(".okx");
    const { address } = useWeb3ModalAccount();
    const web3 = useWeb3()
    const isConnected = Boolean(address);


    const jaceFunContract = useJaceFunContract()
    const tokenFactoryContract = useTokenFactoryGdogContract()
    const tokenFactoryGdogContract = useTokenFactoryGdogContract()


    const [tokenInfo, setTokenInfo] = useState({
        name: "",
        progress: 0,
        state: "Funding",
    });
    const [okbBalance, setOkbBalance] = useState(0);
    const [gdogBalance, setGdogBalance] = useState('0');
    const [tokenBalance, setTokenBalance] = useState(0);
    const [buyAmount, setBuyAmount] = useState("");
    const [sellAmount, setSellAmount] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("");
    const [createDomainStatus, setCreateDomainStatus] = useState("");
    const [tokenContract, setTokenCount] = useState(null);

    const baseAssets = useContext(BaseAssetsConetext)
    const { onSell,onBuy,pending } = useAddLiquidity()
    const gdogAddress  = '0xf6D9Cf57e20bA0d33372E8998A9424aa53411E04';

    const tokenFactoryAddress = getTokenFactoryAddress();
// 方法1: 使用Math.floor() - 向下取整（适用于正数）
    function floorDecimal(num, decimalPlaces) {
        const factor = Math.pow(10, decimalPlaces);
        return Math.floor(num * factor) / factor;
    }
    // 百分比按钮处理
    const setPercent = (percent, type) => {
        if (type === "buy") setBuyAmount( floorDecimal(gdogBalance * percent / 100.0,4));
        if (type === "sell") setSellAmount(floorDecimal(tokenBalance * percent / 100.0,4));
    };

    // 校验函数
    const validateInput = (value, message) => {
        if (!value || isNaN(value) || Number(value) <= 0) {
            toast.error(message, { transition: Zoom });
            return false;
        }
        return true;
    };

    useEffect(async() => {
      //   debugger
      // const tid = await   domainContract.ownerToTokenId(address);
      //   if (tid != 0) {
      //       setTokenId(tid+"")
      //   }

        if(currentTokenAddress){
            await fetchTokenInfo(currentTokenAddress);
        }

    }, [currentTokenAddress,address,pending])

    useEffect(async() => {
        //   debugger
        // const tid = await   domainContract.ownerToTokenId(address);
        //   if (tid != 0) {
        //       setTokenId(tid+"")
        //   }

        const tokenContract = getERC20Contract(web3, gdogAddress)
        const balance = await tokenContract.balanceOf(address);

        setGdogBalance( fromWei(balance)+"" ) ;

    }, [web3])

    useEffect(async() => {
        document.getElementById('tokenDetails').style.display = 'none';
        // console.log('domainInput1',domainInput)
        if (domainInput != '') {
            let status = {};

            try {
                status.innerText = 'Searching domain...';
                // console.log(domainInput+"",'-------1')
                const tokenAddress = await jaceFunContract.getTokenAddressById(domainInput);
                // const tkInfo = await jaceFunContract.getTokenInfoByContract(tokenAddress);
                // console.log(tkInfo[0]+"",'-------')
                // setTokenId(tkInfo[0]+"")
                // if (tokenAddress === '0x0000000000000000000000000000000000000000') {
                //     status.innerText = 'No token found for this domain';
                //     toast.error(status.innerText, { transition: Zoom });
                //     document.getElementById('tokenDetails').style.display = 'none';
                //     setCurrentTokenAddress(  '');
                //     // document.getElementById('tokenContract').value = '';
                //     // window.history.replaceState({}, '', `/okxfun/`);
                //     return;
                // }
                setCurrentTokenAddress(  tokenAddress)

                // setTokenCount(getContract(currentTokenAddress,erc20Abi))
                await fetchTokenInfo(tokenAddress);
                status.innerText = '';
                setNameStatus(status.innerText)
                // window.history.replaceState({}, '', `?domain=${encodeURIComponent(domainInput)}`);
            } catch (error) {
                status.innerText = `Domain not found or token not launched `;//: ${error.message.includes('revert') ? error.message.split('revert')[1]?.trim() || 'Domain not registered' : error.message}`;
                document.getElementById('tokenDetails').style.display = 'none';
                setNameStatus(status.innerText)
                setCurrentTokenAddress(  '')
                // document.getElementById('tokenContract').value = '';
                // toast.error(status.innerText, { transition: Zoom });
                // window.history.replaceState({}, '', `/okxfun/`);
            }
        }
    }, [domainInput])

    const handleDomainChange =  (e) => {
        const value = e.target.value;


        let domainInput = value.trim();

        let status = {};

        // const parts = domainInput.split('.');
        if (domainInput.length < 1 ) {
            status.innerText = 'Invalid domain format. Use format like Jace';
            setNameStatus(status.innerText)
            document.getElementById('tokenDetails').style.display = 'none';
            //toast.error(status.innerText, { transition: Zoom });
            return;
        }
        if(domainInput.toLowerCase() == 'gdog'
            ||domainInput.toLowerCase() == 'gcat'
            ||domainInput.toLowerCase() == 'mima'
            ||domainInput.toLowerCase() == 'lucky'
            ||domainInput.toLowerCase() == 'gt'
        ){
            return ;
        }

        // domainInput = `${parts[0]}.${parts[1].toUpperCase()}` ; // Normalize to .OKX

        setDomainInput(domainInput);
        // document.getElementById('domainInput').value = domainInput; // Update input field

    }
    async function fetchTokenInfo(currentTokenAddress) {

        try {

            // console.log("fetchTokenInfo",currentTokenAddress)
            const tokenContract =  getJsonRpcContract(currentTokenAddress,erc20Abi);

            const name = await tokenContract.name();
            const symbol = await tokenContract.symbol();
            const tokenState = await tokenFactoryContract.tokens(currentTokenAddress);
            const collateral = await tokenFactoryContract.collateral(currentTokenAddress);
            const fundingGoal = await tokenFactoryContract.FUNDING_GOAL();
            const progress = (Number(collateral) / Number(fundingGoal)) * 100;

            let st =
            {
                name: name,
                symbol:symbol,
                    progress: progress,
                state: ['Not Created', 'Funding', 'Trading'][tokenState],
            };
            setTokenInfo(st);

            // document.getElementById('tokenDetails').innerText = `Token: ${name} (${symbol})`;
            // document.getElementById('progressResult').innerText = `Funding Progress: ${progress.toFixed(2)}% (State: ${['Not Created', 'Funding', 'Trading'][tokenState]})`;
            // document.getElementById('progressBar').style.width = `${Math.min(progress, 100)}%`;
            document.getElementById('tokenDetails').style.display = '';

            const isFunding = tokenState == 1 && address;
            // document.getElementById('buyAmount').disabled = !isFunding;
            // document.getElementById('sellAmount').disabled = !isFunding;
            // document.querySelectorAll('.percent-buttons button').forEach(btn => btn.disabled = !isFunding);
            // document.getElementById('buyButton').disabled = !isFunding;
            // document.getElementById('sellButton').disabled = !isFunding;

             await updateBalances(currentTokenAddress);
        } catch (error) {
            console.log("fetchTokenInfo err",error)
            let st =
                {
                    name: "",
                    progress: 0,
                    state: 'Not Created',
                };
            setTokenInfo(st);
            document.getElementById('tokenDetails').style.display = 'none';
            // document.getElementById('progressResult').innerText = '';
            document.getElementById('progressBar').style.width = '0%';
            // document.getElementById('tokenDetails').innerText = `Failed to fetch token info: ${error.message}`;
            // document.getElementById('tokenBalance').innerText = 'Failed to fetch token info';
            // document.getElementById('buyAmount').disabled = true;
            // document.getElementById('sellAmount').disabled = true;
            // document.querySelectorAll('.percent-buttons button').forEach(btn => btn.disabled = true);
            // document.getElementById('buyButton').disabled = true;
            // document.getElementById('sellButton').disabled = true;
        }
    }
    const updateBalances = async (currentTokenAddress) =>{

        if (!web3 || !address) {
            document.getElementById('okbBalance').innerText = 'Please connect wallet';
            document.getElementById('tokenBalance').innerText = 'Please connect wallet';
            return;
        }
        try {
            // const okbBalance = await web3.eth.getBalance(address);
            const okbBalance = baseAssets.length>0 ? baseAssets[0].balance :0;
             setOkbBalance(okbBalance+"")


            document.getElementById('okbBalance').innerText = `Balance: ${okbBalance} `+(NetworksData[window.currChainId] ? NetworksData[window.currChainId].nativeCurrency.symbol :'');
            if (currentTokenAddress) {
                const tokenContract =  getJsonRpcContract(currentTokenAddress,erc20Abi);
                // tokenContract = new web3.eth.Contract(erc20Abi, currentTokenAddress);
                const tokenBalance = await tokenContract.balanceOf(address);
                const symbol = await tokenContract.symbol();
                const tokenBalanceNum = fromWei(tokenBalance,18 );
                setTokenBalance(tokenBalanceNum+"")
                document.getElementById('tokenBalance').innerText = `Balance: ${tokenBalanceNum} ${symbol}`;
            } else {
                document.getElementById('tokenBalance').innerText = 'Please search a domain';
            }
        } catch (error) {
            if(document.getElementById('okbBalance'))
            document.getElementById('okbBalance').innerText = 'Failed to fetch  balance';
            if(document.getElementById('tokenBalance'))
            document.getElementById('tokenBalance').innerText = 'Failed to fetch token balance';
        }
    }

    const buyTokens_old = async () => {
        if (!web3 || !address || !currentTokenAddress) {
            setTransactionStatus( 'Please connect wallet and select a token');
            return;
        }
        //const amount = document.getElementById('buyAmount').value;
        const amount = buyAmount;
        if (!amount || amount <= 0) {
            setTransactionStatus( 'Please enter a valid amount');
            return;
        }
        try {
            const tokenState = await tokenFactoryContract.tokens(currentTokenAddress);
            if (tokenState != 1) {
                setTransactionStatus( 'Token is not in funding state');
                return;
            }
            setTransactionStatus( 'Buying tokens...');

            // const gas = await tokenFactoryContract.buyTokens(currentTokenAddress).estimateGas({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') });
            // await tokenFactoryContract.buyTokens(currentTokenAddress).send({ from: address, value: web3.utils.toWei(amount, 'ether'), gas: Math.floor(gas * 1.2) });
           // console.log(toWei(amount, 18)+"")


            await tokenFactoryContract.buyTokens(currentTokenAddress,{ from: address, value: toWei(amount, 18)+"" });
            setTransactionStatus( 'Buy successful!');
            await fetchTokenInfo(currentTokenAddress);
        } catch (error) {
            setTransactionStatus( `Buy failed: ${error.message}`);
        }
    }

    const buyTokens = async () => {
        if (!web3 || !address || !currentTokenAddress) {
            setTransactionStatus( 'Please connect wallet and select a token');
            return;
        }
        const amount = buyAmount;
        if (!amount || amount <= 0) {
            setTransactionStatus( 'Please enter a valid amount');
            return;
        }
        try {
            const tokenState = await tokenFactoryGdogContract.tokens(currentTokenAddress);
            if (tokenState != 1) {
                setTransactionStatus( 'Token is not in funding state');
                return;
            }
            setTransactionStatus( 'Selling tokens...');

            const tokenContract =  getJsonRpcContract(currentTokenAddress,erc20Abi);
            const symbol = await tokenContract.symbol();
            // tokenContract = new web3.eth.Contract(erc20Abi, currentTokenAddress);
            // const tokenBalance = await tokenContract.balanceOf(address);


            onBuy(tokenFactoryGdogContract,currentTokenAddress,symbol,tokenFactoryAddress,amount,address);

            // const allowance =  await tokenContract.allowance(address, tokenFactoryAddress)
            // if (fromWei(allowance, 18).lt(amount)) {
            //     await tokenContract.approve(tokenFactoryAddress,toWei(amount, 18)+"");
            //     await tokenFactoryContract.sellTokens(currentTokenAddress, toWei(amount, 18)+"");//.send({ from: accounts[0], gas: Math.floor(gas * 1.2) });
            // }else {
            //     await tokenFactoryContract.sellTokens(currentTokenAddress, toWei(amount, 18)+"");//.send({ from: accounts[0], gas: Math.floor(gas * 1.2) });
            // }

            // const gas = await tokenFactoryContract.methods.sellTokens(currentTokenAddress, web3.utils.toWei(amount, 'ether')).estimateGas({ from: accounts[0] });
            setTransactionStatus( 'Sell successful!');
            await fetchTokenInfo(currentTokenAddress);
        } catch (error) {
            setTransactionStatus( `Sell failed: ${error.message}`);
        }
    }
    const sellTokens = async () => {
        if (!web3 || !address || !currentTokenAddress) {
            setTransactionStatus( 'Please connect wallet and select a token');
            return;
        }
        const amount = sellAmount;
        if (!amount || amount <= 0) {
            setTransactionStatus( 'Please enter a valid amount');
            return;
        }
        try {
            const tokenState = await tokenFactoryContract.tokens(currentTokenAddress);
            if (tokenState != 1) {
                setTransactionStatus( 'Token is not in funding state');
                return;
            }
            setTransactionStatus( 'Selling tokens...');

            const tokenContract =  getJsonRpcContract(currentTokenAddress,erc20Abi);
            const symbol = await tokenContract.symbol();
            // tokenContract = new web3.eth.Contract(erc20Abi, currentTokenAddress);
            const tokenBalance = await tokenContract.balanceOf(address);


            onSell(tokenFactoryContract,currentTokenAddress,symbol,tokenFactoryAddress,amount,address);

            // const allowance =  await tokenContract.allowance(address, tokenFactoryAddress)
            // if (fromWei(allowance, 18).lt(amount)) {
            //     await tokenContract.approve(tokenFactoryAddress,toWei(amount, 18)+"");
            //     await tokenFactoryContract.sellTokens(currentTokenAddress, toWei(amount, 18)+"");//.send({ from: accounts[0], gas: Math.floor(gas * 1.2) });
            // }else {
            //     await tokenFactoryContract.sellTokens(currentTokenAddress, toWei(amount, 18)+"");//.send({ from: accounts[0], gas: Math.floor(gas * 1.2) });
            // }

            // const gas = await tokenFactoryContract.methods.sellTokens(currentTokenAddress, web3.utils.toWei(amount, 'ether')).estimateGas({ from: accounts[0] });
            setTransactionStatus( 'Sell successful!');
            await fetchTokenInfo(currentTokenAddress);
        } catch (error) {
            setTransactionStatus( `Sell failed: ${error.message}`);
        }
    }
    const createDomainToken = async () => {
        //gdog，gcat，mima，lucky，gt

        // const tokenId = document.getElementById('tokenId').value;
        if (!tokenId || tokenId <= 0) {
            setCreateDomainStatus( 'Please enter a valid NFT Token ID');
            return;
        }
        if(tokenId.toLowerCase() == 'gdog'
            ||tokenId.toLowerCase() == 'gcat'
            ||tokenId.toLowerCase() == 'mima'
            ||tokenId.toLowerCase() == 'lucky'
            ||tokenId.toLowerCase() == 'gt'
            ){
            return ;
        }
        try {
            // setCreateDomainStatus( 'Checking NFT ownership...');
            // const owner = await nftContract.ownerOf(tokenId);
            // if (owner.toLowerCase() !== address.toLowerCase()) {
            //     setCreateDomainStatus( 'You do not hold this NFT');
            //     return;
            // }
            setCreateDomainStatus( 'Creating domain token...');
            // const result = await jaceFunContract.launchToken(tokenId);//.send({ from: accounts[0], gas: Math.floor(gas * 1.2) });


            const mintTx = await jaceFunContract.mint(tokenId);//.send({ from: accounts[0], gas: Math.floor(gasMint * 1.2) });

             // currentTokenAddress = tokenAddress;



            setCreateDomainStatus( `Domain token created: ${tokenId}`);

            setTimeout(async function () {
                const tokenAddress = await jaceFunContract.getTokenAddressById(tokenId);
                setCurrentTokenAddress(tokenAddress) ;
                await fetchTokenInfo(tokenAddress);
                await updateBalances(tokenAddress);
            },3000)


        } catch (error) {
            setCreateDomainStatus( `Create failed: ${error.message.includes('revert') ? error.message.split('revert')[1]?.trim() || 'Unknown reason' : error.message}`);
        }
    }
    return (
        <div className="min-h-80 flex justify-center xl:px-0 px-5 mx-auto relative xl:pb-0 2xl:pb-[150px]">
            <div className="gradient-bg shadow-[0_0_50px_#48003d] relative z-[10] rounded-[5px]">
                <div className="solid-bg screen-w-600px rounded-[15px] px-3 md:px-6 py-3 md:py-4">
                    <div className="text-black">
                        <h2 className="box-title f-f-fg text-[23px] md:text-[27px] leading-10 text-white font-normal">
                            Token LaunchPad!
                        </h2>

                        {/* Token Contract */}
                        <div className="flex flex-col mt-3">
                            <label>Domain Name:</label>
                        <input
                        className="w-full border rounded p-2 mb-4 border-input"
                        type="text"
                        id="address"
                        placeholder="Enter domain (e.g., Jace)"
                        onChange={handleDomainChange}
                        />
                        <label className="font-13 text-error-red">{nameStatus}</label>
                            <label>Token Contract Address:</label>
                            <input
                                className="w-full border rounded p-2 mb-4 border-input text-[12px]"
                                type="text"
                                id="address"
                                placeholder="Token address will be populated after search"
                                readOnly
                                value={currentTokenAddress || ""}
                            />

                                <div id="tokenDetails">
                            <div className='flex flex-col justify-center w-full items-center font-13' >
                                <div  className="status">
                                    Token: {tokenInfo.name} ({tokenInfo.symbol})
                                </div>
                                <div id="progressResult" className="status">
                                    Funding Progress: {tokenInfo.progress.toFixed(2)}% (State: {tokenInfo.state})
                                </div>
                                <div className="progress-bar">
                                    <div
                                        id="progressBar"
                                        className="progress"
                                        style={{ width: `${tokenInfo.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Buy Tokens */}
                            <div className="section">
                                <h2>Buy Tokens</h2>
                                <label className="font-13">
                                    Amount
                                    <span id="okbBalance" className="balance">
                                        Balance: {okbBalance} {NetworksData[window.currChainId] ? NetworksData[window.currChainId].nativeCurrency.symbol :''}
                                    </span>
                                </label>
                                <label className="font-13">
                                     ,
                                    <span  className="balance">
                                         {gdogBalance} gdog
                                    </span>
                                </label>

                                <input
                                    className="w-full border rounded p-2 mb-4 border-input"
                                    type="number"
                                    id="buyAmount"
                                    placeholder="0.0"
                                    step="0.0001"
                                    value={buyAmount}
                                    onChange={(e) => setBuyAmount(e.target.value)}
                                    disabled={!isConnected}
                                />
                                <div className="percent-buttons">
                                    {[25, 50, 75, 100].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPercent(p, "buy")}
                                            disabled={!isConnected}
                                        >
                                            {p === 100 ? "Max" : `${p}%`}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-center w-full mt-3">
                                    <button
                                        id="buyButton"
                                        className="main-btn"
                                        onClick={buyTokens}
                                        disabled={!isConnected }
                                    >
                                        {isConnected ? "Buy Tokens" : "Connect Wallet First"}
                                    </button>
                                </div>
                            </div>

                            {/* Sell Tokens */}
                            <div className="section">
                                <h2>Sell Tokens</h2>
                                <label className="font-13">
                                    Amount (Tokens):{" "}
                                    <span id="tokenBalance" className="balance">
                                        Balance: {tokenBalance} {tokenInfo.name}
                                    </span>
                                </label>
                                <input
                                    className="w-full border rounded p-2 mb-4 border-input"
                                    type="number"
                                    id="sellAmount"
                                    placeholder="0.0"
                                    step="0.0001"
                                    value={sellAmount}
                                    onChange={(e) => setSellAmount(e.target.value)}
                                    disabled={!isConnected}
                                />
                                <div className="percent-buttons">
                                    {[25, 50, 75, 100].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPercent(p, "sell")}
                                            disabled={!isConnected}
                                        >
                                            {p === 100 ? "Max" : `${p}%`}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-center w-full mt-3">
                                    <button
                                        id="sellButton"
                                        className="main-btn"
                                        onClick={sellTokens}
                                        disabled={!isConnected}
                                    >
                                        {isConnected ? "Sell Tokens" : "Connect Wallet First"}
                                    </button>
                                </div>
                            </div>

                            <div id="transactionStatus" className="status">
                                {transactionStatus}
                            </div>
                        </div>
                        </div>

                        {/* Create Domain Token */}
                        <div className="section  mt-3">
                            <h2>Create Domain Token</h2>
                            <label className="font-13">Domain Name:</label>
                            <input
                                className="w-full border rounded p-2 mb-4 border-input"
                                id="tokenId"
                                placeholder="Enter Domain Name"
                                value={tokenId}
                                onChange={(e) => setTokenId(e.target.value)}
                                disabled={!isConnected}
                            />
                            <div className="flex justify-center w-full mt-3">
                                <button
                                    id="createDomainToken"
                                    className="main-btn"
                                    onClick={createDomainToken}
                                    disabled={!isConnected}
                                >
                                    {isConnected ? "Create Domain Token" : "Connect Wallet First"}
                                </button>
                            </div>
                            <div id="createDomainStatus" className="status">
                                {createDomainStatus}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TokenOperations;
