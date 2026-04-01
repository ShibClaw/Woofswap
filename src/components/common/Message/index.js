import React from 'react'
import {NetworksData} from "../../../config/constants";
const Message = ({ closeToast, title, type = null, hash = null }) => (
  <div className='flex items-center justify-between'>
    <div className='flex items-center'>
      {type && <img className='message-icon' src={`/image/mark/${type}-mark.svg`}></img>}
      <div>
        <div className='message-title f-f-fg'>{title}</div>
        {hash && (
          <div
            className='text-green text-sm leading-6 cursor-pointer flex items-center underline underline-offset-2'
            onClick={() => {
              window.open(NetworksData[window.currChainId].blockExplorerUrls[0]+`tx/${hash}`, '_blank')
            }}
          >
            View on explorer
            <img src='/image/icons/link.svg' className='ml-1 text-green' alt='link' />
          </div>
        )}
      </div>
    </div>
    <img className='icon-size-20 invert-img' src='/image/icons/icon-close-btn.svg' onClick={closeToast}></img>
  </div>
)

export default Message
