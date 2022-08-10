import { HttpClient } from '@avalabs/utils-sdk'
import { NftProvider } from 'services/nft/types'
import {
  CurrencyCode,
  Erc721TokenBalance,
  GlacierClient
} from '@avalabs/glacier-sdk'
import { NFTItemData, NFTItemExternalData, NftResponse } from 'store/nft'
import Logger from 'utils/Logger'
import DevDebuggingConfig from 'utils/debugging/DevDebuggingConfig'
import { GLACIER_URL } from 'utils/glacierUtils'
import { pipeAsyncFunctions } from 'utils/js/pipeAsyncFunctions'
import {
  addMissingFields,
  applyImageAndAspect,
  convertIPFSResolver
} from './utils'

const demoAddress = '0x188c30e9a6527f5f0c3f7fe59b72ac7253c62f28'

export class GlacierNftProvider implements NftProvider {
  private metadataHttpClient = new HttpClient(``, {})

  private glacierSdk = new GlacierClient(GLACIER_URL)

  async isProviderFor(chainId: number): Promise<boolean> {
    const isHealthy = await this.isHealthy()
    if (!isHealthy) {
      return false
    }
    const supportedChainsResp = await this.glacierSdk.supportedChains()
    const chainInfos = supportedChainsResp.chains
    const chains = chainInfos.map(chain => chain.chainId)
    return chains.some(value => value === chainId.toString())
  }

  async fetchNfts(
    chainId: number,
    address: string,
    selectedCurrency = 'usd',
    pageToken?: string
  ): Promise<NftResponse> {
    Logger.info('fetching nfts using Glacier')

    const nftBalancesResp = await this.glacierSdk.listErc721Balances(
      chainId.toString(),
      DevDebuggingConfig.SHOW_DEMO_NFTS ? demoAddress : address,
      {
        currency: selectedCurrency.toLocaleLowerCase() as CurrencyCode,
        // glacier has a cap on page size of 100
        pageSize: 10,
        pageToken: pageToken
      }
    )
    const nftBalances =
      nftBalancesResp.erc721TokenBalances as Erc721TokenBalance[]
    const nextPageToken = nftBalancesResp.nextPageToken

    const processData = pipeAsyncFunctions(
      this.applyMetadata.bind(this),
      applyImageAndAspect,
      addMissingFields(address)
    )

    const nftBalancesWithMetaData = await Promise.allSettled(
      nftBalances.map(processData)
    )

    const nfts = nftBalancesWithMetaData.reduce<NFTItemData[]>(
      (acc, result) => {
        return result.status === 'fulfilled' ? [...acc, result.value] : acc
      },
      []
    )

    return {
      nfts,
      nextPageToken
    }
  }

  private async applyMetadata(nft: Erc721TokenBalance) {
    const metadata = await this.fetchMetadata(nft.tokenUri)
    return { ...nft, ...metadata } as NFTItemData
  }

  private async fetchMetadata(tokenUri: string) {
    const base64MetaPrefix = 'data:application/json;base64,'
    if (tokenUri.startsWith(base64MetaPrefix)) {
      const base64Metadata = tokenUri.substring(base64MetaPrefix.length)
      const metadata = JSON.parse(
        Buffer.from(base64Metadata, 'base64').toString()
      )
      return metadata as NFTItemExternalData
    } else {
      const metadata: NFTItemExternalData = await this.metadataHttpClient.get(
        convertIPFSResolver(tokenUri)
      )
      return metadata
    }
  }

  private async isHealthy() {
    const healthStatus = await this.glacierSdk.healthCheck()
    const status = healthStatus?.status?.toString()
    return status === 'ok'
  }
}

export default new GlacierNftProvider()
