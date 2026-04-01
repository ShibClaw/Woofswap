import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { closeWallet, openWallet } from '../state/wallet/actions'
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme
} from '@web3modal/ethers/react'

const useWalletModal = () => {
  const dispatch = useDispatch()
  const modal = useWeb3Modal()

  const closeWalletModal = useCallback(() => {
    dispatch(closeWallet())
  }, [dispatch])

  const openWalletModal = useCallback(() => {
    // dispatch(openWallet())
    modal.open();
  }, [dispatch])

  return { openWalletModal, closeWalletModal }
}

export default useWalletModal
