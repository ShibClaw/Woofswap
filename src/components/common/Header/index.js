import React, {useState, useEffect} from 'react'
import {useLocation, Link} from 'react-router-dom'
// import {useWeb3React} from '../../../hooks/web3'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import ConnectWallet from '../../connectWallet'
import useAuth from '../../../hooks/useAuth'
// import useGoogleAnalytics from '../../../hooks/useGoogleAnalytics'
import './style.scss'
import OutsideClickHandler from 'react-outside-click-handler'
import {connectors} from '../../../config/constants'
import Transaction from '../Transaction'
import {useSelector} from 'react-redux'
import useWalletModal from '../../../hooks/useWalletModal'
import usePrices from '../../../hooks/usePrices'
import {formatAmount} from '../../../utils/formatNumber'
import Menu from './Menu'
import {ConnectorNames} from "../../../utils/connectors";
import {customNotify} from "../../../utils/notify";
import {NetworksData} from "../../../config/constants";
import { defaultChainId } from '../../../config/constants'

import ThemeToggleButton from '../../../components/common/ThemeToggleButton/index';
import {useTheme} from "../ThemeToggleButton/ThemeContext";

import {
    createWeb3Modal,
    defaultConfig,
    useWeb3Modal,
    useWeb3ModalEvents,
    useWeb3ModalState,
    useWeb3ModalTheme
} from '@web3modal/ethers/react'

const links = [
    {
        name: 'Swap',
        link: '/swap',
        isAll:true,
    },
    // {
    //   name: 'Liquidity',
    //   dropdown: true,
    //   link: [
    {
        name: 'Liquidity',
        link: '/liquidity/liquidity',
        isAll:true,
    },

    //     {
    //       name: 'Migration',
    //       link: '/liquidity/migration',
    //     },
    //   ],
    // },
    // {
    //   name: 'LIQUIDITY',
    //   link: '/liquidity',
    // },
    {
        name: 'Lock',
        link: '/lock',
        isAll:true,
    },
    {
        name: 'Vote',
        link: '/vote',
        isAll:true,
    },
    {
        name: 'Rewards',
        link: '/rewards',
        isAll:true,
    },
    {
        name: 'Bribe',
        link: '/bribe',
        isAll:true,
    },
    // {
    //     name: 'Whitelist',
    //     link: '/whitelist',
    //     isAll:true,
    // },
    // {
    //   name: 'Referral',
    //   link: '/referral',
    // },
    // {
    //     name: 'More',
    //     dropdown: true,
    //     link: [
    //         {
    //             name: 'Docs',
    //             link: 'https://woofswap.gitbook.io/woofswap/introduction/woofswap',
    //             external: true,
    //         },
    //     ],
    // },
    // {
    //     name: 'Bridge',
    //     link: 'https://shibarium.shib.io/bridge',
    //     external: true,
    //     isAll:true,
    // },
    {
        name: 'Twitter',
        link: 'https://twitter.com/woofswap',
        external: true,
        isAll:true,
    },
    // {
    //     name: 'Discord',
    //     link: 'https://discord.com/invite/Q8qGcTuSUK',
    //     external: true,
    //     isAll:true,
    // },
    {
        name: 'Docs',
        link: 'https://woofswap.gitbook.io/woofswap/introduction/woofswap',
        external: true,
        isAll:true,
    },
]

