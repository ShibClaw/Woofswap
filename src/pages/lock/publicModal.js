import React, { useState, useEffect, useMemo, useCallback } from 'react'
import StyledButton from '../../components/common/Buttons/styledButton'
import CommonHollowModal from '../../components/common/CommonHollowModal'

const PublicModal = ({ isOpen, setIsOpen, publicModalInformation, publicModalTitle,onConfirm }) => {
    const onCreate = useCallback(() => {
        setIsOpen(false)
        onConfirm()
    }, [])
    return (
        <CommonHollowModal popup={isOpen} width={400} setPopup={setIsOpen} title= {publicModalTitle} >
            <div className='mt-5'>
                <div className='public-m-content'>
                    <img className="icon-size-20 m-r-8px" alt="" src="/image/icons/icon-tips.svg" />
                    {publicModalInformation}
                </div>

                <div className="flex justify-center">
                    <StyledButton
                        onClickHandler={onCreate}
                        content={'Confirm'}
                        className='py-[13px] md:py-[14.53px] text-grey mt-4 text-base tracking-[1.12px] md:tracking-[1.44px] flex items-center justify-center leading-[24px] px-[19px] rounded-[3px]'
                    />
                </div>

            </div>
        </CommonHollowModal>
    )
}

export default PublicModal
