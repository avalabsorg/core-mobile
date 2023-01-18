import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import {
  BridgeConfig,
  BridgeTransaction,
  CriticalConfig
} from '@avalabs/bridge-sdk'
import { selectActiveNetwork } from 'store/network'
import { BridgeState, initialState } from 'store/bridge/types'

export const reducerName = 'bridge'

export const bridgeSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    addBridgeTransaction: (state, action: PayloadAction<BridgeTransaction>) => {
      const bridgeTx = action.payload
      state.bridgeTransactions[bridgeTx.sourceTxHash] = bridgeTx
    },
    popBridgeTransaction: (state, action: PayloadAction<string>) => {
      const sourceTxHash = action.payload
      delete state.bridgeTransactions[sourceTxHash]
    },
    setConfig: (state, action: PayloadAction<BridgeConfig>) => {
      state.config = action.payload
    }
  }
})

const selectTransactions = (state: RootState) => state.bridge.bridgeTransactions

export const selectBridgeConfig = (state: RootState) => state.bridge.config

export const selectBridgeAppConfig = (state: RootState) =>
  state.bridge.config?.config

export const selectBridgeCriticalConfig = (
  state: RootState
): CriticalConfig | undefined => {
  if (state.bridge.config && state.bridge.config.config) {
    return {
      critical: state.bridge.config.config.critical,
      criticalBitcoin: state.bridge.config.config.criticalBitcoin
    }
  }
}

export const selectBridgeTransactions = createSelector(
  [selectTransactions, selectActiveNetwork],
  (bridgeTransactions, activeNetwork) => {
    return Object.values(bridgeTransactions).reduce<
      BridgeState['bridgeTransactions']
    >((txs, btx) => {
      const isMainnet = !activeNetwork.isTestnet
      // go figure
      const bridgeTx = btx as BridgeTransaction
      if (bridgeTx.environment === (isMainnet ? 'main' : 'test')) {
        txs[bridgeTx.sourceTxHash] = bridgeTx
      }
      return txs
    }, {})
  }
)

export const { addBridgeTransaction, popBridgeTransaction, setConfig } =
  bridgeSlice.actions

export const bridgeReducer = bridgeSlice.reducer