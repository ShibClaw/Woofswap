import React, {useState, useMemo, useEffect, useContext} from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import ReactTooltip from 'react-tooltip'
import Pagination from '../../common/Pagination'
import Max from '../../common/Buttons/max'
import Sticky from 'react-stickynode'
import TransparentButton from '../../common/Buttons/transparentButton'
// import useWalletModal from '../../../hooks/useWalletModal'
import {NumberOfRows, PoolTitles} from '../../../config/constants'
import {formatAmount, getLPSymbol, fromWei, toWei} from '../../../utils/formatNumber'
import useWalletModal from '../../../hooks/useWalletModal'
import StyledButton from '../../common/Buttons/styledButton'
import NoFound from '../../common/NoFound'
import {useVote} from '../../../hooks/useVote'
import {customNotify} from '../../../utils/notify'
import {useReset} from '../../../hooks/useLock'
import BigNumber from 'bignumber.js'
import {PairsContext} from "../../../context/PairsContext";
import {BaseAssetsConetext} from "../../../context/BaseAssetsConetext";


const Item = ({usd, content, idx, type}) => {
    const [arrowReverse, setArrowReverse] = useState()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    return !usd.isZero() ? (
        <div className='flex flex-col items-start justify-center'>
            <div
                data-tip
                data-for={`${type}-${idx}`}
                onMouseEnter={() => {
                    setArrowReverse(`${type}-${idx}`)
                }}
                onMouseLeave={() => {
                    setArrowReverse(null)
                }}
                className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px] flex items-end cursor-pointer space-x-1.5'
            >
                <p>{'$' + formatAmount(usd)}</p>
                <button
                    className={`${arrowReverse === `${type}-${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
                    <img className='invert-img' alt='' src='/image/liquidity/small-arrow-bottom.svg'/>
                </button>
            </div>
            <ReactTooltip
                className='max-w-[180px] !bg-[#090333] !border !border-white !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body'
                id={`${type}-${idx}`}
                place='right'
                effect='solid'
            >
                {content}
            </ReactTooltip>
        </div>
    ) : (
        <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>$0</div>
    )
}

const Row = ({idx, isLast, pool, percent, setPercent, totalPercent}) => {
    const {openWalletModal} = useWalletModal()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const {voteTotalWeight} = useContext(PairsContext)

    return (
        <div
            key={idx}
            className={`${idx === 0 && 'rounded-t-[5px]'} ${
                isLast ? 'rounded-b-[5px]' : ''
            } hover-row mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-[#DEDBF2] p-4 lg:py-5 lg:px-6 bg-[#16033A]`}
        >
            <div className='flex w-full  lg:w-[25%] items-center  space-x-3'>
                <div className='flex items-center  -space-x-2'>
                    <img className='relative z-10' alt=''
                         src={pool.token0.logoURI ? pool.token0.logoURI : "/image/tokens/ERC20_" + (chainId?chainId:109) + ".png"}
                         width={30} height={30}/>
                    <img className='relative z-[5]' alt=''
                         src={pool.token1.logoURI ? pool.token1.logoURI : "/image/tokens/ERC20_" + (chainId?chainId:109) + ".png"}
                         width={30} height={30}/>
                </div>
                <div className=''>
                    <p className='text-base xl:text-[19px] leading-[30px] font-medium'>{`${getLPSymbol(pool)}`}</p>
                    <p className='tracking-[0.78px] text-[13px] leading-none'>{pool.title}</p>
                </div>
            </div>
            <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[14%] items-start justify-center web-table-row'>
                <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Voting APR</p>
                <div
                    className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>{formatAmount(pool.gauge.apr, true)}%
                </div>
            </div>

            {/* second row */}
            <div className='flex flex-col items-start mt-3 lg:mt-0 w-1/2 lg:w-[16%] justify-center web-table-row'>
                <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Rewards</p>
                <Item
                    type={'rewards'}
                    usd={pool.rewardUsd}
                    content={
                        <>
                            {pool.veReward && pool.veReward.internalBribe && (
                                <>
                                    {pool.veReward.internalBribe.amounts.map((amount, idx) => {
                                        return amount > 0 ? (
                                            <p key={`bribe-${idx}`}>
                                                {formatAmount(fromWei(amount, pool.veReward.internalBribe.decimals[idx]))} {pool.veReward.internalBribe.symbols[idx]}
                                            </p>
                                        ) : null
                                    })}
                                </>
                            )}

                            {pool.veReward && pool.veReward.externalBribe && (
                                <>
                                    {pool.veReward.externalBribe.amounts.map((amount, idx) => {
                                        return amount > 0 ? (
                                            <p key={`bribe-${idx}`}>
                                                {formatAmount(fromWei(amount, pool.veReward.externalBribe.decimals[idx]))} {pool.veReward.externalBribe.symbols[idx]}
                                            </p>
                                        ) : null
                                    })}
                                </>
                            )}

                        </>
                    }
                    idx={idx}
                />
            </div>
            {' '}

            <div className='flex flex-col w-1/2 mt-2 lg:mt-0 items-start lg:w-[16%] justify-center web-table-row'>
                <div className='text-sm xl:text-base flex items-center space-x-1.5'>
                    <div className='flex flex-col items-start justify-center'>
                        <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Fee</p>
                        <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'></div>
                        <div className='leading-[22px] text-dimGray text-[15px] web-table-row text-right'>

                            {pool.veReward && pool.veReward.internalBribe && (
                                <>
                                    {pool.veReward.internalBribe.amounts.map((amount, idx) => {
                                        return (
                                            <p className='text-right' key={`bribe-${idx}`}>
                                                {formatAmount(fromWei(amount, pool.veReward.internalBribe.decimals[idx]))} {pool.veReward.internalBribe.symbols[idx]}
                                            </p>
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col w-1/2 mt-2 lg:mt-0 items-start lg:w-[16%] justify-center web-table-row'>
                <div className='text-sm xl:text-base flex items-center space-x-1.5'>
                    <div className='flex flex-col items-start justify-center'>
                        <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Bribes</p>
                        <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'></div>
                        <div className='leading-[22px] text-dimGray text-[15px] web-table-row text-right'>
                            {pool.veReward && pool.veReward.externalBribe && (
                                <>
                                    {pool.veReward.externalBribe.amounts.map((amount, idx) => {
                                        return (
                                            <p key={`bribe-${idx}`}>
                                                {formatAmount(fromWei(amount, pool.veReward.externalBribe.decimals[idx]))} {pool.veReward.externalBribe.symbols[idx]}
                                            </p>
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col w-1/2 mt-2 lg:mt-0 items-start lg:w-[16%] justify-center web-table-row'>
                <div className='text-sm xl:text-base flex items-center space-x-1.5'>
                    <div className='flex flex-col items-start justify-center web-table-row'>
                        <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Total Votes</p>
                        <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px] web-table-row '>
                            {pool.veReward && (

                                <p>
                                    {formatAmount(fromWei(pool.veReward.totalVote))}
                                </p>

                            )}

                            {pool.veReward && (

                                <p>
                                    {formatAmount(new BigNumber(pool.veReward.totalVote).div(voteTotalWeight).times(100))}%
                                </p>

                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-start w-1/2 mt-3 lg:mt-0 lg:w-[16%] justify-center web-table-row'>
                <p className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Your Vote</p>
                <div
                    className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>{formatAmount(pool.votes.weight)}</div>
                <p className='leading-[22px] text-dimGray text-[15px]  web-table-row'>{formatAmount(pool.votes.weightPercent)}%</p>
                {/* <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px] flex items-center space-x-1.5'>
          <p>{address ? formatAmount(pool.votes) + '%' : '-'}</p>
        </div> */}
            </div>
            <div className='w-full lg:w-[24%] mt-3.5 lg:mt-0'>
                {!address ? (
                    <div className='w-full flex items-center lg:justify-end'>
                        <TransparentButton

                            onClickHandler={openWalletModal}
                            content={'Connect Wallet'}
                            className='h-10 btn-con-wallet px-[26px] text-white flex lg:max-w-[140px] whitespace-nowrap flex-col items-center justify-center tex-sm xl:text-[17px] '
                        />
                    </div>
                ) : (
                    <div className='flex flex-col lg:items-end justify-end w-full'>
                        <div className='relative w-full lg:w-auto'>
                            <input
                                className='placeholder-dimGray w-full lg:max-w-[202.89px] bg-body h-[52px] rounded-[3px] z-[10] text-color-main pl-5 pr-2 text-lg !border !border-main focus:!placeholder-transparent focus:!border-[2px] block focus-visible:!outline-none'
                                placeholder={'Enter Vote'}
                                type='number'
                                min={0}
                                step={1}
                                value={percent[pool.address] || ''}
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
                            />
                            {!!percent[pool.address] &&
                                <p className='text-lg text-grey-2 absolute top-3 right-20 z-10 '>%</p>}
                            <Max
                                className={'absolute z-10 right-2 top-2'}
                                onClickHanlder={() => {
                                    const val = isNaN(Number(percent[pool.address])) ? 0 : Number(percent[pool.address])
                                    const maxValue = 100 - totalPercent + val
                                    setPercent({
                                        ...percent,
                                        [pool.address]: maxValue === 0 ? '' : maxValue,
                                    })
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const Table = ({
                   pools,
                   sort,
                   setSort,
                   sortOptions,
                   filter,
                   searchText,
                   isVoted,
                   veWOOF,
                   percent,
                   setPercent,
                   totalPercent,
                   veRewards
               }) => {
    const [pageSize, setPageSize] = useState(NumberOfRows[0])
    const [currentPage, setCurrentPage] = useState(0)
    const {onVote, pending} = useVote()
    const {onReset, pending: resetPending} = useReset()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const baseAssets = useContext(BaseAssetsConetext)

    const filteredPools = useMemo(() => {
        let result = pools;
        if (isVoted) {
            result = pools.filter((pool) => pool.votes.address);
        }
        result = result.filter((pool) => isVoted || !isVoted);
        const res = filter === PoolTitles.ALL ? result : result.filter((item) => item.title === filter)
        if (!searchText || searchText === '') {
            return res
        }

        return (
            res &&
            res.filter((item) => {
                const withSpace = item.symbol.replace('/', ' ')
                const withComma = item.symbol.replace('/', ',')
                return (
                    item.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
                    withSpace.toLowerCase().includes(searchText.toLowerCase()) ||
                    withComma.toLowerCase().includes(searchText.toLowerCase())
                )
            })
        )
    }, [pools, filter, searchText, isVoted, veRewards])

    const sortedPools = useMemo(() => {
        let sortArr = filteredPools.sort((a, b) => {
            let res
            switch (sort.value) {
                case sortOptions[0].value:
                    res = a.gauge.voteApr
                        .minus(b.gauge.voteApr)
                        .times(sort.isDesc ? -1 : 1)
                        .toNumber()
                    break
                case sortOptions[1].value:
                    res = a.gauge.weight
                        .minus(b.gauge.weight)
                        .times(sort.isDesc ? -1 : 1)
                        .toNumber()
                    break
                case sortOptions[2].value:
                    res = a.gauge.bribeUsd
                        .minus(b.gauge.bribeUsd)
                        .times(sort.isDesc ? -1 : 1)
                        .toNumber()
                    break
                case sortOptions[3].value:
                    res = a.votes.weight
                        .minus(b.votes.weight)
                        .times(sort.isDesc ? -1 : 1)
                        .toNumber()
                    break

                default:
                    break
            }
            return res
        })
        for (let i = 0; i < sortArr.length; i++) {
            sortArr[i].rewardUsd = new BigNumber(0)
        }
        if (veRewards.length > 0 && sortArr.length > 0) {


            for (let i = 0; i < sortArr.length; i++) {
                sortArr[i].rewardUsd = new BigNumber(0)

                for (let j = 0; j < veRewards.length; j++) {
                    if (sortArr[i].address.toLowerCase() == veRewards[j][0].toLowerCase()) {
                        sortArr[i].veReward = veRewards[j];
                        let rewardUsd = new BigNumber(0)
                        //Bribes
                        sortArr[i].veReward.externalBribe.amounts.map((amount, idx) => {

                            const token = sortArr[i].veReward.externalBribe.tokens[idx].toLowerCase()
                            const decimal = sortArr[i].veReward.externalBribe.decimals[idx]
                            //symbols

                            const found = baseAssets.find((ele) => ele.address.toLowerCase() === token)
                            if (found) {
                                const usdValue = new BigNumber(amount).div(new BigNumber(10).pow(decimal)).times(found.price)
                                rewardUsd = rewardUsd.plus(usdValue)
                            }

                        })
                        //Fee
                        sortArr[i].veReward.internalBribe.amounts.map((amount, idx) => {
                            const token = sortArr[i].veReward.internalBribe.tokens[idx].toLowerCase()
                            const decimal = sortArr[i].veReward.internalBribe.decimals[idx]
                            //symbols

                            const found = baseAssets.find((ele) => ele.address.toLowerCase() === token)
                            if (found) {
                                const usdValue = new BigNumber(amount).div(new BigNumber(10).pow(decimal)).times(found.price)
                                rewardUsd = rewardUsd.plus(usdValue)
                            }
                        })


                        sortArr[i].rewardUsd = rewardUsd

                    }
                }
            }


        }

        return sortArr;
    }, [filteredPools, sort])

    const pageCount = useMemo(() => {
        return Math.ceil(sortedPools.length / pageSize)
    }, [sortedPools, pageSize])

    const handlePageClick = (event) => {
        setCurrentPage(event.selected)
    }

    useEffect(() => {
        setCurrentPage(0)
    }, [pageSize, filter, isVoted, searchText])

    const errorMsg = useMemo(() => {
        if (!veWOOF) {
            return 'veWOOF is not selected'
        }
        if (veWOOF.voting_amount.isZero()) {
            return 'Voting power is zero'
        }
        if (totalPercent !== 100) {
            return 'Total should be 100%'
        }
        return null
    }, [totalPercent, veWOOF])

    return (
        <>
            <div className='w-full lg:mt-2 xl:mt-0 table-normal'>
                {sortedPools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length > 0 ? (
                    <div className='w-full'>
                        <Sticky
                            enabled={true}
                            innerActiveClass={'gradientBorder'}
                            top={95}
                            activeClass={''}
                            innerClass={'table-border-b px-6 lg:flex justify-between hidden z-[100] py-[1rem] lg:!-mb-[19px] xl:!mb-0 lg:!top-[-19px] xl:!top-[0]'}
                            className={`z-[100]`}
                        >
                            <div
                                className='w-[25%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'></div>
                            {sortOptions.map((option, index) => (
                                <div
                                    className={`${index === 0 ? 'w-[14%]' : 'w-[16%]'} font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg web-table-row`}
                                    key={`header-${index}`}>
                                    <div
                                        onClick={() => {
                                            setSort({
                                                ...option,
                                                isDesc: sort.value === option.value ? !sort.isDesc : true,
                                            })
                                        }}
                                        className='flex items-center cursor-pointer space-x-1 -ml-1 relative'
                                    >
                                        {sort.value === option.value && (
                                            <button
                                                className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-3.5`}>
                                                <img alt='' src='/image/liquidity/arrow-bottom.svg'/>
                                            </button>
                                        )}
                                        <p className='flex items-center'>{option.label}</p>
                                    </div>
                                </div>
                            ))}
                            <div
                                className='w-[24%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'></div>
                        </Sticky>
                        <div className='flex flex-col gradient-bg p-px rounded-[5px] shadow-box'>
                            {sortedPools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((pool, idx) => {
                                return (
                                    <Row
                                        isLast={idx === sortedPools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).length - 1}
                                        pool={pool}
                                        idx={idx}
                                        key={idx}
                                        percent={percent}
                                        setPercent={setPercent}
                                        totalPercent={totalPercent}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <NoFound title='No pools found'/>
                )}

            </div>
            <Pagination
                pageSize={pageSize}
                setPageSize={setPageSize}
                handlePageClick={handlePageClick}
                pageCount={pageCount}
                currentPage={currentPage}
                total={sortedPools.length}
            />
            {address && (
                <div
                    className={`bottom-0 md:bottom-4 justify-center transition-all duration-300 ease-in-out md:flex items-center  fixed md:max-w-[579px] mx-auto w-full  left-0 right-0 z-[100] md md:rounded-[5px] shadow-[0px_0px_30px_#000053] bg-[#232323] px-5 py-3 md:py-3.5`}
                >
                    <p className=''>
                        <span className='text-grey-1 text-base md:text-[15px] f-f-fg '>Voting Power Used:</span>{' '}
                        <span
                            className={`${veWOOF && veWOOF.votedCurrentEpoch ? `text-[#2CBA52]` : 'text-error'} text-lg md:text-2xl font-semibold`}>
              {veWOOF && veWOOF.votedCurrentEpoch ? 'Yes' : 'No'}
            </span>
                    </p>
                    <div className='flex items-center mt-2 md:mt-0 w-full justify-between md:w-auto'>
                        <StyledButton
                            disabled={pending || !veWOOF || veWOOF.votedCurrentEpoch}
                            pending={pending}
                            onClickHandler={() => {
                                if (errorMsg) {
                                    customNotify(errorMsg, 'warn')
                                    return
                                }
                                onVote(veWOOF.id, percent)
                            }}
                            content={'CAST VOTES'}
                            className={
                                'text-sm md:text-[15px] f-f-fg text-white font-semibold w-full md:w-auto  px-[30px] flex flex-col items-center justify-center h-[42px] md:h-[48px] tracking-[0.84px] rounded-[5px] mr-4 md:ml-32'
                            }
                        />
                        <button
                            className='text-green hidden'
                            disabled={!veWOOF || !veWOOF.voted || resetPending}
                            onClick={() => {
                                if (veWOOF.voted) {
                                    onReset(veWOOF.id)
                                }
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Table
