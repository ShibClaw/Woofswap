import React from 'react'
import { useLocation } from 'react-router-dom'
import './style.scss'

const Footer = () => {
  const route = useLocation()
  const links = [
    {
      img: '/image/footer/twitter.svg',
      url: 'https://twitter.com/woofswap',
    },
    {
      img: '/image/footer/medium.svg',
      url: 'https://woofswap.medium.com',
    },
    // {
    //   img: '/image/footer/discord.svg',
    //   url: 'https://discord.com/invite/Q8qGcTuSUK',
    // },
    {
      img: '/image/footer/telegram.svg',
      url: 'https://t.me/woofswap',
    },
    {
      img: '/image/footer/github.svg',
      url: 'https://github.com/WoofSwapFinance',
    }
  ]
  return (
    <div
      id='footer'
      className={` start-img-item-body footer-wrap bottom-footer  lg:[150px]  xxxl:pt-[20%] relative ${route.pathname.includes('referral') ? 'hidden' : 'block'} lg:block`}
    >
      <div className={`mx-auto w-full relative lg:block`}>
        <div className='w-full content-wrapper-footer'>
          <div className='links-wrapper'>
            <div className='flex  space-x-[14px]'>
              {links.map((item, idx) => {
                return (
                  <a key={idx} href={item.url} rel='noreferrer' target={'_blank'}>
                    <img alt='' className='icon-size-big max-w-[44px]' src={item.img} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
