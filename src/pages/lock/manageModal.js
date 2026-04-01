import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CommonHollowModal from '../../components/common/CommonHollowModal'
import Tab from '../../components/common/Tab'
import ManageTab from '../../components/pages/lock/manage'
import MergeTab from '../../components/pages/lock/merge'
import SplitTab from '../../components/pages/lock/split'
import TransferTab from '../../components/pages/lock/transfer'

const data = ['MANAGE', 'MERGE', 'SPLIT', 'TRANSFER']

const ManageModal = ({ isOpen, setIsOpen, selected, theAsset }) => {
  const [tab, setTab] = useState(0)
  const { final } = useSelector((state) => state.transactions)

  useEffect(() => {
    if (['Split Successful', 'Merge Successful', 'Transfer Successful'].includes(final)) {
      setIsOpen(false)
    }
  }, [final])

  return (
    <CommonHollowModal popup={isOpen} width={588} setPopup={setIsOpen} title={`Manage veWOOF #${selected.id}`}>
      <Tab className={'mt-4 md:mt-[29px]'} multi={true} tab={tab} setTab={setTab} tabData={data} />
      {tab === 0 && <ManageTab selected={selected} theAsset={theAsset} />}
      {tab === 1 && <MergeTab selected={selected} />}
      {tab === 2 && <SplitTab selected={selected} />}
      {tab === 3 && <TransferTab selected={selected} />}
    </CommonHollowModal>
  )
}

export default ManageModal
