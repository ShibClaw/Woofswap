import React from 'react'
import styled from 'styled-components'
import TransparentButton from '../../../common/Buttons/transparentButton'
import StyledButton from '../../../common/Buttons/styledButton'

const Card = styled.div`
  .inside {
    background: transparent linear-gradient(90deg, #1d023b 0%, #17023e 100%) 0% 0% no-repeat padding-box;
    z-index: 2;
  }
  background: transparent linear-gradient(166deg, #09033300 0%, #ed00c9 27%, #bd00ed 73%, #09033300 100%) 0% 0% no-repeat padding-box;
  position: relative;
  animation: gradient 2s ease infinite;
  background-size: 150% 150%;

  &::before {
    background: transparent linear-gradient(113deg, #ed00c9 0%, #bd00ed 100%) 0% 0% no-repeat padding-box;
    z-index: 1;
    opacity: 1;
    transition: opacity 0.25s linear;
    position: absolute;
    content: '';
    border-radius: 5px;
    inset: 0;
  }
  &:hover::before {
    opacity: 0;
  }
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  &:hover .inside::before {
    opacity: 1;
  }
  .inside::before {
    background: transparent linear-gradient(92deg, #090240 0%,#151b28 100%) 0% 0% no-repeat padding-box;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.25s linear;
    position: absolute;
    content: '';
    border-radius: 5px;
    inset: 0;
  }
  // button {
  //   background-image: linear-gradient(to right, #d800b7, #b100de, #b100de, #d800b7);
  //   background-size: 300% 100%;
  //   border-radius: 3px;
  //   text-shadow: 0px 0px 16px #935c8b;
  //   z-index: 2;
  //   &:hover {
  //     background-position: 100% 0%;
  //   }
  // }
  // button::before {
  //   background: transparent linear-gradient(90deg, #1d023b 0%, #17023e 100%) 0% 0% no-repeat padding-box;
  //   z-index: 1;
  //   opacity: 0;
  //   transition: opacity 0.25s linear;
  //   position: absolute;
  //   content: '';
  //   border-radius: 3px;
  //   inset: 0;
  //   margin: 1px;
  // }
  // &:hover button::before {
  //   opacity: 1;
  // }
`
const Index = ({ className, title, img, para, button, setOpen, cta }) => {
  const renderContent = () => {
    return (
      <div className='flex items-center space-x-2 px-10 h-[52px] relative z-10'>
        <img src='/image/whiteList/add-icon.svg' alt='' />
        <span>{button}</span>
      </div>
    )
  }
  return (
    <Card className={`card-normal rounded-[5px] wrapper relative`}>
      <div className=' md:py-[31px] px-[22px] pt-[26px] pb-4 md:px-[35px] rounded-[5px] md:flex items-start md:space-x-5 m-px relative'>
        <div className='max-w-[83px] mt-3 z-10 relative'>
          <img alt='' src={img} />
        </div>
        <div className='max-w-[328px] z-10 relative mt-4 md:mt-0'>
          <p className='text-[23px] md:text-3xl f-f-fg font-medium gradient-text'>{title}</p>
          <div className='mb-4 lg:min-h-[72px] md:mb-6 mt-1 md:mt-[6.25px] text-[#DEDBF2] opacity-[0.88] text-[15px] md:text-[17px] leading-[25px] md:leading-6'>
            {para}
          </div>
          {cta ? (
            <StyledButton
              content={renderContent()}
              onClickHandler={setOpen}
              className='
          relative w-full md:w-auto max-w-[220px] py-[1px] f-f-fg  text-grey flex flex-col items-center justify-center text-[17px] tracking-[1.36px] rounded-[3px] transition-all duration-300 ease-in-out'
            />
          ) : (
            <TransparentButton
              content={renderContent()}
              onClickHandler={setOpen}
             
              className='
            relative w-full md:w-auto max-w-[220px] f-f-fg  text-grey flex flex-col items-center justify-center text-[17px] tracking-[1.36px] rounded-[3px] transition-all duration-300 ease-in-out'
            />
          )}
        </div>
      </div>
    </Card>
  )
}

export default Index
