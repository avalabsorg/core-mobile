import React, {useRef} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet} from 'react-native';
import AvaListItem from 'screens/portfolio/AvaListItem';
import PortfolioHeader from 'screens/portfolio/PortfolioHeader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {ERC20} from '@avalabs/wallet-react-components';
import {AvaxToken} from 'dto/AvaxToken';
import {useSearchableTokenList} from 'screens/portfolio/useSearchableTokenList';

type PortfolioProps = {
  onExit: () => void;
  onSwitchWallet: () => void;
};

function PortfolioView({onExit, onSwitchWallet}: PortfolioProps) {
  const listRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const {tokenList} = useSearchableTokenList();

  function showBottomSheet(token: ERC20 | AvaxToken) {
    navigation.navigate('SendReceiveBottomSheet', {token});
  }

  const renderItem = (item: ListRenderItemInfo<ERC20 | AvaxToken>) => {
    const token = item.item;
    return (
      <AvaListItem.Token
        tokenName={token.name}
        tokenPrice={token.balanceParsed}
        image={token.logoURI}
        symbol={token.symbol}
        onPress={() => showBottomSheet(token)}
      />
    );
  };

  return (
    <SafeAreaProvider style={styles.flex}>
      <PortfolioHeader />
      <FlatList
        ref={listRef}
        style={[
          {
            flex: 1,
            marginTop: 36,
          },
        ]}
        data={tokenList}
        renderItem={renderItem}
        keyExtractor={(item: ERC20 | AvaxToken) => item.symbol}
        scrollEventThrottle={16}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default PortfolioView;
