import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useApplicationContext} from 'contexts/ApplicationContext';

interface Prop {
  color?: string;
  size?: number;
}

function LightModeSVG({color, size = 24}: Prop) {
  const theme = useApplicationContext().theme;
  const iconColor = color ?? theme.alternateBackground;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.9999 5.98877C8.68532 5.98877 5.98877 8.68585 5.98877 12.0005C5.98877 15.3151 8.68532 18.0122 11.9999 18.0122C15.314 18.0122 18.0111 15.3156 18.0111 12.0005C18.0111 8.68531 15.314 5.98877 11.9999 5.98877Z"
        fill={iconColor}
      />
      <Path
        d="M12 4.22179C11.3522 4.22179 10.8271 3.69672 10.8271 3.04942V1.1729C10.8271 0.525066 11.3522 0 12 0C12.6479 0 13.1729 0.525066 13.1729 1.1729V3.04942C13.1729 3.69672 12.6473 4.22179 12 4.22179Z"
        fill={iconColor}
      />
      <Path
        d="M12 19.7776C11.3522 19.7776 10.8271 20.3027 10.8271 20.9505V22.8265C10.8271 23.4748 11.3522 23.9999 12 23.9999C12.6479 23.9999 13.1729 23.4748 13.1729 22.8265V20.9505C13.1729 20.3027 12.6473 19.7776 12 19.7776Z"
        fill={iconColor}
      />
      <Path
        d="M17.4994 6.49997C17.0419 6.04187 17.0419 5.29944 17.4994 4.84134L18.8264 3.51432C19.284 3.05675 20.027 3.05675 20.4851 3.51432C20.9432 3.97243 20.9432 4.71539 20.4851 5.17296L19.1581 6.49997C18.7005 6.95808 17.9581 6.95808 17.4994 6.49997Z"
        fill={iconColor}
      />
      <Path
        d="M6.50017 17.5005C6.04207 17.0418 5.29964 17.0418 4.84154 17.5005L3.51452 18.827C3.05695 19.2845 3.05642 20.028 3.51452 20.4856C3.97263 20.9432 4.71558 20.9432 5.17316 20.4856L6.50017 19.158C6.95828 18.7005 6.95828 17.9575 6.50017 17.5005Z"
        fill={iconColor}
      />
      <Path
        d="M19.7776 12C19.7776 11.3522 20.3027 10.8271 20.9505 10.8271H22.827C23.4748 10.8271 23.9999 11.3522 23.9999 12C23.9999 12.6479 23.4748 13.1724 22.827 13.1724H20.9505C20.3027 13.1724 19.7776 12.6479 19.7776 12Z"
        fill={iconColor}
      />
      <Path
        d="M4.22179 12C4.22179 11.3522 3.69672 10.8271 3.04889 10.8271H1.1729C0.525066 10.8271 0 11.3522 0 12C0 12.6479 0.525066 13.1724 1.1729 13.1724H3.04942C3.69672 13.1724 4.22179 12.6479 4.22179 12Z"
        fill={iconColor}
      />
      <Path
        d="M17.4993 17.5004C17.9574 17.0428 18.7004 17.0428 19.158 17.5004L20.485 18.8274C20.9431 19.2845 20.9431 20.028 20.485 20.4855C20.0269 20.9431 19.2845 20.9431 18.8264 20.4855L17.4993 19.1585C17.0412 18.7004 17.0412 17.958 17.4993 17.5004Z"
        fill={iconColor}
      />
      <Path
        d="M6.50013 6.50008C6.95823 6.04198 6.95823 5.29955 6.50013 4.84145L5.17311 3.51497C4.71501 3.05686 3.97258 3.05686 3.51448 3.51497C3.05637 3.97254 3.05637 4.7155 3.51448 5.17307L4.84149 6.50008C5.2996 6.95872 6.04202 6.95872 6.50013 6.50008Z"
        fill={iconColor}
      />
    </Svg>
  );
}

export default LightModeSVG;
