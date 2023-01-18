import { JsonMap } from 'posthog-react-native/src/bridge'

export enum FeatureGates {
  EVERYTHING = 'everything',
  EVENTS = 'events',
  SWAP = 'swap-feature',
  BRIDGE = 'bridge-feature',
  BRIDGE_BTC = 'bridge-feature-btc',
  BRIDGE_ETH = 'bridge-feature-eth',
  SEND = 'send-feature',
  SEND_NFT_IOS = 'send-nft-ios-feature',
  SEND_NFT_ANDROID = 'send-nft-android-feature',
  USE_FLATLIST_ANDROID = 'use-flatlist-android'
}

export enum FeatureVars {
  SENTRY_SAMPLE_RATE = 'sentry-sample-rate'
}

export type PosthogCapture = (
  event: string,
  properties?: JsonMap
) => Promise<void>

// posthog response can be an empty object when all features are disabled
// thus, we need to use Partial
export type PostHogDecideResponse = {
  featureFlags: Partial<Record<FeatureGates | FeatureVars, boolean | string>>
}

export type FeatureFlags = PostHogDecideResponse['featureFlags']