import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { getWoofAddress } from '../../../utils/addressHelpers'
import {formatAmount, fromWei} from '../../../utils/formatNumber'
import Modal from '../Modal'
import NoFound from '../NoFound'
import { isAddress } from '@ethersproject/address'
import BigNumber from "bignumber.js";
import {getERC20Contract} from "../../../utils/contractHelpers";
import {multicall} from "../../../utils/multicall";
import {ERC20Abi} from "../../../config/abi";
import useWeb3 from "../../../hooks/useWeb3";
import { routeAssets } from '../../../config/constants'
import {useAddLocalStorageToken} from '../../../hooks/usePrices'

const theAddress = getWoofAddress()

const SearchTokenPopup = ({ popup, setPopup, setSelectedAsset, selectedAssets = [], baseAssets }) => {
  const [manage, setManage] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [refreshNumber, setRefreshNumber] = useState(0)
    const [querydAssets, setQuerydAssets] = useState([])
    const [addLocalAssets, setAddLocalAssets] = useState([])
    const { address, chainId, isConnected } = useWeb3ModalAccount()
  const inputRef = useRef()
    const web3 = useWeb3()

  const filteredAssets = useMemo(() => {

    const resultArr =  searchText
      ? baseAssets.filter(
          (asset) =>
            asset.name.toLowerCase().includes(searchText.toLowerCase()) ||
            asset.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
            asset.address.toLowerCase().includes(searchText.toLowerCase()),
        )
      : baseAssets


      return resultArr
  }, [baseAssets, searchText,refreshNumber])

  const commonAssets = useMemo(() => {
    // return baseAssets.filter(
    //   (asset) =>
    //     asset.address.length<42 ||  //asset.address === 'BONE' ||
    //     [
    //       theAddress.toLowerCase(),
    //         // linkAddress.toLowerCase(),
    //     ].includes(asset.address.toLowerCase()),
    // )
      const commonArr = []
      baseAssets.map((baseItem, idx) => {

         if(baseItem.address.length<42)
             commonArr.push(baseItem)

          routeAssets.map((rootItem, idx) => {
            if(baseItem.address.toLowerCase() == rootItem.address.toLowerCase() && rootItem.chainId == chainId)
                commonArr.push(baseItem)
          })
          if(
              baseItem.address == "0xe9Cb2D7ADC24Fc59FE00D6C0A0669BDF16805Fe0" ||
              // baseItem.address == "0x0b4FD6288b6d32171CC515bfFC9340026F56A358" ||//PIKA
              baseItem.address == "0xD0daa7B6ff1B40d3cc6F0B2Cf7E85cB993D1c834" ||
              baseItem.address == "0x8f4b11d923BbAA6206f3Dd3ff84e8e31bafB49b7" ||
              baseItem.address == "0x61CFA29261d8151D39244b8FfCf8DFd2f9DF3839" ||
              baseItem.address == "0xeCe898EdCc0AF91430603175F945D8de75291c70" )//DAMN
              commonArr.push(baseItem)


      })

      return commonArr
  }, [baseAssets,chainId])

    const onTokenRemove = useCallback(
        (val) => {

            if(val){
                val.showRemove = false
                val.showAdd = true

                // let q = querydAssets.concat([])
                // setQuerydAssets(q)

                let localArr = []
                let localAssetsStr =   window.localStorage.getItem('localStorageAssets'+chainId)
                if(localAssetsStr != null && localAssetsStr != ''){
                    localArr = JSON.parse(localAssetsStr)
                }
               let res =   localArr.filter(
                    (asset) =>
                        asset.address != val.address,
                )

                window.localStorage.setItem("localStorageAssets"+chainId,JSON.stringify(res))
                setRefreshNumber(Math.random)

            }


        },
        [baseAssets,refreshNumber])

    const onTokenAdd = useCallback(
        (val) => {

            if(val){
                val.showRemove = true
                val.showAdd = false


                let localArr = []
                let localAssetsStr =   window.localStorage.getItem('localStorageAssets'+chainId)
                if(localAssetsStr != null && localAssetsStr != ''){
                    localArr = JSON.parse(localAssetsStr)
                }

                let isIn = false
                localArr.map((baseItem, idx) => {
                    if(baseItem.address.toLowerCase() == val.address.toLowerCase()){
                        isIn = true
                    }
                })
                if(!isIn){
                    localArr.push(val)
                    window.localStorage.setItem("localStorageAssets"+chainId,JSON.stringify(localArr))
                    setRefreshNumber(Math.random)
                }

            }


        },
        [baseAssets,refreshNumber])

  useEffect(async() => {
    if (!popup) {
      setSearchText('')
    } else {
      setTimeout(() => {
        inputRef.current && inputRef.current.focus()
      }, 300)
    }

    console.log('searchText',searchText,chainId)
      if(isAddress(searchText)){
          if(filteredAssets.length>0){
              setQuerydAssets([])
              return
          }
          //pikaAddress
          if(searchText.toLowerCase() == "0x0b4FD6288b6d32171CC515bfFC9340026F56A358".toLowerCase()){
              setQuerydAssets([])
              return
          }


          let showAdd = true
          let showRemove = false

          let localArr = []
          let isIn = false
          let localAssetsStr =   window.localStorage.getItem('localStorageAssets'+chainId)
          if(localAssetsStr != null && localAssetsStr != ''){
              localArr = JSON.parse(localAssetsStr)
          }

          localArr.map((baseItem, idx) => {
              if(baseItem.address.toLowerCase() == searchText.toLowerCase()){
                  isIn = true
                  showRemove = true
              }
          })

          baseAssets.map((baseItem, idx) => {
              if(baseItem.address.toLowerCase() == searchText.toLowerCase()){
                  isIn = true
                  showRemove = true
              }
          })
          if(showRemove)
              showAdd = false


          const calls = [{
              address: searchText,
              name: 'balanceOf',
              params: [address],
          },
              {
                  address: searchText,
                  name: 'decimals',
                  params: [],
              },
              {
                  address: searchText,
                  name: 'symbol',
                  params: [],
              }
          ]

          try{



              const tokenInfos = await multicall(ERC20Abi, calls,web3)
              // const parsedTokenBalances = tokenInfos.map((tokenBalance, index) => {
              //     return fromWei(tokenBalance, baseAssets[index].decimals || 18)
              // })

              setQuerydAssets(   [{
                  address: searchText,
                  name: tokenInfos[2][0],
                  symbol: tokenInfos[2][0],
                  decimals: tokenInfos[1][0],
                  logoURI: '/image/tokens/ERC20_' + (chainId?chainId:109)  +'.png',
                  price: 0,
                  balance: new BigNumber(tokenInfos[0][0]._hex).div(new BigNumber(10).pow(tokenInfos[1][0])) ,
                  chainId: chainId,
                  showAdd:showAdd,
                  showRemove:showRemove
              }])

          }catch(es){
          //debugger
              console.log(es)
          }



      }else {
          setQuerydAssets([])
      }



  }, [popup,searchText,filteredAssets,refreshNumber])

  return (
    <Modal
      popup={popup}
      setPopup={setPopup}
      title={manage ? 'Manage Tokens' : 'Select a Token'}
      isBack={manage}
      setIsBack={setManage}
      width={540}
      isToken={true}
    >
      <>
        <div className='w-full'>
          <div className='px-3 md:px-6'>
            <div className='border border-white w-full mt-3 rounded-[3px]'>
              <input
                ref={inputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder='Search by name, symbol or address'
                className='bg-body-white placeholder-[#757384] h-14 w-full text-grey text-base md:text-lg px-4 py-[18px] rounded-[3px]'
              />
            </div>
          </div>
          <div className='w-full mt-3.5 md:mt-[18px] px-3 md:px-6'>
            <p className='text-[13px] md:text-sm tracking-[0.52px] md:tracking-[0.56px] f-f-fg text-dimGray mb-1'>COMMON TOKENS</p>
            <div className='flex flex-wrap md:-mx-3'>
              {commonAssets.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className={`px-2 md:px-3 cursor-pointer py-1 md:py-1.5 border m-[5px] flex items-center space-x-[5px] border-[#343434] rounded-xl ${
                      !!selectedAssets[0] && [selectedAssets[0].address].includes(item.address)
                        ? 'cursor-not-allowed opacity-40'
                        : 'cursor-pointer hover:bg-body'
                    }`}
                    onClick={() => {
                      if (!!selectedAssets[0] && ![selectedAssets[0].address].includes(item.address)) {
                        setSelectedAsset(item)
                        setPopup(false)
                      } else if (selectedAssets.length === 0) {
                        setSelectedAsset(item)
                        setPopup(false)
                      }
                    }}
                  >
                    <img alt='' src={item.logoURI?item.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} width={28} height={28} loading='lazy' />
                    <p className='text-sm md:text-base text-black-or-grey f-f-fg'>{item.symbol}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='w-full mt-3 scroll-box'>
          <div className='flex justify-between text-[13px] md:text-sm tracking-[0.52px] md:tracking-[0.56px] f-f-fg text-dimGray mb-1 px-3 md:px-6'>
            <span>TOKEN NAME</span>
            {address && <span>BALANCE</span>}
          </div>
          <div className='w-full mt-3 md:mt-[13px] max-h-[340px] overflow-auto'>
            {filteredAssets.concat(querydAssets).length > 0 ? (
              filteredAssets.concat(querydAssets).map((asset, idx) => {
                return (
                  <div
                    key={`asset-${idx}`}
                    className={`flex items-center justify-between py-[6px] px-3 md:px-6 ${
                        !!selectedAssets[0] && [selectedAssets[0].address].includes(asset.address) ||!!selectedAssets[1] && [selectedAssets[1].address].includes(asset.address) 
                        ? 'cursor-not-allowed opacity-40'
                        : 'cursor-pointer hover:bg-body'
                    }`}
                    onClick={() => {
                      if (!!selectedAssets[0] && ![selectedAssets[0].address].includes(asset.address)) {
                        setSelectedAsset(asset)
                        setPopup(false)
                      }else if (!!selectedAssets[1] && ![selectedAssets[1].address].includes(asset.address)) {
                          setSelectedAsset(asset)
                          setPopup(false)
                      } else if (selectedAssets.length === 0) {
                        setSelectedAsset(asset)
                        setPopup(false)
                      }
                    }}
                  >
                    <div className='flex items-center space-x-2.5 md:space-x-3'>
                      <div className='img-bac' >
                        <img alt='' src={asset.logoURI?asset.logoURI:"/image/tokens/ERC20_"+ (chainId?chainId:109)+".png"} className='flex-shrink-0' width={28} height={28} loading='lazy' />
                      </div>



                      <div className=''>
                        <p className='text-black-or-grey text-sm md:text-base f-f-fg'>{asset.symbol}</p>
                        <p className='text-[13px] md:text-sm tracking-[0.52px] text-dimGray'>{asset.name}</p>
                      </div>

                  {
                      asset.showAdd? (
                          <div className='img-bac' onClick={(e) => {

                      onTokenAdd(asset)
                      e.stopPropagation()
                      e.nativeEvent.stopImmediatePropagation()
                          } }>
                              <img alt='' src={"/image/icons/add.png"} className='flex-shrink-0' width={28} height={28} loading='lazy' />
                          </div>
                  ):null
                  }

                  {
                      asset.showRemove ? (
                          <div className='img-bac' onClick={(e) => {

                      onTokenRemove(asset)
                      e.stopPropagation()
                      e.nativeEvent.stopImmediatePropagation()
                  } }>
                  <img alt='' src={"/image/icons/remove.png"} className='flex-shrink-0' width={28} height={28} loading='lazy' />
                      </div>
                  ):null
                  }

                    </div>
                    {address && <p className='text-sm md:text-base text-black-or-grey'>{formatAmount(asset.balance) || ''}</p>}
                  </div>
                )
              })
            ) : (
              <NoFound title='No tokens found' />
            )}
          </div>
          {/* <div className='flex items-center justify-center w-full pt-[0.775rem]'>
              <button
                onClick={() => {
                  setManage(true)
                }}
                className='text-sm md:text-[17px] text-green text-center'
              >
                Manage Tokens
              </button>
            </div> */}
        </div>
      </>
    </Modal>
  )
}

export default SearchTokenPopup
