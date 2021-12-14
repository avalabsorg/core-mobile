import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useApplicationContext} from 'contexts/ApplicationContext';

interface Prop {
  color?: string;
  size?: number;
}

function SwapNarrowSVG({color, size = 20}: Prop) {
  const {theme} = useApplicationContext();

  const svgColor = color ?? theme.alternateBackground;

  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M4.79165 19.7083C4.79165 19.7083 4.83331 19.7083 4.83331 19.75C4.87498 19.75 4.91665 19.7917 4.95831 19.7917L4.99998 19.7917C5.04165 19.7917 5.12498 19.7917 5.16665 19.7917C5.20831 19.7917 5.29165 19.7917 5.33331 19.7917L5.37498 19.7917C5.41665 19.7917 5.45831 19.75 5.49998 19.75C5.49998 19.75 5.54165 19.75 5.54165 19.7083C5.58331 19.7083 5.62498 19.6667 5.62498 19.6667L5.66665 19.625C5.70831 19.5833 5.70831 19.5833 5.74998 19.5417L9.87498 14.875C9.99998 14.7083 10.0833 14.5417 10.0833 14.3333C10.0833 14.125 9.99998 13.875 9.79165 13.7083C9.45831 13.4167 8.95831 13.4583 8.62498 13.7917L5.91665 16.875L5.91664 1.08333C5.91664 0.624996 5.54164 0.249996 5.08331 0.249996C4.62498 0.249996 4.24998 0.624996 4.24998 1.08333L4.24998 16.8333L1.62498 13.75C1.33331 13.4167 0.791645 13.375 0.458312 13.6667C0.124978 13.9583 0.0833116 14.5 0.374978 14.8333L4.54165 19.5C4.58331 19.5417 4.62498 19.5833 4.62498 19.5833L4.66665 19.625C4.70831 19.6667 4.74998 19.6667 4.79165 19.7083Z"
        fill={svgColor}
      />
      <Path
        d="M15.2083 0.291655C15.2083 0.291655 15.1666 0.291655 15.1666 0.249989C15.125 0.249989 15.0833 0.208323 15.0416 0.208323L15 0.208323C14.9583 0.208323 14.875 0.208323 14.8333 0.208323C14.7916 0.208323 14.7083 0.208323 14.6666 0.208323L14.625 0.208323C14.5833 0.208323 14.5416 0.249989 14.5 0.249989C14.5 0.249989 14.4583 0.249989 14.4583 0.291655C14.4166 0.291655 14.375 0.333321 14.375 0.333321L14.3333 0.374989C14.2916 0.416657 14.2916 0.416655 14.25 0.458321L10.125 5.12499C9.83331 5.45832 9.87498 5.99999 10.2083 6.29166C10.5416 6.58332 11.0416 6.54166 11.375 6.20833L14.0833 3.12499L14.0833 18.9583C14.0833 19.4167 14.4583 19.7917 14.9166 19.7917C15.375 19.7917 15.75 19.4167 15.75 18.9583L15.75 3.16666L18.375 6.24999C18.6666 6.58332 19.2083 6.62499 19.5416 6.33332C19.7083 6.16666 19.8333 5.95832 19.8333 5.70832C19.8333 5.49999 19.75 5.33332 19.625 5.16666L15.5 0.499989C15.4583 0.458323 15.4583 0.458323 15.4166 0.416655L15.375 0.374989C15.2916 0.333323 15.25 0.333323 15.2083 0.291655Z"
        fill={svgColor}
      />
    </Svg>
  );
}

export default SwapNarrowSVG;
