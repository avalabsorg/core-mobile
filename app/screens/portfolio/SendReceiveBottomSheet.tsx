import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import BottomSheet, {TouchableOpacity} from '@gorhom/bottom-sheet';
import ButtonAva from 'components/ButtonAva';
import AvaText from 'components/AvaText';
import AvaLogoSVG from 'components/svg/AvaLogoSVG';
import {ApplicationContext} from 'contexts/ApplicationContext';
import TabViewAva from 'components/TabViewAva';
import CarrotSVG from 'components/svg/CarrotSVG';
import ClearSVG from 'components/svg/ClearSVG';
import TextTitle from 'components/TextTitle';
import AvaListItem from './AvaListItem';
import TabViewBackground from './components/TabViewBackground';
import SendAvax from 'screens/sendAvax/SendAvax';
import {usePortfolio} from 'screens/portfolio/usePortfolio';
import SendAvaxConfirm from 'screens/sendAvax/SendAvaxConfirm';
import ReceiveToken from 'screens/receive/ReceiveToken';
import OvalTagBg from 'components/OvalTagBg';
import TransactionsView from 'screens/transactions/TransactionsView';
import Divider from 'components/Divider';
import {ERC20} from '@avalabs/wallet-react-components';
import {AvaxToken} from 'dto/AvaxToken';

const Stack = createStackNavigator();

interface Props {
  token: ERC20;
}

const SendReceiveBottomSheet: FC<Props> = props => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const theme = useContext(ApplicationContext).theme;
  const {balanceAvaxTotal, balanceTotalInUSD} = usePortfolio();
  const {goBack, canGoBack, navigate} = useNavigation();
  const snapPoints = useMemo(() => ['0%', '86%'], []);

  //todo: figure out types for route params
  const {route} = props;
  const tokenObj = route.params.token as ERC20 | AvaxToken;

  useEffect(() => {
    // intentionally setting delay so animation is visible.
    setTimeout(() => {
      bottomSheetRef?.current?.snapTo(1);
    }, 50);
  }, []);

  const handleClose = useCallback(() => {
    bottomSheetRef?.current?.collapse();
    // InteractionManager.runAfterInteractions(() => canGoBack() && goBack());
  }, []);

  const handleChange = useCallback(index => {
    if (index === 0 && canGoBack()) {
      goBack();
    }
  }, []);

  const TokenLogo = () => {
    const context = useContext(ApplicationContext);
    if (tokenObj.symbol === 'AVAX') {
      return (
        <AvaLogoSVG
          size={32}
          logoColor={context.theme.logoColor}
          backgroundColor={context.theme.txtOnBgApp}
        />
      );
    } else {
      return (
        <Image
          style={styles.tokenLogo}
          source={{
            uri: (tokenObj as ERC20).logoURI,
          }}
        />
      );
    }
  };

  const Tabs = () => (
    <>
      <View style={{flexDirection: 'row', paddingRight: 16}}>
        <View style={{flex: 1}}>
          <AvaListItem.Simple
            label={
              <TextTitle
                text={tokenObj.name}
                size={16}
                color={theme.txtListItem}
                bold
              />
            }
            title={
              <TextTitle
                text={`${tokenObj.balanceParsed} ${tokenObj.symbol}`}
                size={24}
                color={theme.txtListItem}
                bold
              />
            }
            subtitle={
              <TextTitle
                text={balanceTotalInUSD}
                size={14}
                color={theme.txtListItemSubscript}
              />
            }
            leftComponent={<TokenLogo />}
            titleAlignment={'flex-start'}
          />
        </View>
        <TouchableOpacity onPress={handleClose}>
          <ClearSVG
            color={theme.btnIconIcon}
            backgroundColor={theme.bgSearch}
            size={40}
          />
        </TouchableOpacity>
      </View>
      <TabViewAva renderCustomLabel={renderCustomLabel}>
        <SendAvax title={'Send'} />
        <ReceiveToken title={'Receive'} />
        <TransactionsView title={'Activity'} />
      </TabViewAva>
    </>
  );

  const SendNavigator = () => {
    const screenOptions = useMemo<StackNavigationOptions>(
      () => ({
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: true,
        safeAreaInsets: {top: 0},
        headerLeft: ({onPress}) => (
          <TouchableOpacity
            style={{paddingEnd: 16, transform: [{rotate: '180deg'}]}}
            onPress={onPress}>
            <CarrotSVG color={theme.txtOnBgApp} />
          </TouchableOpacity>
        ),
        headerTitleStyle: {
          color: theme.txtListItem,
        },
        headerStyle: {
          backgroundColor: theme.bgOnBgApp,
          shadowColor: theme.transparent,
        },
        cardStyle: {
          backgroundColor: theme.bgOnBgApp,
          overflow: 'visible',
        },
      }),
      [],
    );

    const DoneDoneScreen = () => <DoneScreen onClose={handleClose} />;
    const ConfirmScreen = () => {
      const {navigate} = useNavigation();
      return (
        <SendAvaxConfirm
          onConfirm={() => navigate('Done Screen')}
          onClose={handleClose}
          destinationAddress={'X-fuji1mtf4tv4dnmghh34ausjqyxer05hl3qvqv3nmja'}
          fiatAmount={'443.23 USD'}
          tokenAmount={'23232.23 AVAX'}
          tokenImageUrl={tokenObj.logoURI}
        />
      );
    };

    const doneScreenOptions = useMemo(
      () => ({headerShown: false, headerLeft: () => null}),
      [],
    );
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
          <Stack.Screen
            name="Send Screen"
            options={doneScreenOptions}
            component={Tabs}
          />
          <Stack.Screen name="Confirm Transaction" component={ConfirmScreen} />
          <Stack.Screen
            name="Done Screen"
            options={doneScreenOptions}
            component={DoneDoneScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  const renderCustomLabel = (title: string, focused: boolean) => {
    return (
      <OvalTagBg color={focused ? '#FFECEF' : theme.transparent}>
        <AvaText.Tag
          textStyle={{color: focused ? theme.btnTextTxt : '#6C6C6E'}}>
          {title}
        </AvaText.Tag>
      </OvalTagBg>
    );
  };

  // renders
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleChange}
        backgroundComponent={TabViewBackground}>
        <SendNavigator />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  tokenLogo: {
    paddingHorizontal: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

interface DoneProps {
  onClose: () => void;
}

function DoneScreen({onClose}: DoneProps) {
  return (
    <View
      style={[
        useContext(ApplicationContext).backgroundStyle,
        {
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          paddingStart: 0,
          paddingEnd: 0,
        },
      ]}>
      <Divider size={100} />
      <AvaLogoSVG />
      <Divider size={32} />
      <AvaText.Heading2>Asset sent</AvaText.Heading2>
      <View style={{flex: 1}} />
      <View style={{width: '100%'}}>
        <ButtonAva text={'Done'} onPress={onClose} />
      </View>
    </View>
  );
}

export default SendReceiveBottomSheet;
