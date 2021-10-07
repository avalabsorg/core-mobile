import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {ApplicationContext} from 'contexts/ApplicationContext';
import AvaButton from './AvaButton';
import AvaText from './AvaText';

type Props = {
  btnPrimaryText: string;
  btnSecondaryText: string;
  onBtnPrimary: (text: string) => void;
  onBtnSecondary: () => void;
  onChangeText: (text: string) => void;
  heading?: string;
  errorMessage?: string;
};

export default function TextArea(props: Props | Readonly<Props>): JSX.Element {
  const context = useContext(ApplicationContext);
  const theme = context.theme;
  const [enteredText, setEnteredText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    props.errorMessage,
  );

  useEffect(() => {
    setErrorMessage(props.errorMessage);
  }, [props.errorMessage]);

  return (
    <View
      style={[
        context.shadow,
        styles.container,
        {
          backgroundColor: theme.colorBg2,
        },
      ]}>
      <View
        style={[
          {
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            height: 160,
          },
        ]}>
        {props.heading && (
          <AvaText.Heading2 textStyle={{marginBottom: 16}}>
            Recovery phrase
          </AvaText.Heading2>
        )}
        <TextInput
          placeholder={'Enter your recovery phrase'}
          placeholderTextColor={theme.colorDisabled}
          multiline={true}
          value={enteredText}
          onChangeText={text => {
            setEnteredText(text);
            props.onChangeText(text);
          }}
          style={[
            {
              flexShrink: 1,
              textAlignVertical: 'top',
              color: theme.colorText1,
              fontSize: 16,
              padding: 0,
              lineHeight: 24,
              fontFamily: 'Inter-Regular',
            },
          ]}
        />
        {errorMessage && (
          <AvaText.Body3 textStyle={{color: theme.colorError, marginTop: 4}}>
            {errorMessage}
          </AvaText.Body3>
        )}
      </View>

      <View style={[styles.buttonContainer, {backgroundColor: theme.colorBg3}]}>
        <AvaButton.TextLarge onPress={props.onBtnSecondary}>
          {props.btnSecondaryText}
        </AvaButton.TextLarge>
        <AvaButton.PrimaryMedium
          onPress={() => props.onBtnPrimary(enteredText)}>
          {props.btnPrimaryText}
        </AvaButton.PrimaryMedium>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  buttonContainer: {
    margin: 0,
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});