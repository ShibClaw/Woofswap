import React from 'react'
import styled from 'styled-components'
const Button = styled.div`
  font-size: 14px;
  padding-top: 12.64px;
  padding-bottom: 12.64px;
  padding-left: ${({ icon }) => (icon ? '40px' : '60px')};
  display: flex;
  align-items: center;
  padding-right: ${({ icon }) => (icon ? '26px' : '60px')};
  line-height: 18px !important;
  font-weight: 600;
  letter-spacing: 0.84px;
  color: #fff;
  text-shadow: 0 0 4px #0000004d;
  cursor: pointer;
  height: 42px;
  border: 0;

  @media (min-width: 1280px) {
    font-size: 18px;
    padding-top: 18px;
    padding-bottom: 18px;
    line-height: 21px !important;
    height: 57px;
    padding-left: ${({ icon }) => (icon ? '47px' : '60px')};
    padding-right: ${({ icon }) => (icon ? '43px' : '60px')};
  }
  clip-path: polygon(6% 0, 80% 0%, 100% 0, 100% 77%, 94% 100%, 20% 100%, 0 100%, 0 25%);
  -o-transition: all 0.4s ease-in-out;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
  background-image:linear-gradient(180deg,#f06500,#f28b03);
  background-size: 300% 100%;
  &:hover {
    background-position: 100% 0%;
  }
`
const CTA = ({ title, onClickHandler = null, disabled, className = '', icon }) => {
  return (
    <Button
      icon={icon}
      role={'button'}
      aria-disabled={disabled}
      onClick={(e) => {
        onClickHandler && onClickHandler(e.target.value)
      }}
      className={`${className} f-f-fg ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      <>{title}</>
      {icon && <img src='/image/home/launch-app-arrow.svg' alt='' />}
    </Button>
  )
}

export default CTA
