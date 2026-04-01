import React from 'react'
import { useNavigate } from 'react-router-dom'
// import Ghost from '../../../common/buttons/ghost'
import CTA from '../../../common/Buttons/cta'
import './style.scss'

const Start = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className='home-logo'>
        <img className='home-logo-img logo relative z-10' alt='' src='/images/logo_title.png' />
      </div>
      <div className='mx-auto h-88 flex-bac'>
        <div className='start-img-item start-title-bottom'>
          <div className='start-img-item-body f-f-fg'>
            <div className='left-part'>
              <div className='gradient-text left-title f-f-fg'>WOOF PROTOCOL</div>
              <div className='left-para'>
                <p>A community driven</p>
                <p>liquidity layer & AMM on Puppy Net</p>
              </div>
            </div>
            <div className='right-part'>
              <div className='first'>

                <CTA
                    className='home-btn'
                  icon={true}
                  title={'LAUNCH APP'}
                  onClickHandler={() => {
                    navigate('/swap')
                  }}
                />

              </div>
              {/* <Ghost title={'CONNECT WALLET'} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Start
