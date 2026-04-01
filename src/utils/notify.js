import { toast } from 'react-toastify'
import Message from '../components/common/Message'

/*
  type: 0 -> pending, 1 -> success, 2 -> fail
*/
export function notify(type = 0, hash = '', toastId = null, message = null) {
  console.log('hash :>> ', hash)
  switch (type) {
    case 0:
      return toast.loading(<Message title={'Transaction Pending'} />)
    case 1:
      toast.update(toastId, {
        render: <Message title={'Transaction Successful'} type={'success'} />,
        type: 'success',
        isLoading: false,
        icon: false,
        autoClose: 5000,
      })
      break
    case 2:
      if (!toastId) {
        customNotify(message, 'error')
      } else {
        toast.update(toastId, {
          render: <Message title={message} type={'error'} />,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        })
      }
      break

    default:
      break
  }
}

export function customNotify(title, type, hash = null) {
  switch (type) {
    case 'success':
      toast.success(<Message title={title} type={type} hash={hash} />, {
        icon: false,
      })
      break

    case 'error':
      toast.error(<Message title={title} type={type} />, {
        icon: false,
      })
      break

    case 'warn':
      toast.warn(<Message title={title} type={type} />, {
        icon: false,
      })
      break

    case 'info':
      toast.info(<Message title={title} type={type} />, {
        icon: false,
      })
      break

    default:
      break
  }
}
