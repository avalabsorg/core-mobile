import { getPvmApi } from 'utils/network/pvm'
import BN from 'bn.js'
import { Account } from 'store/account'
import { exportC } from 'services/earn/exportC'
import { importP } from 'services/earn/importP'
import Big from 'big.js'
import { FujiParams, MainnetParams } from 'utils/NetworkParams'
import { bnToBig } from '@avalabs/utils-sdk'
import { importC } from 'services/earn/importC'
import { exportP } from 'services/earn/exportP'
import WalletService from 'services/wallet/WalletService'
import {
  AddDelegatorProps,
  AvalancheTransactionRequest
} from 'services/wallet/types'
import NetworkService from 'services/network/NetworkService'
import { UnsignedTx } from '@avalabs/avalanchejs-v2'
import Logger from 'utils/Logger'
import { Avalanche } from '@avalabs/wallets-sdk'
import { exponentialBackoff } from 'utils/js/exponentialBackoff'
import {
  AddDelegatorTransactionProps,
  GetAllStakesParams
} from 'services/earn/types'
import { getUnixTime } from 'date-fns'
import { GetCurrentSupplyResponse } from '@avalabs/avalanchejs-v2/dist/src/vms/pvm'
import {
  BlockchainId,
  Network,
  PChainTransaction,
  PChainTransactionType,
  SortOrder
} from '@avalabs/glacier-sdk'
import { glacierSdk } from 'utils/network/glacier'

class EarnService {
  /**
   * Get all available nodes
   * @param isTestnet is testnet mode enabled
   */
  getCurrentValidators = (isTestnet: boolean) => {
    return getPvmApi(isTestnet).getCurrentValidators()
  }

  /**
   * Collect tokens for staking by moving Avax from C to P-chain
   *
   * @param cChainBalance in nAvax
   * @param requiredAmount in nAvax
   * @param activeAccount
   * @param isDevMode
   */
  async collectTokensForStaking(
    cChainBalance: BN,
    requiredAmount: BN,
    activeAccount: Account,
    isDevMode: boolean
  ): Promise<boolean> {
    return (
      (await exportC({
        cChainBalance,
        requiredAmount,
        activeAccount,
        isDevMode
      })) &&
      (await importP({
        activeAccount,
        isDevMode
      }))
    )
  }

  /**
   * Collect staking rewards by moving Avax from P to C-chain
   *
   * @param pChainBalance in nAvax
   * @param requiredAmount in nAvax
   * @param activeAccount
   * @param isDevMode
   */
  async claimRewards(
    pChainBalance: BN,
    requiredAmount: BN,
    activeAccount: Account,
    isDevMode: boolean
  ): Promise<boolean> {
    return (
      (await exportP({
        pChainBalance,
        requiredAmount,
        activeAccount,
        isDevMode
      })) &&
      (await importC({
        activeAccount,
        isDevMode
      }))
    )
  }

  /**
   *
   * @param amount
   * @param duration in s
   * @param currentSupply
   * @param delegationFee in percent
   * @param isDeveloperMode
   */
  calcReward(
    amount: Big,
    duration: number,
    currentSupply: Big,
    delegationFee: number,
    isDeveloperMode: boolean
  ): string {
    const defPlatformVals = isDeveloperMode ? FujiParams : MainnetParams
    const minConsumptionRateRatio = new Big(
      defPlatformVals.stakingConfig.RewardConfig.MinConsumptionRate
    )
    const maxConsumptionRateRatio = new Big(
      defPlatformVals.stakingConfig.RewardConfig.MaxConsumptionRate
    )
    const stakingPeriodOverMintingPeriod = new Big(duration).div(
      new Big(defPlatformVals.stakingConfig.RewardConfig.MintingPeriod)
    )
    const effectiveConsumptionRate = minConsumptionRateRatio
      .mul(new Big(1).minus(stakingPeriodOverMintingPeriod))
      .add(maxConsumptionRateRatio.mul(stakingPeriodOverMintingPeriod))

    const stakeOverSupply = amount.div(currentSupply)
    const supplyCap = bnToBig(
      defPlatformVals.stakingConfig.RewardConfig.SupplyCap
    )
    const unmintedSupply = supplyCap.sub(currentSupply)
    const fullReward = unmintedSupply
      .mul(stakeOverSupply)
      .mul(stakingPeriodOverMintingPeriod)
      .mul(effectiveConsumptionRate)

    const delegationFeeRatio = new Big(delegationFee).div(100)
    const rewardsMinusDelegationFee = fullReward.mul(
      new Big(1).minus(delegationFeeRatio)
    )

    return rewardsMinusDelegationFee.toFixed(0)
  }

  async issueAddDelegatorTransaction({
    activeAccount,
    nodeId,
    stakeAmount,
    startDate,
    endDate,
    isDevMode
  }: AddDelegatorTransactionProps): Promise<void> {
    const startDateUnix = getUnixTime(startDate)
    const endDateUnix = getUnixTime(endDate)
    const avaxXPNetwork = NetworkService.getAvalancheNetworkXP(isDevMode)
    const rewardAddress = activeAccount.addressPVM
    const unsignedTx = await WalletService.createAddDelegatorTx({
      accountIndex: activeAccount.index,
      avaxXPNetwork,
      rewardAddress,
      nodeId,
      startDate: startDateUnix,
      endDate: endDateUnix,
      stakeAmount,
      isDevMode
    } as AddDelegatorProps)

    const signedTxJson = await WalletService.sign(
      { tx: unsignedTx } as AvalancheTransactionRequest,
      activeAccount.index,
      avaxXPNetwork
    )
    const signedTx = UnsignedTx.fromJSON(signedTxJson).getSignedTx()

    const txID = await NetworkService.sendTransaction(signedTx, avaxXPNetwork)
    Logger.trace('txID', txID)

    const avaxProvider = NetworkService.getProviderForNetwork(
      avaxXPNetwork
    ) as Avalanche.JsonRpcProvider

    try {
      await exponentialBackoff(
        () => avaxProvider.getApiP().getTxStatus({ txID }),
        result => result.status === 'Committed',
        6
      )
    } catch (e) {
      Logger.error('exponentialBackoff failed', e)
      throw Error(
        `Transfer is taking unusually long (add Delegator). txId = ${txID}`
      )
    }
  }

  /**
   * Retrieve the upper bound on the number of tokens that exist in P-chain
   * This is an upper bound because it does not account for burnt tokens, including transaction fees.
   *
   * @param isDeveloperMode
   */
  getCurrentSupply(isTestnet: boolean): Promise<GetCurrentSupplyResponse> {
    return getPvmApi(isTestnet).getCurrentSupply()
  }

  /**
   * Retrieve all stakes for given addresses on P chain
   *
   * @param isTestnet
   * @param addresses
   */
  getAllStakes = async ({ isTestnet, addresses }: GetAllStakesParams) => {
    const addressesStr = addresses.join(',')
    let pageToken: string | undefined
    const transactions: PChainTransaction[] = []

    do {
      const response =
        await glacierSdk.primaryNetwork.listLatestPrimaryNetworkTransactions({
          network: isTestnet ? Network.FUJI : Network.MAINNET,
          blockchainId: BlockchainId.P_CHAIN,
          addresses: addressesStr,
          pageSize: 100,
          sortOrder: SortOrder.DESC,
          pageToken
        })

      pageToken = response.nextPageToken
      transactions.push(...(response.transactions as PChainTransaction[]))
    } while (pageToken)
    const stakes = transactions.filter(
      transaction =>
        transaction.txType === PChainTransactionType.ADD_DELEGATOR_TX
    )

    return stakes
  }
}

export default new EarnService()
