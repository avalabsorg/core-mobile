import React, {FC, memo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {usePortfolio} from 'screens/portfolio/usePortfolio';
import {useApplicationContext} from 'contexts/ApplicationContext';
import AvaButton from 'components/AvaButton';
import CopySVG from 'components/svg/CopySVG';
import AvaText from 'components/AvaText';
import {Space} from 'components/Space';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import {
  NavigationContainer,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import AvaxQACode from 'components/AvaxQRCode';
import HeaderAccountSelector from 'components/HeaderAccountSelector';
import AppNavigation from 'navigation/AppNavigation';
import {copyToClipboard} from 'utils/DeviceTools';
import {RootStackParamList} from 'navigation/WalletScreenStack';
import TokenAddress from 'components/TokenAddress';

type ReceiveStackParams = {
  ReceiveCChain: undefined;
  // ReceiveXChain: undefined;
};

const ReceiveStack = createStackNavigator<ReceiveStackParams>();

interface Props {
  showBackButton?: boolean;
  setPosition?: (position: number) => void;
  embedded?: boolean;
}

function ReceiveToken2({
  setPosition,
  showBackButton = false,
  embedded = false,
}: Props) {
  const {addressC} = usePortfolio();
  const {navContainerTheme, theme} = useApplicationContext();

  //Share has been decommissioned yet again :(
  // const handleShare = async (address: string) => {
  //   try {
  //     const result = await Share.share({
  //       message: address,
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         console.log('shared with activity type of ', result.activityType);
  //       } else {
  //         console.log('shared');
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       console.log('dismissed');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const HeaderAccountSelectorComp = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    return (
      <HeaderAccountSelector
        onPressed={() =>
          navigation.navigate(AppNavigation.Modal.AccountDropDown)
        }
      />
    );
  };

  const receiveNavigator = (
    <ReceiveStack.Navigator
      initialRouteName={'ReceiveCChain'}
      screenOptions={{
        presentation: 'card',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: embedded ? theme.colorBg2 : theme.background,
        },
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <ReceiveStack.Screen
        name={'ReceiveCChain'}
        options={
          embedded
            ? {headerShown: false}
            : {
                headerTitle: () => <HeaderAccountSelectorComp />,
              }
        }>
        {props => (
          <Receive
            {...props}
            embedded={embedded}
            selectedAddress={addressC}
            positionCallback={setPosition}
          />
        )}
      </ReceiveStack.Screen>
    </ReceiveStack.Navigator>
  );

  const switchTheme = {...navContainerTheme};
  switchTheme.colors.background = embedded ? theme.colorBg2 : theme.background;

  if (showBackButton) {
    return receiveNavigator;
  } else {
    return (
      <NavigationContainer independent={!showBackButton} theme={switchTheme}>
        {receiveNavigator}
      </NavigationContainer>
    );
  }
}

const Receive: FC<{
  selectedAddress: string;
  isXChain?: boolean;
  onShare?: (address: string) => void;
  positionCallback?: (position: number) => void;
  embedded: boolean;
}> = memo(props => {
  const theme = useApplicationContext().theme;
  const isXChain = !!props?.isXChain;
  const embedded = !!props?.embedded;

  useFocusEffect(
    useCallback(() => {
      props?.positionCallback?.(isXChain ? 1 : 0);
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Space y={embedded ? 34 : 8} />
      {embedded || (
        <>
          <AvaText.LargeTitleBold textStyle={{marginHorizontal: 16}}>
            Receive
          </AvaText.LargeTitleBold>
          <Space y={12} />
        </>
      )}
      <Text style={{marginHorizontal: 16, paddingTop: 4}}>
        <AvaText.Body2>This is your </AvaText.Body2>
        <AvaText.Heading3>
          {isXChain ? 'X chain ' : 'C chain '}
        </AvaText.Heading3>
        <AvaText.Body2>address to receive funds.</AvaText.Body2>
      </Text>
      <View style={[styles.container]}>
        <Space y={55} />
        <View style={{alignSelf: 'center'}}>
          <AvaxQACode
            circularText={isXChain ? 'X Chain' : 'C Chain'}
            sizePercentage={0.7}
            address={props.selectedAddress}
          />
        </View>
        <Space y={40} />
        <View
          style={[
            styles.copyAddressContainer,
            {backgroundColor: theme.colorBg2},
          ]}>
          <TokenAddress
            address={props.selectedAddress}
            copyIconEnd
            showFullAddress
            textType={'ButtonMedium'}
          />
        </View>
        <Space y={16} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  copyAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
});

export default ReceiveToken2;
