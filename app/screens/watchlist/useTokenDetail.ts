import { useEffect, useMemo, useState } from 'react'
import {
  TokenWithBalance,
  useWalletStateContext
} from '@avalabs/wallet-react-components'
import useInAppBrowser from 'hooks/useInAppBrowser'
import { useApplicationContext } from 'contexts/ApplicationContext'
import { CoinsContractInfoResponse } from '@avalabs/coingecko-sdk'
import { CG_AVAX_TOKEN_ID } from 'screens/watchlist/WatchlistView'

export function useTokenDetail(tokenAddress: string) {
  const { repo } = useApplicationContext()
  const [isFavorite, setIsFavorite] = useState(true)
  const [token, setToken] = useState<TokenWithBalance>()
  const { openMoonPay, openUrl } = useInAppBrowser()
  const { selectedCurrency, currencyFormatter } =
    useApplicationContext().appHook
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>()
  const [chartDays, setChartDays] = useState(1)
  const [ranges, setRanges] = useState<{
    minDate: number
    maxDate: number
    minPrice: number
    maxPrice: number
    diffValue: number
    percentChange: number
  }>({
    minDate: 0,
    maxDate: 0,
    minPrice: 0,
    maxPrice: 0,
    diffValue: 0,
    percentChange: 0
  })
  const [contractInfo, setContractInfo] = useState<CoinsContractInfoResponse>()
  const [urlHostname, setUrlHostname] = useState<string>('')
  const { watchlistFavorites, saveWatchlistFavorites } =
    repo.watchlistFavoritesRepo
  // @ts-ignore avaxToken, erc20Tokens exist in walletContext
  const { erc20Tokens, avaxToken } = useWalletStateContext()

  const allTokens = useMemo(
    () => [{ ...avaxToken, address: CG_AVAX_TOKEN_ID }, ...erc20Tokens],
    [erc20Tokens, avaxToken]
  )

  // find token
  useEffect(() => {
    if (allTokens) {
      const tk = allTokens.find(tk => tk.address === tokenAddress, false)
      if (tk) {
        setToken(tk)
      }
    }
  }, [allTokens, tokenAddress])

  // checks if contract can be found in favorites list
  useEffect(() => {
    setIsFavorite(!!watchlistFavorites.find(value => value === tokenAddress))
  }, [watchlistFavorites])

  // get coingecko chart data.
  useEffect(() => {
    ;(async () => {
      const data = await repo.coingeckoRepo.getCharData(tokenAddress, chartDays)
      if (data) {
        setChartData(data.dataPoints)
        setRanges(data.ranges)
      } else {
        // Coingecko does not support all tokens chart data. So here we'll
        // simply set to empty to hide the loading state.
        setChartData([])
      }
    })()
  }, [tokenAddress, chartDays])

  // get market cap, volume, etc
  useEffect(() => {
    ;(async () => {
      const data = await repo.coingeckoRepo.getContractInfo(tokenAddress)
      setContractInfo(data)
      if (data?.links?.homepage?.[0]) {
        const url = data?.links?.homepage?.[0]
          ?.replace(/^https?:\/\//, '')
          ?.replace('www.', '')
        setUrlHostname(url)
      }
    })()
  }, [tokenAddress])

  function handleFavorite() {
    if (isFavorite) {
      const index = watchlistFavorites.indexOf(tokenAddress)
      if (index > -1) {
        watchlistFavorites.splice(index, 1)
        saveWatchlistFavorites(watchlistFavorites)
      }
    } else {
      watchlistFavorites.push(tokenAddress)
      saveWatchlistFavorites(watchlistFavorites)
    }
    setIsFavorite(!isFavorite)
  }

  async function changeChartDays(days: number) {
    setChartData(undefined)
    setChartDays(days)
  }

  return {
    isFavorite,
    openMoonPay,
    openUrl,
    selectedCurrency,
    currencyFormatter,
    contractInfo,
    urlHostname,
    handleFavorite,
    // @ts-ignore market_data exists in CoinsContractInfoResponse
    marketTotalSupply: contractInfo?.market_data.total_supply ?? 0,
    twitterHandle: contractInfo?.links?.twitter_screen_name,
    // @ts-ignore market_data exists in CoinsContractInfoResponse
    marketCirculatingSupply: contractInfo?.market_data?.circulating_supply ?? 0,
    // @ts-ignore market_data exists in CoinsContractInfoResponse
    marketVolume: contractInfo?.market_data?.total_volume.usd ?? 0,
    // @ts-ignore market_data exists in CoinsContractInfoResponse
    marketCap: contractInfo?.market_data?.market_cap.usd ?? 0,
    marketCapRank: contractInfo?.market_cap_rank ?? 0,
    chartData,
    token,
    ranges,
    changeChartDays
  }
}