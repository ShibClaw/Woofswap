import { createReducer } from '@reduxjs/toolkit'
import {
  selectCurrency,
  Field,
  resetMintState,
  setAddLiquidityTxHash,
  updateCurrentStep,
  setFullRange,
  setInitialTokenPrice,
  setInitialUSDPrices,
  setShowNewestPosition,
  typeInput,
  typeLeftRangeInput,
  typeRightRangeInput,
  typeStartPriceInput,
  updateDynamicFee,
  updateSelectedPreset,
  updateLiquidityRangeType,
  updatePresetRange,
} from './actions'

export const Presets = {
  SAFE: 'SAFE',
  RISK: 'RISK',
  NORMAL: 'NORMAL',
  FULL: 'FULL',
  STABLE: 'STABLE',
  GAMMA_NARROW: 'GAMMA_NARROW',
  GAMMA_WIDE: 'GAMMA_WIDE',
  GAMMA_DYNAMIC: 'GAMMA_DYNAMIC',
  GAMMA_STABLE: 'GAMMA_STABLE',
}

const initialState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  startPriceTypedValue: '',
  leftRangeTypedValue: '',
  rightRangeTypedValue: '',
  dynamicFee: 0,
  preset: null,
  txHash: '',
  showNewestPosition: false,
  initialUSDPrices: { [Field.CURRENCY_A]: '', [Field.CURRENCY_B]: '' },
  initialTokenPrice: '',
  currentStep: 0,
  [Field.CURRENCY_A]: {
    currencyId: '',
  },
  [Field.CURRENCY_B]: {
    currencyId: '',
  },
  liquidityRangeType: undefined,
  presetRange: undefined,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateDynamicFee, (state, { payload: { dynamicFee } }) => {
      return {
        ...state,
        dynamicFee,
      }
    })
    .addCase(resetMintState, () => initialState)
    .addCase(setFullRange, (state) => {
      return {
        ...state,
        leftRangeTypedValue: true,
        rightRangeTypedValue: true,
      }
    })
    .addCase(typeStartPriceInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        startPriceTypedValue: typedValue,
      }
    })
    .addCase(typeLeftRangeInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        leftRangeTypedValue: typedValue,
      }
    })
    .addCase(typeRightRangeInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        rightRangeTypedValue: typedValue,
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue, noLiquidity } }) => {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          }
        }
        // they're typing into a new field, store the other value
        else {
          return {
            ...state,
            independentField: field,
            typedValue,
          }
        }
      } else {
        return {
          ...state,
          independentField: field,
          typedValue,
        }
      }
    })
    .addCase(updateSelectedPreset, (state, { payload: { preset } }) => {
      return {
        ...state,
        preset,
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId },
        }
      }
    })
    .addCase(setAddLiquidityTxHash, (state, { payload: { txHash } }) => {
      return {
        ...state,
        txHash,
      }
    })
    .addCase(setShowNewestPosition, (state, { payload: { showNewestPosition } }) => {
      return {
        ...state,
        showNewestPosition,
      }
    })
    .addCase(setInitialUSDPrices, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        initialUSDPrices: {
          ...state.initialUSDPrices,
          [field]: typedValue,
        },
      }
    })
    .addCase(setInitialTokenPrice, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        initialTokenPrice: typedValue,
      }
    })
    .addCase(updateCurrentStep, (state, { payload: { currentStep } }) => {
      return {
        ...state,
        currentStep,
      }
    })
    .addCase(updateLiquidityRangeType, (state, { payload: { liquidityRangeType } }) => {
      return {
        ...state,
        liquidityRangeType,
      }
    })
    .addCase(updatePresetRange, (state, { payload: { presetRange } }) => {
      return {
        ...state,
        presetRange,
      }
    }),
)
