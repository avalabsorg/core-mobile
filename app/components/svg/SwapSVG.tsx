import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useApplicationContext} from 'contexts/ApplicationContext';

interface Prop {
  selected?: boolean;
  color?: string;
  size?: number;
}

function SwapSVG({selected, color, size = 24}: Prop) {
  const context = useApplicationContext();

  const svgColor = color
    ? color
    : selected
    ? context.theme.accentColor
    : context.theme.onBgSearch;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.6262 18.3737C21.2475 18.3737 21.7512 17.87 21.7512 17.2487C21.7512 16.6274 21.2475 16.1237 20.6262 16.1237L5.95583 16.1237L8.0316 13.891C8.45465 13.436 8.42872 12.7241 7.97368 12.3011C7.51864 11.878 6.8068 11.904 6.38375 12.359L2.70814 16.3125C2.68009 16.3427 2.65365 16.3738 2.62881 16.4057C2.39575 16.6119 2.2488 16.9131 2.2488 17.2487C2.2488 17.5843 2.39573 17.8856 2.62876 18.0917C2.65362 18.1236 2.68008 18.1548 2.70814 18.185L6.38375 22.1385C6.8068 22.5935 7.51864 22.6194 7.97368 22.1964C8.42872 21.7733 8.45465 21.0615 8.0316 20.6064L5.95581 18.3737L20.6262 18.3737Z"
        fill={svgColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.37381 5.62628C2.75249 5.62628 2.24881 6.12996 2.24881 6.75128C2.24881 7.3726 2.75249 7.87628 3.37381 7.87628L18.0442 7.87628L15.9684 10.109C15.5453 10.564 15.5713 11.2759 16.0263 11.6989C16.4814 12.122 17.1932 12.096 17.6163 11.641L21.2919 7.6875C21.3199 7.65733 21.3464 7.62621 21.3712 7.59426C21.6043 7.38814 21.7512 7.08687 21.7512 6.75128C21.7512 6.4157 21.6043 6.11445 21.3712 5.90833C21.3464 5.87635 21.3199 5.84522 21.2919 5.81503L17.6163 1.86153C17.1932 1.40649 16.4814 1.38056 16.0263 1.80362C15.5713 2.22667 15.5453 2.93851 15.9684 3.39355L18.0442 5.62628L3.37381 5.62628Z"
        fill={svgColor}
      />
    </Svg>
  );
}

export default SwapSVG;
