import { EventEmitter } from 'events'
import WalletConnectClient from '@walletconnect/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { parseWalletConnectUri } from '@walletconnect/utils'
import {
  ISessionStatus,
  IWalletConnectOptions,
  IWalletConnectSession
} from '@walletconnect/types'
import {
  CLIENT_OPTIONS,
  WalletConnectRequest
} from 'services/walletconnect/types'
import { JsonRpcRequest } from '@walletconnect/jsonrpc-types'
import { Network, NetworkVMType } from '@avalabs/chains-sdk'
import { TransactionParams } from 'screens/rpc/util/types'
import Logger from 'utils/Logger'
import { Account } from 'store/account'

let initialized = false
let connectors: WalletConnectService[] = []
const tempCallIds: number[] = []
const emitter = new EventEmitter()

const WALLETCONNECT_SESSIONS = `walletconnectSessions`

const persistSessions = async () => {
  const sessions = connectors
    .filter(
      connector =>
        connector &&
        connector.walletConnectClient &&
        connector.walletConnectClient.connected
    )
    .map(connector => ({
      ...connector.walletConnectClient?.session,
      uri: connector.url,
      autoSign: connector?.autoSign,
      requestOriginatedFrom: connector?.requestOriginatedFrom
    }))

  await AsyncStorage.setItem(WALLETCONNECT_SESSIONS, JSON.stringify(sessions))
}

const waitForInitialization = async () => {
  let i = 0
  while (!initialized) {
    await new Promise<void>(res => setTimeout(() => res(), 1000))
    if (i++ > 5) initialized = true
  }
}

class WalletConnectService {
  autoSign = false
  url?: string
  title = null
  icon = null
  hostname = null
  requestOriginatedFrom?: string
  walletConnectClient: WalletConnectClient | null
  activeAccount: Account | undefined
  activeNetwork: Network | undefined

  constructor(
    options: IWalletConnectOptions,
    existing = false,
    account?: Account,
    network?: Network
  ) {
    this.activeAccount = account
    this.activeNetwork = network
    this.url = options?.uri

    Logger.info('creating new walletconnect service instance')

    /******************************************************************************
     * === Listeners ===
     * 1. Open request for app trying to connect
     *****************************************************************************/

    const onSessionRequest = async (
      error: Error | null,
      payload: JsonRpcRequest,
      existing: boolean
    ) => {
      // do not respond to session request if on BTC
      if (this.activeNetwork?.vmName === NetworkVMType.BITCOIN) return

      Logger.info('received dapp session request', error ?? payload)
      if (error) {
        console.error(error)
      }

      try {
        const sessionData = {
          ...payload.params[0],
          autoSign: this.autoSign,
          requestOriginatedFrom: this.requestOriginatedFrom
        }

        await waitForInitialization()
        if (!existing) {
          await this.sessionRequest(sessionData)
        }
        this.startSession(sessionData, existing)
      } catch (e) {
        Logger.error('dapp session session error or user canceled', e)
        this.walletConnectClient?.rejectSession()
      }
    }
    /******************************************************************************
     * 2. Receives update. Currently, not acting on it, just logging
     *****************************************************************************/
    const onSessionUpdate = (error: Error | null, payload: JsonRpcRequest) => {
      // do not update session if on BTC
      if (this.activeNetwork?.vmName === NetworkVMType.BITCOIN) return
      Logger.info('dapp session updated', payload)
      if (error) {
        throw error
      }
    }

    /******************************************************************************
     * 3. Receives call request and dispatches it so RpcMethodsUI
     *****************************************************************************/
    const onCallRequest = async (
      error: Error | null,
      payload: JsonRpcRequest<TransactionParams[]>
    ) => {
      // do not respond to call request if on BTC
      if (this.activeNetwork?.vmName === NetworkVMType.BITCOIN) return

      if (tempCallIds.includes(payload.id)) return
      tempCallIds.push(payload.id)

      Logger.info('received dapp call request', error ?? payload)
      if (error) {
        throw error
      }

      try {
        const signedResult = await this.callRequests({
          payload,
          peerMeta: this.walletConnectClient?.session?.peerMeta
        })
        this.walletConnectClient?.approveRequest({
          id: payload.id,
          result: signedResult,
          jsonrpc: '2.0'
        })
        Logger.info(
          'sending call approval to dapp via walletconnect',
          signedResult
        )
      } catch (e) {
        Logger.error('dapp call error or user canceled', e)
        this.walletConnectClient?.rejectRequest({
          id: payload.id,
          error: {
            message: 'USER HAS REJECTED'
          }
        })
      }
    }

    /******************************************************************************
     * 4. Disconnected remotely. We kill our session and remove it from storage
     *****************************************************************************/
    const onDisconnect = (error: Error | null) => {
      if (error) {
        throw error
      }
      Logger.warn('dapp disconnected remotely')
      const peerMeta = this.walletConnectClient?.session?.peerMeta
      this.killSession()
      persistSessions()
      emitter.emit(WalletConnectRequest.SESSION_DISCONNECTED, peerMeta)
    }

    /******************************************************************************
     * create walletconnect instance, set listeners
     *****************************************************************************/
    const connOptions = {
      ...options,
      ...CLIENT_OPTIONS
    } as IWalletConnectOptions

    this.walletConnectClient = new WalletConnectClient({ ...connOptions })
    this.walletConnectClient.on('session_update', onSessionUpdate)
    this.walletConnectClient.on('call_request', onCallRequest)
    this.walletConnectClient.on('disconnect', onDisconnect)
    this.walletConnectClient.on('session_request', (error, payload) =>
      onSessionRequest(error, payload, existing)
    )
    this.walletConnectClient.on('connect', () => {
      if (network) {
        Logger.warn('dapp connected, updating chain')
        this.walletConnectClient?.updateChain({
          chainId: network.chainId,
          rpcUrl: network.rpcUrl,
          networkId: network.chainId,
          nativeCurrency: { name: 'US Dollar', symbol: 'USD' }
        })
      }
    })

    // If the connection has been previously approved,
    // don't prompt the user to approve, simply start the session
    Logger.info('done creating wallet connect instance - waiting for trigger')
    if (existing) {
      Logger.info('existing dapp session, starting...')
      this.startSession(options.session, existing)
    }
  }

