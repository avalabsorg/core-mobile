import React, {useContext} from 'react';
import Svg, {Path} from 'react-native-svg';
import {useApplicationContext} from 'contexts/ApplicationContext';

export default function SplashLogoSVG(): JSX.Element {
  const {isDarkMode} = useApplicationContext();
  const color = isDarkMode ? '#ffffff' : '#000000';

  return (
    <Svg width="200" height="40" viewBox="0 0 200 40" fill="none">
      <Path
        d="M53.8423 13.0404H56.0059L62.0601 26.9839H59.2017L57.8917 23.7934H51.7978L50.5274 26.9839H47.7286L53.8423 13.0404ZM57.0182 21.6664L54.8546 15.9945L52.6513 21.6664H57.0182Z"
        fill={color}
      />
      <Path
        d="M64.7428 13.0404H67.621L71.4519 23.5768L75.4019 13.0404H78.1018L72.4246 26.9839H70.2611L64.7428 13.0404Z"
        fill={color}
      />
      <Path
        d="M87.0398 13.0404H89.2039L95.2575 26.9839H92.3993L91.0895 23.7934H84.9954L83.7248 26.9839H80.9264L87.0398 13.0404ZM90.2159 21.6664L88.0524 15.9945L85.849 21.6664H90.2159Z"
        fill={color}
      />
      <Path
        d="M100.79 13.0404H103.291V24.7387H109.265V26.9839H100.79V13.0404Z"
        fill={color}
      />
      <Path
        d="M119.598 13.0404H121.762L127.815 26.9839H124.957L123.647 23.7934H117.553L116.283 26.9839H113.484L119.598 13.0404ZM122.774 21.6664L120.61 15.9945L118.407 21.6664H122.774Z"
        fill={color}
      />
      <Path
        d="M133.348 13.0404H136.663L143.471 23.3996H143.511V13.0404H146.011V26.9839H142.836L135.888 16.2899H135.849V26.9839H133.348V13.0404Z"
        fill={color}
      />
      <Path
        d="M162.763 16.3096C162.247 15.7582 161.744 15.3906 161.254 15.2068C160.778 15.023 160.294 14.931 159.805 14.931C159.077 14.931 158.416 15.0624 157.82 15.3249C157.238 15.5744 156.735 15.9289 156.311 16.3884C155.888 16.8348 155.557 17.36 155.319 17.9639C155.094 18.5679 154.982 19.2178 154.982 19.9137C154.982 20.662 155.094 21.3513 155.319 21.9815C155.557 22.6118 155.888 23.1566 156.311 23.6162C156.735 24.0757 157.238 24.4367 157.82 24.6993C158.416 24.9619 159.077 25.0932 159.805 25.0932C160.374 25.0932 160.923 24.9619 161.453 24.6993C161.995 24.4236 162.498 23.9903 162.961 23.3995L165.026 24.8569C164.39 25.7234 163.616 26.3537 162.703 26.7475C161.79 27.1414 160.817 27.3383 159.785 27.3383C158.7 27.3383 157.701 27.1676 156.788 26.8263C155.888 26.4718 155.108 25.9794 154.446 25.3492C153.797 24.7059 153.287 23.9378 152.917 23.045C152.547 22.1522 152.361 21.161 152.361 20.0712C152.361 18.9552 152.547 17.9443 152.917 17.0383C153.287 16.1193 153.797 15.3381 154.446 14.6948C155.108 14.0514 155.888 13.559 156.788 13.2177C157.701 12.8632 158.7 12.6859 159.785 12.6859C160.738 12.6859 161.618 12.8566 162.425 13.198C163.245 13.5262 164.006 14.0908 164.708 14.8917L162.763 16.3096Z"
        fill={color}
      />
      <Path
        d="M170.674 13.0404H173.175V18.5942H179.745V13.0404H182.246V26.9839H179.745V20.8393H173.175V26.9839H170.674V13.0404Z"
        fill={color}
      />
      <Path
        d="M189.357 13.0404H198.666V15.2855H191.858V18.7123H198.309V20.9574H191.858V24.7387H199.024V26.9839H189.357V13.0404Z"
        fill={color}
      />
      <Path
        d="M14.5 9.5L19.5 4.5L28.5 11L35 30L19.5 32L5.5 29L14.5 9.5Z"
        fill="#ffffff"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.1688 40C31.3017 40 40.3267 31.0457 40.3267 20C40.3267 8.95431 31.3017 0 20.1688 0C9.03586 0 0.0108643 8.95431 0.0108643 20C0.0108643 31.0457 9.03586 40 20.1688 40ZM14.078 29.0609H9.3491C8.22792 29.0609 7.6673 29.0609 7.33156 28.8454C6.96872 28.6127 6.73979 28.222 6.71555 27.7943C6.69305 27.3984 6.97071 26.9157 7.52604 25.9505L7.52629 25.9502L17.8799 7.95394C18.4433 6.97441 18.7251 6.48464 19.0837 6.30232C19.4709 6.10536 19.9302 6.10502 20.3178 6.30145C20.6766 6.48322 20.9591 6.97261 21.524 7.95128L23.9119 12.0878L23.912 12.0879C24.3228 12.7995 24.5282 13.1554 24.6185 13.5308C24.7168 13.9395 24.717 14.3653 24.6191 14.774C24.5291 15.1495 24.324 15.5056 23.9137 16.2176L17.7224 26.9638C17.3062 27.6862 17.0981 28.0475 16.813 28.3175C16.5026 28.6114 16.1262 28.828 15.7148 28.9494C15.3368 29.0609 14.9172 29.0609 14.078 29.0609ZM30.9491 29.0609H25.4665C24.3352 29.0609 23.7695 29.0609 23.4327 28.8436C23.0688 28.6088 22.8405 28.2152 22.819 27.7854C22.7991 27.3876 23.0838 26.9029 23.6532 25.9338L26.3899 21.2752C26.9522 20.3183 27.2333 19.8399 27.5892 19.6606C27.9738 19.467 28.4286 19.4666 28.8136 19.6597C29.1698 19.8384 29.4516 20.3165 30.015 21.2725L30.0152 21.2728L32.761 25.9312C33.3326 26.901 33.6184 27.3859 33.5989 27.784C33.5777 28.2142 33.3496 28.6082 32.9855 28.8433C32.6487 29.0609 32.0822 29.0609 30.9491 29.0609Z"
        fill="#E84142"
      />
    </Svg>
  );
}