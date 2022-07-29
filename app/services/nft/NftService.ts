import glacierNftProvider from 'services/nft/GlacierNftProvider'
import covalentNftProvider from 'services/nft/CovalentNftProvider'
import { NftProvider } from 'services/nft/types'
import { Erc721TokenBalance } from '@avalabs/glacier-sdk'

export type NftUID = string

export function getNftUID(nft: Erc721TokenBalance): NftUID {
  return nft.contractAddress + nft.tokenId
}

export class NftService {
  providers: NftProvider[] = [glacierNftProvider, covalentNftProvider]

  private getProvider(chainId: number): NftProvider | undefined {
    return this.providers.find(value => value.isProviderFor(chainId))
  }

  /**
   * @throws {@link Error}
   */
  fetchNft(
    chainId: number,
    address: string,
    selectedCurrency: string,
    pageToken?: string
  ) {
    //TODO: providers cant mix, so if suddenly one becames unavailable we need to reset pageToken to undefined
    const provider = this.getProvider(chainId)
    if (!provider) throw Error('no available providers')
    return provider.fetchNfts(chainId, address, pageToken, selectedCurrency)
  }
}

export default new NftService()