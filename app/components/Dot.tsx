import React from 'react';
import {useApplicationContext} from 'contexts/ApplicationContext';
import DotSVG from 'components/svg/DotSVG';
import {View} from 'react-native';

type Props = {
  filled?: boolean;
  size?: number;
  margin?: number;
};

export default function Dot(props: Props | Readonly<Props>) {
  const context = useApplicationContext();
  const iconMargin = props.margin || 0;

  return (
    <View style={[{margin: iconMargin}]}>
      {props.filled || <DotSVG size={props.size} />}
      {props.filled && (
        <DotSVG size={props.size} fillColor={context.theme.accentColor} />
      )}
    </View>
  );
}
