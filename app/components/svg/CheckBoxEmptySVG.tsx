import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Prop {
  fillColor?: string
  size?: number
}

export default function CheckBoxEmptySVG({
  fillColor = 'white',
  size = 24
}: Prop) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H18C18.55 5 19 5.45 19 6V18C19 18.55 18.55 19 18 19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
        fill={fillColor}
      />
    </Svg>
  )
}