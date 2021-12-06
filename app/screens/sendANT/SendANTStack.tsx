import React, {useMemo} from 'react';
import {useApplicationContext} from 'contexts/ApplicationContext';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from 'navigation/AppNavigation';
import DoneScreen from 'screens/send/DoneScreen';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import HeaderAndTabs from 'screens/send/HeaderAndTabs';
import ConfirmScreen from 'screens/send/ConfirmScreen';
import {AntWithBalance} from '@avalabs/wallet-react-components';
import {SubHeaderOptions} from 'navigation/NavUtils';

const Stack = createStackNavigator();

type Props = {
  onClose: () => void;
  token: AntWithBalance;
};

export default function SendANTStack({onClose}: Props): JSX.Element {
  const context = useApplicationContext();
  const screenOptions = useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: false,
      safeAreaInsets: {top: 0},
      cardStyle: {
        overflow: 'visible',
        backgroundColor: context.theme.colorBg2,
      },
    }),
    [],
  );

  const HeaderNTabs = () => <HeaderAndTabs onClose={onClose} />;
  const DoneScrn = () => <DoneScreen onClose={onClose} />;

  return (
    <NavigationContainer independent={true} theme={context.navContainerTheme}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={AppNavigation.SendToken.SendTokenScreen}
          component={HeaderNTabs}
        />
        <Stack.Screen
          name={AppNavigation.SendToken.ConfirmTransactionScreen}
          options={SubHeaderOptions('Confirm Transaction')}
          component={ConfirmScreen}
        />
        <Stack.Screen
          name={AppNavigation.SendToken.DoneScreen}
          component={DoneScrn}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
