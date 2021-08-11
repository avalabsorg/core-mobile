import React, {useContext} from 'react';
import {Text} from 'react-native';
import {ApplicationContext} from 'contexts/ApplicationContext';

type Props = {
  text: string;
  multiline?: boolean;
  color?: string;
};

export default function TextLabel(props: Props | Readonly<Props>) {
  const context = useContext(ApplicationContext);
  const theme = context.theme;
  return (
    <Text
      numberOfLines={props.multiline ? undefined : 1}
      style={[
        {
          textAlign: props.multiline ? 'center' : 'left',
          color: props.color || theme.textOnBg,
          fontSize: 13,
          fontFamily: 'Inter-Regular',
        },
      ]}>
      {props.text}
    </Text>
  );
}
