import { Route, Routes } from 'react-router-dom'
import Swap from './pages/swap'
import Aitest from './pages/aitest'
import Liquidity from './pages/liquidity'
import Migration from './pages/liquidity/migration'
import ManageLiquidity from './pages/liquidity/manageLiquidity'
import Lock from './pages/lock'
import Vote from './pages/vote'
import Rewards from './pages/rewards'
// import WhiteList from './pages/whiteList'
import AddBribe from './pages/whiteList/bribeModal'
import Launchpad from './pages/launchpad'

import Header from './components/common/Header'
import Footer from './components/common/Footer'
import PageNotFound from './pages/404NotFound'
import { RefreshContextProvider } from './context/RefreshContext'
import { ToastContainer, Zoom } from 'react-toastify'
import { useVideoAutoplay } from './helpers/useAutoPlay'
import './App.scss'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import { VeWOOFsContextProvider } from './context/veWOOFsConetext'
import { BaseAssetsConetextProvider } from './context/BaseAssetsConetext'
import { RouteAssetsConetextProvider } from './context/RouteAssetsConetext'
import { PairsContextProvider } from './context/PairsContext'
import { GammasContextProvider } from './context/GammasContext'
import ApplicationUpdater from './state/application/updater'
import MultiCallV3Updater from './state/multicall/v3/updater'
import { useLocation, Link } from 'react-router-dom'
import { useTheme } from './components/common/ThemeToggleButton/ThemeContext';

const Updaters = () => {
  return (
    <>
      <ApplicationUpdater />
      <MultiCallV3Updater />
    </>
  )
}

const App = () => {
  useVideoAutoplay()
  const route = useLocation()
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <div className={`main ${route.pathname === '/' ? 'bac-home' : ''}  ${isDarkMode === 'light' ? 'light-mode' : 'dark-mode'}`} >
      <RefreshContextProvider>
        <Updaters />
        <BaseAssetsConetextProvider>
          <RouteAssetsConetextProvider>
            <PairsContextProvider>
              <VeWOOFsContextProvider>
                <GammasContextProvider>
                  <div className="screen-layout">
                    <Header/>
                    <Routes>
                      <Route path='/' element={<Swap />} exact />
                    <Route path='/swap' element={<Swap />} exact />
                    <Route path='/aitest' element={<Aitest />} exact />
                    <Route path='/liquidity' element={<Liquidity />} exact />
                      <Route path='/liquidity/liquidity' element={<Liquidity />} exact />
                      <Route path='/liquidity/migration' element={<Migration />} exact />
                      <Route path='/liquidity/manage' element={<ManageLiquidity />} exact />
                      <Route path='/liquidity/manage/:address' element={<ManageLiquidity />} exact />
                      <Route path='/lock' element={<Lock />} exact />
                      <Route path='/vote' element={<Vote />} exact />

                      <Route path='/vote/:veId' element={<Vote />} exact />
                      <Route path='/rewards' element={<Rewards />} exact />
                      <Route path='/bribe' element={<AddBribe />} exact />
                      <Route path='/404' element={<PageNotFound />} exact />
                      <Route path='*' element={<PageNotFound />} exact />
                    </Routes>
                  </div>
                  {/*<Footer />*/}
                </GammasContextProvider>
              </VeWOOFsContextProvider>
            </PairsContextProvider>
          </RouteAssetsConetextProvider>
        </BaseAssetsConetextProvider>
      </RefreshContextProvider>
      <ToastContainer
        className='notify-class'
        position='top-right'
        theme='dark'
        closeOnClick={false}
        transition={Zoom}
        autoClose={5000}
        hideProgressBar={true}
        closeButton={false}
      />
    </div>
  )
}

export default App
