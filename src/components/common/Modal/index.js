import React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

const Modal = ({
  popup,
  setPopup,
  title,
  isBack = false,
  setIsBack,
  width = 588,
  isToken = false,
  disableOutside,
  children,
  height,
  isTransaction = false,
}) => {
  return (
    <>
      <div
        onClick={() => {
          setPopup(false)
        }}
        className={`fixed ${
          popup ? (isTransaction ? 'visible z-[202] opacity-100' : 'visible z-[200] opacity-100') : 'z-0 invisible opacity-0'
        } inset-0 w-full h-full transition-all duration-300 ease-in-out bg-opacity-[0.88] model-body`}
      ></div>

      <div
        className={`${
          popup ? (isTransaction ? 'z-[203] visible opacity-100' : 'z-[201] visible opacity-100') : 'z-0 invisible opacity-0'
        }  w-full inset-0-new fixed transition-all duration-300 ease-in-out flex items-center min-h-screen justify-center flex-col paraent`}
      >
        <OutsideClickHandler

          onOutsideClick={() => {
            if (!disableOutside) {
              setPopup(false)
            }
          }}
        >
          <div
            className={`max-w-[92%] ${width === 588 ? ' md:w-[588px] max-h-[90vh] overflow-y-auto' : ''}   ${width === 548 ? ' md:w-[548px]' : ''} ${
              width === 540 ? ' md:w-[540px] h-500' : ''
            } ${!isToken ? 'px-3 md:px-6' : ''} ${
              height === 298 ? 'max-h-[298px] overflow-y-auto' : ''
            } scroll-normal mx-auto w-full py-3 md:py-5 bg-[#101645] rounded-lg border border-white`}
          >
            <div className={`flex items-center justify-between${isToken ? ' px-3 md:px-6' : ''}`}>
              <div className='flex items-center'>
                {isBack && (
                  <button
                    className='mr-[20px]'
                    onClick={() => {
                      setIsBack(false)
                    }}
                  >
                    <img className='icon-size-20' alt='' src='/image/icons/icon-back-arrow.svg' />
                  </button>
                )}
                <p className='text-lg md:text-[22px] f-f-fg text-white font-semibold'>{title}</p>
              </div>
              <button onClick={() => setPopup(null)} className='focus:outline-none'>
                <img className='icon-size-20 invert-img' alt='' src='/image/icons/icon-close-btn.svg' />
              </button>

            </div>
            {children}
          </div>
        </OutsideClickHandler>
      </div>
    </>
  )
}

export default Modal
