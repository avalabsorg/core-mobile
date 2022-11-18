import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BITCOIN_NETWORK, Network } from '@avalabs/chains-sdk'
import { selectIsDeveloperMode } from 'store/settings/advanced'
import { selectAllCustomTokens } from 'store/customToken'
import { LocalTokenWithBalance } from 'store/balance'
import { getLocalTokenId } from 'store/balance/utils'
import { BN } from 'bn.js'
import { RootState } from '../index'
import { ChainID, NetworkState } from './types'
import { mergeWithCustomTokens } from './utils'

const defaultNetwork = BITCOIN_NETWORK

export const noActiveNetwork = 0

export const alwaysFavoriteNetworks = [43114, 43113] //Avalanche mainnet, testnet

const reducerName = 'network'

const initialState: NetworkState = {
  networks: {},
  customNetworks: {},
  favorites: [...alwaysFavoriteNetworks, -1, -2, 1], //BTC, BTC testnet, ETH
  active: noActiveNetwork
}

export const networkSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setNetworks: (state, action: PayloadAction<Record<number, Network>>) => {
      state.networks = action.payload
    },
    setActive: (state, action: PayloadAction<number>) => {
      state.active = action.payload
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const chainId = action.payload
      if (!state.favorites.includes(chainId)) {
        // set favorite
        state.favorites.push(chainId)
      } else {
        if (alwaysFavoriteNetworks.includes(chainId)) {
          return
        }
        // unset favorite
        const newFavorites = state.favorites.filter(id => id !== chainId)
        state.favorites = newFavorites
      }
    },
    addCustomNetwork: (state, action: PayloadAction<Network>) => {
      const network = action.payload
      state.customNetworks[network.chainId] = network
    },
    removeCustomNetwork: (state, action: PayloadAction<ChainID>) => {
      const chainId = action.payload
      delete state.customNetworks[chainId]
    }
  }
})

// selectors
const selectActiveChainId = (state: RootState) => state.network.active

const selectFavorites = (state: RootState) => state.network.favorites

const _selectNetworks = (state: RootState) => state.network.networks
const _selectCustomNetworks = (state: RootState) => state.network.customNetworks

export const selectNetworks = createSelector(
  [
    _selectNetworks,
    _selectCustomNetworks,
    selectAllCustomTokens,
    selectIsDeveloperMode
  ],
  (networks, customNetworks, allCustomTokens, isDeveloperMode) => {
    const populatedNetworks = Object.keys(networks).reduce(
      (reducedNetworks, key) => {
        const chainId = parseInt(key)
        const network = networks[chainId]
        if (network && network.isTestnet === isDeveloperMode) {
          reducedNetworks[chainId] = mergeWithCustomTokens(
            network,
            allCustomTokens
          )
        }
        return reducedNetworks
      },
      {} as Record<number, Network>
    )
    const populatedCustomNetworks = Object.keys(customNetworks).reduce(
      (reducedNetworks, key) => {
        const chainId = parseInt(key)
        const network = customNetworks[chainId]
        if (network && network.isTestnet === isDeveloperMode) {
          reducedNetworks[chainId] = mergeWithCustomTokens(
            network,
            allCustomTokens
          )
        }
        return reducedNetworks
      },
      {} as Record<number, Network>
    )
    return { ...populatedNetworks, ...populatedCustomNetworks }
  }
)

export const selectCustomNetworks = createSelector(
  [selectNetworks, _selectCustomNetworks],
  (networks, customNetworks) => {
    const customNetworkChainIds = Object.values(customNetworks).map(
      n => n.chainId
    )
    return Object.values(networks).filter(n =>
      customNetworkChainIds.includes(n.chainId)
    )
  }
)

export const selectActiveNetwork = createSelector(
  [selectNetworks, selectActiveChainId],
  (networks, chainId) => {
    const network = networks[chainId]
    if (!network) return defaultNetwork
    return network
  }
)

export const selectFavoriteNetworks = createSelector(
  [selectFavorites, selectNetworks, selectIsDeveloperMode],
  (favorites, networks, isDeveloperMode) => {
    return favorites.reduce((acc, chainId) => {
      const network = networks[chainId]
      if (network && network.isTestnet === isDeveloperMode) {
        acc.push(network)
      }
      return acc
    }, [] as Network[])
  }
)

export const selectInactiveNetworks = createSelector(
  [selectActiveChainId, selectFavoriteNetworks],
  (activeChainId, favoriteNetworks) => {
    return favoriteNetworks.filter(network => network.chainId !== activeChainId)
  }
)

// get the list of contract tokens for the active network
export const selectNetworkContractTokens = (state: RootState) => {
  const network = selectActiveNetwork(state)
  return network.tokens ?? []
}

// get token info for a contract token of the active network
export const selectTokenInfo = (symbol: string) => (state: RootState) => {
  const tokens = selectNetworkContractTokens(state)
  return tokens.find(token => token.symbol === symbol)
}

export const selectIsTestnet = (chainId: number) => (state: RootState) => {
  const networks = _selectNetworks(state)
  const network = networks[chainId]
  return network?.isTestnet
}

export const selectIsCustomNetwork =
  (chainId: number) => (state: RootState) => {
    const customNetworks = _selectCustomNetworks(state)
    return !!customNetworks[chainId]
  }

export const selectAllNetworkTokensAsLocal = (
  state: RootState
): LocalTokenWithBalance[] => {
  return (
    state.network.networks[state.network.active]?.tokens?.map(token => {
      return {
        ...token,
        localId: getLocalTokenId(token),
        balance: new BN(0),
        balanceInCurrency: 0,
        balanceDisplayValue: '0',
        balanceCurrencyDisplayValue: '0',
        priceInCurrency: 0,
        marketCap: 0,
        change24: 0,
        vol24: 0
      } as LocalTokenWithBalance
    }) ?? []
  )
}

export const {
  setNetworks,
  setActive,
  toggleFavorite,
  addCustomNetwork,
  removeCustomNetwork
} = networkSlice.actions

export const networkReducer = networkSlice.reducer
