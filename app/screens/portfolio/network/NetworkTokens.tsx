import React, { useLayoutEffect } from 'react'
import { FlatList, ListRenderItemInfo, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSearchableTokenList } from 'screens/portfolio/useSearchableTokenList'
import AppNavigation from 'navigation/AppNavigation'
import PortfolioListItem from 'components/PortfolioListItem'
import ZeroState from 'components/ZeroState'
import AvaButton from 'components/AvaButton'
import { PortfolioScreenProps } from 'navigation/types'
import { useIsUIDisabled, UI } from 'hooks/useIsUIDisabled'
import {
  selectBalanceTotalInCurrencyForNetwork,
  TokenType,
  TokenWithBalance
} from 'store/balance'
import { useApplicationContext } from 'contexts/ApplicationContext'
import { useSelector } from 'react-redux'
import { selectActiveNetwork } from 'store/network'
import { usePosthogContext } from 'contexts/PosthogContext'
import NetworkTokensHeader from './components/NetworkTokensHeader'

type NavigationProp = PortfolioScreenProps<
  typeof AppNavigation.Portfolio.NetworkTokens
>['navigation']

const NetworkTokens = () => {
  const { theme } = useApplicationContext()
  const { capture } = usePosthogContext()
  const { navigate, getParent } = useNavigation<NavigationProp>()
  const {
    isLoading,
    isRefetching,
    filteredTokenList: tokenList,
    refetch
  } = useSearchableTokenList()
  const { chainId } = useSelector(selectActiveNetwork)
  const balanceTotal = useSelector(
    selectBalanceTotalInCurrencyForNetwork(chainId)
  )
  const manageDisabled = useIsUIDisabled(UI.ManageTokens)
  const manageBtnColor = theme.colorPrimary1

  useLayoutEffect(() => {
    getParent()?.setParams({ showBackButton: true })

    return () => {
      getParent()?.setParams({ showBackButton: false })
    }
  }, [getParent])

  const goToReceive = () => navigate(AppNavigation.Wallet.ReceiveTokens)

  const selectToken = (token: TokenWithBalance) => {
    navigate(AppNavigation.Wallet.OwnedTokenDetail, {
      tokenId: token.id
    })

    capture('TokenListTokenSelected', {
      selectedToken:
        token.type === TokenType.ERC20 ? token.address : token.symbol
    })
  }

  const manageTokens = () => {
    navigate(AppNavigation.Wallet.TokenManagement)
  }

  const renderItem = (item: ListRenderItemInfo<TokenWithBalance>) => {
    const token = item.item
    return (
      <PortfolioListItem
        showLoading={isLoading || isRefetching}
        tokenName={token.name}
        tokenPrice={token.balanceDisplayValue ?? '0'}
        tokenPriceInCurrency={token.balanceInCurrency}
        image={token?.logoUri}
        symbol={token.symbol}
        onPress={() => selectToken(token)}
      />
    )
  }

  const ManageButton = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
      <AvaButton.TextLink
        textColor={manageBtnColor}
        onPress={manageTokens}
        disabled={manageDisabled}>
        Manage
      </AvaButton.TextLink>
    </View>
  )

  const renderTokens = () => (
    <FlatList
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 100,
        flexGrow: 1
      }}
      data={tokenList}
      renderItem={renderItem}
      keyExtractor={(item: TokenWithBalance) => item.id}
      onRefresh={refetch}
      refreshing={isRefetching}
      scrollEventThrottle={16}
      ListHeaderComponent={<ManageButton />}
    />
  )

  const renderZeroState = () => {
    return (
      <View style={{ paddingHorizontal: 16, flex: 1, marginTop: -160 }}>
        <ZeroState.NetworkTokens goToReceive={goToReceive} />
      </View>
    )
  }

  const renderContent = () => {
    if (balanceTotal === 0) return renderZeroState()

    return renderTokens()
  }

  return (
    <View style={{ flex: 1 }}>
      <NetworkTokensHeader />
      {renderContent()}
    </View>
  )
}

export default NetworkTokens