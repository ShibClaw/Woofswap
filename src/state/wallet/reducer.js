/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { closeWallet, openWallet } from './actions'

export const initialState = {
  isWalletOpen: false,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(openWallet, (state) => {
      return {
        ...state,
        isWalletOpen: true,
      }
    })
    .addCase(closeWallet, (state) => {
      return {
        ...state,
        isWalletOpen: false,
      }
    }),
)
