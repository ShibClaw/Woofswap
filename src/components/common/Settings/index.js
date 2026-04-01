import React from 'react'
import ReactTooltip from 'react-tooltip'
// import Toggle from '../Toggle'

const Index = ({ slippage, setSlippage, deadline, setDeadline }) => {
  const slipageTolerance = ['0.1', '0.5', '1.00']

  // -ml-px md:ml-1 xl:ml-6
  return (
    <div className='md:max-w-[540px] absolute z-20 w-full px-3 md:px-[30px] pt-[17px] pb-[24px] md:py-5 bg-setting rounded-lg -ml-3 md:-ml-6 lg:ml-0 border top-14 border-white'>
      <p className='text-dimGray f-f-fg text-[12px]'>TRANSACTION SETTINGS</p>
      <div className='flex items-center space-x-1.5 mt-[17px] md:mt-[18px]'>
        <p className='text-[12px] !font-normal text-[#DEDBF2]'>Slippage Tolerance</p>
        <img alt='' className='invert-img' data-tip data-for='registerTip' src='/image/swap/question-mark.png' />
        <ReactTooltip
          className='max-w-[318.77px] !bg-body !text-[#E6E6E6] !text-base !p-[10px] !opacity-100 after:!bg-body '
          id='registerTip'
          place='right'
          effect='solid'
        >
          Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.
        </ReactTooltip>
      </div>
      <div className='md:flex items-center mt-[13px]'>
        <div className='flex items-center space-x-[11px] z-10 w-50px'>
          {slipageTolerance.map((item, idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  setSlippage(Number(item))
                }}
                className={`${
                  slippage == Number(item) ? 'bg-blue-other' : 'bg-body'
                } focus:bg-blue-other max-w-[84px] md:max-w-[32px] flex-shrink-0 hover:bg-blue-other w-full rounded-full flex flex-col items-center justify-center text-base text-[12px] text-black-or-grey h-10 md:h-[34px] cursor-pointer`}
              >
                {item}%
              </button>
            )
          })}
        </div>
        <div className='flex items-center space-x-[9px] w-full mt-[11px] md:mt-0 md:justify-end'>
          <input
            className='placeholder-dimGray max-w-[84px] bg-body w-full h-[34px] rounded-full text-white pl-5 pr-2 text-[12px] !border !border-white focus:!border-[2px] block focus-visible:!outline-none'
            value={slippage}
            onChange={(e) => setSlippage(e.target.value || 0)}
            type={'number'}
            min={0}
            max={50}
          />
          <span className='text-[12px] text-black-or-grey'>%</span>
        </div>
      </div>
      {(slippage < 0.5 || slippage > 5) && (
        <div className='w-full mt-2 text-warn'>{slippage > 5 ? 'Your transaction may be frontrun' : 'Your transaction may fail'}</div>
      )}
      <div className='w-full mt-6 md:mt-5'>
        <div className='flex items-center space-x-1.5'>
          <p className='text-[#DEDBF2] md:text-[12px] leading-5 !font-normal'>Transaction Deadline</p>
          <img alt='' data-tip className='invert-img' data-for='registerTip1' src='/image/swap/question-mark.png' />
          <ReactTooltip
            className='max-w-[318.77px] !bg-body !text-[#E6E6E6] !text-base !p-[10px] !opacity-100 after:!bg-body '
            id='registerTip1'
            place='right'
            effect='solid'
          >
            Your transaction will revert if it is left confirming for longer than this time.
          </ReactTooltip>
        </div>
        <div className='flex items-center space-x-[9px] mt-[9px]'>
          <input
            className='placeholder-dimGray max-w-[84px] h-[34px] w-full rounded-full bg-body text-white pl-5 pr-2 text-[12px] !border !border-white focus:!border-[2px] block focus-visible:!outline-none'
            type={'number'}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value || 0)}
            min={0}
          />
          <span className='text-[12px] text-black-or-grey'>minutes</span>
        </div>
      </div>
      {/* <p className='text-dimGray text-[13px] md:text-sm f-f-fg tracking-[0.52px] md:tracking-[0.56px] mt-6 md:mt-5 pt-[22px] border-t border-[#5E6282]'>
        INTERFACE SETTINGS
      </p>
      <div className='flex items-center justify-between w-full mt-[18px]'>
        <div className='flex items-center space-x-1.5'>
          <p className='text-base text-[12px]  text-[#DEDBF2] '>Expert Mode</p>
          <img alt='' data-tip data-for='registerTip2' src='/image/swap/question-mark.png' />
          <ReactTooltip
            className='max-w-[318.77px] !bg-body !text-[#E6E6E6] !text-base !p-[10px] !opacity-100 after:!bg-body '
            id='registerTip2'
            place='right'
            effect='solid'
          >
            Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Pellentesque in augue sit amet justo interdum
            tesque suscipit.
          </ReactTooltip>
        </div>
        <Toggle toggleId='first' />
      </div>
      <div className='flex items-center justify-between w-full mt-[16px]'>
        <div className='flex items-center space-x-1.5'>
          <p className='text-base text-[12px]  text-[#DEDBF2] '>Disable Multihops</p>
          <img alt='' data-tip data-for='registerTip3' src='/image/swap/question-mark.png' />
          <ReactTooltip
            className='max-w-[318.77px] !bg-body !text-[#E6E6E6] !text-base !p-[10px] !opacity-100 after:!bg-body '
            id='registerTip3'
            place='right'
            effect='solid'
          >
            Lorem ipsum dolor sit amet, conse ctetur adipiscing elit. Pellentesque in augue sit amet justo interdum
            tesque suscipit.
          </ReactTooltip>
        </div>
        <Toggle toggleId='second' />
      </div> */}
    </div>
  )
}

export default Index
