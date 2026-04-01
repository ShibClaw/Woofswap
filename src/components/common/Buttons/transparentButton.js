import React from 'react'
import styled from 'styled-components'
const Button = styled.div`
  box-sizing: border-box;
  border: 1px solid #008000;
  border-image-source: linear-gradient(to right, rgb(55 65 91) 30%, rgb(59, 90, 127) 100%);
  border-image-slice: 4;
  overflow: hidden;
  cursor: pointer;
  &::after {
    position: absolute;
    -o-transition: all 0.4s ease-in-out;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
    content: '';
    width: 0;
    bottom: -1px;
    background: linear-gradient(90deg, rgb(48, 39, 174) 0%, rgb(12, 11, 136) 100%)!important;
    height: 120%;
    left: -10%;
    transform: skewX(15deg);
    z-index: -1;

    &:hover {
      width: 120%;
    }
  }
  &:hover {
    //text-shadow: 0px 0px 16px #935c8b;
  }
`
const TransparentButton = ({ content, showIcon,  className, onClickHandler = null, disabled, fontWeight }) => {
  return (
    <Button
      role={'button'}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onClickHandler()
        }
      }}
      className={`${className} f-f-fg bg-[#bd00ed1a] ${fontWeight ? fontWeight : 'font-semibold'} ${disabled ? 'cursor-not-allowed' : ''}`}
    >
        {
            showIcon?
                (
                    <>
                        {/*<img className='icon-size-20'  src="/image/icons/icon-add-reduce.svg" />*/}
                        {content}
                    </>
                )
                :
                (
                 <>
                     {content}
                 </>
                )
        }

    </Button>
  )
}

export default TransparentButton
