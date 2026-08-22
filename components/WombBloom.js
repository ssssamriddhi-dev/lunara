import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const AG = Animated.createAnimatedComponent(G);

function Petals({ cx, cy, color, r = 9 }) {
  return (
    <G>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <Ellipse
          key={deg}
          cx={cx}
          cy={cy - r}
          rx={3.6}
          ry={r * 0.72}
          transform={`rotate(${deg}, ${cx}, ${cy})`}
          stroke={color}
          strokeWidth="0.9"
          fill="none"
        />
      ))}
      <Circle cx={cx} cy={cy} r="2.4" fill={color} opacity={0.85} />
    </G>
  );
}

export default function WombBloom({
  size = 220,
  ink = COLORS.ink,
  accent = COLORS.gold,
  bloom = COLORS.terracotta,
  opacity = 1,
  animate = true,
  style,
}) {
  const breathe = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 3800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 3800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0.45, duration: 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, [animate]);

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] });

  return (
    <View style={style} pointerEvents="none">
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Svg width={size} height={size} viewBox="0 0 200 200">

          <AG opacity={shimmer}>
            <Circle cx="60" cy="40" r="4.5" stroke={accent} strokeWidth="0.9" fill="none" />
            <Path d="M80 32 A6.5 6.5 0 0 1 80 45 A3.6 6.5 0 0 0 80 32" fill={accent} />
            <Circle cx="100" cy="26" r="7.5" fill={accent} />
            <Path d="M120 32 A6.5 6.5 0 0 0 120 45 A3.6 6.5 0 0 1 120 32" fill={accent} />
            <Circle cx="140" cy="40" r="4.5" stroke={accent} strokeWidth="0.9" fill="none" />
            <Circle cx="70" cy="22" r="1" fill={accent} />
            <Circle cx="130" cy="22" r="1" fill={accent} />
            <Circle cx="100" cy="12" r="1.2" fill={accent} />
          </AG>

          <G stroke={ink} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M74 74 C68 100, 82 120, 92 136 C95 142, 95 152, 94 162 L106 162 C105 152, 105 142, 108 136 C118 120, 132 100, 126 74 C116 64, 84 64, 74 74 Z" />
            <Path d="M92 150 L108 150" strokeWidth="1" opacity={0.5} />
            <Path d="M74 76 C58 64, 40 60, 30 70 C24 77, 27 87, 36 89" />
            <Path d="M126 76 C142 64, 160 60, 170 70 C176 77, 173 87, 164 89" />
          </G>

          <G opacity={0.55}>
            <Path d="M96 90 C96 104, 100 116, 100 128" stroke={ink} strokeWidth="0.8" fill="none" />
            <Path d="M104 90 C104 104, 100 116, 100 128" stroke={ink} strokeWidth="0.8" fill="none" />
          </G>

          <Petals cx={30} cy={92} color={bloom} r={11} />
          <Petals cx={170} cy={92} color={bloom} r={11} />

          <G stroke={accent} strokeWidth="1" fill="none" strokeLinecap="round" opacity={0.8}>
            <Path d="M100 162 C100 172, 98 182, 94 190" />
            <Path d="M99 170 C90 168, 82 172, 78 180" />
            <Path d="M101 178 C110 176, 118 180, 122 188" />
            <Path d="M78 180 C74 174, 74 168, 78 163" />
            <Path d="M122 188 C126 182, 126 176, 122 171" />
            <Circle cx="94" cy="192" r="2.6" />
          </G>

          <G stroke={bloom} strokeWidth="0.9" fill="none" opacity={0.6}>
            <Path d="M84 108 C74 106, 66 110, 62 118" />
            <Path d="M116 108 C126 106, 134 110, 138 118" />
            <Path d="M62 118 C58 113, 58 107, 62 103" />
            <Path d="M138 118 C142 113, 142 107, 138 103" />
          </G>

        </Svg>
      </Animated.View>
    </View>
  );
}
