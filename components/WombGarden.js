import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';
import { COLORS } from '../constants/theme';
import { PALETTE } from './Flora';

const AG = Animated.createAnimatedComponent(G);

function Rosette({ cx, cy, r, petal, heart, petals = 8, rot = 0 }) {
  const steps = Array.from({ length: petals }, (_, i) => (360 / petals) * i + rot);
  return (
    <G>
      {steps.map((d) => (
        <Ellipse key={d} cx={cx} cy={cy - r * 0.62} rx={r * 0.3} ry={r * 0.62}
          fill={petal} opacity={0.92} transform={`rotate(${d}, ${cx}, ${cy})`} />
      ))}
      <Circle cx={cx} cy={cy} r={r * 0.26} fill={heart} />
    </G>
  );
}

function Magnolia({ cx, cy, s, a = PALETTE.blush, b = PALETTE.magenta }) {
  return (
    <G>
      {[0, 72, 144, 216, 288].map((d, i) => (
        <Path key={d}
          d={`M${cx} ${cy} C${cx - s * 0.55} ${cy - s * 0.35}, ${cx - s * 0.45} ${cy - s} , ${cx} ${cy - s * 1.1} C${cx + s * 0.45} ${cy - s}, ${cx + s * 0.55} ${cy - s * 0.35}, ${cx} ${cy} Z`}
          fill={i % 2 ? a : b} opacity={0.9} transform={`rotate(${d}, ${cx}, ${cy})`} />
      ))}
      <Circle cx={cx} cy={cy} r={s * 0.2} fill={PALETTE.amber} />
    </G>
  );
}

export default function WombGarden({ size = 240, opacity = 1, animate = true, style }) {
  const breathe = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!animate) return;
    const loop = (v, to, from, ms) =>
      Animated.loop(Animated.sequence([
        Animated.timing(v, { toValue: to, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: from, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
    loop(breathe, 1, 0, 4000);
    loop(shimmer, 1, 0.45, 2400);
  }, [animate]);

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });

  return (
    <View style={style} pointerEvents="none">
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Svg width={size} height={size} viewBox="0 0 220 240">

          <AG opacity={shimmer}>
            <Circle cx="56" cy="34" r="4" stroke={COLORS.gold} strokeWidth="1" fill="none" />
            <Path d="M80 26 A7 7 0 0 1 80 40 A4 7 0 0 0 80 26" fill={COLORS.gold} />
            <Circle cx="110" cy="20" r="8.5" fill={COLORS.gold} />
            <Path d="M140 26 A7 7 0 0 0 140 40 A4 7 0 0 1 140 26" fill={COLORS.gold} />
            <Circle cx="164" cy="34" r="4" stroke={COLORS.gold} strokeWidth="1" fill="none" />
            <Circle cx="68" cy="16" r="1.1" fill={COLORS.gold} />
            <Circle cx="152" cy="16" r="1.1" fill={COLORS.gold} />
            <Circle cx="110" cy="6" r="1.3" fill={COLORS.gold} />
          </AG>

          <G stroke={COLORS.ink} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M82 84 C75 112, 90 134, 101 152 C104 159, 104 170, 103 182 L117 182 C116 170, 116 159, 119 152 C130 134, 145 112, 138 84 C127 73, 93 73, 82 84 Z" />
            <Path d="M101 170 L119 170" strokeWidth="1" opacity={0.45} />
            <Path d="M82 86 C64 72, 44 68, 33 79 C27 87, 30 97, 40 99" />
            <Path d="M138 86 C156 72, 176 68, 187 79 C193 87, 190 97, 180 99" />
          </G>

          <G opacity={0.4}>
            <Path d="M105 100 C105 118, 110 130, 110 144" stroke={COLORS.ink} strokeWidth="0.8" fill="none" />
            <Path d="M115 100 C115 118, 110 130, 110 144" stroke={COLORS.ink} strokeWidth="0.8" fill="none" />
          </G>

          <G stroke={PALETTE.leaf} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity={0.85}>
            <Path d="M110 152 C104 138, 96 126, 92 112" />
            <Path d="M110 150 C118 138, 126 128, 130 116" />
            <Path d="M100 132 C92 130, 86 124, 84 116" />
            <Path d="M120 138 C128 136, 134 130, 136 122" />
          </G>
          {[[86, 112], [132, 114], [96, 126], [126, 130]].map(([x, y], i) => (
            <Path key={i} d={`M${x} ${y} C${x - 9} ${y + 4}, ${x - 7} ${y + 14}, ${x} ${y + 15} C${x + 7} ${y + 14}, ${x + 9} ${y + 4}, ${x} ${y} Z`}
              fill={PALETTE.sage} opacity={0.75} />
          ))}

          <Magnolia cx={34} cy={100} s={26} />
          <Magnolia cx={186} cy={100} s={26} a={PALETTE.rose} b={PALETTE.plum} />

          <Rosette cx={62} cy={126} r={22} petal={PALETTE.plum} heart={COLORS.ink} petals={9} />
          <Rosette cx={158} cy={124} r={20} petal={PALETTE.magenta} heart={PALETTE.amber} petals={7} rot={12} />
          <Rosette cx={110} cy={72} r={19} petal={PALETTE.coral} heart={PALETTE.amber} petals={8} />
          <Rosette cx={84} cy={162} r={15} petal={PALETTE.butter} heart={PALETTE.amber} petals={10} />
          <Rosette cx={140} cy={158} r={14} petal={PALETTE.sky} heart={PALETTE.cream} petals={6} rot={20} />
          <Rosette cx={44} cy={150} r={12} petal={PALETTE.blush} heart={PALETTE.amber} petals={8} />
          <Rosette cx={176} cy={146} r={11} petal={PALETTE.teal} heart={PALETTE.cream} petals={7} />

          <G stroke={COLORS.gold} strokeWidth="1.1" fill="none" strokeLinecap="round" opacity={0.75}>
            <Path d="M110 182 C110 194, 107 206, 102 216" />
            <Path d="M109 192 C99 190, 90 195, 85 204" />
            <Path d="M111 200 C121 198, 130 203, 135 212" />
            <Path d="M85 204 C81 197, 81 190, 85 185" />
            <Path d="M135 212 C139 205, 139 198, 135 193" />
            <Circle cx="102" cy="219" r="2.4" />
          </G>

        </Svg>
      </Animated.View>
    </View>
  );
}
