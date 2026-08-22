import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';
import { View } from 'react-native';
import { COLORS } from '../constants/theme';

export function Bloom({ size = 120, color = COLORS.gold, opacity = 0.35, style }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G stroke={color} strokeWidth="1" fill="none" opacity={opacity}>
          <Path d="M50 88 C50 70, 50 58, 50 48" />
          <Path d="M50 48 C38 44, 26 34, 22 20" />
          <Path d="M50 48 C62 44, 74 34, 78 20" />
          <Circle cx="22" cy="18" r="5" />
          <Circle cx="78" cy="18" r="5" />
          <Path d="M50 48 C42 52, 38 62, 42 72" />
          <Path d="M50 48 C58 52, 62 62, 58 72" />
          <Ellipse cx="50" cy="80" rx="7" ry="10" />
          <Path d="M43 62 C36 60, 30 64, 28 70" />
          <Path d="M57 62 C64 60, 70 64, 72 70" />
        </G>
      </Svg>
    </View>
  );
}

export function MoonPhases({ width = 160, color = COLORS.slate, opacity = 0.5, style }) {
  const r = 7;
  const gap = 26;
  return (
    <View style={style} pointerEvents="none">
      <Svg width={width} height={20} viewBox="0 0 160 20">
        <G opacity={opacity}>
          <Circle cx="12" cy="10" r={r} fill="none" stroke={color} strokeWidth="0.9" />
          <Path d={`M${12 + gap} 3 A ${r} ${r} 0 0 1 ${12 + gap} 17 A 4 ${r} 0 0 0 ${12 + gap} 3`} fill={color} />
          <Circle cx={12 + gap * 2} cy="10" r={r} fill={color} />
          <Path d={`M${12 + gap * 3} 3 A ${r} ${r} 0 0 0 ${12 + gap * 3} 17 A 4 ${r} 0 0 1 ${12 + gap * 3} 3`} fill={color} />
          <Circle cx={12 + gap * 4} cy="10" r={r} fill="none" stroke={color} strokeWidth="0.9" />
        </G>
      </Svg>
    </View>
  );
}

export function Sprig({ size = 90, color = COLORS.sage || COLORS.slate, opacity = 0.3, flip = false, style }) {
  return (
    <View style={[style, flip && { transform: [{ scaleX: -1 }] }]} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <G stroke={color} strokeWidth="1" fill="none" opacity={opacity} strokeLinecap="round">
          <Path d="M12 74 C24 58, 34 40, 40 18" />
          <Path d="M24 56 C16 52, 12 44, 13 36" />
          <Path d="M28 46 C36 44, 42 38, 44 30" />
          <Path d="M33 34 C25 30, 22 22, 23 15" />
          <Path d="M37 26 C45 24, 50 18, 51 11" />
          <Circle cx="40" cy="14" r="3.5" />
        </G>
      </Svg>
    </View>
  );
}

export function CornerVine({ size = 200, color = COLORS.gold, opacity = 0.14, style }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 160 160">
        <G stroke={color} strokeWidth="1.1" fill="none" opacity={opacity} strokeLinecap="round">
          <Path d="M160 0 C120 20, 90 50, 72 92 C62 116, 58 138, 58 160" />
          <Path d="M118 34 C112 20, 114 8, 124 0" />
          <Path d="M126 42 C140 40, 150 32, 154 20" />
          <Path d="M96 66 C88 54, 88 40, 96 30" />
          <Path d="M104 74 C118 74, 128 66, 132 54" />
          <Path d="M78 104 C68 94, 66 80, 72 68" />
          <Path d="M86 112 C100 114, 112 108, 118 96" />
          <Circle cx="124" cy="2" r="4" />
          <Circle cx="96" cy="28" r="4" />
          <Circle cx="72" cy="66" r="4" />
        </G>
      </Svg>
    </View>
  );
}

export function Halo({ size = 300, color = COLORS.gold, opacity = 0.1, style }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <G stroke={color} fill="none" opacity={opacity}>
          <Circle cx="100" cy="100" r="96" strokeWidth="0.8" />
          <Circle cx="100" cy="100" r="80" strokeWidth="0.6" strokeDasharray="2 6" />
          <Circle cx="100" cy="100" r="62" strokeWidth="0.5" />
        </G>
      </Svg>
    </View>
  );
}
