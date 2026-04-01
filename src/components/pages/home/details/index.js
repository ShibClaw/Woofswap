import React, { useContext, useMemo } from 'react'
import { PairsContext } from '../../../../context/PairsContext'
import { useEpochTimer, useOneDayVolume, useTVL } from '../../../../hooks/useGeneral'
import usePrices from '../../../../hooks/usePrices'
import { formatAmount } from '../../../../utils/formatNumber'
import './style.scss'

const Details = () => {
  const prices = usePrices()
  const tvl = useTVL()
  const { supply } = useContext(PairsContext)
  const { circSupply, lockedSupply } = supply
  const { days, hours, mins, epoch } = useEpochTimer()
  const oneDayVolume = useOneDayVolume()

  const details = useMemo(() => {
    return [
      {
        title: 'TOTAL VALUE LOCKED',
        value: tvl && !tvl.isZero() ? `$${formatAmount(tvl)}` : 'N/A',
      },
      {
        title: 'CIRCULATING MARKET CAP',
        value: prices ? `$${formatAmount(circSupply.times(prices['WOOF']))}` : 'N/A',
      },
      {
        title: 'CIRCULATING SUPPLY',
        value: !circSupply.isZero() ? `${formatAmount(circSupply)}` : 'N/A',
      },
      {
        title: 'WOOF PRICE',
        value: prices ? `$${formatAmount(prices['WOOF'])}` : 'N/A',
      },
      {
        title: '24 HOUR VOLUME',
        value: oneDayVolume ? `$${formatAmount(oneDayVolume)}` : 'N/A',
      },
      {
        title: 'TOTAL LOCKED WOOF',
        value: lockedSupply ? `${formatAmount(lockedSupply)}` : 'N/A',
      },
      {
        title: `EPOCH ${epoch} ENDS IN`,
        value: `${days}d ${hours}h ${mins}m`,
      },
    ]
  }, [prices, tvl, circSupply, lockedSupply, mins, oneDayVolume])

  return (
      <></>
    // <div className='details-container'>
    //   <div className='container-1 mx-auto'>
    //     <div className='details-body'>
    //       {details.map((item, index) => {
    //         return (
    //           <div className='details-item' key={`details-${index}`}>
    //             <img alt='' className='absolute z-[0] max-w-[180px] lg:max-w-[240px]' src='/image/home/detail-bg.png' />
    //             <div className='details-item-title f-f-fg relative z-10'>{item.title}</div>
    //             <div className='details-item-vaule relative z-10'>{item.value}</div>
    //           </div>
    //         )
    //       })}
    //     </div>
    //   </div>
    // </div>
  )
}

export default Details
