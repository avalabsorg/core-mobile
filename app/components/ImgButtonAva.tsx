import React, {useState} from 'react';
import {
  Appearance,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import CommonViewModel from 'utils/CommonViewModel';
import {COLORS, COLORS_NIGHT} from 'resources/Constants';

type Props = {
  src: ImageSourcePropType;
  onPress: () => void;
  width?: number;
  height?: number;
};
export default function ImgButtonAva(props: Props | Readonly<Props>) {
  const [commonViewModel] = useState(
    new CommonViewModel(Appearance.getColorScheme()),
  );
  const [isDarkMode] = useState(commonViewModel.isDarkMode);

  let THEME = isDarkMode ? COLORS_NIGHT : COLORS;
  return (
    <TouchableNativeFeedback
      useForeground={true}
      onPress={props.onPress}
      background={TouchableNativeFeedback.Ripple(THEME.primaryColor, true)}>
      <View style={styles.container}>
        <Image
          source={props.src}
          style={[
            styles.button,
            {width: props.width || 24, height: props.height || 24},
          ]}
        />
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'baseline',
  },
  button: {
    margin: 10,
  },
});
