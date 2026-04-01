import { createAction } from '@reduxjs/toolkit'

export const Field = {
  CURRENCY_A: 'CURRENCY_A',
  CURRENCY_B: 'CURRENCY_B',
}

export const Bound = {
  LOWER: 'LOWER',
  UPPER: 'UPPER',
}

export const typeInput = createAction('mintV3/typeInputMint')
export const typeStartPriceInput = createAction('mintV3/typeStartPriceInput')
export const typeLeftRangeInput = createAction('mintV3/typeLeftRangeInput')
export const typeRightRangeInput = createAction('mintV3/typeRightRangeInput')
export const resetMintState = createAction('mintV3/resetMintState')
export const setFullRange = createAction('mintV3/setFullRange')
export const updateDynamicFee = createAction('mintV3/updateDynamicFee')
export const updateSelectedPreset = createAction('mintV3/updateSelectedPreset')
export const setAddLiquidityTxHash = createAction('mintV3/setAddLiquidityTxHash')
export const setShowNewestPosition = createAction('mintV3/setShowNewestPosition')
export const setInitialUSDPrices = createAction('mintV3/setInitialUSDPrices')
export const setInitialTokenPrice = createAction('mintV3/setInitialTokenPrice')
export const updateCurrentStep = createAction('mintV3/setCurrentStep')
export const selectCurrency = createAction('mintV3/selectCurrency')
export const updateLiquidityRangeType = createAction('mintV3/setliquidityRangeType')
export const updatePresetRange = createAction('mintV3/setPresetRange')
