import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import './style.scss'

const Menu = ({ item, idx }) => {
  const route = useLocation()
  const [more, setMore] = useState(false)
    const chainId = window.currChainId;

  return (
    <li key={`main-${idx}`} className={`${route.pathname.includes(item.link) &&'links-sky'}  links`}>
      {item.dropdown ? (
        <div className='relative'>
          <div
            onMouseEnter={() => {
              setMore(true)
            }}
            onMouseLeave={() => {
              setMore(false)
            }}
            className='flex items-center links-more space-x-1 cursor-pointer relative z-10 font-light text-grey'
          >
            <span>{item.name}</span>
            <img
              alt='dropdown'
              src='/image/header/dropdown-arrow.svg'
              className={`${!more ? 'rotate-180' : 'rotate-0'} icon-size-mini transition-all duration-150 ease-in-out`}
            />
          </div>
          {more && (
            <div
              onMouseEnter={() => {
                setMore(true)
              }}
              onMouseLeave={() => {
                setMore(false)
              }}
              className='dropdown-box py-3 px-[22px] w-[174px] absolute top-25px text-left rounded-[3px] flex flex-col text-grey text-lg leading-[33px] font-light'
            >
              {item.link.map((_item, j) => {
                return _item.external ? (
                  <div
                    className='doc-link'
                    onClick={() => {
                      window.open(_item.link, '_blank')
                    }}
                    key={`more-${j}`}
                  >
                    {_item.name}
                  </div>
                ) : (
                  <Link
                    key={`more-${j}`}
                    onClick={() => setMore(false)}
                    className={route.pathname.includes(_item.link) ? 'text-sky doc-link' : 'font-light doc-link'}
                    to={_item.link}
                  >
                    {_item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      ) : (
          (chainId != 719 && ! item.isAll) ?(
              <div
              className='font-light link-normal flex items-center cursor-not-allowed'  target ={item.external ? "_blank":"_self"} to={item.link}>
          <img
          src= {'/image/icons/'+item.name+".svg"}
          className={`invert-img mr-5px icon-size-normal transition-all duration-150 ease-in-out`}
          />
          <span>{item.name}</span>
      </div>
              ):(
              <Link className={route.pathname.includes(item.link) ? 'text-sky flex items-center' : 'font-light link-normal flex items-center'}  target ={item.external ? "_blank":"_self"} to={item.link}>
          <img
          src= {'/image/icons/'+item.name+".svg"}
          className={`invert-img mr-5px icon-size-normal transition-all duration-150 ease-in-out`}
          />
          <span>{item.name}</span>
      </Link>
              )

      )}
    </li>
  )
}

export default Menu
