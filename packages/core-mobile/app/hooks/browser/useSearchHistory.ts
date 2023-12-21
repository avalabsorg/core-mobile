import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { History } from 'store/browser'
import { selectAllHistories } from 'store/browser/slices/globalHistory'

interface ReturnProps {
  searchText: string
  setSearchText: (text: string) => void
  filterHistories: History[]
  hasHistory: boolean
  hasSearchResult: boolean
}

export const useSearchHistory = (): ReturnProps => {
  const histories = useSelector(selectAllHistories)

  const [searchText, setSearchText] = useState('')
  const [filterHistories, setFilterHistories] = useState(histories)
  const hasHistory = histories.length > 0
  const hasSearchResult = filterHistories.length > 0

  useEffect(() => {
    const sortedHistories = [...histories].sort(
      (a, b) => b.lastVisited - a.lastVisited
    )
    if (searchText.length > 0 && sortedHistories.length > 0) {
      const filteredHistories = sortedHistories.filter(history => {
        return history.title.toLowerCase().includes(searchText.toLowerCase())
      })
      setFilterHistories(filteredHistories)
      return
    }
    setFilterHistories(sortedHistories)
  }, [histories, searchText])

  return {
    searchText,
    setSearchText,
    filterHistories,
    hasHistory,
    hasSearchResult
  }
}
