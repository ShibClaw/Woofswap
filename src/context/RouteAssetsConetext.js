import React, { useState, useEffect } from 'react'
import useRefresh from '../hooks/useRefresh'
import { getRouteAssets } from '../utils/api'

const RouteAssetsConetext = React.createContext([])

const RouteAssetsConetextProvider = ({ children }) => {
  const [routeAssets, setRouteAssets] = useState([])
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    getRouteAssets()
      .then((res) => {
        setRouteAssets(res)
      })
      .catch((error) => {
        console.error('Route Assets fetched had error', error)
      })
  }, [fastRefresh])

  return <RouteAssetsConetext.Provider value={routeAssets}>{children}</RouteAssetsConetext.Provider>
}

export { RouteAssetsConetext, RouteAssetsConetextProvider }
