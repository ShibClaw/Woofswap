import { useCallback } from 'react'
import { useActiveWeb3React } from './useActiveWeb3React'

const useGetMuonSignature = () => {
  const { library } = useActiveWeb3React()
  return useCallback(
    (user, timestamp) => {
      if (!user || !library) {
        return null
      }
      const signer = library.getSigner()
      const typedData = {
        types: {
          Message: [
            { type: 'address', name: 'user' },
            { type: 'uint256', name: 'timestamp' },
          ],
        },
        domain: { name: 'Dibs' },
        primaryType: 'Message',
        message: { user, timestamp },
      }
      return signer._signTypedData(typedData.domain, typedData.types, typedData.message)
    },
    [library],
  )
}

export default useGetMuonSignature
