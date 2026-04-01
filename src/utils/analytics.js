import ReactGA from 'react-ga4'

function init() {
  const GOOGLE_ANALYTICS_ID = 'G-WSF8F61YJ'
  if (typeof GOOGLE_ANALYTICS_ID === 'string') {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
      gaOptions: {
        storage: 'none',
        storeGac: false,
      },
    })
  } else {
    ReactGA.initialize('test', { testMode: true, debug: true })
  }
}

function sendEvent(payload) {
  ReactGA.event(payload)
}

function sendPageview(path) {
  ReactGA.send({ hitType: 'pageview', page: path })
}

const GA = {
  init,
  sendEvent,
  sendPageview,
}

export default GA
