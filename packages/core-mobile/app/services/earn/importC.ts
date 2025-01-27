import { Avalanche } from '@avalabs/core-wallets-sdk'
import { retry } from 'utils/js/retry'
import Logger from 'utils/Logger'
import WalletService from 'services/wallet/WalletService'
import NetworkService from 'services/network/NetworkService'
import { Account } from 'store/account'
import { AvalancheTransactionRequest } from 'services/wallet/types'
import { UnsignedTx } from '@avalabs/avalanchejs'
import { Avax } from 'types/Avax'
import { FundsStuckError } from 'hooks/earn/errors'
import {
  maxTransactionCreationRetries,
  maxTransactionStatusCheckRetries
} from './utils'

export type ImportCParams = {
  activeAccount: Account
  isDevMode: boolean
}

export async function importC({
  activeAccount,
  isDevMode
}: ImportCParams): Promise<void> {
  Logger.info('importing C started')

  const avaxXPNetwork = NetworkService.getAvalancheNetworkXP(isDevMode)

  const avaxProvider = NetworkService.getProviderForNetwork(
    avaxXPNetwork
  ) as Avalanche.JsonRpcProvider

  const baseFee = await avaxProvider.getApiC().getBaseFee() //in WEI
  const baseFeeAvax = Avax.fromWei(baseFee)
  const instantBaseFee = WalletService.getInstantBaseFee(baseFeeAvax)

  const unsignedTx = await WalletService.createImportCTx({
    accountIndex: activeAccount.index,
    baseFee: instantBaseFee,
    avaxXPNetwork,
    sourceChain: 'P',
    destinationAddress: activeAccount.addressC
  })

  const signedTxJson = await WalletService.sign({
    transaction: {
      tx: unsignedTx,
      externalIndices: [],
      internalIndices: []
    } as AvalancheTransactionRequest,
    accountIndex: activeAccount.index,
    network: avaxXPNetwork
  })
  const signedTx = UnsignedTx.fromJSON(signedTxJson).getSignedTx()

  let txID: string
  try {
    txID = await retry({
      operation: () =>
        NetworkService.sendTransaction({ signedTx, network: avaxXPNetwork }),
      isSuccess: result => result !== '',
      maxRetries: maxTransactionCreationRetries
    })
  } catch (e) {
    Logger.error('ISSUE_IMPORT_FAIL', e)
    throw new FundsStuckError({
      name: 'ISSUE_IMPORT_FAIL',
      message: 'Sending import transaction failed ',
      cause: e
    })
  }

  Logger.trace('txID', txID)

  try {
    await retry({
      operation: () => avaxProvider.getApiC().getAtomicTxStatus(txID),
      isSuccess: result => result.status === 'Accepted',
      maxRetries: maxTransactionStatusCheckRetries
    })
  } catch (e) {
    Logger.error('importC failed', e)
    throw new FundsStuckError({
      name: 'CONFIRM_IMPORT_FAIL',
      message: 'Import did not finish',
      cause: e
    })
  }

  Logger.info('importing C finished')
}
