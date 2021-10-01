import React, {useContext, useEffect} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import Dot from 'components/Dot';
import PinKey, {PinKeys} from 'screens/onboarding/PinKey';
import {
  MnemonicLoaded,
  NothingToLoad,
  PrivateKeyLoaded,
  usePinOrBiometryLogin,
  WalletLoadingResults,
} from './PinOrBiometryLoginViewModel';
import AvaText from 'components/AvaText';
import {Space} from 'components/Space';
import {ApplicationContext} from 'contexts/ApplicationContext';
import AvaButton from 'components/AvaButton';

const keymap: Map<string, PinKeys> = new Map([
  ['1', PinKeys.Key1],
  ['2', PinKeys.Key2],
  ['3', PinKeys.Key3],
  ['4', PinKeys.Key4],
  ['5', PinKeys.Key5],
  ['6', PinKeys.Key6],
  ['7', PinKeys.Key7],
  ['8', PinKeys.Key8],
  ['9', PinKeys.Key9],
  ['0', PinKeys.Key0],
  ['<', PinKeys.Backspace],
]);

type Props = {
  onSignInWithRecoveryPhrase: () => void;
  onEnterWallet: (mnemonic: string) => void;
};

export default function PinOrBiometryLogin({
  onSignInWithRecoveryPhrase,
  onEnterWallet,
}: Props | Readonly<Props>): JSX.Element {
  const [
    title,
    pinDots,
    onEnterPin,
    mnemonic,
    promptForWalletLoadingIfExists,
    jiggleAnim,
  ] = usePinOrBiometryLogin();

  const context = useContext(ApplicationContext);

  useEffect(() => {
    promptForWalletLoadingIfExists().subscribe({
      next: (value: WalletLoadingResults) => {
        if (value instanceof MnemonicLoaded) {
          onEnterWallet(value.mnemonic);
        } else if (value instanceof PrivateKeyLoaded) {
          // props.onEnterSingletonWallet(value.privateKey)
        } else if (value instanceof NothingToLoad) {
          //do nothing
        }
      },
      error: err => console.log(err.message),
    });
  }, []);
  useEffect(() => {
    if (mnemonic) {
      onEnterWallet(mnemonic);
    }
  }, [mnemonic]);

  const generatePinDots = (): Element[] => {
    const dots: Element[] = [];

    pinDots.forEach((value, key) => {
      dots.push(<Dot filled={value.filled} key={key} />);
    });
    return dots;
  };

  const keyboard = () => {
    const keys: Element[] = [];
    '123456789 0<'.split('').forEach((value, key) => {
      keys.push(
        <View key={key} style={styles.pinKey}>
          <PinKey keyboardKey={keymap.get(value)!} onPress={onEnterPin} />
        </View>,
      );
    });
    return keys;
  };

  return (
    <View style={styles.verticalLayout}>
      <Space y={64} />
      <View style={styles.growContainer}>
        <AvaText.LargeTitleBold textStyle={{textAlign: 'center'}}>
          {title}
        </AvaText.LargeTitleBold>
        <Space y={8} />
        <AvaText.Body1
          textStyle={{textAlign: 'center', color: context.theme.colorText1}}>
          Enter your PIN
        </AvaText.Body1>
        <Animated.View
          style={[
            {padding: 68},
            {
              transform: [
                {
                  translateX: jiggleAnim,
                },
              ],
            },
          ]}>
          <View style={styles.dots}>{generatePinDots()}</View>
        </Animated.View>
      </View>
      <View style={styles.keyboard}>{keyboard()}</View>
      <AvaButton.TextMedium onPress={onSignInWithRecoveryPhrase}>
        Sign In with recovery phrase
      </AvaButton.TextMedium>
    </View>
  );
}

const styles = StyleSheet.create({
  verticalLayout: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  growContainer: {
    flexGrow: 1,
  },
  keyboard: {
    marginHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dots: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  pinKey: {
    flexBasis: '33%',
    padding: 16,
  },
});
