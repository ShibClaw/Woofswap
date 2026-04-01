import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import Settings from '../../components/common/Settings'
import Tab from '../../components/common/Tab'
import AddLiquidity from '../../components/pages/liquidity/addLiquidity'
import RemoveLiquidity from '../../components/pages/liquidity/removeLiquidity'
import { PairsContext } from '../../context/PairsContext'

const V3Enabled = false

const ManageLiquidity = () => {
  const [settings, setSettings] = useState(false)
  const [isAdd, setIsAdd] = useState(true)
  const [slippage, setSlippage] = useState(0.5)
  const [deadline, setDeadline] = useState(20)
  const { userPairs } = useContext(PairsContext)
  const navigate = useNavigate()
  const { address } = useParams()


  useEffect(() => {
    if (userPairs && userPairs.length > 0 && address) {

      const item = userPairs.find((ele) => ele.address.toLowerCase() === address.toLowerCase())
      if (!item) {
        navigate('/404')
        return
      }
    }
  }, [userPairs, address])

  return (
    <>
      <div className='min-h-80 w-full pt-[134px] pb-28 xl:pb-0 2xl:pb-[150px] px-5 xl:px-0 '>
        {V3Enabled && (
          <div className='max-w-[1104px] mx-auto w-full'>
            <div className='flex justify-center'>
              <div className='flex h-11'>
                <Link
                  to={'/liquidity/manage'}
                  className={`w-[100px] h-full flex justify-center items-center text-grey cursor-pointer border-[#ED00C9] border rounded-[5px] -ml-px popup-gradientbg`}
                >
                  V2
                </Link>
                <Link
                  to={'/liquidity/manageV3'}
                  className={`w-[100px] h-full flex justify-center items-center text-[#A2A0B7] cursor-pointer border-[#555367] border-r border-t border-b rounded-r-[5px] -ml-[3px] -mr-px`}
                >
                  V3
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className='w-full max-w-[520px] lg:max-w-[595px] gradient-bg p-px rounded-[5px] mx-auto relative  mt-4'>
          <OutsideClickHandler
            onOutsideClick={() => {
              setSettings(false)
            }}
          >
            <div className='w-full popup-gradientbg px-3 py-3 rounded-[15px] md:px-6 md:py-5'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <button
                    className='mr-[20px]'
                    onClick={() => {
                      navigate('/liquidity')
                    }}
                  >
                    <img className='icon-size-20' alt='' src='/image/icons/icon-back-arrow.svg' />
                  </button>
                  <h4 className='text-[1.3rem] md:text-[22px] f-f-fg text-white font-bold'>Manage Liquidity</h4>
                </div>
                <button
                  onClick={() => {
                    setSettings(!settings)
                  }}
                  className=''
                >
                  <img className='icon-size-big sw-3/4 sm:w-auto invert-img' alt='' src='/image/swap/bar.svg' />
                </button>
              </div>
              {settings && <Settings slippage={slippage} setSlippage={setSlippage} deadline={deadline} setDeadline={setDeadline} />}
              <div className='w-full mt-4 md:mt-[29px]'>
                <Tab leftTitle='Add' rightTitle='Remove' isLeft={isAdd} setIsLeft={setIsAdd} />
                {isAdd ? (
                  <AddLiquidity slippage={slippage} deadline={deadline} pairs={userPairs} pairAddress={address} />
                ) : (
                  <RemoveLiquidity slippage={slippage} deadline={deadline} pairs={userPairs} pairAddress={address} />
                )}
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    </>
  )
}

export default ManageLiquidity
