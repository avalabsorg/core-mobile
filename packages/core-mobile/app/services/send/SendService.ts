import { Network, NetworkVMType } from '@avalabs/chains-sdk'
import { resolve } from '@avalabs/utils-sdk'
import { Account } from 'store/account'
import { SendServiceEVM } from 'services/send/SendServiceEVM'
import { NFTItemData } from 'store/nft'
import { NftTokenWithBalance, TokenType } from 'store/balance'
import BN from 'bn.js'
import SentryWrapper from 'services/sentry/SentryWrapper'
import { isErc721 } from 'services/nft/utils'
import { SendServicePVM } from 'services/send/SendServicePVM'
import { RpcMethod } from 'store/rpc'
import { getAddressByNetwork } from 'store/account/utils'
import { InAppTransactionParams as BtcTransactionParams } from 'store/rpc/handlers/bitcoin_sendTransaction/utils'
import { TransactionParams as EvmTransactionParams } from 'store/rpc/handlers/eth_sendTransaction/utils'
import { TransactionParams as AvalancheTransactionParams } from 'store/rpc/handlers/avalanche_sendTransaction/utils'
import { SendServiceAVM } from 'services/send/SendServiceAVM'
import sendServiceBTC from './SendServiceBTC'
import {
  isValidSendState,
  SendParams,
  SendServiceHelper,
  SendState
} from './types'

class SendService {
  async send({
    sendState,
    network,
    account,
    currency,
    sentryTrx,
    request
  }: SendParams): Promise<string> {
    return SentryWrapper.createSpanFor(sentryTrx)
      .setContext('svc.send.send')
      .executeAsync(async () => {
        const fromAddress = getAddressByNetwork(account, network)
        if (!fromAddress) {
          throw new Error('Source address not set')
        }
        const service = this.getService(network, fromAddress)
        const params = {
          sendState,
          isMainnet: !network.isTestnet,
          fromAddress,
          currency,
          sentryTrx
        }
        sendState = await service.validateStateAndCalculateFees(params)

        if (sendState.error?.error) {
          throw new Error(sendState.error.message)
        }

        if (!isValidSendState(sendState)) {
          throw new Error('Unknown error, unable to submit')
        }

        let txHash, txError

        if (network.vmName === NetworkVMType.BITCOIN) {
          ;[txHash, txError] = await resolve(
            request({
              method: RpcMethod.BITCOIN_SEND_TRANSACTION,
              params: sendState as BtcTransactionParams
            })
          )
        }

        if (network.vmName === NetworkVMType.PVM) {
          const txRequest = await (
            service as SendServicePVM
          ).getTransactionRequest({
            sendState,
            isMainnet: !network.isTestnet,
            fromAddress,
            currency,
            sentryTrx,
            accountIndex: account.index
          })

          ;[txHash, txError] = await resolve(
            request({
              method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
              params: txRequest as AvalancheTransactionParams
            })
          )
        }

        if (network.vmName === NetworkVMType.AVM) {
          const txRequest = await (
            service as SendServiceAVM
          ).getTransactionRequest({
            sendState,
            isMainnet: !network.isTestnet,
            fromAddress,
            currency,
            sentryTrx,
            accountIndex: account.index
          })

          ;[txHash, txError] = await resolve(
            request({
              method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
              params: txRequest as AvalancheTransactionParams
            })
          )
        }

        if (network.vmName === NetworkVMType.EVM) {
          const txRequest = await (
            service as SendServiceEVM
          ).getTransactionRequest({
            sendState,
            isMainnet: !network.isTestnet,
            fromAddress,
            currency,
            sentryTrx
          })

          ;[txHash, txError] = await resolve(
            request({
              method: RpcMethod.ETH_SEND_TRANSACTION,
              params: [txRequest] as [EvmTransactionParams],
              chainId: network.chainId.toString()
            })
          )
        }

        if (txError) {
          throw txError
        }

        if (!txHash) {
          throw new Error('Tx hash empty')
        }

        return txHash
      })
  }

  // eslint-disable-next-line max-params
  async validateStateAndCalculateFees(
    sendState: SendState,
    activeNetwork: Network,
    account: Account,
    currency: string,
    nativeTokenBalance?: BN
  ): Promise<SendState> {
    const fromAddress = getAddressByNetwork(account, activeNetwork)

    if (!fromAddress) {
      throw new Error('Source address not set')
    }
    const service = this.getService(activeNetwork, fromAddress)
    const params = {
      sendState,
      isMainnet: !activeNetwork.isTestnet,
      fromAddress,
      currency,
      accountIndex: account.index,
      nativeTokenBalance
    }
    return service.validateStateAndCalculateFees(params)
  }

  mapTokenFromNFT(nft: NFTItemData): NftTokenWithBalance {
    return {
      tokenId: nft.tokenId,
      type: isErc721(nft) ? TokenType.ERC721 : TokenType.ERC1155,
      address: nft.address,
      logoUri: nft.metadata.imageUri ?? '',
      name: nft.metadata.name ?? '',
      symbol: isErc721(nft) ? nft.symbol : '',
      //unused but included to conform to NftTokenWithBalance
      balanceInCurrency: 0,
      balanceDisplayValue: '',
      balanceCurrencyDisplayValue: '',
      priceInCurrency: 0,
      decimals: 0,
      description: '',
      marketCap: 0,
      change24: 0,
      vol24: 0,
      balance: new BN(0)
    }
  }

  private getService(
    activeNetwork: Network,
    fromAddress: string
  ): SendServiceHelper {
    switch (activeNetwork?.vmName) {
      case NetworkVMType.BITCOIN:
        return sendServiceBTC
      case NetworkVMType.EVM: // we might be able to change this to be a singleton too
        return new SendServiceEVM(activeNetwork, fromAddress)
      case NetworkVMType.PVM:
        return new SendServicePVM(activeNetwork)
      case NetworkVMType.AVM:
        return new SendServiceAVM(activeNetwork)
      default:
        throw new Error('unhandled send helper')
    }
  }
}

export default new SendService()
