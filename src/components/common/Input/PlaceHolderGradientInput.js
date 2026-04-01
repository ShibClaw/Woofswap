import React from 'react'

const PlaceHolderGradientInput = ({ label, type, setSearch, placeholder, searchText, className, disabled }) => {
  return (
    <div className={`${className} w-full`}>
      <label className='text-grey font-light'>{label}</label>
      <div className={` ${disabled ? 'bg-transparent border border-[#F703D2] border-opacity-[0.12]' : 'gradient-bg p-px'}   w-full rounded-[3px] mt-1.5`}>
        <div className={`${disabled ? 'bg-white bg-opacity-[0.12]' : 'bg-body'} px-3  rounded-[3px] flex items-center justify-between`}>
          <input
            type={type ? type : 'text'}
            value={searchText}
            disabled={disabled}
            onChange={setSearch}
            placeholder={placeholder}
            className={`bg-transparent w-full font-light py-[8px] text-lg leading-10 placeholder-[#757384] text-grey`}
          />
        </div>
      </div>
    </div>
  )
}

export default PlaceHolderGradientInput
