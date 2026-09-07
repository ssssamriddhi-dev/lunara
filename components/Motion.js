import { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { PALETTE } from './Flora';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

/* Petals drifting slowly down the screen */
function Petal({ x, size, delay, dur, tint }) {
  const fall = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(fall, { toValue: 1, duration: dur, delay, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x,
        opacity: fall.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 0.5, 0.4, 0] }),
        transform: [
          { translateY: fall.interpolate({ inputRange: [0, 1], outputRange: [-40, 900] }) },
          { translateX: sway.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] }) },
          { rotate: fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '260deg'] }) },
        ],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Path d="M20 4 C10 12, 8 26, 20 36 C32 26, 30 12, 20 4 Z" fill={tint} />
        <Path d="M20 8 C15 16, 15 27, 20 34" stroke="#FFF" strokeWidth="1.2" fill="none" opacity="0.5" />
      </Svg>
    </Animated.View>
  );
}

const TINTS = [PALETTE.blush, PALETTE.rose, PALETTE.plum, COLORS.petal, PALETTE.magenta];

export function PetalFall({ count = 7 }) {
  const petals = useRef(
    Array.from({ length: count }, (_, i) => ({
      x: (width / count) * i + Math.random() * 30,
      size: 16 + Math.random() * 14,
      delay: Math.random() * 9000,
      dur: 14000 + Math.random() * 9000,
      tint: TINTS[i % TINTS.length],
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {petals.map((p, i) => <Petal key={i} {...p} />)}
    </View>
  );
}

/* A flower that opens when tapped/selected */
export function BloomPulse({ active, size = 22, color = COLORS.orchid }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(a, { toValue: active ? 1 : 0, friction: 5, tension: 90, useNativeDriver: true }).start();
  }, [active]);

  return (
    <Animated.View
      style={{
        transform: [
          { scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
          { rotate: a.interpolate({ inputRange: [0, 1], outputRange: ['-40deg', '0deg'] }) },
        ],
        opacity: a,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <G>
          {[0, 72, 144, 216, 288].map((d) => (
            <Path key={d} d="M20 20 C13 15, 13 6, 20 2 C27 6, 27 15, 20 20 Z"
              fill={color} opacity={0.9} transform={`rotate(${d}, 20, 20)`} />
          ))}
          <Circle cx="20" cy="20" r="3.4" fill={PALETTE.amber} />
        </G>
      </Svg>
    </Animated.View>
  );
}

/* Soft breathing glow behind anything */
export function Shimmer({ children, style }) {
  const g = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(g, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(g, { toValue: 0.4, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[style, { opacity: g }]}>{children}</Animated.View>;
}
