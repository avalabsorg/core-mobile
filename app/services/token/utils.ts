import { ContractMarketChartResponse } from '@avalabs/coingecko-sdk'
import { defaultChartData } from 'store/watchlist'
import { ChartData, SparklineData } from './types'

// data is of 7 days
// we only need the last 24 hours
export const transformSparklineData = (data: SparklineData | []): ChartData => {
  if (data.length === 0) return defaultChartData

  const oneDayDataPoints = Math.ceil(data.length / 7)
  const oneDayData = data.slice(-oneDayDataPoints)
  const minDate = 0
  const maxDate = oneDayDataPoints - 1
  const minPrice = Math.min(...oneDayData)
  const maxPrice = Math.max(...oneDayData)
  const diffValue = oneDayData[oneDayData.length - 1] - oneDayData[0]
  const percentChange = (Math.abs(diffValue) / oneDayData[0]) * 100

  return {
    ranges: {
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      diffValue,
      percentChange
    },
    dataPoints: oneDayData.map((value, index) => {
      return { x: index, y: value }
    })
  }
}

export const transformContractMarketChartResponse = (
  rawData: ContractMarketChartResponse
) => {
  const dates = rawData.prices.map(value => value[0])
  const prices = rawData.prices.map(value => value[1])

  const minDate = Math.min(...dates)
  const maxDate = Math.max(...dates)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const diffValue = prices[prices.length - 1] - prices[0]
  const average = (prices[prices.length - 1] + prices[0]) / 2
  const percentChange = (diffValue / average) * 100

  return {
    ranges: {
      minDate,
      maxDate,
      minPrice,
      maxPrice,
      diffValue,
      percentChange
    },
    dataPoints: rawData.prices.map(tu => {
      return { x: tu[0], y: tu[1] }
    })
  } as ChartData
}