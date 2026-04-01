import React from 'react'
import { useNavigate } from 'react-router-dom'

const SubPage = ({ title, children, hideBack }) => {
  const navigate = useNavigate()

  return (
    <>
      <div className='min-h-80 w-full pt-[134px] pb-28 xl:pb-0 2xl:pb-[150px] px-5 xl:px-0 '>
        <div className='w-full screen-w-600px gradient-bg p-px rounded-[5px] mx-auto relative'>
          <div className='w-full popup-gradientbg px-3 py-3 rounded-[15px] md:px-6 md:py-5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <button
                  className='mr-2.5 lg:mr-6'
                  onClick={() => {
                    navigate(-1)
                  }}
                >
                  {
                    hideBack?
                        (
                            <>
                            </>
                        )
                        :
                        (
                            <>
                              <img className='icon-size-20 w-[20px] lg:w-[26px]'  alt='' src='/image/icons/icon-back-arrow.svg' />
                            </>
                        )
                  }
                </button>
                <p className='text-[22px] lg:text-[18px] f-f-fg text-white font-normal'>{title}</p>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default SubPage