  /******************************************************************************
   * Supporting methods
   *****************************************************************************/
  killSession = () => {
    this.walletConnectClient && this.walletConnectClient.killSession()
    this.walletConnectClient = null
  }

  // Session request emitters
  sessionRequest = (peerInfo: any) =>
    new Promise((resolve, reject) => {
      Logger.info('dapp emitting session request')
      emitter.emit(WalletConnectRequest.SESSION, peerInfo)

      emitter.on(WalletConnectRequest.SESSION_APPROVED, peerId => {
        if (peerInfo.peerId === peerId) {
          Logger.info('dapp received emission approval for session')
          resolve(true)
        }
      })
      emitter.on(WalletConnectRequest.SESSION_REJECTED, peerId => {
        if (peerInfo.peerId === peerId) {
          Logger.info('dapp received emission rejection for session')
          reject(new Error(WalletConnectRequest.SESSION_REJECTED))
        }
      })
    })

  // Call request emitters
  callRequests = (data: any) =>
    new Promise((resolve, reject) => {
      Logger.info('dapp emitting CALL request')
      emitter.emit(WalletConnectRequest.CALL, data)

      emitter.on(WalletConnectRequest.CALL_APPROVED, args => {
        const { id, hash } = args
        if (data.payload.id === id) {
          Logger.info('dapp received emission approval for CALL')
          resolve(hash)
        }
      })
      emitter.on(WalletConnectRequest.CALL_REJECTED, id => {
        if (data.payload.id === id) {
          Logger.info('dapp received emission rejection for CALL')
          reject(new Error(WalletConnectRequest.CALL_REJECTED))
        }
      })
    })

  startSession = async (sessionData: any, existing: boolean) => {
    // do not start session if on BTC
    if (this.activeNetwork?.vmName === NetworkVMType.BITCOIN) return
    const chainId = this.activeNetwork?.chainId ?? 1
    const selectedAddress = this.activeAccount?.address ?? ''
    const approveData: ISessionStatus = {
      chainId: chainId,
      accounts: [selectedAddress]
    }
    if (existing) {
      this.walletConnectClient?.updateSession(approveData)
    } else {
      await this.walletConnectClient?.approveSession(approveData)
      persistSessions()
    }
  }
}

