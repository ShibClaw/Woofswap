import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import React, { useContext, useState } from 'react'
import { BaseAssetsConetext } from '../../../context/BaseAssetsConetext'
import { formatAmount } from '../../../utils/formatNumber'
import SearchTokenPopup from '../SearchTokenPopup'

const percentArray = [25, 50, 75, 100]

const TokenInput = ({ title, asset, setAsset, amount, selectedAssets, onInputChange = () => {}, setAmount, disabled = false }) => {
  const [tokenPopup, setTokenPopup] = useState(false)
  const baseAssets = useContext(BaseAssetsConetext)
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    // console.log("xxxxxxxxx"+address)
  return (
    <div className='w-full account-bac'>
      <div className='flex items-center justify-between'>
        <p className='m-r-8px text-grey-2 text-sm md:text-base leading-10'>{title}</p>
        {address && (
          <div className={`flex items-center text-sm md:text-base space-x-3`}>
            {!disabled && (
              <div className='flex items-center space-x-2.5'>
                {percentArray.map((percent, index) => {
                  return (
                    <div
                      className={`b-r-10px flex items-center justify-center bg-white bg-opacity-[0.08] round-[3px] text-grey-1 text-[13px] md:text-base w-[40px] md:w-[56px] h-[22px] md:h-[28px] cursor-pointer`}
                      onClick={() => asset && setAmount(
                            ( title == "From" && asset.address == "BONE" && percent == 100)?
                                (asset?.balance?.times(percent).div(100).minus(0.01).toString(10) || 0 ):  (asset?.balance?.times(percent).div(100).toString(10) || 0 ))}
                      key={`percent-${index}`}
                    >
                      {percent}%
                    </div>
                  )
                })}
              </div>
            )}
            <p className='text-grey-2'>Balance: {!asset ? '-' : formatAmount(asset.balance)}</p>
            {/* {!disabled && <p className='text-green text-sm md:text-base'>Max</p>} */}
          </div>
        )}
      </div>
      <div className='gradient-bg mt-1.5 md:mt-2.5 p-px w-full rounded-[3px]'>
        <div className='pr-3 rounded-[3px] flex items-center'>
          <input
            value={amount}
                onChange={(e) => {
                if (Number(e.target.value) < 0) {
                    setAmount('')
                } else {
                    onInputChange(e)
                }
            }}
            className={`bg-transparent !border-0 w-4/5 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4 text-xl lg:text-2xl leading-10 placeholder-[#757384] text-color-main`}
            placeholder='0.00'
            type={'number'}
            disabled={disabled}
            min={0}
          />
          {asset ? (

            <div
              onClick={() => {
                setTokenPopup(true)
              }}
              className='flex items-center ml-2 space-x-5 f-f-fg lg:space-x-8 cursor-pointer'
            >
              <div className='flex items-center space-x-[3.5px] lg:space-x-2 '>
                  <div className='img-bac'>
                      <img className='w-[28px] h-[28px]' alt='' src={asset.logoURI?asset.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} />
                  </div>
                <p className='font-medium text-sm lg:text-[1.2rem] leading-6 text-white-1'>{asset.symbol}</p>
              </div>
              <img className='invert-img' alt='' src='/image/swap/dropdown-arrow.png' />
            </div>
          ):(
              <div className="flex items-center flex-shrink-0 space-x-2">
              <p
              onClick={() => {
              setTokenPopup(true)
          }}
              className='normal-btn flex items-center flex-shrink-0 space-x-2'>
                  Select token<img style={{}} className='ml-[5px]' alt='' src='/image/swap/dropdown-arrow.png' />
          </p>

              </div>
          )
          }
        </div>
      </div>
      <SearchTokenPopup popup={tokenPopup} setPopup={setTokenPopup} selectedAssets={selectedAssets} setSelectedAsset={setAsset} baseAssets={baseAssets} />
    </div>
  )
}

export default TokenInput
