export type DeFiChain = {
  id: string
  communityId: number
  name: string
  nativeTokenId: string
  logoUrl: string
  wrappedTokenId: string
  isSupportPreExec: boolean
}

export type DeFiProtocolBase = {
  id: string
  chain: string
  name: string
  siteUrl: string
  logoUrl: string
  hasSupportedPortfolio: boolean
  tvl: number
}

export type DeFiSimpleProtocol = DeFiProtocolBase & {
  netUsdValue: number
  assetUsdValue: number
  debtUsdValue: number
}

export type DeFiProtocol = DeFiProtocolBase & {
  portfolioItemList: DeFiPortfolioItem[]
}

export type DeFiToken = {
  id: string
  chain: string
  name: string
  symbol: string
  displaySymbol: string | null
  optimizedSymbol: string
  decimals: number
  logoUrl: string
  protocolId: string
  price: number
  isVerified: boolean
  isCore: boolean
  isWallet: boolean
  timeAt: number
  amount: number
  rawAmount?: number
  rawAmountStr?: string
  claimableAmount?: number // for vesting tokens
}

export enum DeFiProtocolDetailTypes {
  COMMON = 'common',
  LOCKED = 'locked',
  LENDING = 'lending',
  LEVERAGED_FARMING = 'leveraged_farming',
  VESTING = 'vesting',
  REWARD = 'reward',
  OPTIONS_SELLER = 'options_seller',
  OPTIONS_BUYER = 'options_buyer',
  PERPETUALS = 'perpetuals',
  INSURANCE_SELLER = 'insurance_seller',
  INSURANCE_BUYER = 'insurance_buyer'
}

export type DeFiPortfolioItem = {
  stats: {
    assetUsdValue: number
    debtUsdValue: number
    netUsdValue: number
  }
  updateAt: number
  name: string
  detailTypes: DeFiProtocolDetailTypes[]
  detail: {
    supplyTokenList?: DeFiToken[]
    rewardTokenList?: DeFiToken[]
    borrowTokenList?: DeFiToken[]
    unlockAt?: number
    healthRate?: number
    debtRatio?: number
    dailyUnlockAmount?: number
    endAt?: number

    // Optional detail properties: https://docs.open.DeFi.com/en/reference/api-models/portfolioitemobject#locked-locked-position

    // For reward items:
    tokenList?: DeFiToken[]

    // For vesting protocols
    token?: DeFiToken

    // For Options Seller / Options Buyer
    strikeToken?: DeFiToken
    underlyingToken?: DeFiToken
    collateralTokenList?: DeFiToken[]

    // For perpetuals:
    pnlUsdValue?: number

    type?: number | string
    style?: 'American' | 'European'
    exerciseStartAt?: number
    exerciseEndAt?: number
    isAutoExercise?: boolean
    exerciseProfit?: number
    usdValue?: number
    description?: string
    expiredAt?: number
    side?: 'Long' | 'Short'
    baseToken?: DeFiToken
    quoteToken?: DeFiToken
    positionToken?: DeFiToken
    marginToken?: DeFiToken
    marginRate?: { amount: number }
    leverage?: DeFiToken
    dailyFundingRate?: DeFiToken
    entryPrice?: DeFiToken
    markPrice?: DeFiToken
    liquidationPrice?: DeFiToken
  }
}