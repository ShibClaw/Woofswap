import React from 'react'
import styled from 'styled-components'
import './style.scss'
const Statue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 38px;
  justify-content: space-between;

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

    span {
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
    max-width: 90%;
    justify-content: center;
    @media (min-width: 1024px) {
      width: 50%;
      margin-left: ${({ reverse }) => reverse && '92px'};
    }
    img {
    }
  }

  // @media (min-width: 768px) {
  //   margin-top: 202px;
  // }

  @media (min-width: 1024px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
  }
`
const Index = ({ src, para, title, reverse, span }) => {
  return (
    <div className='container-small mx-auto'>
      <Statue reverse={reverse} className='statue'>
        <div className='image-wrapper'>
          <img src={src} className={`${title === 'Kickstart the WOOF' && 'max-w-[110%] sm:max-w-auto'}`} alt='' />
        </div>
        <div className='relative paragraph'>
          <p className='author f-f-fg'>{title}</p>
          <span className='f-f-fg'>{span}</span>
          <div className='para b-f'> {para}</div>
        </div>
      </Statue>
    </div>
  )
}

export default Index
