import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  LayoutChangeEvent,
  NativeModules,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { NFTStackParamList } from 'navigation/wallet/NFTScreenStack'
import { getColorFromURL } from 'rn-dominant-color'
import LinearGradientSVG from 'components/svg/LinearGradientSVG'
import { useApplicationContext } from 'contexts/ApplicationContext'
import { orientation } from 'react-native-sensors'
import { filter, map, sampleTime, tap } from 'rxjs'
import AppNavigation from 'navigation/AppNavigation'

const SAMPLE_TIME = 50

export default function NftFullScreen() {
  const { theme } = useApplicationContext()
  const { params } =
    useRoute<
      RouteProp<NFTStackParamList, typeof AppNavigation.Nft.FullScreen>
    >()
  const imageUrl = params?.url as string
  const imageUrlSmall = params?.urlSmall as string
  const [grabbedBgColor, setGrabbedBgColor] = useState('black')
  const windowWidth = useMemo(() => Dimensions.get('window').width - 32, [])
  const [imageAspect, setImageAspect] = useState(0)
  const [shimmerSize, setShimmerSize] = useState({ w: 0, h: 0 })

  const [sensorData, setSensorData] = useState({
    pitch: 0,
    roll: 0
  })
  const transformValue = useRef({
    pitch: new Animated.Value(0),
    roll: new Animated.Value(0)
  })
  const diff = useRef({ pitch: 0, roll: 0 })

  useEffect(() => {
    if (Platform.OS === 'android') {
      const { FullScreenActivity } = NativeModules
      FullScreenActivity.onCreate()
      return () => {
        FullScreenActivity.onDestroy()
      }
    }
  }, [])

  useEffect(() => {
    const subscription = orientation
      .pipe(
        // @ts-expect-error: looks like this ts error is due to react native sensor using deprecated rxjs methods
        sampleTime(SAMPLE_TIME),
        filter(
          value =>
            Math.abs(diff.current.pitch - value.pitch) > 0.001 ||
            Math.abs(diff.current.roll - value.roll) > 0.001
        ),
        tap(sensorData => {
          diff.current.pitch = sensorData.pitch
          diff.current.roll = sensorData.roll
        }),
        map(value => {
          return {
            pitch: value.pitch,
            roll: value.roll < -0.8 ? -0.8 : value.roll > 0.8 ? 0.8 : value.roll // constrain for when device is upside-down
          }
        })
      )
      .subscribe(value => {
        setSensorData({
          pitch: isNaN(value.pitch) ? 0 : value.pitch,
          roll: isNaN(value.roll) ? 0 : value.roll
        })
      })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    Animated.timing(transformValue.current.pitch, {
      toValue: sensorData.pitch,
      duration: SAMPLE_TIME - 1,
      easing: Easing.linear,
      useNativeDriver: true
    }).start()
    Animated.timing(transformValue.current.roll, {
      toValue: sensorData.roll,
      duration: SAMPLE_TIME - 1,
      easing: Easing.linear,
      useNativeDriver: true
    }).start()
  }, [sensorData])

  useEffect(() => {
    getColorFromURL(imageUrlSmall).then(colors => {
      setGrabbedBgColor(
        Platform.OS === 'ios' ? colors.secondary : colors.background
      )
    })
  }, [imageUrlSmall])

  useEffect(() => {
    Image.getSize(imageUrl, (width, height) => setImageAspect(height / width))
  }, [imageUrl])

  const calculateShimmerMaskSize = (event: LayoutChangeEvent) => {
    // we need separate view for shimmer because iOS removes shadow if parent view has overflow: 'hidden'
    setShimmerSize({
      w: event.nativeEvent.layout.width,
      h: event.nativeEvent.layout.height
    })
  }

  return (
    <View style={[styles.container]}>
      <StatusBar translucent backgroundColor={theme.transparent} />
      <View style={styles.absolute}>
        <LinearGradientSVG
          colorFrom={grabbedBgColor}
          colorTo={grabbedBgColor}
          opacityFrom={0.8}
          opacityTo={0.3}
        />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Animated.View
          style={{
            borderRadius: 8,
            elevation: 10,
            shadowColor: 'black',
            shadowRadius: 10,
            shadowOpacity: 0.5,
            shadowOffset: { width: 0, height: 6 },
            transform: [
              {
                rotateX: transformValue.current.pitch.interpolate({
                  inputRange: Platform.OS === 'ios' ? [0, 1.5] : [-1.57, 0],
                  outputRange: ['10deg', '-10deg']
                })
              },
              {
                rotateY: transformValue.current.roll.interpolate({
                  inputRange: [-0.8, 0.8],
                  outputRange: ['20deg', '-20deg']
                })
              }
            ]
          }}>
          <Image
            onLayout={calculateShimmerMaskSize}
            style={[
              styles.imageStyle,
              { width: windowWidth, height: windowWidth * imageAspect }
            ]}
            source={{ uri: imageUrl }}
          />
          <View
            style={{
              borderRadius: 8,
              position: 'absolute',
              width: shimmerSize.w,
              height: shimmerSize.h,
              overflow: 'hidden'
            }}>
            <Animated.View
              style={{
                width: 300,
                height: 600,
                transform: [
                  { rotateZ: '-45deg' },
                  { translateY: 0 },
                  { scaleY: 1.5 },
                  {
                    translateX: transformValue.current.pitch.interpolate({
                      inputRange: Platform.OS === 'ios' ? [0, 2] : [-1.57, 0.5],
                      outputRange: [-5000, 5500]
                    })
                  }
                ]
              }}>
              <LinearGradientSVG
                orientation={'horizontal'}
                loop={true}
                colorTo={'#ffffff'}
                colorFrom={'#000000'}
                opacityTo={1}
                opacityFrom={0}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  imgContainer: {
    elevation: 5,
    margin: 16,
    justifyContent: 'space-evenly'
  },
  imageStyle: {
    borderRadius: 8,
    resizeMode: 'contain'
  },
  absolute: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
})