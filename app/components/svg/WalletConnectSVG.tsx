import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useApplicationContext } from 'contexts/ApplicationContext'

interface Prop {
  color?: string
  size?: number
}

function WalletConnectSVG({ size = 24, color }: Prop) {
  const theme = useApplicationContext().theme
  const bgColor = color ?? theme.colorBg1

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.09445 8.38542C9.35595 5.20486 14.6441 5.20486 17.9056 8.38542L18.2981 8.7682C18.4612 8.92719 18.4612 9.18504 18.2981 9.34403L16.9553 10.6535C16.8738 10.733 16.7416 10.733 16.6601 10.6535L16.1199 10.1267C13.8445 7.90791 10.1555 7.90791 7.88012 10.1267L7.30161 10.6908C7.22006 10.7703 7.08789 10.7703 7.00634 10.6908L5.66358 9.38138C5.50047 9.22239 5.50047 8.96454 5.66358 8.80554L6.09445 8.38542ZM20.6826 11.0934L21.8777 12.2588C22.0408 12.4178 22.0408 12.6757 21.8777 12.8347L16.489 18.0895C16.3259 18.2486 16.0615 18.2486 15.8984 18.0895L12.0739 14.36C12.0331 14.3202 11.967 14.3202 11.9262 14.36L8.10169 18.0895C7.93865 18.2486 7.67425 18.2486 7.51114 18.0895L2.12231 12.8346C1.95923 12.6756 1.95923 12.4177 2.12231 12.2587L3.31739 11.0933C3.48047 10.9343 3.74487 10.9343 3.90795 11.0933L7.73256 14.8229C7.77333 14.8627 7.83942 14.8627 7.88019 14.8229L11.7047 11.0933C11.8677 10.9343 12.1321 10.9343 12.2952 11.0933L16.1198 14.8229C16.1606 14.8627 16.2267 14.8627 16.2675 14.8229L20.0921 11.0934C20.2551 10.9344 20.5195 10.9344 20.6826 11.0934Z"
        fill={bgColor}
      />
    </Svg>
  )
}

export default WalletConnectSVG
