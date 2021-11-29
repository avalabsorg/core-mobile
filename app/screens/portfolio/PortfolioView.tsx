import React, {FC, memo, useEffect, useMemo, useRef} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import PortfolioHeader from 'screens/portfolio/PortfolioHeader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {TokenWithBalance} from '@avalabs/wallet-react-components';
import {useSearchableTokenList} from 'screens/portfolio/useSearchableTokenList';
import AppNavigation from 'navigation/AppNavigation';
import {StackNavigationProp} from '@react-navigation/stack';
import {PortfolioStackParamList} from 'navigation/wallet/PortfolioScreenStack';
import PortfolioListItem from 'screens/portfolio/components/PortfolioListItem';
import ZeroState from 'components/ZeroState';
import AvaButton from 'components/AvaButton';
import {usePortfolio} from 'screens/portfolio/usePortfolio';
import Loader from 'components/Loader';
import {useSelectedTokenContext} from 'contexts/SelectedTokenContext';

type PortfolioProps = {
  onExit: () => void;
  onSwitchWallet: () => void;
  tokenList?: TokenWithBalance[];
  loadZeroBalanceList?: () => void;
  handleRefresh?: () => void;
  hasZeroBalance?: boolean;
  setSelectedToken?: (token: TokenWithBalance) => void;
};

export type PortfolioNavigationProp =
  StackNavigationProp<PortfolioStackParamList>;

// experimenting with container pattern and stable props to try to reduce re-renders
function PortfolioContainer({
  onExit,
  onSwitchWallet,
}: PortfolioProps): JSX.Element {
  const {tokenList, loadZeroBalanceList, loadTokenList} =
    useSearchableTokenList();
  const {balanceTotalInUSD, isWalletReady, isBalanceLoading, isErc20Loading} =
    usePortfolio();
  const {setSelectedToken} = useSelectedTokenContext();

  const hasZeroBalance =
    !balanceTotalInUSD ||
    balanceTotalInUSD === '0' ||
    balanceTotalInUSD === '$0.00';

  function handleRefresh() {
    loadTokenList();
  }

  return (
    <>
      {!isWalletReady || isBalanceLoading || isErc20Loading ? (
        <Loader />
      ) : (
        <PortfolioView
          onExit={onExit}
          onSwitchWallet={onSwitchWallet}
          tokenList={tokenList}
          loadZeroBalanceList={loadZeroBalanceList}
          handleRefresh={handleRefresh}
          hasZeroBalance={hasZeroBalance}
          setSelectedToken={setSelectedToken}
        />
      )}
    </>
  );
}

const PortfolioView: FC<PortfolioProps> = memo(
  ({
    tokenList,
    loadZeroBalanceList,
    handleRefresh,
    hasZeroBalance,
    setSelectedToken,
  }: PortfolioProps) => {
    const listRef = useRef<FlatList>(null);
    const navigation = useNavigation<PortfolioNavigationProp>();

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        loadZeroBalanceList?.();
      });
      return () => navigation.removeListener('focus', unsubscribe);
    }, [navigation]);

    function selectToken(token: TokenWithBalance) {
      setSelectedToken?.(token);
      navigation.navigate(AppNavigation.Modal.SendReceiveBottomSheet);
    }

    function emptyStateAdditionalItem() {
      return (
        <AvaButton.PrimaryLarge
          style={{marginTop: 32}}
          onPress={() => {
            navigation.navigate(AppNavigation.Modal.ReceiveOnlyBottomSheet);
          }}>
          Receive tokens
        </AvaButton.PrimaryLarge>
      );
    }

    const renderItem = (item: ListRenderItemInfo<TokenWithBalance>) => {
      const token = item.item;
      return (
        <PortfolioListItem
          tokenName={token.name}
          tokenPrice={token.balanceDisplayValue ?? '0'}
          tokenPriceUsd={token.balanceUsdDisplayValue}
          image={token?.logoURI}
          symbol={token.symbol}
          onPress={() => selectToken(token)}
        />
      );
    };

    const zeroState = useMemo(() => {
      return (
        <ZeroState.Portfolio additionalItem={emptyStateAdditionalItem()} />
      );
    }, []);

    return (
      <SafeAreaProvider style={styles.flex}>
        <PortfolioHeader />
        {!tokenList ? (
          <Loader />
        ) : (
          <FlatList
            ref={listRef}
            contentContainerStyle={{paddingHorizontal: 16}}
            style={[styles.tokenList, tokenList?.length === 1 && {flex: 0}]}
            data={tokenList}
            renderItem={renderItem}
            keyExtractor={(item: TokenWithBalance) => item?.symbol}
            onRefresh={handleRefresh}
            refreshing={false}
            scrollEventThrottle={16}
            ListEmptyComponent={zeroState}
          />
        )}
        {tokenList?.length === 1 && hasZeroBalance && (
          <View
            style={{
              position: 'absolute',
              top: 200,
              left: 0,
              right: 0,
              bottom: 0,
            }}>
            {zeroState}
          </View>
        )}
      </SafeAreaProvider>
    );
  },
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  tokenList: {
    marginTop: 36,
  },
});

export default PortfolioContainer;
