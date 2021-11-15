import {useMemo, useRef} from 'react';
import {Animated, Platform, Vibration} from 'react-native';

export function useJigglyPinIndicator(): {
  jiggleAnim: Animated.Value;
  fireJiggleAnimation: () => void;
} {
  const jiggleAnim = useRef(new Animated.Value(0)).current;

  const wrongPinAnim = useMemo(() => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(jiggleAnim, {
          toValue: 20,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(jiggleAnim, {
          toValue: -20,
          duration: 60,
          useNativeDriver: true,
        }),
      ]),
      {},
    );
  }, []);

  function vibratePhone() {
    Vibration.vibrate(
      Platform.OS === 'android'
        ? [0, 150, 10, 150, 10, 150, 10, 150, 10, 150]
        : [0, 10, 10, 10, 10],
    );
  }

  function fireJiggleAnimation() {
    wrongPinAnim.start();
    setTimeout(() => {
      wrongPinAnim.reset();
      jiggleAnim.setValue(0);
    }, 800);
    vibratePhone();
  }

  return {
    jiggleAnim,
    fireJiggleAnimation,
  };
}