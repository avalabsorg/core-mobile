import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import AppNavigation from 'navigation/AppNavigation';
import PortfolioView from 'screens/portfolio/PortfolioView';
import {useApplicationContext} from 'contexts/ApplicationContext';
import {HistoryItemType} from '@avalabs/avalanche-wallet-sdk/dist/History';

type Props = {
  onExit: () => void;
  onSwitchWallet: () => void;
};

export type PortfolioStackParamList = {
  [AppNavigation.Wallet.PortfolioScreen]: undefined;
  [AppNavigation.Wallet.SearchScreen]: undefined;
  [AppNavigation.Wallet.AddCustomToken]: undefined;
  [AppNavigation.Modal.AccountBottomSheet]: undefined;
  [AppNavigation.Modal.SendReceiveBottomSheet]: undefined;
  [AppNavigation.Modal.ReceiveOnlyBottomSheet]: undefined;
  [AppNavigation.Modal.TransactionDetailBottomSheet]: {
    historyItem: HistoryItemType;
  };
};

const PortfolioStack = createStackNavigator<PortfolioStackParamList>();

function PortfolioStackScreen({onExit, onSwitchWallet}: Props) {
  const {theme} = useApplicationContext();
  const PortfolioViewWithProps = () => (
    <PortfolioView onExit={onExit} onSwitchWallet={onSwitchWallet} />
  );

  return (
    <PortfolioStack.Navigator
      initialRouteName={AppNavigation.Wallet.PortfolioScreen}
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: theme.colorBg1},
      }}>
      <PortfolioStack.Screen
        name={AppNavigation.Wallet.PortfolioScreen}
        component={PortfolioViewWithProps}
      />
    </PortfolioStack.Navigator>
  );
}

export default React.memo(PortfolioStackScreen);
