import React from 'react'
import styled from 'styled-components'
const Button = styled.div`
  font-size: 14px;
  line-height: 18px !important;
  font-weight: 500;
  letter-spacing: 0.84px;
  color: #fff;
  text-shadow: 0 0 4px #0000004d;
  cursor: pointer;
  height: 42px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 200px;
  width: 100%;

  @media (min-width: 1280px) {
    font-size: 18px;
    line-height: 21px !important;
    height: ${({mint}) => (mint ? '59px' : '57px')};
    max-width: 238px;
    width: 100%;
  }
  box-sizing: border-box;
  background: linear-gradient(90deg, rgba(48, 39, 174, 0.52) 0%, rgb(22, 22, 59) 100%) !important;
  position: relative;
  border: 1px solid #008000;
  border-image-source: linear-gradient(90deg, rgb(48, 39, 174) 0%, rgb(12, 11, 136) 100%) !important;
  border-image-slice: 4;
  clip-path: polygon(6% 0, 80% 0%, 100% 0, 100% 77%, 94% 100%, 20% 100%, 0 100%, 0 25%);
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, rgba(48, 39, 174, 0.25) 0%, rgba(24, 24, 134, 0.49) 100%) !important;
    background-position: 100% 0%;
    //text-shadow: 0px 0px 16px #8200f4;
  }

  &::after {
    position: absolute;
    transition: 0.3s;
    content: '';
    width: 0;
    bottom: -1px;
    background: linear-gradient(90deg, rgb(48, 39, 174) 0%, rgb(12, 11, 136) 100%) !important;
    clip-path: polygon(6% 0, 80% 0%, 100% 0, 100% 77%, 94% 100%, 20% 100%, 0 100%, 0 25%);
    height: 120%;
    left: -10%;
    transform: skewX(15deg);
    z-index: -1;
  }

  .line1 {
    width: 24px;
    height: 1px;
    position: absolute;
    background: #1e1e96;
    top: 3px;
    left: -4px;
    transform: rotate(-39deg);

    @media (min-width: 1280px) {
      top: 6px;
      left: -6px;
      transform: rotate(-45deg);
    }
  }

  .line2 {
    width: 24px;
    height: 1px;
    position: absolute;
    background: #3143b9;
    bottom: 3px;
    right: -6px;
    transform: rotate(-41deg);

    @media (min-width: 1280px) {
      bottom: 6px;
      right: -6px;
      transform: rotate(-42deg);
    }
  }
`
const Ghost = ({ title, onClickHandler = null, disabled, className = '', mint }) => {
  return (
    <Button
      mint={mint}
      role={'button'}
      aria-disabled={disabled}
      onClick={(e) => {
        onClickHandler && onClickHandler(e.target.value)
      }}
      className={`${className} second f-f-fg ${disabled && 'cursor-not-allowed'}`}
    >
      <div className='line1' />
      <div className='line2' />
      <p>{title}</p>
    </Button>
  )
}

export default Ghost
