import { ChainId } from '@avalabs/chains-sdk'
import { useSelector } from 'react-redux'
import { selectActiveNetwork } from 'store/network'

export enum UI {
  Collectibles = 'Collectibles',
  Swap = 'Swap',
  Buy = 'Buy',
  ManageTokens = 'ManageTokens',
  Bridge = 'Bridge',
  WalletConnect = 'WalletConnect'
}

// The list of features we want to enable on certain networks (whitelist)
const enabledUIs: Partial<Record<UI, number[]>> = {
  [UI.Collectibles]: [
    ChainId.AVALANCHE_MAINNET_ID,
    ChainId.AVALANCHE_TESTNET_ID,
    ChainId.ETHEREUM_HOMESTEAD,
    ChainId.ETHEREUM_TEST_GOERLY,
    ChainId.ETHEREUM_TEST_RINKEBY
  ],
  [UI.Swap]: [ChainId.AVALANCHE_MAINNET_ID],
  [UI.Buy]: [ChainId.AVALANCHE_MAINNET_ID, ChainId.AVALANCHE_TESTNET_ID],
  [UI.WalletConnect]: [
    ChainId.AVALANCHE_MAINNET_ID,
    ChainId.AVALANCHE_TESTNET_ID
  ]
}

// The list of features we want to disable on certain networks (blacklist)
const disabledUIs: Partial<Record<UI, number[]>> = {
  [UI.ManageTokens]: [ChainId.BITCOIN, ChainId.BITCOIN_TESTNET],
  [UI.Bridge]: [
    ChainId.DFK,
    ChainId.DFK_TESTNET,
    ChainId.SWIMMER,
    ChainId.SWIMMER_TESTNET
  ]
}

export const useIsUIDisabled = (ui: UI) => {
  const { chainId } = useSelector(selectActiveNetwork)

  if (enabledUIs[ui]?.includes(chainId)) {
    return false
  }

  const disabled = disabledUIs[ui]
  if (disabled && !disabled.includes(chainId)) {
    return false
  }

  return true
}