const instance = {
  // restores approved connections
  async init(activeAccount: Account, activeNetwork: Network) {
    // do not init if on BTC
    if (activeNetwork.vmName === NetworkVMType.BITCOIN) return

    Logger.info('loading persisted dapps')
    const sessionData = await AsyncStorage.getItem(WALLETCONNECT_SESSIONS)
    if (sessionData) {
      const sessions = JSON.parse(sessionData)
      sessions.forEach((session: IWalletConnectSession & { uri: string }) => {
        const data = {
          bridge: session.bridge,
          uri: session.uri,
          session
        } as IWalletConnectOptions

        const existingConnector = this.isSessionConnected(session.uri)
        if (!existingConnector) {
          Logger.info('dapp connection from storage does not exist, creating')
          connectors.push(
            new WalletConnectService(data, true, activeAccount, activeNetwork)
          )
        } else if (!existingConnector.walletConnectClient?.connected) {
          Logger.info('dapp connection from storage exists, connecting')
          existingConnector.walletConnectClient?.connect()
        }
      })
    }
    initialized = true
  },
  // creates new session. Checks to see if there's already a session created for that app
  newSession(
    uri: string,
    autoSign?: boolean,
    requestOriginatedFrom?: string,
    activeAccount?: Account,
    activeNetwork?: Network
  ) {
    // do not start new session if on BTC
    if (activeNetwork?.vmName === NetworkVMType.BITCOIN) return

    Logger.info('received link to start dapp session')
    const existingConnector = this.isSessionConnected(uri)
    if (existingConnector) {
      Logger.info('session already exists, replace')
      // existingConnector.killSession()
      return
      // const errorMsg =
      //   'This session is already connected. Close the current session before starting a new one.'
      // throw new Error(errorMsg)
      // return
    }

    connectors.push(
      new WalletConnectService({ uri }, false, activeAccount, activeNetwork)
    )
  },
  // kills session given a peerId
  killSession: async (id: string) => {
    // 1) First kill the session
    const connectorToKill = connectors.find(
      connector =>
        connector &&
        connector.walletConnectClient &&
        connector.walletConnectClient.session.peerId === id
    )
    if (connectorToKill) {
      await connectorToKill.walletConnectClient?.killSession()
    }
    // 2) Remove from the list of connectors
    connectors = connectors.filter(
      connector =>
        connector &&
        connector.walletConnectClient &&
        connector.walletConnectClient.connected &&
        connector.walletConnectClient.session.peerId !== id
    )
    // 3) Persist the list
    await persistSessions()
  },
  // bus
  emitter: emitter,
  // checks if session is connected given an uri
  isSessionConnected(uri: string) {
    const wcUri = parseWalletConnectUri(uri)
    return connectors.find(({ walletConnectClient }) => {
      if (!walletConnectClient) {
        return false
      }
      const { handshakeTopic, key } = walletConnectClient.session
      return handshakeTopic === wcUri.handshakeTopic && key === wcUri.key
    })
  },
  // checks is WC url is valid
  isValidUri(uri: string) {
    const result = parseWalletConnectUri(uri)
    if (!result.handshakeTopic || !result.bridge || !result.key) {
      return false
    }
    return true
  },
  // updates session if network or account changes
  updateSessions(addressC: string, chainId: string) {
    connectors.forEach(connector => {
      if (connector.walletConnectClient?.connected) {
        connector.walletConnectClient?.updateSession({
          chainId: parseInt(chainId),
          accounts: [addressC]
        })
      }
    })
  },
  // returns session info list for 'Connected Sites' view
  getConnections(): {
    session: IWalletConnectSession
    killSession: () => Promise<void>
  }[] {
    try {
      return (
        connectors?.map(conn => {
          return {
            session: conn.walletConnectClient?.session as IWalletConnectSession,
            killSession: () =>
              this.killSession(conn.walletConnectClient?.peerId ?? '')
          }
        }) ?? []
      )
    } catch (e) {
      throw Error('error loading sessions')
    }
  },
  // Kills all sessions
  async killAllSessions() {
    return connectors?.map(conn => {
      if (conn.walletConnectClient?.session?.peerId)
        return this.killSession(conn.walletConnectClient?.session?.peerId)
    })
  }
}

export default instance