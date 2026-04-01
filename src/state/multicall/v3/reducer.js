import { createReducer } from '@reduxjs/toolkit'
import {
  addV3MulticallListeners,
  errorFetchingV3MulticallResults,
  fetchingV3MulticallResults,
  removeV3MulticallListeners,
  updateV3MulticallResults,
} from './actions'
import { toCallKey } from './utils'

const initialState = {
  callResults: {},
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addV3MulticallListeners,
      (
        state,
        {
          payload: {
            calls,
            chainId,
            options: { blocksPerFetch },
          },
        },
      ) => {
        const listeners = state.callListeners ? state.callListeners : (state.callListeners = {})
        listeners[chainId] = listeners[chainId] ?? {}
        calls.forEach((call) => {
          const callKey = toCallKey(call)
          listeners[chainId][callKey] = listeners[chainId][callKey] ?? {}
          listeners[chainId][callKey][blocksPerFetch] = (listeners[chainId][callKey][blocksPerFetch] ?? 0) + 1
        })
      },
    )
    .addCase(
      removeV3MulticallListeners,
      (
        state,
        {
          payload: {
            chainId,
            calls,
            options: { blocksPerFetch },
          },
        },
      ) => {
        const listeners = state.callListeners ? state.callListeners : (state.callListeners = {})

        if (!listeners[chainId]) return
        calls.forEach((call) => {
          const callKey = toCallKey(call)
          if (!listeners[chainId][callKey]) return
          if (!listeners[chainId][callKey][blocksPerFetch]) return

          if (listeners[chainId][callKey][blocksPerFetch] === 1) {
            delete listeners[chainId][callKey][blocksPerFetch]
          } else {
            listeners[chainId][callKey][blocksPerFetch]--
          }
        })
      },
    )
    .addCase(fetchingV3MulticallResults, (state, { payload: { chainId, fetchingBlockNumber, calls } }) => {
      state.callResults[chainId] = state.callResults[chainId] ?? {}
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const current = state.callResults[chainId][callKey]
        if (!current) {
          state.callResults[chainId][callKey] = {
            fetchingBlockNumber,
          }
        } else {
          if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return
          state.callResults[chainId][callKey].fetchingBlockNumber = fetchingBlockNumber
        }
      })
    })
    .addCase(errorFetchingV3MulticallResults, (state, { payload: { fetchingBlockNumber, chainId, calls } }) => {
      state.callResults[chainId] = state.callResults[chainId] ?? {}
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const current = state.callResults[chainId][callKey]
        if (!current || typeof current.fetchingBlockNumber !== 'number') return // only should be dispatched if we are already fetching
        if (current.fetchingBlockNumber <= fetchingBlockNumber) {
          delete current.fetchingBlockNumber
          current.data = null
          current.blockNumber = fetchingBlockNumber
        }
      })
    })
    .addCase(updateV3MulticallResults, (state, { payload: { chainId, results, blockNumber } }) => {
      state.callResults[chainId] = state.callResults[chainId] ?? {}
      Object.keys(results).forEach((callKey) => {
        const current = state.callResults[chainId][callKey]
        if ((current?.blockNumber ?? 0) > blockNumber) return
        state.callResults[chainId][callKey] = {
          data: results[callKey],
          blockNumber,
        }
      })
    }),
)
