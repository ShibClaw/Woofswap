import { useContext } from 'react'
import { RefreshContext } from '../context/RefreshContext'

const useRefresh = () => {
  const { fastest,setFastest, fast, slow } = useContext(RefreshContext)
  return { fastestRefresh: fastest,setfastestRefresh: setFastest, fastRefresh: fast, slowRefresh: slow }
}

export default useRefresh
