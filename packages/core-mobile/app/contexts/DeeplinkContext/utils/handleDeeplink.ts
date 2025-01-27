import { CORE_UNIVERSAL_LINK_HOSTS } from 'resources/Constants'
import { AnyAction, Dispatch } from '@reduxjs/toolkit'
import Logger from 'utils/Logger'
import { navigateToClaimRewards } from 'services/earn/utils'
import { ProcessedFeatureFlags } from 'store/posthog/types'
import { parseUri } from '@walletconnect/utils'
import { showSimpleToast } from 'components/Snackbar'
import { WalletConnectVersions } from 'store/walletConnectV2/types'
import { newSession } from 'store/walletConnectV2/slice'
import { ACTIONS, DeepLink, PROTOCOLS } from '../types'

export const handleDeeplink = (
  deeplink: DeepLink,
  dispatch: Dispatch<AnyAction>,
  processedFeatureFlags: ProcessedFeatureFlags
): void => {
  let url
  try {
    url = new URL(deeplink.url)
  } catch (e) {
    return
  }
  const protocol = url.protocol.replace(':', '')
  switch (protocol) {
    case PROTOCOLS.WC: {
      const uri = url.href
      const { version } = parseUri(uri)
      dispatchWalletConnectSession(version, uri, dispatch)
      break
    }
    case PROTOCOLS.HTTPS: {
      if (CORE_UNIVERSAL_LINK_HOSTS.includes(url.hostname)) {
        const action = url.pathname.split('/')[1]
        if (action === ACTIONS.WC) {
          const uri = url.searchParams.get('uri')
          if (uri) {
            const { version } = parseUri(uri)
            dispatchWalletConnectSession(version, uri, dispatch)
          } else {
            Logger.info(`${deeplink.url} is not a wallet connect link`)
          }
        }
      }
      break
    }
    case PROTOCOLS.CORE: {
      const action = url.host
      handleWalletConnectActions({
        action,
        url,
        deeplink,
        dispatch,
        processedFeatureFlags
      })
      break
    }
    default:
      return
  }
}

const handleWalletConnectActions = ({
  action,
  url,
  dispatch,
  deeplink,
  processedFeatureFlags
}: {
  action: string
  url: URL
  dispatch: Dispatch<AnyAction>
  deeplink: DeepLink
  processedFeatureFlags: ProcessedFeatureFlags
}): void => {
  switch (action) {
    case ACTIONS.WC: {
      const uri = url.searchParams.get('uri')
      if (uri) {
        const { version } = parseUri(uri)
        dispatchWalletConnectSession(version, uri, dispatch)
      } else {
        Logger.info(`${deeplink.url} is not a wallet connect link`)
      }
      break
    }
    case ACTIONS.StakeComplete: {
      if (processedFeatureFlags.earnBlocked) return
      deeplink.callback?.()
      navigateToClaimRewards()
      break
    }
    default:
      break
  }
}

/**
 * the following formats for WC link are supported:
 * - https://core.app/wc?uri=wc%3Ab08d4b7be6bd25662c5922faadf82ff94d525af4282e0bdc9a78ae2ed9e086ec%402%3Frelay-protocol%3Dirn%26symKey%3Da33be37bb809cfbfbc788a54649bfbf1baa8cdbfe2fe21657fb51ef1bc7ab1fb
 * - wc:b08d4b7be6bd25662c5922faadf82ff94d525af4282e0bdc9a78ae2ed9e086ec@2?relay-protocol=irn&symKey=a33be37bb809cfbfbc788a54649bfbf1baa8cdbfe2fe21657fb51ef1bc7ab1fb
 * - core://wc?uri=wc%3Ab08d4b7be6bd25662c5922faadf82ff94d525af4282e0bdc9a78ae2ed9e086ec%402%3Frelay-protocol%3Dirn%26symKey%3Da33be37bb809cfbfbc788a54649bfbf1baa8cdbfe2fe21657fb51ef1bc7ab1fb
 */
const dispatchWalletConnectSession = (
  version: number,
  uri: string,
  dispatch: Dispatch<AnyAction>
): void => {
  // link is a valid wallet connect uri
  const versionStr = version.toString()
  if (versionStr === WalletConnectVersions.V1) {
    showSimpleToast('WalletConnect V1 is not supported')
  } else if (versionStr === WalletConnectVersions.V2) {
    dispatch(newSession(uri))
  }
}
