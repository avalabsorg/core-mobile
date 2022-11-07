import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useApplicationContext } from 'contexts/ApplicationContext'

interface Prop {
  color?: string
}

function ShareSVG({ color }: Prop) {
  const context = useApplicationContext()

  const iconColor = color ?? context.theme.colorIcon1
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 16.12C17.24 16.12 16.56 16.42 16.04 16.89L8.91 12.74C8.96 12.51 9 12.28 9 12.04C9 11.8 8.96 11.57 8.91 11.34L15.96 7.23004C16.5 7.73004 17.21 8.04004 18 8.04004C19.66 8.04004 21 6.70004 21 5.04004C21 3.38004 19.66 2.04004 18 2.04004C16.34 2.04004 15 3.38004 15 5.04004C15 5.28004 15.04 5.51004 15.09 5.74004L8.04 9.85004C7.5 9.35004 6.79 9.04004 6 9.04004C4.34 9.04004 3 10.38 3 12.04C3 13.7 4.34 15.04 6 15.04C6.79 15.04 7.5 14.73 8.04 14.23L15.16 18.39C15.11 18.6 15.08 18.82 15.08 19.04C15.08 20.65 16.39 21.96 18 21.96C19.61 21.96 20.92 20.65 20.92 19.04C20.92 17.43 19.61 16.12 18 16.12Z"
        fill={iconColor}
      />
    </Svg>
  )
}

export default ShareSVG