const MobileMenu = ({item, idx, route}) => {

    const [isOpen, setIsOpen] = useState(false)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    return (
        <li key={idx} className={`${route.pathname === item.link &&'links-sky'}  links`} >
            {item.dropdown ? (
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setIsOpen(false)
                    }}
                >
                    <div className='relative'>
                        <div
                            onClick={() => {
                                setIsOpen(!isOpen)
                            }}
                            className='flex items-center space-x-1 cursor-pointer relative z-10  font-light text-blue'
                        >
                            <span>{item.name}</span>
                            <img
                                alt='dropdown'
                                src='/image/header/dropdown-arrow.svg'
                                className={`${!isOpen ? 'rotate-180' : 'rotate-0'} icon-size-normal transition-all duration-150 ease-in-out`}
                            />
                        </div>
                        {isOpen && (
                            <div
                                className='py-3 px-[22px] w-[205px] absolute top-10 border border-[#f06500] bg-[#090333] -left-[74px] z-40 rounded-[3px] flex flex-col text-grey text-[17px] leading-9'>
                                {item.link.map((_item, j) => {
                                    return _item.external ? (
                                        <div
                                            className='doc-link'
                                            id={'test'}
                                            key={`subitem-${j}`}
                                            onClick={() => {
                                                window.open(_item.link, '_blank')
                                                setIsOpen(false)
                                            }}
                                        >
                                            {_item.name}
                                        </div>
                                    ) : (
                                        <Link
                                            key={j}
                                            onClick={() => {
                                                setIsOpen(false)
                                            }}
                                            className={`${route.pathname === _item.link && 'text-sky'} no-link text-grey-1`}
                                            to={_item.link}
                                        >
                                            <span>{_item.name}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </OutsideClickHandler>
            ) : (
                (chainId != 719 && ! item.isAll) ?
                    (<div className={`${route.pathname === item.link && 'text-sky'} no-link text-grey-2 flex items-center`} >
                <img
                src= {'/image/icons/'+item.name+".svg"}
                className={`mr-5px icon-size-normal transition-all duration-150 ease-in-out`}
                />
                <span>{item.name}</span>
                </div>):(
                <Link className={`${route.pathname === item.link && 'text-sky'} no-link text-grey-2 flex items-center`} to={item.link}>
                <img
                src= {'/image/icons/'+item.name+".svg"}
                className={`mr-5px icon-size-normal transition-all duration-150 ease-in-out`}
                />
                <span>{item.name}</span>
                </Link>
                    )

            )}
        </li>
    )
}

const Header = () => {
    // useGoogleAnalytics()
    const [open, setOpen] = useState(false)
    const [connector, setConnector] = useState(null)
    const [secondDrop, setSecondDrop] = useState(false)
    const [mobileDrop, setMobileDrop] = useState(false)
    // const {account, error,library,chainId} = useWeb3React()
    const error = null;
    const { address, chainId, isConnected } = useWeb3ModalAccount()

    const {logout,login} = useAuth()
    const [scroll, setScroll] = useState(false)
    const [selected, setSelected] = useState(false)

    const [isTabOpen, setIsTabOpen] = useState(false)
    const [curTabNet, setCurTabNet] = useState("Shibarium")
    const [curTabImg, setCurTabImg] = useState("/image/icons/shib-logo.webp")

    const modal = useWeb3Modal()
    const stateWeb3 = useWeb3ModalState()
    const { themeMode, themeVariables, setThemeMode } = useWeb3ModalTheme()
    const events = useWeb3ModalEvents()

    window.currChainId = chainId
    const tablinks = [
        {
            chainId:109,
            name: 'Shibarium',
            link: 'Shibarium',
            icon:'/image/icons/shib-logo.webp'
        },
        {
            chainId:10088,
            name: 'GateLayer',
            link: 'GT',
            icon:'/image/tokens/GT.png'
        },
        {
            chainId:2420,
            name: 'Rufus Chain',
            link: 'ELON',
            icon:'/image/tokens/ELON.png'
        },
        {
            chainId:86,
            name: 'GateChain',
            link: 'GT',
            icon:'/image/tokens/GT.png'
        },
        {
            chainId:196,
            name: 'X Layer',
            link: 'X Layer',
            icon:'/image/tokens/OKB.png'
        },{
            chainId:177,
            name: 'HashKey Mainnet',
            link: 'HSK',
            icon:'/image/tokens/HSK.png'
        },{
            chainId:860621,
            name: 'PGP Chain',
            link: 'PGA',
            icon:'/image/tokens/PGA.png'
        },
    ]
    const toHex = num => {
        const val = Number(num);
        return "0x" + val.toString(16);
    }
    const switchNetwork = async (network) => {
        modal.open()
        return ;
        if(network == 0){
            customNotify("coming soon!", 'info')
            return
        }

        const provider = window.stargate?.wallet?.ethereum?.signer?.provider?.provider ?? window.ethereum
        //library.provider
        try {
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: toHex(network) }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await provider.request({
                        method: "wallet_addEthereumChain",
                        params: [NetworksData[network]],
                    });
                return true
                } catch (error) {
                    console.error('Failed to setup the network', error)
                    // setError(error);
                }
            }
        }
    };


    const prices = usePrices()

    const route = useLocation()
    // console.log('route.pathname',route.pathname)
    // console.log('route.pathname',route.pathname==='/')

    useEffect(() => {
        if (prices && prices['WOOF']) {
            document.title = `WoofSwap` //- $${formatAmount(prices['WOOF'])}
        }
    }, [prices])
    useEffect(() => {
        window.addEventListener('scroll', () => {
            setScroll(window.scrollY > 30)
        })
    }, [])
    const {isWalletOpen} = useSelector((state) => state.wallet)
    const {openWalletModal, closeWalletModal} = useWalletModal()

    useEffect(() => {
        setOpen(false)
        closeWalletModal()
        setMobileDrop(false)
    }, [route.pathname])

    useEffect(() => {
        window.currChainId = chainId
        for(let i=0;i<tablinks.length;i++){
            if(chainId == tablinks[i].chainId){
                setCurTabImg(tablinks[i].icon)
                setCurTabNet(tablinks[i].name)
            }
        }



    }, [chainId])

    useEffect(() => {
        if (address) {
            // if (!connector && !selected) {
            //     setConnector(connectors[0])
            //     setSelected(false)
            // }
        } else {
            setConnector(null)
        }
    }, [address, connector, selected, setSelected])

    const dropDownhandler = () => {


        modal.open()
        return ;
        console.log(modal)
        console.log(stateWeb3)
        console.log(themeMode)
        console.log(events)


        if (connector) {
            setSecondDrop(!secondDrop)
        } else {
            openWalletModal()
        }
    }

    const onDisconnect = () => {
        logout()
        setConnector(null)
        setSecondDrop(false)
    }

    const onMobileDisconnect = () => {
        logout()
        setConnector(null)
        setMobileDrop(false)
    }
    //
    // const [isDarkMode, setIsDarkMode] = useState(true);
    // const toggleDarkMode = () => {
    //     setIsDarkMode(!isDarkMode);
    // };

    // const [isDarkMode, setIsDarkMode] = useState( localStorage.getItem('styleMode') || 'light');
    //
    // const toggleDarkMode = () => {
    //     const newStyleMode = isDarkMode === 'light' ? 'dark' : 'light';
    //     setIsDarkMode(newStyleMode);
    //     localStorage.setItem('styleMode', newStyleMode);
    // };
    const { isDarkMode, toggleDarkMode } = useTheme();


    return (
        <>

            <div
                className={`${route.pathname === '/' ? 'sidebar' : 'sidebar'}  header-wrap ${scroll ? 'bg-[#090333]' : 'bg-transparent'} transition-all duration-300 ease-in-out  z-[120]`}>
                <div className='header flex justify-center px-new  py-6'>
                    <div className='flex items-center'>
                        <button
                            onClick={() => {
                                setOpen(true)
                                setSecondDrop(false)
                            }}
                            className='bg-transparent w-8 xl:hidden mr-[11px]'
                        >
                            <img className="invert-img" alt='' src='/image/header/hamburger-menu.png'/>
                        </button>

                        <Link to='/'>
                            {
                                isDarkMode == 'light' ? (
                                    <img className='logo-title relative z-10 web-show' alt='' src='/image/header/logo_title-light.png'/>
                                ) : (
                                    <img className='logo-title relative z-10 web-show' alt='' src='/image/header/logo_title.png'/>
                                )
                            }

                            <img className='logo-title-normal relative z-10 mobile-show' alt='' src='/image/header/logo.png'/>
                        </Link>


                    </div>

                    <ul className='navigation left-tab z-20 justify-center hidden xl:flex items-start'>
                        {links.map((item, idx) => {
                            return <Menu item={item} key={`main-${idx}`} idx={idx}/>
                        })}
                    </ul>

                    <div className='flex items-center right-corner-screen'>
                        <div className="btn-net-box relative m-r-8 web-show" >
                            <div
                                className="flex items-center space-x-1 cursor-pointer relative z-10 font-light text-blue"
                                onClick={() => {
                                    //setIsTabOpen(!isTabOpen)
                                        dropDownhandler()
                                }}
                            >
    {
        chainId != 109 && chainId != 2420 && chainId != 196 && chainId != 177 && chainId != 10088 && chainId != 86 && chainId != 860621 ? null :
    <
        img
        className = "icon-size-normal"
        src = {curTabImg}
        />
    }

                             {chainId != 109 && chainId != 2420 && chainId != 196 && chainId != 177 && chainId != 10088 && chainId != 86 && chainId != 860621 ? (
                                <div className='text-error'>
                                     Wrong Network{chainId}
                                </div>
                                ) : <span className="font-bold" >{curTabNet}</span>
                                }

                                {chainId != 109 && chainId != 2420 && chainId != 196 && chainId != 177 && chainId != 10088 && chainId != 86 && chainId != 860621 ? (
                                    null
                                ) : <img
                                    alt='dropdown'
                                    src='/image/icons/icon-select-white.svg'
                                    className="icon-size-mini"
                                />

                                }
                            </div>
                        </div>
                        <img src="/image/common/switch-icon.png" className="icon-size-big mobile-show m-r-15px" onClick={() => {
                            setIsTabOpen(!isTabOpen)
                        }} />
                        {isTabOpen && (
                            <div
                                className='absolute  top-10 flex flex-col nav-box dropdown-box-hover bg-body rounded-[3px] xl:block z-[101]'>
                                {tablinks.map((item, idx) => {
                                    return <div
                                        className='doc-link flex items-center'
                                        key={`net-${idx}`}
                                        onClick={() => {

                                            setIsTabOpen(false)
                                            switchNetwork(item.chainId)
                                        }}
                                    >
                                        <img className="icon-size-normal" src={item.icon} />
                                        <span className="ml-[5px]">{item.name}</span>
                                    </div>
                                })}
                            </div>
                        )}
                        <OutsideClickHandler
                            onOutsideClick={() => {
                                setSecondDrop(false)
                            }}
                        >
                            <div
                                onClick={() => {
                                    dropDownhandler()
                                }}
                                className={`${
                                    connector ? 'max-w-[209px] w-full' : 'text-xs  xl:px-[25px]'
                                } bg-[#bd00ed1a] connector-wallet items-center font-semibold text-sm md:text-sm relative z-20  xl:text-base leading-7  f-f-fg xl:flex`}
                            >

                                {
                                    address ? (
                                        <div className='flex items-center space-x-4  xl:space-x-5'>
                                            <div className='flex items-center flex-shrink-0 space-x-2'>
                                                {/*<img*/}
                                                {/*    src={connector ? (connector.title == 'MetaMask' ? '/image/header/metamask.svg' : connector.logo) : '/image/header/metamask.svg'}*/}
                                                {/*    className='max-w-[24px] h-6 ' alt=''/>*/}


                                                <p className='connector-address'>
                                                    <img className="icon-size-normal mr-[11px]" src='/logo.png' />
                                                    {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ''}
                                                </p>
                                            </div>
                                            {/*<button*/}
                                            {/*    className={`${secondDrop ? ' rotate-180' : ' rotate-0'} duration-300 ease-in-out transform `}>*/}
                                            {/*    <img className='icon-size-normal' src='/image/header/chevron.svg' alt=''/>*/}
                                            {/*</button>*/}
                                        </div>
                                    ) : (
                                      (
                                            <div className='connect-wallet flex items-center'>
                                                <span className="text-white-btn mobile-show">Connect Wallet</span>
                                                <span className="web-show text-white-btn">Connect to a Wallet</span>
                                                <img
                                                    className="icon-size-mini mobile-show"
                                                    alt='dropdown'
                                                    src='/image/icons/icon-select-white.svg'
                                                />
                                               <img
                                                    className="icon-size-normal web-show"
                                                    alt='dropdown'
                                                    src='/image/icons/icon-select-white.svg'
                                                />
                                            </div>
                                        )
                                    )
                                }

                                {/*error ? (*/}
                                {/*<div className='wrong-network'>*/}
                                {/*    Wrong Network*/}
                                {/*</div>*/}
                                {/*) :*/}
                            </div>

                            {secondDrop && (
                                <div
                                    className='m-r-15 dropdown-box-hover absolute max-w-[186px] w-full py-[15px] px-5 border-white bg-body rounded-[3px] top-[30px] xl:block z-[101]'>
                                    <button onClick={onDisconnect} className='flex items-center space-x-[5.73px]'>
                                        <img className='max-w-[24px] h-6' alt='' src='/image/logout-icon.svg'/>
                                        <p className='flex-shrink-0 text-[15px] text-grey-1'>Logout</p>
                                    </button>
                                </div>
                            )}
                        </OutsideClickHandler>
                        <ThemeToggleButton />
                    </div>
                </div>
            </div>

            {/* mobile flow */}
            <div className={`top-bg !z-[1000] xl:hidden ${open ? 'top-0' : 'top-minus'}`}>
                <div className='inner-tab'>
                    <div className='top-navigation'>
                        <button
                            onClick={() => {
                                setOpen(false)
                                setSecondDrop()
                            }}
                            className='bg-transparent w-8 xl:hidden mr-[11px]'
                        >
                            <img className="invert-img" alt='' src='/image/header/hamburger-menu.png'/>
                        </button>

                        <Link to='/swap'>
                            <img className='logo-title-normal' alt='' src='/logo.png'/>
                        </Link>

                    </div>

                    <div className='bottom-navigation w-full'>
                        <ul className='navigation z-20 justify-center xl:flex items-start'>
                            {links.map((item, idx) => {
                                return <MobileMenu item={item} idx={idx} route={route} key={`mobile-${idx}`}/>
                            })}
                        </ul>
                        {/*{*/}
                        {/*    <>*/}
                        {/*        {!connector ? (*/}
                        {/*            <button*/}
                        {/*                onClick={() => {*/}
                        {/*                    openWalletModal()*/}
                        {/*                }}*/}
                        {/*                className='mobile-btn f-f-fg'*/}
                        {/*            >*/}
                        {/*                <div className='line1'/>*/}
                        {/*                <div className='line2'/>*/}
                        {/*                CONNECT WALLET*/}
                        {/*            </button>*/}
                        {/*        ) : (*/}
                        {/*            <div*/}
                        {/*                className='relative max-w-[230px] flex flex-col items-center justify-center w-full'>*/}
                        {/*                <div*/}
                        {/*                    onClick={() => {*/}
                        {/*                        setMobileDrop(!mobileDrop)*/}
                        {/*                    }}*/}
                        {/*                    className='btn-con-wallet px-3 py-[9px] tracking-[1.12px] max-w-[209px] w-full mt-5 text-white text-sm leading-7 connect-wallet-2 f-f-fg '*/}
                        {/*                >*/}
                        {/*                    <div className='flex items-center space-x-7'>*/}
                        {/*                        <div className='flex items-center flex-shrink-0 space-x-2'>*/}
                        {/*                            <img className="icon-size-normal" src='/image/icons/shib-logo.webp' />*/}
                        {/*                            <p className=  'drop-shadow-[0px_0px_4px_#0000004D]'>{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}</p>*/}
                        {/*                        </div>*/}
                        {/*                        /!*<button className='w-4 h-4 flex-shrink-0'>*!/*/}
                        {/*                            /!*<img className='w-full h-full' src='/image/header/chevron.svg'*!/*/}
                        {/*                            /!*     alt=''/>*!/*/}
                        {/*                        /!*</button>*!/*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*                {mobileDrop && (*/}
                        {/*                    <div*/}
                        {/*                        className='absolute max-w-[250px] w-full py-[15px] px-[18px] border-white border hover:border-[#0000FF] bg-body rounded-[3px] top-[80px]'>*/}
                        {/*                        <button onClick={onMobileDisconnect}*/}
                        {/*                                className='flex items-center space-x-[5.73px] w-full'>*/}
                        {/*                            <img className='max-w-[24px] h-6' alt=''*/}
                        {/*                                 src='/image/header/logout-icon.svg'/>*/}
                        {/*                            <p className='flex-shrink-0 text-sm text-grey'>Logout</p>*/}
                        {/*                        </button>*/}
                        {/*                    </div>*/}
                        {/*                )}*/}
                        {/*            </div>*/}
                        {/*        )}*/}
                        {/*    </>*/}
                        {/*}*/}


                    </div>
                </div>

            </div>


            <Transaction/>
        </>
    )
}

export default Header
