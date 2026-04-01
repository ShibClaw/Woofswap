import React from 'react'
import './hero.scss'
import CTA from '../../../common/Buttons/cta'
import { useNavigate } from 'react-router-dom'

const Index = () => {
  const navigate = useNavigate()
  // const [loadCount, setLoadCount] = useState(0)

  // const setVideoLoaded = () => {
  //   if (loadCount <= 1) {
  //     setLoadCount(loadCount + 1)
  //   }
  // }
  return (
    <div className='relative hero-wrapper'>
      <div className='video-wrapper'>
        <video
          className='bg-index'
          playsInline
          autoPlay
          muted
          loop
          src='https://ipfs.io/ipfs/QmPjbfZKBCk4HpYnkuLsKkoexg5SjpRaLzuiHZaGv3pPrN'
          data-src='https://ipfs.io/ipfs/QmPjbfZKBCk4HpYnkuLsKkoexg5SjpRaLzuiHZaGv3pPrN'
          // src='https://pinata.thena.fi/ipfs/QmPjbfZKBCk4HpYnkuLsKkoexg5SjpRaLzuiHZaGv3pPrN'
          // data-src='https://pinata.thena.fi/ipfs/QmPjbfZKBCk4HpYnkuLsKkoexg5SjpRaLzuiHZaGv3pPrN'
        />
      </div>
      <div className='container-1 mx-auto hero-box'>
        <svg className='arrows'>
          <path className='a1' d='M0 0 L30 32 L60 0' />
          <path className='a2' d='M0 20 L30 52 L60 20' />
          <path className='a3' d='M0 40 L30 72 L60 40' />
        </svg>
        <div className='why-img-item'>
          <div className='why-img-item-body f-f-fg'>
            <h2 className='heading'>The Native Liquidity Layer On WOOF.</h2>
            <CTA
              icon={true}
              title={'SWAP NOW'}
              onClickHandler={() => {
                navigate('/swap')
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
