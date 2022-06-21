import { createListenerMiddleware, TypedStartListening } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from 'store'
import { addAppListeners } from 'store/app'
import { addBalanceListeners } from 'store/balance'
import { addAccountListener } from 'store/account'
import { fetchNetworkFeeListener } from 'store/networkFee'
import { addSetBridgeFilterListener } from 'store/bridge'

export type AppStartListening = TypedStartListening<RootState, AppDispatch>

const listener = createListenerMiddleware({
  onError: (error, errorInfo) => console.error(error, errorInfo)
})

const startListening = listener.startListening as AppStartListening

addAppListeners(startListening)

addBalanceListeners(startListening)

addAccountListener(startListening)

addSetBridgeFilterListener(startListening)

fetchNetworkFeeListener(startListening)

export { listener }