import React, { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sticky from 'react-stickynode'
import moment from 'moment'
import TransparentButton from '../../components/common/Buttons/transparentButton'
import SearchInput from '../../components/common/Input/SearchInput'
import { formatAmount } from '../../utils/formatNumber'
import { veWOOFsContext } from '../../context/veWOOFsConetext'
import CreateModal from './createModal'
import ManageModal from './manageModal'
import PublicModal from './publicModal'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import useWalletModal from '../../hooks/useWalletModal'
import { useWithdraw } from '../../hooks/useLock'
import { useWOOFAsset } from '../../hooks/useGeneral'
import NoFound from '../../components/common/NoFound'
import usePrices from '../../hooks/usePrices'
import { getRewardTokenSymbol } from '../../utils/addressHelpers'
// import ReactTooltip from 'react-tooltip'

const Lock = () => {
  const [searchText, setSearchText] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPublicOpen, setIsPublicOpen] = useState(false)
    const [currItem, setCurrItem] = useState(null)
    const [isManageOpen, setIsManageOpen] = useState(false)
    const [publicModalTitle, setPublicModalTitle] = useState(false)

  const veWOOFs = useContext(veWOOFsContext)

    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { openWalletModal } = useWalletModal()
  const { onWithdraw, pending } = useWithdraw()
  const prices = usePrices()
  const theAsset = useWOOFAsset()
  const navigate = useNavigate()
  // const [arrow, setArrow] = useState(false)

    const startWithdraw = (e) => {
        setCurrItem(e)
        setPublicModalTitle("Withdraw vest amount on veWOOF #"+e.id)
        setIsPublicOpen(true)
    }
    const onConfirm =(e) => {
        onWithdraw(currItem)
    }

  const publicModalInformation = "Claim your reward Withdraw !!!"

  const renderButton = () => {
    if (address) {
      return (
          <div className='flex items-center space-x-3 '>
            <img className='icon-size-20 m-r-8' src='/image/icons/icon-lock.svg' alt='' />
            <span>CREATE LOCK</span>
          </div>
      )
    } else {
      return <span>CONNECT WALLET</span>
    }
  }


  const filteredData = useMemo(() => {
    return !searchText ? veWOOFs : veWOOFs.filter((item) => item.id.toString().includes(searchText))
  }, [searchText, veWOOFs])

  return (
      <>
        <div className='min-h-80 min-h-[450px] px-5 sm:px-16 md:px-28 mdLg:px-40 lg:px-5 xl:px-0 pt-20  md:pt-[120px] mx-auto'>
          <div className='lg:flex justify-between items-center'>
            <div className='max-w-[532px] w-full'>
              <h1 className='text-page-title text-[34px] md:text-[42px] font-medium text-white  f-f-fg'>Lock</h1>

              <p className='text-page-title-tips text-[#b8b6cb] text-base md:text-lg leading-[22px] md:leading-6 mt-24px'>
                Lock {getRewardTokenSymbol(chainId)} into veWOOF to earn and govern. Vote with veWOOF to earn bribes and trading fees. veWOOF can be transferred, merged and split. You can hold
                multiple positions.{' '}
                <a href='https://woofswap.gitbook.io/woofswap/introduction/woofswap' target='_blank' rel='noreferrer'>
                   <img className="icon-size-help icon-help invert-img" src="/image/swap/question-mark.png" />
                  {/*<span className='!text-lg text-green'>Learn More</span>*/}
                </a>
              </p>
            </div>
            {/* <div className='mt-3 lg:mt-0 bg-white w-full lg:max-w-[220px]  bg-opacity-[0.05]  rounded-[3px] bg-clip-padding px-5 py-3.5 text-grey'>
            <div className='w-full'>
              <p className='f-f-fg text-sm leading-4 xl:text-base xl:leading-5'>veWOOF Total APR</p>
              <div
                onMouseEnter={() => {
                  setArrow(true)
                }}
                onMouseLeave={() => {
                  setArrow(false)
                }}
                data-tip
                data-for={`tip`}
                className='flex items-center space-x-1 cursor-pointer max-w-[68px]'
              >
                <span className='text-lg lg:text-2xl xl:text-[27px] leading-5 lg:leading-8'>99%</span>
                <img
                  className={`${arrow ? 'rotate-180' : 'rotate-0'} transition-all duration-300 ease-in-out`}
                  alt=''
                  src='/image/liquidity/small-arrow-bottom.svg'
                />
                <ReactTooltip
                  className='max-w-[180px] !bg-[#090333] !border !border-white !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body '
                  id={`tip`}
                  place='right'
                  effect='solid'
                >
                  <p> WOOF</p>
                </ReactTooltip>
              </div>
            </div>
          </div> */}
            <div className='mt-3 xl:mt-0 w-full flex-col-reverse flex lg:flex-row items-center lg:justify-end lg:space-y-0 lg:space-x-3'>
              <TransparentButton

                  content={renderButton()}
                  fontWeight={'font-medium'}
                  className={
                    'border-img h-[52px] px-7 mb-3 lg:mb-0 text-grey flex flex-col items-center justify-center w-full lg:w-auto text-sm xl:text-[17px] tracking-[1.04px] xl:tracking-[1.36px] font-semibold'
                  }
                  onClickHandler={() => {
                    if (address) {
                      setIsCreateOpen(true)
                    } else {
                      openWalletModal()
                    }
                  }}
              />
            </div>
          </div>
          <div className='table-normal-header h-65px mt-48px'>
            <div></div>
            <SearchInput searchText={searchText} setSearchText={setSearchText} placeholder='Search veWOOF ID' onlyNumber={true} />
          </div>
          {filteredData && filteredData.length > 0 ? (
              <div className='table-normal w-full'>
                <Sticky
                    enabled={true}
                    innerActiveClass={'gradientBorder'}
                    top={95}
                    activeClass={''}
                    innerClass={'table-border-b px-6 lg:flex justify-between hidden z-[100] py-[1rem] lg:!-mb-[19px] xl:!mb-0 lg:!top-[-19px] xl:!top-[0]'}
                    className={`z-[100]`}
                >
                  <div className='w-[15%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'>veWOOF ID</div>
                  <div className='web-table-row w-[17%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'>Lock Value</div>
                  <div className='web-table-row w-[17%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'>Locked Amount</div>
                  <div className='web-table-row w-[17%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'>Lock Expire</div>
                  <div className='web-table-row w-[13%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'>Votes Used</div>
                  <div className='web-table-row w-[20%] font-medium text-[17px] xl:text-[18px] normal-td-header f-f-fg'></div>
                </Sticky>
                <div className='flex flex-col'>
                  {filteredData &&
                      filteredData.map((item, index) => {
                        return (
                            <div key={`vewoof-${index}`} className='hover-row gradient-bg p-px shadow-box space-y-2.5 lg:space-y-0 first:mt-0 rounded-[3px]'>
                              <div className='px-4 hover-row py-3 lg:p-6 flex flex-col lg:flex-row justify-between items-center rounded-[3px] bg-gradient-to-r from-left to-right'>
                                <div className='w-full lg:w-[15%] mt-3 lg:mt-0 text-[#DEDBF2] f-f-fg'>
                                  <div className='lg:hidden text-[13px] font-semibold'>veWOOF ID</div>
                                  <div className='flex items-center'>
                                    <div className='img-bac m-r-8'>
                                      <img className='icon-size-big m-r-8' src='/image/tokens/VEWOOF.png' alt='' />
                                    </div>
                                    <div className='text-lg lg:text-xl font-medium m-l-2'>#{item.id}</div>
                                  </div>
                                </div>
                                <div className='w-full lg:w-[34%] flex mt-3 lg:mt-0 text-[#DEDBF2]'>
                                  <div className='w-1/2 web-table-row'>
                                    <div className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Lock Value</div>
                                    <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>{formatAmount(item.voting_amount)} </div>
                                    <div className='text-[15px] text-dimGray'>veWOOF</div>
                                    {/*<div className='text-[15px] text-dimGray'>${formatAmount(item.voting_amount.times(prices['WOOF']))}</div>*/}
                                  </div>
                                  <div className='w-1/2 web-table-row'>
                                    <div className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Locked Amount</div>
                                    <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>{formatAmount(item.amount)} </div>
                                    <div className='text-[15px] text-dimGray'>{getRewardTokenSymbol(chainId)}</div>
                                    {/*<div className='text-[15px] text-dimGray'>${formatAmount(item.amount.times(prices['WOOF']))}</div>*/}
                                  </div>
                                </div>
                                <div className='w-full lg:w-[34%] flex lg:items-center mt-3 lg:mt-0 text-[#DEDBF2]'>
                                  <div className='w-1/2  web-table-row'>
                                    <div className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Lock Expire</div>
                                    <div className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px] text-[#DEDBF2]'>
                                      {moment.unix(item.lockEnd).format('MMM DD, YYYY')}
                                    </div>
                                    <div className='text-[15px] text-dimGray'>{item.diffDates}</div>
                                  </div>
                                  <div  className={ `w-1/2 w-38 text-[#DEDBF2] web-table-row`} >
                                    <div className='lg:hidden text-sm f-f-fg font-medium text-table-row-title'>Votes Used</div>
                                    <div
                                        className={`text-base sm:text-[17px] lg:text-[15px] xl:text-[17px] f-f-fg font-semibold ${
                                            item.votedCurrentEpoch ? `text-success` : 'text-error'
                                        }`}
                                    >
                                      {item.votedCurrentEpoch ? 'Yes' : 'No'}
                                    </div>
                                  </div>
                                </div>
                                <div className={`${index === 4 ? 'lg:w-[13%]' : index === 5 ? 'lg:w-[20%]' : 'lg:w-[17%]'} flex lg:justify-end space-x-[14.5px] mt-3 mb-2 lg:mb-0 lg:mt-0`}>
                                  {item.voting_amount.isZero() ? (
                                      <div
                                          className='text-base text-white cursor-pointer'
                                          onClick={() => {
                                            if (!pending) {
                                                startWithdraw(item)
                                            }
                                          }}
                                      >
                                        Withdraw
                                      </div>
                                  ) : (
                                      <>
                                        {item.votedCurrentEpoch?(null):(
                                                <TransparentButton

                                                    onClickHandler={() => {
                                                          navigate(`/vote/${item.id}`)
                                                      }}
                                                      content={'Vote'}
                                                      className={
                                                          'border-img h-10 px-4 lg:px-[1.5rem] lg:w-auto w-full text-grey flex  whitespace-nowrap flex-col items-center justify-center tex-sm xl:text-[17px]'
                                                      }
                                              />
                                            )
                                        }

                                        <TransparentButton

                                            onClickHandler={() => {
                                              setSelectedItem(item)
                                              setIsManageOpen(true)
                                            }}
                                            content={'Manage'}
                                            className={
                                              'border-img h-10 px-4 lg:w-auto w-full text-grey flex  whitespace-nowrap flex-col items-center justify-center tex-sm xl:text-[17px]'
                                            }
                                        />
                                      </>
                                  )}
                                </div>
                              </div>
                            </div>
                        )
                      })}
                </div>
              </div>
          ) : (
              <div className='table-normal w-full'>
                <NoFound title={address ? 'No positions found' : 'Please connect your wallet'} />
              </div>
          )}
        </div>
        {isCreateOpen && <CreateModal isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} theAsset={theAsset} />}
        {isManageOpen && <ManageModal isOpen={isManageOpen} setIsOpen={setIsManageOpen} selected={selectedItem} theAsset={theAsset} />}
        {isPublicOpen && <PublicModal isOpen={isPublicOpen} setIsOpen={setIsPublicOpen} publicModalTitle={publicModalTitle} publicModalInformation={publicModalInformation} onConfirm={onConfirm} />}
      </>
  )
}
export default Lock
