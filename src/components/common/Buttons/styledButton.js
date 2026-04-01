import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
  background-image: ${({ disabled }) => (disabled ? 'unset' : 'linear-gradient(180deg,#f06500,#f28b03);')};
  background-size: 300% 100%;
  //text-shadow: 0px 0px 16px #935c8b;
  &:hover {
    background-position: 100% 0%;
  }
`
const StyledButton = ({ content, className, onClickHandler = null, disabled, pending = false }) => {
  return (
    <Button
      disabled={disabled}
      role={'button'}
      aria-disabled={disabled}
      onClick={(e) => {
        if (!disabled && !pending && onClickHandler) {
          onClickHandler(e.target.value)
        }
      }}
      className={`f-f-fg text-white-btn transition-all duration-300 ease-in-out !font-semibold${className ? ' ' + className : ''}${
        disabled ? ' !bg-white !bg-opacity-[0.33] !text-[#090333] cursor-not-allowed' : ''
      } `}
    >
      {pending ? 'PENDING...' : content}
    </Button>
  )
}

export default StyledButton
