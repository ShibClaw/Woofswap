import React, {useContext, useEffect, useMemo, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import BigNumber from 'bignumber.js'
import TabFilter from '../../components/common/TabFilter'
import SearchInput from '../../components/common/Input/SearchInput'
import Table from '../../components/pages/vote/table'
import Timer from '../../components/common/Timer'
import MobileFilter from '../../components/common/MobileFilterModal'
import {formatAmount, getLPSymbol, ZERO_ADDRESS} from '../../utils/formatNumber'
import VeWOOFSelect from '../../components/common/VeWOOFSelect'
import Toggle from '../../components/common/Toggle'
import {useEpochTimer, useVoteEmissions} from '../../hooks/useGeneral'
import {PoolTitles} from '../../config/constants'
import {veWOOFsContext} from '../../context/veWOOFsConetext'
import usePrices from '../../hooks/usePrices'
import {GammasContext} from '../../context/GammasContext'
import {useGetExpectedClaimForNextEpoch} from "../../hooks/useRewards";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'

const sortOptions = [
    {
        label: 'APR',
        value: 'apr',
        isDesc: true,
    },

    {
        label: 'Rewards',
        value: 'rewards',
        isDesc: true,
    },
    {
        label: 'Fee',
        value: 'Fee',
        isDesc: false,
    },
    {
        label: 'Bribe',
        value: 'bribe',
        isDesc: false,
    },
    {
        label: 'Total Votes',
        value: 'votes',
        isDesc: true,
    },
    {
        label: 'Your Vote',
        value: 'your',
        isDesc: true,
    },
]

const Vote = () => {
    const [filter, setFilter] = useState(PoolTitles.ALL)
    const [sort, setSort] = useState({})
    const [mobileFilter, setMobileFilter] = useState(false)
    const [isVoted, setIsVoted] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [veWOOF, setVeWOOF] = useState(null)
    const [percent, setPercent] = useState({})
    const pairs = useContext(GammasContext)
    // const pairs = useContext(PairsContext)

    const veWOOFs = useContext(veWOOFsContext)
    // const {voteEmssions} = useVoteEmissions()
    const voteEmssions = 0;
    const {days, hours, mins, epoch} = useEpochTimer()
    const veRewards = useGetExpectedClaimForNextEpoch(veWOOF)
    const { address, chainId, isConnected } = useWeb3ModalAccount()

    const navigate = useNavigate()
    const prices = usePrices()
    let {veId} = useParams()

    const totalWeight = useMemo(() => {
        if (pairs && pairs.length > 0 && prices) {
            const totalWeight = pairs.reduce((sum, cur) => {
                return sum.plus(0)
            }, new BigNumber(0))
            return  totalWeight
        }
        return new BigNumber(0)
    }, [pairs, prices])

    useEffect(() => {
        if (veWOOFs && veWOOFs.length > 0 && veId) {

            const item = veWOOFs.find((ele) => ele.id+"" === veId)
            if (!item) {
                navigate('/404')
                return
            }
            setPercent({})
            setVeWOOF(item)
        }
    }, [veWOOFs, veId])

    const totalInfo = useMemo(() => {
        return [
            {
                title: 'Your veWOOF Balance',
                balance: veWOOF ? formatAmount(veWOOF.voting_amount) : '-',
            },
            {
                title: 'Emissions / % of Vote',
                balance: '$' + formatAmount(voteEmssions),
            },
            // {
            //   title: 'Average Voting APR',
            //   balance: formatAmount(avgApr) + '%',
            // },
            // {
            //   title: 'Last Week APR',
            //   balance: '106%',
            // },
            {
                title: `Epoch ${epoch} Ends In`,
                balance: `${days}d ${hours}h ${mins}m`,
            },
        ]
    }, [veWOOF, voteEmssions, totalWeight, mins])

    const totalInfoTime = useMemo(() => {
        return [
            {
                days0: days < 10 ? 0: (days+'').charAt(0),
                days1: days < 10 ? (days+'').charAt(0):(days+'').charAt(1),
            },
            {
                hours0: hours < 10 ? 0: (hours+'').charAt(0),
                hours1: hours < 10 ?  (hours+'').charAt(0):(hours+'').charAt(1),
            },
            {
                mins0: mins < 10 ? 0: (mins+'').charAt(0),
                mins1: mins < 10 ?  (mins+'').charAt(0):(mins+'').charAt(1),
            },

        ]
    }, [veWOOF, voteEmssions, totalWeight, mins])

    const pools = useMemo(() => {

        return pairs
            .filter((pair) => pair.gauge.address !== ZERO_ADDRESS && pair.isValid)
            .map((pair) => {
                let votes = {
                    weight: new BigNumber(0),
                    weightPercent: new BigNumber(0),
                }
                if (veWOOF && veWOOF.votes.length > 0) {
                    const found = veWOOF.votes.find((ele) => ele.address.toLowerCase() === pair.address.toLowerCase())
                    if (found) {
                        votes = found
                    }
                }
                return {
                    ...pair,
                    votes,
                }
            })
    }, [pairs, veWOOF,chainId])

    useEffect(() => {
        if (veWOOF) {
            setPercent({})
            setVeWOOF(veWOOFs.find((item) => item.id === veWOOF.id))
        }
    }, [veWOOFs, veWOOF])

    const votedGauges = useMemo(() => {
        const temp = []
        for (let i = 0; i < Object.keys(percent).length; i++) {
            const key = Object.keys(percent)[i]
            if (!isNaN(Number(percent[key])) && Number(percent[key]) !== 0) {
                const found = pools.find((pool) => pool.address === key)
                temp.push({
                    ...found,
                    votes: percent[key],
                })
            }
        }
        return temp
    }, [pools, percent])

    const totalPercent = useMemo(() => {
        return Object.values(percent).reduce((sum, current) => {
            return sum + (!current || current === '' ? 0 : Number(current))
        }, 0)
    }, [percent])

    return (
        <>
            <div
                className='min-h-80  px-5 sm:px-16 md:px-28 mdLg:px-40 lg:px-5 xl:px-0 pt-20  md:pt-[120px] mx-auto'>
                <div className='lg:flex items-end justify-between lg:space-x-2 xl:space-x-[20px]'>
                    <div className='lg:w-[30%] xl:w-1/3'>
                        <div className='max-w-[450px]'>
                            <h1 className='text-page-title'>Vote</h1>
                            <p className='text-page-title-tips text-[#b8b6cb] text-base md:text-lg leading-[22px] md:leading-6 mt-24px'>
                                Select your veWOOF and use 100% of your votes for one or more pools to earn bribes and
                                trading fees. {''}
                                <a href='https://woofswap.gitbook.io/woofswap/introduction/woofswap' target='_blank' rel='noreferrer'>
                                     <img className="icon-size-help icon-help invert-img" src="/image/swap/question-mark.png" />
                  {/*<span className='!text-lg text-green'>Learn More</span>*/}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/*lg:w-[70%] xl:w-2/3*/}
                    {/*<Timer arr={totalInfo} className={`flex timer-box bg-white  mt-4 lg:mt-0`} />*/}



                    <div className="countdown-box">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <span>{totalInfoTime[0].days0}</span>
                                <span>{totalInfoTime[0].days1}</span>
                                <span>:</span>
                            </div>
                            <div className="flex items-center">
                                <span>{totalInfoTime[1].hours0}</span>
                                <span>{totalInfoTime[1].hours1}</span>
                                <span>:</span>
                            </div>
                            <div className="flex items-center">
                                <span>{totalInfoTime[2].mins0}</span>
                                <span>{totalInfoTime[2].mins1}</span>
                            </div>
                        </div>

                        <div className="countdown-box-row">
                            Epoch<span className="epoch-text">{`${epoch}`}</span>Ends In
                        </div>
                    </div>
                </div>
                <div className="table-normal-header w-full flex justify-between items-end mt-48px">
                    <div className=' hidden lg:flex items-center space-x-8'>
                        <TabFilter data={Object.values(PoolTitles)} filter={filter} setFilter={setFilter}
                                   className={'w-[290px]'}/>
                        <div className='flex items-center space-x-2'>
                            <p className='text-color-2 font-semibold text-sm text-[13px] whitespace-nowrap'>Voted Only</p>
                            <Toggle checked={isVoted} onChange={() => setIsVoted(!isVoted)} toggleId='isVoted'/>
                        </div>
                    </div>
                    <div className='flex items-center justify-between  lg:space-x-7 xl:space-x-[60px] relative mobile-flex-1'>
                        <div
                            className='w-full lg:w-[55%] xl:w-1/2 lg:flex-row flex flex-col-reverse lg:items-center lg:space-x-5'>
                            <VeWOOFSelect className={'lg:max-w-[300px] w-full'} isSelected={veWOOF}
                                           setIsSelected={setVeWOOF}/>
                            <div className='flex items-center mt-3.5 lg:mt-0'>
                                <SearchInput className={''} searchText={searchText} setSearchText={setSearchText}
                                             placeholder='Search LP'/>
                                {/* filter button for mobile */}
                                <button
                                    onClick={() => {
                                        setMobileFilter(!mobileFilter)
                                    }}
                                    className='w-12 flex-shrink-0 h-[42px] lg:hidden ml-3'
                                >
                                    <img alt=''
                                         className='w-12 h-[4w-full flex items-center h-[42px] rounded-[3px] bg-[#000045] bg-opacity-80 px-42px]'
                                         src='/image/liquidity/filter.svg'/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-between w-full lg:space-x-7 xl:space-x-[60px] relative'>
                    {/* for desktop */}
                    {/* mobile filters popup */}
                    {mobileFilter && (
                        <MobileFilter
                            setMobileFilter={setMobileFilter}
                            setFilter={setFilter}
                            filter={filter}
                            tabs={Object.values(PoolTitles)}
                            isVote={true}
                            isVoted={isVoted}
                            setIsVoted={setIsVoted}
                            sort={sort}
                            setSort={setSort}
                            sortOptions={sortOptions}
                        />
                    )}
                </div>
                <div>
                    {votedGauges.length > 0 && (
                        <>
                            <p className='text-grey-2 f-f-fg'>Your Votes:</p>
                            <div
                                className='flex overflow-auto mb-4 lg:mb-0 pb-2 lg:pb-0  w-full mt-1.5 lg:-mt-2.5 space-x-4 lg:space-x-8'>
                                {votedGauges.map((pool, idx) => {
                                    return (
                                        <div key={idx}
                                             className='flex lg:my-4 flex-shrink-0 max-w-[280px] lg:max-w-[264px] xl:max-w-[275px] rounded-md border border-main'>
                                            <div
                                                className={`flex items-center w-3/4 bg-[#0000FF1A] rounded-tl-md rounded-bl-md border-r border-white`}>
                                                <button
                                                    className='border-r border-white md:w-10 md:h-10'
                                                    onClick={() => {
                                                        setPercent({
                                                            ...percent,
                                                            [pool.address]: '',
                                                        })
                                                    }}
                                                >
                                                    <img className="invert-img" alt='' src='/image/vote/remove-button.svg'/>
                                                </button>
                                                <div className='flex items-center w-full space-x-2 ml-1.5 py-1.5'>
                                                    <div className='flex items-center  -space-x-2'>
                                                        <img className='relative w-6 h-6 z-10' alt=''
                                                             src={pool.token0.logoURI?pool.token0.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"}/>
                                                        <img className='relative w-6 h-6 z-[5]' alt=''
                                                             src={pool.token1.logoURI?pool.token1.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"}/>
                                                    </div>
                                                    <div className='text-grey-2'>
                                                        <p className='text-[1rem] font-semibold f-f-fg lg:text-base xl:text-[17px] leading-5'>{getLPSymbol(pool)}</p>
                                                        <p className='tracking-[0.66px] text-[11px] xl:text-xs leading-none'>{pool.stable ? 'STABLE' : 'VOLATILE'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative w-1/5 lg:w-[28%]'>
                                                <input
                                                    onChange={(e) => {
                                                        const val = isNaN(Number(percent[pool.address])) ? 0 : Number(percent[pool.address])
                                                        const newVal = isNaN(Number(e.target.value)) || Number(e.target.value) < 0 ? 0 : Math.floor(Number(e.target.value))
                                                        const maxValue = 100 - totalPercent + val === 0 ? '' : 100 - totalPercent + val
                                                        let final = newVal === 0 ? '' : totalPercent - val + newVal > 100 ? maxValue : newVal
                                                        setPercent({
                                                            ...percent,
                                                            [pool.address]: !e.target.value ? '' : final,
                                                        })
                                                    }}
                                                    type={'number'}
                                                    className='py-3 w-[90%] pl-3 text-white font-medium text-lg lg:text-xl bg-transparent'
                                                    value={pool.votes}
                                                />
                                                <span
                                                    className='text-grey-2 font-medium text-lg lg:text-xl absolute right-0 z-10 mt-3 -mr-1.5 lg:mr-1.5'>%</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
                <Table
                    pools={pools}
                    sort={sort}
                    setSort={setSort}
                    sortOptions={sortOptions}
                    filter={filter}
                    searchText={searchText}
                    isVoted={isVoted}
                    veWOOF={veWOOF}
                    percent={percent}
                    setPercent={setPercent}
                    totalPercent={totalPercent}
                    veRewards={veRewards}
                />
            </div>
        </>
    )
}

export default Vote
