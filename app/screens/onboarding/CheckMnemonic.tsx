import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import Header from 'screens/mainView/Header';
import TextTitle from 'components/TextTitle';
import ButtonAva from 'components/ButtonAva';
import CheckMnemonicViewModel from './CheckMnemonicViewModel';
import MnemonicInput from './MnemonicInput';
import {Subscription} from 'rxjs';

type Props = {
  onSuccess: () => void;
  onBack: () => void;
  mnemonic: string;
};

export default function CheckMnemonic(props: Props | Readonly<Props>) {
  const [viewModel] = useState(new CheckMnemonicViewModel(props.mnemonic));
  const [enteredMnemonics, setEnteredMnemonics] = useState(new Map());
  const [enabledInputs, setEnabledInputs] = useState(new Map());

  useEffect(() => {
    const disposables = new Subscription();
    disposables.add(
      viewModel.enteredMnemonic.subscribe(value => setEnteredMnemonics(value)),
    );
    disposables.add(
      viewModel.enabledInputs.subscribe(value => setEnabledInputs(value)),
    );
    viewModel.onComponentMount();

    return () => {
      disposables.unsubscribe();
    };
  }, []);

  const onBack = (): void => {
    props.onBack();
  };

  const onVerify = (): void => {
    viewModel.onVerify().subscribe({
      error: err => Alert.alert(err.message),
      complete: () => props.onSuccess(),
    });
  };

  const setMnemonic = (index: number, value: string): void => {
    viewModel.setMnemonic(index, value);
  };

  const mnemonics = () => {
    const mnemonics: Element[] = [];
    enteredMnemonics.forEach((value, key) => {
      if (enabledInputs.get(key)) {
        mnemonics.push(
          <MnemonicInput
            key={key}
            keyNum={key}
            text={value}
            onChangeText={text => setMnemonic(key, text)}
            editable={true}
          />,
        );
      } else {
        mnemonics.push(
          <MnemonicInput
            key={key}
            keyNum={key}
            text={value}
            editable={false}
          />,
        );
      }
    });
    return mnemonics;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Header showBack onBack={onBack} />
      <TextTitle
        text={'Fill In Mnemonic Phrase Below'}
        size={20}
        textAlign={'center'}
      />
      <View style={[{height: 16}]} />
      <View style={styles.growContainer}>
        <View style={styles.mnemonics}>{mnemonics()}</View>
      </View>
      <ButtonAva text={'Next'} onPress={onVerify} />
    </ScrollView>
  );
}

const styles: any = StyleSheet.create({
  scrollView: {
    height: '100%',
  },
  mnemonics: {
    marginHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  growContainer: {
    flexGrow: 1,
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
});
