import React from 'react'

const CommonHollowModal = ({ popup, setPopup, title, width = 588, children }) => {
  return (
    <>
      <div
        onClick={() => {
          setPopup(false)
        }}
        className={`fixed ${
          popup ? 'visible z-[150] opacity-100' : 'z-0 invisible opacity-0'
        } inset-0 w-full h-full transition-all duration-300 ease-in-out bg-opacity-[0.88] model-body`}
      ></div>

      <div
        className={`${
          popup ? 'z-[151] visible opacity-100' : 'z-0 invisible opacity-0'
        } w-full inset-0 fixed transition-all duration-300 ease-in-out flex items-center min-h-screen justify-center flex-col paraent`}
      >
        <div
          className={`max-w-[92%] ${width === 588 ? ' sm:min-w-[500px] sm:max-w-[500px] md:min-w-[588px] md:max-w-[588px]' : ''} ${
            width === 540 ? ' md:min-w-[540px] max-w-[540px]' : width === 400 ? ' md:min-w-[400px] max-w-[400px]' : ''
          } mx-auto w-full rounded-[5px] gradient-bg p-px`}
        >
          <div className='popup-gradientbg px-3 py-3 rounded-[15px] md:px-6 md:py-5'>
            <div className='flex items-center justify-between'>
              <p className='normal-family text-[1.15rem] md:text-[22px] f-f-fg text-white font-medium'>{title}</p>
              <button onClick={() => setPopup(false)} className='focus:outline-none'>
                <img className='icon-size-20 invert-img' alt='' src='/image/icons/icon-close-btn.svg' />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default CommonHollowModal
