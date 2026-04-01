import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import './style.scss'

const Statue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 38px;
  justify-content: space-between;

  @media (min-width: 1024px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
    margin-top: 90px;
  }
  @media (min-width: 1280px) {
    padding: 0;
  }

  .paragraph {
    flex-shrink: 0;
    margin-top: 27px;
    max-width: 100%;
    @media (min-width: 1024px) {
      margin-left: ${({ reverse }) => !reverse && '60px'};
      max-width: 50%;
    }
    @media (min-width: 1440px) {
      margin-left: ${({ reverse }) => !reverse && '92px'};
      max-width: 50%;
      margin-top: 0px;
    }

    .subtitle {
      color: white !important;
      font-size: 27px;
      line-height: 34px;
      font-weight: 500;

      @media (min-width: 1024px) {
        font-size: 42px;
        line-height: 48px;
      }
    }
  }

  .quote {
    top: -35px;

    @media (min-width: 1024px) {
      top: -45px;
      left: -29px;
    }
  }

  .para {
    color: #b8b6cb;
    font-size: 16px;
    line-height: 25px;
    margin-top: 11px;
    @media (min-width: 768px) {
      font-size: 18px;
      line-height: 30px;
    }
  }
  .line {
    border: 1px solid #3382f1;
    width: 53px;
    margin-bottom: 16px;
    margin-top: 21.6px;
  }
  .author {
    background: transparent linear-gradient(90deg, #ed00c9 0%, #bd00ed 100%) 0% 0% no-repeat padding-box;
    -webkit-background-clip: text;
    width: fit-content;
    -webkit-text-fill-color: transparent;
    font-size: 27px;
    font-weight: 500;
    @media (min-width: 768px) {
      font-size: 42px;
      line-height: 48px;
    }
  }
  .image-wrapper {
    display: flex;
    max-width: ${({ large }) => (large ? '75%' : '65%')};
    justify-content: center;
    @media (min-width: 768px) {
      width: 55%;
    }
    @media (min-width: 1024px) {
      width: 50%;
      margin-left: ${({ reverse }) => reverse && '92px'};
    }
    img {
      max-width: ${({ large, larger, small }) => (large ? '125%' : small ? '85%' : larger ? '140%' : '100%')};
    }
  }

  .link-wrapper {
    display: flex;
    align-items: center;
    margin-top: 29px;
    cursor: pointer;

    // img {
    //   width: 30px;
    //   height: 10.71px;
    //   transition: all 0.4s ease;
    // }

    // &:hover {
    //   img {
    //     width: 50px;
    //   }
    // }

    .link-title {
      font-size: 20px;
      font-weight: 500;
      color: #3382f1;
      margin-right: 13.5px;
    }
  }
`
const HomePara = ({ src, para, title, reverse, span, link = null, large, small, larger }) => {
  const navigate = useNavigate()

  return (
    <div className='container-small-2 mx-auto'>
      <Statue reverse={reverse} small={small} large={large} larger={larger} className='statue'>
        <div className='image-wrapper'>
          <img src={src} alt='' />
        </div>
        <div className='relative paragraph'>
          <p className='author f-f-fg'>{title}</p>
          <p className='subtitle f-f-fg'>{span}</p>
          <p className='para b-f'> {para}</p>
          {link && (
            <div
              className='link-wrapper group'
              onClick={() => {
                if (link.external) {
                  window.open(link.value, '_blank')
                } else {
                  navigate(link.value)
                }
              }}
            >
              <span className='link-title'>{link.label}</span>
              <img className={`group-hover:w-[40px] w-[30px] duration-300 ease-in-out`} src='/image/common/spear.svg' alt='' />
            </div>
          )}
        </div>
      </Statue>
    </div>
  )
}

export default HomePara
