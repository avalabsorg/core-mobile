import { NetworkContractToken, NetworkToken } from '@avalabs/chains-sdk'
import { BitcoinInputUTXO } from '@avalabs/wallets-sdk'
import BN from 'bn.js'

export enum TokenType {
  NATIVE = 'NATIVE',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721'
}

type TokenBalanceData = {
  type: TokenType
  balance: BN
  balanceUSD: number
  balanceDisplayValue: string
  balanceUsdDisplayValue: string
  priceUSD: number
  utxos?: BitcoinInputUTXO[]
}

type TokenMarketData = {
  marketCap: number
  change24: number
  vol24: number
}

export type NetworkTokenWithBalance = TokenBalanceData &
  TokenMarketData &
  NetworkToken & {
    id: string // chainId + coingeckoId
    coingeckoId: string
    type: TokenType.NATIVE
  }

export type TokenWithBalanceERC20 = TokenBalanceData &
  TokenMarketData &
  NetworkContractToken & {
    id: string // chainId + token contract address
    type: TokenType.ERC20
  }

export type TokenWithBalanceERC721 = TokenBalanceData &
  TokenMarketData & {
    id: string
    type: TokenType.ERC721
    address: string
    decimals: number
    description: string
    logoUri: string
    name: string
    symbol: string
  }

export type TokenWithBalance =
  | NetworkTokenWithBalance
  | TokenWithBalanceERC20
  | TokenWithBalanceERC721

export type Balance = {
  accountIndex: number
  chainId: number
  tokens: TokenWithBalance[]
}

export type Balances = { [chainId_address: string]: Balance }

export enum QueryStatus {
  /**
   * Indicates no query is in flight
   */
  IDLE = 'idle',

  /**
   * Indicates the query is being run for the first time
   */
  LOADING = 'loading',

  /**
   * Indicates the query is being re-run on demand (user clicks refetch for example)
   */
  REFETCHING = 'refetching',

  /**
   * Indicates that a polling query is currently in flight.
   * For example if the query runs every 10 seconds then
   * the status will switch to `polling` every 10 seconds until
   * the query has resolved.
   */
  POLLING = 'polling'
}

export type BalanceState = {
  status: QueryStatus
  balances: Balances
}