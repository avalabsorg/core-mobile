import { Dispatch } from 'react'

export interface DeeplinkContextType {
  pendingDeepLink: DeepLink | undefined
  setPendingDeepLink: Dispatch<DeepLink>
}

export interface DeepLink {
  url: string
  origin: DeepLinkOrigin
}

export enum DeepLinkOrigin {
  ORIGIN_DEEPLINK = 'deeplink',
  ORIGIN_QR_CODE = 'qr-code'
}

export const PROTOCOLS = {
  HTTP: 'http',
  HTTPS: 'https',
  WC: 'wc'
}

export const ACTIONS = {
  WC: 'wc'
}
