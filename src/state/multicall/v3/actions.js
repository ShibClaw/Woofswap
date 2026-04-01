import { createAction } from '@reduxjs/toolkit'

export const addV3MulticallListeners = createAction('multicallV3/addMulticallListeners')
export const removeV3MulticallListeners = createAction('multicallV3/removeMulticallListeners')
export const fetchingV3MulticallResults = createAction('multicallV3/fetchingMulticallResults')
export const errorFetchingV3MulticallResults = createAction('multicallV3/errorFetchingMulticallResults')
export const updateV3MulticallResults = createAction('multicallV3/updateMulticallResults')
