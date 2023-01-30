import { PeerMeta } from 'services/walletconnect/types'
import { AppListenerEffectAPI } from 'store'
import { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import { RpcMethod, RpcError } from '../types'

export interface TypedJsonRpcRequest<Method extends string, Params = unknown>
  extends JsonRpcRequest<Params> {
  method: Method
  peerMeta: PeerMeta
  peerId: string
}

export interface DappRpcRequest<Method extends string, Params = unknown> {
  payload: TypedJsonRpcRequest<Method, Params>
}

export type HandleResponse = Promise<Result<symbol | unknown, RpcError>>

export type ApproveResponse = Promise<Result<unknown, RpcError>>

export interface RpcRequestHandler<
  Request extends DappRpcRequest<string, unknown>,
  ApproveData
> {
  methods: RpcMethod[]
  handle: (
    request: Request,
    listenerApi: AppListenerEffectAPI
  ) => HandleResponse
  approve?: (
    payload: { request: Request; data: ApproveData },
    listenerApi: AppListenerEffectAPI
  ) => ApproveResponse
  hasPostApprove?: boolean
}

export type Result<Value, Error> =
  | {
      success: true
      value?: Value
    }
  | {
      success: false
      error: Error
    }

export const DEFERRED_RESULT = Symbol()
