import React, {useContext, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchSVG from 'components/svg/SearchSVG';
import ClearSVG from 'components/svg/ClearSVG';
import {ApplicationContext} from 'contexts/ApplicationContext';
import {useNavigation} from '@react-navigation/native';
import AvaLogoSVG from 'components/svg/AvaLogoSVG';
import AvaListItem from 'screens/portfolio/AvaListItem';
import {keyExtractor} from 'screens/portfolio/PortfolioView';
import filter from 'lodash.filter';
// @ts-ignore no-type-def-available
import contains from 'lodash.contains';
import CarrotSVG from 'components/svg/CarrotSVG';

const data: JSON[] = require('assets/coins.json');

function SearchView() {
  const [searchText, setSearchText] = useState('');
  const [tokenList, setTokenList] = useState(data);
  // back press hides flatlist to help minimize artifacts during fade out transition
  const [backPressed, setBackPressed] = useState(false);
  const context = useContext(ApplicationContext);
  const navigation = useNavigation();

  function onCancel() {
    setBackPressed(true);
    setTimeout(() => navigation.goBack(), 0);
  }

  const today = {
    title: 'Today',
    data: data.slice(0, 3),
  };
  const yesterday = {
    title: 'Yesterday',
    data: data.slice(3, 10),
  };

  const sectionData = [today, yesterday];

  const renderItem = (item: ListRenderItemInfo<any>) => {
    const json = item.item;
    console.log(json);
    return (
      <AvaListItem.Activity
        tokenName={'Avalanche'}
        tokenPrice={json.current_price}
        balance={json.current_price}
        movement={'UP'}
        symbol={json.symbol}
        onPress={() => navigation.navigate('TransactionDetailBottomSheet')}
      />
    );
  };

  const emptyList = (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: 32,
      }}>
      <AvaLogoSVG />
      <Text style={{fontSize: 24, paddingTop: 32, textAlign: 'center'}}>
        There are no results. Please try another search
      </Text>
    </View>
  );

  // once we have the official list we'll fix with the proper types
  // and remove the @ts-ignores
  const handleSearch = (text: string) => {
    const filteredTokens = filter(data, token => {
      // @ts-ignore
      return contains(token?.name?.toLowerCase(), text.toLowerCase());
    });

    setSearchText(text);
    // @ts-ignore
    setTokenList(filteredTokens);
  };

  return (
    <View style={{flex: 1, backgroundColor: context.theme.bgApp}}>
      <View
        // while we wait for the proper background from UX
        style={{
          backgroundColor: context.theme.bgApp,
        }}>
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBackground,
              {backgroundColor: context.theme.bgSearch},
            ]}>
            <SearchSVG color={context.theme.onBgSearch} size={32} hideBorder />
            <TextInput
              style={[styles.searchInput, {color: context.theme.txtOnBgApp}]}
              placeholder="Search"
              placeholderTextColor={context.theme.onBgSearch}
              value={searchText}
              onChangeText={handleSearch}
              underlineColorAndroid="transparent"
              accessible
              clearButtonMode="always"
              autoCapitalize="none"
              numberOfLines={1}
            />
          </View>
          <TouchableOpacity style={{paddingLeft: 16}} onPress={onCancel}>
            <ClearSVG
              size={36}
              color={context.theme.onBgSearch}
              backgroundColor={context.theme.bgSearch}
            />
          </TouchableOpacity>
        </View>
      </View>
      {backPressed || (
        <SectionList
          sections={sectionData}
          data={tokenList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          renderSectionHeader={({section: {title}}) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 16,
              }}>
              <Text style={styles.header}>{title}</Text>
              <View style={{transform:[{rotate: '-90deg'}]}}>
                <CarrotSVG color={'#6C6C6E'} />
              </View>
            </View>
          )}
          ListEmptyComponent={emptyList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17,
    color: '#6C6C6E',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  searchBackground: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    height: 40,
    flex: 1,
    justifyContent: 'center',
    paddingStart: 12,
  },
  searchInput: {
    paddingLeft: 4,
    height: 40,
    flex: 1,
    marginRight: 24,
    fontSize: 16,
  },
});

export default SearchView;
