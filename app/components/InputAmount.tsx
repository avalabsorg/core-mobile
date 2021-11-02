import React, {useContext, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import ImgButtonAva from 'components/ImgButtonAva';
import {useApplicationContext} from 'contexts/ApplicationContext';

type Props = {
  initValue?: string;
  onChangeText?: (text: string) => void;
  textSize?: number;
  editable?: boolean;
  showControls?: boolean;
};

export default function InputAmount(props: Props | Readonly<Props>) {
  const context = useApplicationContext();
  const [decreaseBtnVisible] = useState(!!props.showControls);
  const [increaseBtnVisible] = useState(!!props.showControls);
  const [value, setValue] = useState(
    props.initValue ? props.initValue : '0.00',
  );

  const decreaseAmount = (): void => {
    let newVal = parseFloat(value) - 0.1;
    if (newVal < 0) {
      newVal = 0;
    }
    let newState = newVal.toFixed(2).toString();
    setValue(newState);
    props.onChangeText?.(newState);
  };

  const increaseAmount = (): void => {
    let newVal = parseFloat(value) + 0.1;
    let newState = newVal.toFixed(2).toString();
    setValue(newState);
    props.onChangeText?.(newState);
  };

  const theme = context.theme;
  const decreaseIcon = context.isDarkMode
    ? require('assets/icons/remove_dark.png')
    : require('assets/icons/remove_light.png');
  const increaseIcon = context.isDarkMode
    ? require('assets/icons/add_dark.png')
    : require('assets/icons/add_light.png');
  const decreaseBtn = decreaseBtnVisible && (
    <ImgButtonAva src={decreaseIcon} onPress={() => decreaseAmount()} />
  );
  const increaseBtn = increaseBtnVisible && (
    <ImgButtonAva src={increaseIcon} onPress={() => increaseAmount()} />
  );
  return (
    <View style={styles.horizontalLayout}>
      {decreaseBtn}
      <TextInput
        keyboardType={'numeric'}
        editable={props.editable !== false}
        style={[
          {
            flexGrow: 1,
            color: theme.inputTxt,
            fontSize: props.textSize ? props.textSize : 18,
            padding: 8,
            borderWidth: 1,
            borderColor: theme.inputBorder,
            borderRadius: 4,
            margin: 12,
            textAlign: 'right',
            fontFamily: 'Inter-Regular',
          },
        ]}
        textAlign={'center'}
        onChangeText={text => {
          setValue(text);
          props.onChangeText?.(text);
        }}
        value={value}
      />
      {increaseBtn}
    </View>
  );
}

const styles: any = StyleSheet.create({
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
