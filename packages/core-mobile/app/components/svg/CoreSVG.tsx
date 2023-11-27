import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Prop {
  height?: number
}

function CoreSVG({ height = 27 }: Prop) {
  return (
    <Svg width={height * 6.53} height={height} viewBox="0 0 136 27" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M121.328 5.22359H135.922V0.493631H116.459L121.328 5.22359ZM116.447 15.7436H135.393V11.2119H116.459L116.447 15.7436ZM135.91 21.5822H121.328L116.447 26.385H135.91V21.5822ZM91.8988 5.02937C94.982 5.02937 96.3731 7.10505 96.3731 9.18478C96.3731 11.2645 95.039 13.3402 91.8988 13.3402H84.443V5.04151L91.8988 5.02937ZM102.556 26.0694L94.6932 17.2245C99.6353 16.2291 101.27 12.6442 101.27 9.07957C101.27 4.58834 98.0164 0.526005 91.9151 0.485544C87.7906 0.526005 83.6661 0.485544 79.5456 0.485544V26.3809H84.4471V17.7505H89.1654L96.7433 26.3971H102.572L102.556 26.0694ZM50.6049 4.45077C56.7348 4.45077 59.1875 9.30616 59.1143 13.6881C59.037 17.9366 56.7348 22.5169 50.6049 22.5169C44.4751 22.5169 42.1729 17.973 42.0631 13.7246C41.9532 9.36281 44.4792 4.45077 50.6049 4.45077ZM50.6049 0C41.6156 0 37.2349 6.83396 37.2349 13.6315C37.2349 20.429 41.4692 26.9838 50.6049 26.9838C59.7407 26.9838 63.8652 20.2955 63.9425 13.6072C64.0157 6.85014 59.5576 0.0161881 50.6049 0.0161881V0ZM20.3545 19.7817C18.5906 21.452 16.2532 22.391 13.8179 22.4076C7.39116 22.4076 4.90181 17.9366 4.86927 13.6477C4.83673 9.35876 7.52132 4.68141 13.7976 4.68141C16.1276 4.64687 18.3793 5.51784 20.0738 7.1091L23.3279 3.96928C22.0784 2.71522 20.5913 1.72012 18.9526 1.04158C17.314 0.363028 15.5563 0.0145079 13.7813 0.0161881C4.38523 0.0161881 -0.0484122 6.89465 0.000398558 13.6477C0.0492093 20.4007 4.12491 27 13.7813 27C17.5316 27 20.989 25.7862 23.6614 23.1562L20.3545 19.7817Z"
        fill="white"
      />
    </Svg>
  )
}

export default CoreSVG