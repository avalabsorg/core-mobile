import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useApplicationContext } from 'contexts/ApplicationContext'

interface Prop {
  color?: string
  testID?: string
}

function MenuSVG({ color }: Prop) {
  const context = useApplicationContext()

  const iconColor = color ?? context.theme.colorIcon1
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      testID="menu_svg">
      <Path
        d="M3.0128 5.0001C2.88048 4.99823 2.7491 5.02271 2.62631 5.07212C2.50351 5.12153 2.39175 5.1949 2.29752 5.28794C2.20328 5.38098 2.12845 5.49186 2.07738 5.61411C2.0263 5.73637 2 5.86757 2 6.0001C2 6.13263 2.0263 6.26383 2.07738 6.38609C2.12845 6.50834 2.20328 6.61922 2.29752 6.71226C2.39175 6.8053 2.50351 6.87867 2.62631 6.92808C2.7491 6.97749 2.88048 7.00197 3.0128 7.0001H20.9872C21.1195 7.00197 21.2509 6.97749 21.3737 6.92808C21.4965 6.87867 21.6082 6.8053 21.7025 6.71226C21.7967 6.61922 21.8715 6.50834 21.9226 6.38609C21.9737 6.26383 22 6.13263 22 6.0001C22 5.86757 21.9737 5.73637 21.9226 5.61411C21.8715 5.49186 21.7967 5.38098 21.7025 5.28794C21.6082 5.1949 21.4965 5.12153 21.3737 5.07212C21.2509 5.02271 21.1195 4.99823 20.9872 5.0001H3.0128ZM3.0128 11.0001C2.88048 10.9982 2.7491 11.0227 2.62631 11.0721C2.50351 11.1215 2.39175 11.1949 2.29752 11.2879C2.20328 11.381 2.12845 11.4919 2.07738 11.6141C2.0263 11.7364 2 11.8676 2 12.0001C2 12.1326 2.0263 12.2638 2.07738 12.3861C2.12845 12.5083 2.20328 12.6192 2.29752 12.7123C2.39175 12.8053 2.50351 12.8787 2.62631 12.9281C2.7491 12.9775 2.88048 13.002 3.0128 13.0001H20.9872C21.1195 13.002 21.2509 12.9775 21.3737 12.9281C21.4965 12.8787 21.6082 12.8053 21.7025 12.7123C21.7967 12.6192 21.8715 12.5083 21.9226 12.3861C21.9737 12.2638 22 12.1326 22 12.0001C22 11.8676 21.9737 11.7364 21.9226 11.6141C21.8715 11.4919 21.7967 11.381 21.7025 11.2879C21.6082 11.1949 21.4965 11.1215 21.3737 11.0721C21.2509 11.0227 21.1195 10.9982 20.9872 11.0001H3.0128ZM3.0128 17.0001C2.88048 16.9982 2.7491 17.0227 2.62631 17.0721C2.50351 17.1215 2.39175 17.1949 2.29752 17.2879C2.20328 17.381 2.12845 17.4919 2.07738 17.6141C2.0263 17.7364 2 17.8676 2 18.0001C2 18.1326 2.0263 18.2638 2.07738 18.3861C2.12845 18.5083 2.20328 18.6192 2.29752 18.7123C2.39175 18.8053 2.50351 18.8787 2.62631 18.9281C2.7491 18.9775 2.88048 19.002 3.0128 19.0001H20.9872C21.1195 19.002 21.2509 18.9775 21.3737 18.9281C21.4965 18.8787 21.6082 18.8053 21.7025 18.7123C21.7967 18.6192 21.8715 18.5083 21.9226 18.3861C21.9737 18.2638 22 18.1326 22 18.0001C22 17.8676 21.9737 17.7364 21.9226 17.6141C21.8715 17.4919 21.7967 17.381 21.7025 17.2879C21.6082 17.1949 21.4965 17.1215 21.3737 17.0721C21.2509 17.0227 21.1195 16.9982 20.9872 17.0001H3.0128Z"
        fill={iconColor}
      />
    </Svg>
  )
}

export default MenuSVG