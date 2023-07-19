import { ChainId } from '@avalabs/chains-sdk'
import { assertNotUndefined } from 'utils/assertions'
import { Avalanche } from '@avalabs/wallets-sdk'
import { exponentialBackoff } from 'utils/js/exponentialBackoff'
import Logger from 'utils/Logger'
import { calculatePChainFee } from 'services/earn/calculateCrossChainFees'
import WalletService from 'services/wallet/WalletService'
import { Account } from 'store/account'
import { AvalancheTransactionRequest } from 'services/wallet/types'
import { UnsignedTx } from '@avalabs/avalanchejs-v2'
import NetworkService from 'services/network/NetworkService'
import { BigIntNAvax, BigIntWeiAvax } from 'types/denominations'

export type ExportCParams = {
  cChainBalance: BigIntNAvax
  requiredAmount: BigIntNAvax
  activeAccount: Account
  isDevMode: boolean
}

export async function exportC({
  cChainBalance,
  requiredAmount,
  activeAccount,
  isDevMode
}: ExportCParams): Promise<boolean> {
  const avaxXPNetwork = NetworkService.getAvalancheNetworkXP(isDevMode)
  const chains = await NetworkService.getNetworks()
  const cChainNetwork =
    chains[
      isDevMode ? ChainId.AVALANCHE_TESTNET_ID : ChainId.AVALANCHE_MAINNET_ID
    ]
  assertNotUndefined(cChainNetwork)

  const avaxProvider = NetworkService.getProviderForNetwork(
    avaxXPNetwork
  ) as Avalanche.JsonRpcProvider

  const baseFee: BigIntWeiAvax = await avaxProvider.getApiC().getBaseFee()
  const instantFee = baseFee + (baseFee * BigInt(20)) / BigInt(100) // Increase by 20% for instant speed

  const pChainFee = calculatePChainFee()
  const amount: BigIntNAvax = requiredAmount + pChainFee

  if (cChainBalance < amount) {
    throw Error('Not enough balance on C chain')
  }

  const unsignedTxWithFee = await WalletService.createExportCTx(
    amount,
    instantFee,
    activeAccount.index,
    avaxXPNetwork,
    'P',
    activeAccount.addressPVM
  )

  const signedTxWithFeeJson = await WalletService.sign(
    { tx: unsignedTxWithFee } as AvalancheTransactionRequest,
    activeAccount.index,
    avaxXPNetwork
  )
  const signedTxWithFee = UnsignedTx.fromJSON(signedTxWithFeeJson).getSignedTx()

  const txID = await NetworkService.sendTransaction(
    signedTxWithFee,
    avaxXPNetwork
  )
  Logger.trace('txID', txID)

  try {
    await exponentialBackoff(
      () => avaxProvider.getApiC().getAtomicTxStatus(txID),
      result => result.status === 'Accepted',
      6
    )
  } catch (e) {
    Logger.error('exponentialBackoff failed', e)
    throw Error(`Transfer is taking unusually long (export C). txId = ${txID}`)
  }

  return true
}
