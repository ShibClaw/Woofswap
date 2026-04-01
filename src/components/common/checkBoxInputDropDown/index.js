import React, { useMemo, useState } from 'react'

const Index = ({ className, data, tokenIds, setTokenIds }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const filterData = useMemo(() => {
    return searchText ? data.filter((asset) => asset.includes(searchText)) : data
  }, [searchText, data])

  const handleCheckBox = (item) => {
    let temp = [...tokenIds]
    if (temp.find((_item) => _item == item)) {
      let temp2 = temp.filter((_item) => _item !== item)
      setTokenIds([...temp2])
    } else {
      temp.push(item)
      setTokenIds([...temp])
    }
  }
  const emptyArray = () => {
    setTokenIds([])
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false)
          }}
          className={`fixed inset-0 w-full h-full bg-transparent z-[50]`}
        />
      )}
      <div className={`${className} w-full`}>
        <div className='flex items-center justify-between'>
          <p className='text-dimGray text-[13px] md:text-base leading-4 md:leading-10'>Select Your theNFTs</p>
          <button
            onClick={() => {
              tokenIds.length === data.length ? emptyArray() : setTokenIds(data)
              setIsOpen(false)
            }}
            className={` text-[15px] md:text-lg relative z-50 text-[#26FFFE]`}
          >
            {tokenIds.length === data.length ? 'Clear All' : 'Select All'}
          </button>
        </div>
        <div className={` gradient-bg h-auto  p-px w-full rounded-[3px] relative`}>
          <div className='bg-body  z-[90] rounded-[3px] min-h-[48px] md:min-h-[70px]   flex items-center relative'>
            <div
              className={`bg-transparent w-full   relative z-10 flex flex-col items-start justify-center pl-3.5 text-lg md:text-2xl md:leading-10 text-grey`}
            >
              {tokenIds.length >= 1 ? (
                <div className='z-20'>
                  <div className='grid grid-cols-3 md:grid-cols-4 gap-2.5 py-[13px]'>
                    {tokenIds.map((item, idx) => {
                      return (
                        <div
                          key={idx}
                          className={`bg-white bg-opacity-10 leading-9 text-lg h-8 md:h-[42px] flex flex-col items-center justify-center rounded-[5px] px-2.5 md:px-3.5 py-2.5 text-grey cursor-pointer`}
                          onClick={() => {
                            handleCheckBox(item)
                          }}
                        >
                          {item}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <input
                  className={`bg-transparent w-full h-full relative z-10 py-[8px] lg:py-[15px] font-normal text-lg md:text-2xl md:leading-10 placeholder-[#757384] text-grey`}
                  placeholder={isOpen ? '' : 'Select'}
                  name='tag'
                  autoComplete='off'
                  onChange={(e) => {
                    setSearchText(e.target.value)
                  }}
                  onClick={() => {
                    setIsOpen(!isOpen)
                  }}
                />
              )}
            </div>
            <img
              className={`${
                isOpen ? 'rotate-180' : 'rotate-0'
              } transform transition-all duration-300 ease-in-out absolute right-4 top-4 md:top-7 cursor-pointer`}
              alt=''
              src='/image/swap/dropdown-arrow.png'
              onClick={() => {
                setIsOpen(!isOpen)
              }}
            />
          </div>

          {isOpen && (
            <div className='w-full gradient-bg p-px absolute -ml-px z-[102] rounded-b-[3px]'>
              <div className={`bg-[#090333] max-h-[240px] overflow-auto w-full py-5 px-4 bg-clip-padding rounded-b-[3px]`}>
                {filterData.length > 0 ? (
                  filterData.map((item, idx) => {
                    return (
                      <div key={idx} className={`${idx !== data.length - 1 && 'pb-4'} `}>
                        <div className='flex items-center space-x-[13px]'>
                          <input
                            id={`checkbox${idx}`}
                            type='checkbox'
                            checked={tokenIds.find((_item) => _item == item)}
                            onChange={() => {
                              handleCheckBox(item)
                            }}
                            className='w-6 h-6 text-[#0000FF] accent-slate-400 rounded-[3px] !border-[#757384] '
                          />
                          <label htmlFor={`checkbox${idx}`} className={` text-grey cursor-pointer w-full z-20 text-[1.15rem] md:text-xl leading-7`}>
                            {item}
                          </label>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className='text-grey text-[1.15rem] md:text-xl leading-7'>Not Found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Index
