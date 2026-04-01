import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import PlaceHolderGradientInput from '../../../components/common/Input/PlaceHolderGradientInput'
import StyledButton from '../../../components/common/Buttons/styledButton'
import { useRegister } from '../../../hooks/useReferral'
import { customNotify } from '../../../utils/notify'
import useWalletModal from '../../../hooks/useWalletModal'
import { useSearchParams } from 'react-router-dom'

const Code = ({ codeName }) => {
  const [yourCode, setYourCode] = useState('')
  const [close, setClose] = useState(true)
  const ref = useRef()
  const { onRegister, pending } = useRegister()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { openWalletModal } = useWalletModal()
  const [referralCode, setReferralCode] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      setReferralCode(refCode)
    } else {
      setReferralCode('DIBS')
    }
  }, [searchParams])

  const refUrl = useMemo(() => `${window.location.host}/referral/?ref=${codeName}`, [codeName])

  const errorMsg = useMemo(() => {
    if (address) {
      if (!yourCode || !referralCode || !/^[A-Za-z0-9]+$/.test(yourCode)) {
        return 'Invalid Code'
      }
    }

    return null
  }, [address, yourCode, referralCode])

  return (
    <div className='mt-3 lg:mt-0 lg:ml-6 w-full'>
      <h3 className='text-[27px] leading-8 md:text-4xl f-f-fg font-medium gradient-text'>Your Code</h3>
      {!codeName ? (
        <div className='referal-code-bg relative bg-cover bg-center w-full h-fit lg:h-[298px] rounded-[5px] mt-2.5 lg:mt-5 px-[21px] py-[30px] lg:p-3 flex flex-col items-center justify-center'>
          <p className='f-f-fg text-grey leading-[28px] lg:leading-[34px] max-w-[270px] lg:max-w-[446px] text-center text-[20px] lg:text-[27px] font-semibold'>
            Earn with DiBs
          </p>
          <p className='mt-3 f-f-fg text-grey leading-[26px] max-w-[300px] md:max-w-[600px] text-center text-[15px] lg:text-[17px]'>
            Earn by participating in WOOF (3,3) Referral System. Refer friends and earn a cut of their trading fees. Traders receive lottery tickets for a chance
            to win a share of the weekly prize pool. Top 8 referrers receive bonuses on top. Create your DiBs code now!
          </p>
        </div>
      ) : (
        <p className='text-grey text-[15px] lg:text-lg leading-[26px] max-w-[595px] lg:mt-3 font-light'>
          Share the code below with others and start earning. You earn a share of the trading fees generated using your code.&nbsp;
          <a href='https://woofswap.gitbook.io/woofswap/introduction/woofswapthe-referral-system' target='_blank' rel='noreferrer'>
             <img className="icon-size-help icon-help invert-img" src="/image/swap/question-mark.png" />
                  {/*<span className='!text-lg text-green'>Learn More</span>*/}
          </a>
        </p>
      )}
      <div className='gradient-bg mt-[30px] lg:mt-4 p-px relative z-[10] rounded-[5px]'>
        <div className='solid-bg rounded-[5px] px-3 md:px-6 py-3 md:py-5'>
          {!codeName ? (
            address ? (
              <>
                <div className='lg:flex lg:space-x-5 items-end'>
                  <PlaceHolderGradientInput
                    label={'Your Code'}
                    placeholder={'Enter Code'}
                    className='lg:max-w-[287px]'
                    searchText={yourCode}
                    setSearch={(e) => {
                      setYourCode(e.target.value)
                    }}
                  />
                  <PlaceHolderGradientInput
                    label={`Your referrer's code`}
                    placeholder={`Enter your referrer's code`}
                    searchText={referralCode}
                    setSearch={(e) => {
                      setReferralCode(e.target.value)
                    }}
                    className='lg:max-w-[287px] mt-3.5 lg:mt-0'
                  />
                  <StyledButton
                    disabled={pending}
                    pending={pending}
                    onClickHandler={() => {
                      if (address) {
                        if (errorMsg) {
                          customNotify(errorMsg, 'warn')
                        } else {
                          onRegister(yourCode, referralCode)
                        }
                      } else {
                        openWalletModal()
                      }
                    }}
                    content={!address ? 'CONNECT WALLET' : 'Create'}
                    className={'px-[41px] py-4 rounded-[3px] w-full lg:w-auto text-grey mt-3 lg:mt-0 tracking-[1.12px] md:tracking-[1.8px]'}
                  />
                </div>
                {close && (
                  <div className='mt-4 flex items-center justify-between w-full bg-white bg-opacity-[0.08] p-4 rounded-[3px] '>
                    <div className='flex items-center space-x-2.5'>
                      <img alt='' src='/image/mark/info-mark.svg' className='w-5' />
                      <span className='text-grey text-[15px] w-[216px] sm:w-auto lg:text-[17px] font-light'>
                        Your DiBs code can consist of both lowercase and uppercase letters, as well as numbers.
                      </span>
                    </div>
                    <button onClick={() => setClose(false)}>
                      <img alt='' src='/image/mark/transparentMark.svg' className='w-5' />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <StyledButton
                onClickHandler={() => {
                  openWalletModal()
                }}
                content={'CONNECT WALLET'}
                className={'px-[41px] py-4 rounded-[3px] w-full text-grey  tracking-[1.12px] md:tracking-[1.8px]'}
              />
            )
          ) : (
            <div className='w-full'>
              <div className='pb-2.5 lg:pb-4 text-grey text-base lg:text-[22px] leading-5 lg:leading-7 f-f-fg font-light border-b border-[#757384]'>
                Your Dibs Code: <span className='text-green text-lg lg:text-[22px]'>{codeName}</span>
              </div>
              <div className='mt-[13px] lg:mt-5 w-full'>
                <div className='w-full'>
                  <p className='text-grey f-f-fg text-[17px] lg:text-[22px] leading-5 lg:leading-10'>Register link:</p>
                  <div className='gradient-bg p-px h-12 lg:h-auto rounded-[3px] max-w-[642.45px] w-full mt-[5px] lg:mt-0'>
                    <div className='bg-body relative pl-3 flex items-center lg:pl-4 h-full py-[9px] text-grey rounded-[3px]'>
                      <p ref={ref} id={refUrl} className='lg:text-lg  leading-5 lg:leading-9 font-light'>
                        <span className='sm:hidden'>
                          {refUrl.slice(0, 10)}...{refUrl.slice(-10)}
                        </span>
                        <span className='sm:block hidden'>{refUrl}</span>
                      </p>
                      <StyledButton
                        content={'Copy'}
                        onClickHandler={() => {
                          customNotify('Copied!', 'info')
                          navigator.clipboard.writeText(ref.current.id)
                        }}
                        className={'leading-4  lg:leading-[19px] f-f-fg rounded-[2px] px-3.5 text-base  lg:px-[19px] py-2 absolute right-2'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Code
