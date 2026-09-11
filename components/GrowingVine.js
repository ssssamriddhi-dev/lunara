import { useEffect, useRef } from 'react';
import { Animated, Easing, View, Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';
import { PALETTE } from './Flora';

const { width } = Dimensions.get('window');
const APath = Animated.createAnimatedComponent(Path);
const AG = Animated.createAnimatedComponent(G);

const STEM = 'M0 44 C40 20, 78 58, 118 34 C156 12, 196 52, 236 30 C272 10, 312 44, 360 26';
const LEN = 520;

const BLOOMS = [
  { x: 40,  y: 30, r: 13, petal: PALETTE.plum,    heart: PALETTE.amber, n: 6, delay: 700 },
  { x: 118, y: 34, r: 16, petal: PALETTE.magenta, heart: PALETTE.cream, n: 7, delay: 950 },
  { x: 196, y: 52, r: 11, petal: PALETTE.sky,     heart: PALETTE.amber, n: 5, delay: 1200 },
  { x: 236, y: 30, r: 14, petal: PALETTE.rose,    heart: PALETTE.amber, n: 6, delay: 1400 },
  { x: 312, y: 44, r: 10, petal: PALETTE.butter,  heart: PALETTE.coral, n: 8, delay: 1650 },
];

const LEAVES = [
  { x: 76,  y: 48, rot: -28 },
  { x: 160, y: 24, rot: 34 },
  { x: 272, y: 46, rot: -20 },
  { x: 340, y: 22, rot: 26 },
];

function Bloom({ b }) {
  const a = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(a, { toValue: 1, delay: b.delay, friction: 5, tension: 70, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 2600 + b.delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: 2600 + b.delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const petals = Array.from({ length: b.n }, (_, i) => (360 / b.n) * i);

  return (
    <AG
      opacity={a}
      style={{
        transform: [
          { scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) },
          { rotate: sway.interpolate({ inputRange: [0, 1], outputRange: ['-5deg', '5deg'] }) },
        ],
      }}
    >
      {petals.map((d) => (
        <Ellipse
          key={d}
          cx={b.x}
          cy={b.y - b.r * 0.58}
          rx={b.r * 0.30}
          ry={b.r * 0.58}
          fill={b.petal}
          opacity={0.92}
          transform={`rotate(${d}, ${b.x}, ${b.y})`}
        />
      ))}
      <Circle cx={b.x} cy={b.y} r={b.r * 0.26} fill={b.heart} />
    </AG>
  );
}

export default function GrowingVine({ height = 72 }) {
  const draw = useRef(new Animated.Value(LEN)).current;
  const leaf = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(draw, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }).start();
    Animated.timing(leaf, { toValue: 1, duration: 900, delay: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={{ height, marginTop: 4 }} pointerEvents="none">
      <Svg width={width - 48} height={height} viewBox="0 0 360 72">
        <APath
          d={STEM}
          stroke={PALETTE.leaf}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={LEN}
          strokeDashoffset={draw}
          opacity={0.75}
        />
        <AG opacity={leaf}>
          {LEAVES.map((l, i) => (
            <Path
              key={i}
              d={`M${l.x} ${l.y} C${l.x - 11} ${l.y + 5}, ${l.x - 9} ${l.y + 17}, ${l.x} ${l.y + 18} C${l.x + 9} ${l.y + 17}, ${l.x + 11} ${l.y + 5}, ${l.x} ${l.y} Z`}
              fill={PALETTE.sage}
              opacity={0.8}
              transform={`rotate(${l.rot}, ${l.x}, ${l.y + 9})`}
            />
          ))}
        </AG>
        {BLOOMS.map((b, i) => <Bloom key={i} b={b} />)}
      </Svg>
    </View>
  );
}
