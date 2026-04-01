import React from 'react'

const SearchInput = ({ searchText, setSearchText, placeholder, full, className, onlyNumber = false }) => (
    <div className={`w-full rounded-[3px] flex items-center ${!full && 'lg:max-w-[250px]'} lg:min-w-[200px] relative ${className}`}>
        <img className='pointer-events-none absolute left-3 w-6 h-6' alt='' src='/image/icons/icon-search.svg' />
        <input
            type={onlyNumber ? 'number' : 'text'}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={placeholder}
            className='bg-body-white placeholder-[#757384] h-[42px]  w-full text-grey text-base pl-[41px] pr-4 py-[18px] rounded-[3px]'
        />
    </div>
)

export default SearchInput
