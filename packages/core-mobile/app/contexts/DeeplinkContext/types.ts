import { Dispatch } from 'react'

export interface DeeplinkContextType {
  pendingDeepLink: DeepLink | undefined
  setPendingDeepLink: Dispatch<DeepLink>
}

export interface DeepLink {
  url: string
  origin: DeepLinkOrigin
  callback?: () => void
}

export enum DeepLinkOrigin {
  ORIGIN_DEEPLINK = 'deeplink',
  ORIGIN_QR_CODE = 'qr-code',
  ORIGIN_NOTIFICATION = 'notification'
}

export const PROTOCOLS = {
  HTTP: 'http',
  HTTPS: 'https',
  WC: 'wc',
  CORE: 'core'
}

export enum StakeActions {
  StakeComplete = 'stakecomplete'
}

export const ACTIONS = {
  WC: 'wc',
  StakeComplete: StakeActions.StakeComplete
}

export interface NotificationCallbackProps {
  url: string
  accountIndex: number
  origin: DeepLinkOrigin
  isDevMode: boolean
}