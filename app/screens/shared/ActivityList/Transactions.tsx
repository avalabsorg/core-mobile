import React, { useMemo } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import AvaText from 'components/AvaText'
import ActivityListItem from 'screens/activity/ActivityListItem'
import { endOfToday, endOfYesterday, format, isSameDay } from 'date-fns'
import BridgeTransactionItem from 'screens/bridge/components/BridgeTransactionItem'
import { BridgeTransactionStatusParams } from 'navigation/types'
import useInAppBrowser from 'hooks/useInAppBrowser'
import { useSelector } from 'react-redux'
import { selectBridgeTransactions } from 'store/bridge'
import { Transaction } from 'store/transaction'
import ZeroState from 'components/ZeroState'
import { BridgeTransaction } from '@avalabs/bridge-sdk'
import { UI, useIsUIDisabled } from 'hooks/useIsUIDisabled'
import { RefreshControl } from 'components/RefreshControl'

const yesterday = endOfYesterday()
const today = endOfToday()

const getDayString = (timestamp: number) => {
  const isToday = isSameDay(today, timestamp)
  const isYesterday = isSameDay(yesterday, timestamp)
  return isToday
    ? 'Today'
    : isYesterday
    ? 'Yesterday'
    : format(timestamp, 'MMMM do')
}
type Section = {
  title: string
  data: Transaction[] | BridgeTransaction[]
}

type Item = string | Transaction | BridgeTransaction

interface Props {
  isRefreshing: boolean
  onRefresh: () => void
  onEndReached?: () => void
  data: Transaction[]
  openTransactionDetails: (item: Transaction) => void
  openTransactionStatus: (params: BridgeTransactionStatusParams) => void
  hidePendingBridgeTransactions: boolean
}

const Transactions = ({
  isRefreshing,
  onRefresh,
  onEndReached,
  data,
  openTransactionDetails,
  openTransactionStatus,
  hidePendingBridgeTransactions
}: Props) => {
  const { openUrl } = useInAppBrowser()
  const bridgeDisabled = useIsUIDisabled(UI.Bridge)
  const pendingBridgeTransactions = Object.values(
    useSelector(selectBridgeTransactions)
  )
  const combinedData = useMemo(() => {
    const allSections: Section[] = []

    // add pending bridge transactions
    if (
      !hidePendingBridgeTransactions &&
      !bridgeDisabled &&
      pendingBridgeTransactions.length > 0
    )
      allSections.push({ title: 'Pending', data: pendingBridgeTransactions })

    // add all other transactions
    let section: { title: string; data: Transaction[] }
    let sectionTitle = ''

    data.forEach(item => {
      const dateText = getDayString(item.timestamp)
      if (!sectionTitle || sectionTitle !== dateText) {
        section = {
          title: dateText,
          data: [item]
        }
        sectionTitle = dateText
        allSections.push(section)
      } else {
        section.data.push(item)
      }
    })

    // convert back to flatlist data format
    const flatListData: Array<Item> = []

    for (const section of allSections) {
      flatListData.push(section.title)
      flatListData.push(...section.data)
    }

    return flatListData
  }, [
    bridgeDisabled,
    data,
    hidePendingBridgeTransactions,
    pendingBridgeTransactions
  ])

  const renderPendingBridgeTransaction = (tx: BridgeTransaction) => {
    return (
      <BridgeTransactionItem
        key={tx.sourceTxHash}
        item={tx}
        onPress={() => {
          openTransactionStatus({
            txHash: tx.sourceTxHash || ''
          })
        }}
      />
    )
  }

  const renderTransaction = ({ item }: ListRenderItemInfo<Item>) => {
    // render section header
    if (typeof item === 'string') {
      return renderSectionHeader(item)
    }

    // render row
    if ('addressBTC' in item) {
      return renderPendingBridgeTransaction(item)
    } else {
      const onPress = () => {
        if (item.isContractCall || item.isBridge) {
          openUrl(item.explorerLink)
        } else {
          openTransactionDetails(item)
        }
      }

      return (
        <View key={item.hash}>
          {item.isBridge ? (
            <BridgeTransactionItem item={item} onPress={onPress} />
          ) : (
            <ActivityListItem tx={item} onPress={onPress} />
          )}
        </View>
      )
    }
  }

  const renderSectionHeader = (title: string) => {
    return (
      <Animated.View style={styles.headerContainer}>
        <AvaText.ActivityTotal>{title}</AvaText.ActivityTotal>
      </Animated.View>
    )
  }

  const keyExtractor = (
    item: string | Transaction | BridgeTransaction,
    index: number
  ) => {
    if (typeof item === 'string') {
      return index.toString()
    }

    if ('addressBTC' in item) return item.sourceTxHash

    return item.hash
  }

  const renderTransactions = () => {
    return (
      <FlashList
        indicatorStyle="white"
        data={combinedData}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.contentContainer}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={TransactionsZeroState}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />
        }
        getItemType={item => {
          return typeof item === 'string' ? 'sectionHeader' : 'row'
        }}
        estimatedItemSize={71}
      />
    )
  }

  return <View style={styles.container}>{renderTransactions()}</View>
}

const TransactionsZeroState = () => {
  return (
    <View style={styles.zeroState}>
      <ZeroState.NoTransactions />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingBottom: '20%' },
  zeroState: { flex: 1, marginTop: '30%' },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginRight: 8
  }
})

export default React.memo(Transactions)
