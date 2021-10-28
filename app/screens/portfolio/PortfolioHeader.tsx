import React, {FC, memo, useContext} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AvaListItem from 'components/AvaListItem';
import {
  ApplicationContext,
  ApplicationContextState,
} from 'contexts/ApplicationContext';
import {usePortfolio} from 'screens/portfolio/usePortfolio';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import AppNavigation from 'navigation/AppNavigation';
import MenuSVG from 'components/svg/MenuSVG';
import CarrotSVG from 'components/svg/CarrotSVG';
import AddSVG from 'components/svg/AddSVG';
import AvaText from 'components/AvaText';
import {SelectedAccountContext} from 'contexts/SelectedAccountContext';
import {PortfolioNavigationProp} from 'screens/portfolio/PortfolioView';

// experimenting with container pattern and stable props to try to reduce re-renders
function PortfolioHeaderContainer() {
  const context = useContext(ApplicationContext);
  const navigation = useNavigation<PortfolioNavigationProp>();
  const {balanceTotalInUSD} = usePortfolio();
  const {selectedAccount} = useContext(SelectedAccountContext);

  return (
    <PortfolioHeader
      appContext={context}
      navigation={navigation}
      balanceTotalUSD={balanceTotalInUSD}
      accountName={selectedAccount?.title ?? ''}
    />
  );
}

interface PortfolioHeaderProps {
  appContext: ApplicationContextState;
  navigation: PortfolioNavigationProp;
  balanceTotalUSD: string;
  accountName: string;
}

const PortfolioHeader: FC<PortfolioHeaderProps> = memo(
  ({navigation, appContext, balanceTotalUSD = 0, accountName}) => {
    const theme = appContext.theme;

    const leftComponent = (
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <MenuSVG />
      </Pressable>
    );

    const rightComponent = (
      <Pressable
        onPress={() => navigation.navigate(AppNavigation.Wallet.SearchScreen)}>
        <AddSVG />
      </Pressable>
    );

    function onAccountPressed() {
      navigation.navigate(AppNavigation.Modal.AccountBottomSheet);
    }

    function customTitle() {
      return (
        <Pressable onPress={onAccountPressed}>
          <View
            style={[
              styles.accountTitleContainer,
              {borderColor: theme.btnIconBorder},
            ]}>
            <AvaText.Heading3
              ellipsize={'middle'}
              textStyle={{marginRight: 16}}>
              {accountName}
            </AvaText.Heading3>
            <View style={{transform: [{rotate: '90deg'}]}}>
              <CarrotSVG color={theme.txtListItem} size={10} />
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <View pointerEvents="box-none">
        <View>
          <AvaListItem.Base
            title={customTitle()}
            rightComponent={rightComponent}
            leftComponent={leftComponent}
            listPressDisabled
          />
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 25,
          }}>
          <AvaText.LargeTitleBold>{balanceTotalUSD}</AvaText.LargeTitleBold>
          <AvaText.Heading3 textStyle={{paddingBottom: 4, marginLeft: 4}}>
            USD
          </AvaText.Heading3>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  accountTitleContainer: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
});

export default PortfolioHeaderContainer;
