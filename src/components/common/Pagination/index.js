import React, { useState } from 'react'
import ReactPaginate from 'react-paginate'
import styled from 'styled-components'
import OutsideClickHandler from 'react-outside-click-handler'
import { NumberOfRows } from '../../../config/constants'

const MyPaginate = styled(ReactPaginate).attrs({
  // You can redefine classes here, if you want.
  activeClassName: 'active', // default to "selected"
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  color: #151b28;
  font-weight: 400;
  font-size: 15px;
  li a {
    padding: 6px 11px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin: 5px;
    background: #FFFFFF;
    border-radius: 7px;
  }
  li.active a {
    background: #ffffff;
    border-radius: 7px;
    color: #f06500;
    font-weight: 500;
    border: 1px solid #f06500;
    padding: 5px 11px;
  }
  li.disabled a {
    color: grey;
    background: #c8c8c8;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`

const Pagination = ({ pageSize, setPageSize, handlePageClick, pageCount, currentPage, total = 0 }) => {
  const [rowDropDown, setRowDropDown] = useState(false)
  return (
    <div className='pagination-normal flex items-center lg:flex-row w-full justify-end mt-[15px]'>
      <div className='flex space-x-5 lg:space-x-2 mt-3 lg:mt-0'>
        <div className='flex items-center space-x-2.5 text-[15px] text-grey-666'>
          {`${currentPage * pageSize + 1}-${Math.min(currentPage * pageSize + pageSize, total)} of ${total}`}
        </div>
      </div>
      <MyPaginate
        breakLabel='...'
        nextLabel='>'
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        pageCount={pageCount}
        previousLabel='<'
        renderOnZeroPageCount={null}
        forcePage={currentPage}
      />
        <div className='flex items-center space-x-2.5 text-[15px] text-grey-666'>
            <div className='relative z-20'>
                <div
                    onClick={() => {
                        setRowDropDown(!rowDropDown)
                    }}
                    className='flex items-center space-x-1 cursor-pointer'
                >
                    <div className="row-drop-down">{pageSize}</div>

                    {/*<img*/}
                    {/*    className={`${rowDropDown ? 'rotate-180' : ''} transform transition-all duration-300 ease-in-out`}*/}
                    {/*    alt=''*/}
                    {/*    src='/image/liquidity/small-arrow-bottom.svg'*/}
                    {/*/>*/}
                </div>
                {rowDropDown && (
                    <OutsideClickHandler
                        onOutsideClick={() => {
                            setRowDropDown(false)
                        }}
                    >
                        <div className='rows-box bg-[#000045] overflow-auto text-grey-666 text-xs md:text-base leading-6 rounded-md absolute bottom-8'>
                            {NumberOfRows.map((item, idx) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setPageSize(item)
                                            setRowDropDown(false)
                                        }}
                                        className='rows-box-row flex items-center space-x-1 cursor-pointer'
                                        key={idx * Math.random()}
                                    >
                                        <span>{item}</span> <p>Rows</p>
                                    </div>
                                )
                            })}
                        </div>
                    </OutsideClickHandler>
                )}
            </div>
        </div>
    </div>
  )
}

export default Pagination
