import Svg, { Path, Circle, G, Ellipse } from 'react-native-svg';
import { View } from 'react-native';

export const PALETTE = {
  plum: '#8E6BA8',
  magenta: '#C4577E',
  rose: '#D98BA4',
  blush: '#E8B4C0',
  coral: '#D9724F',
  amber: '#D9A441',
  butter: '#E8C86A',
  sky: '#6E93C4',
  teal: '#4E9A94',
  leaf: '#6E8F5E',
  sage: '#9BAF8C',
  cream: '#F0E4D4',
};

export function Anemone({ size = 60, petal = PALETTE.plum, heart = '#2E3350', style }) {
  const P = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {P.map((d) => (
          <Ellipse key={d} cx="50" cy="26" rx="11" ry="22" fill={petal} opacity={0.9}
            transform={`rotate(${d}, 50, 50)`} />
        ))}
        <Circle cx="50" cy="50" r="11" fill={heart} />
        {P.map((d) => (
          <Path key={'s' + d} d="M50 39 L50 33" stroke={heart} strokeWidth="1.6" strokeLinecap="round"
            transform={`rotate(${d + 22}, 50, 50)`} />
        ))}
      </Svg>
    </View>
  );
}

export function Poppy({ size = 60, petal = PALETTE.magenta, style }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <G>
          <Path d="M50 50 C28 44, 20 24, 36 14 C48 7, 58 16, 50 50 Z" fill={petal} opacity={0.85} />
          <Path d="M50 50 C72 44, 80 24, 64 14 C52 7, 42 16, 50 50 Z" fill={petal} opacity={0.95} />
          <Path d="M50 50 C30 58, 22 78, 38 88 C50 94, 60 84, 50 50 Z" fill={petal} opacity={0.75} />
          <Path d="M50 50 C70 58, 78 78, 62 88 C50 94, 40 84, 50 50 Z" fill={petal} opacity={0.88} />
          <Circle cx="50" cy="50" r="7" fill="#2E3350" opacity={0.85} />
        </G>
      </Svg>
    </View>
  );
}

export function Daisy({ size = 50, petal = PALETTE.butter, heart = PALETTE.amber, style }) {
  const P = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {P.map((d) => (
          <Ellipse key={d} cx="50" cy="24" rx="6.5" ry="21" fill={petal}
            transform={`rotate(${d}, 50, 50)`} />
        ))}
        <Circle cx="50" cy="50" r="10" fill={heart} />
      </Svg>
    </View>
  );
}

export function Bud({ size = 40, color = PALETTE.rose, style }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M50 14 C34 26, 30 50, 42 66 C48 74, 52 74, 58 66 C70 50, 66 26, 50 14 Z" fill={color} />
        <Path d="M50 20 C44 34, 44 54, 50 66" stroke="#FFF" strokeWidth="1.4" fill="none" opacity={0.35} />
        <Path d="M50 66 C46 78, 46 88, 50 96" stroke={PALETTE.leaf} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}

export function Bellflowers({ size = 60, color = PALETTE.sky, style }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M18 14 C34 26, 52 42, 70 52" stroke={PALETTE.leaf} strokeWidth="2" fill="none" strokeLinecap="round" />
        {[[36, 30], [52, 42], [68, 54]].map(([x, y], i) => (
          <G key={i}>
            <Path d={`M${x} ${y} C${x - 7} ${y + 10}, ${x - 5} ${y + 20}, ${x} ${y + 22} C${x + 5} ${y + 20}, ${x + 7} ${y + 10}, ${x} ${y} Z`} fill={color} opacity={0.9} />
          </G>
        ))}
      </Svg>
    </View>
  );
}

export function Leaf({ size = 46, color = PALETTE.leaf, flip = false, style }) {
  return (
    <View style={[style, flip && { transform: [{ scaleX: -1 }] }]} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M14 88 C26 52, 52 22, 88 14 C82 52, 56 82, 14 88 Z" fill={color} opacity={0.85} />
        <Path d="M14 88 C38 62, 62 38, 86 16" stroke="#FFF" strokeWidth="1.6" fill="none" opacity={0.3} />
      </Svg>
    </View>
  );
}

export function Ivy({ size = 70, color = PALETTE.sage, style }) {
  return (
    <View style={style} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path d="M50 96 C50 70, 46 44, 50 10" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        {[[26, 74, 0], [72, 60, 1], [30, 44, 0], [70, 30, 1]].map(([x, y, f], i) => (
          <Path key={i}
            d={`M50 ${y + 6} C${x} ${y + 6}, ${x} ${y - 10}, ${x + (f ? -8 : 8)} ${y - 14}`}
            stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        ))}
        {[[24, 58], [76, 44], [28, 28], [72, 14]].map(([x, y], i) => (
          <Path key={'l' + i} d={`M${x} ${y} C${x - 10} ${y + 4}, ${x - 8} ${y + 14}, ${x} ${y + 14} C${x + 8} ${y + 14}, ${x + 10} ${y + 4}, ${x} ${y} Z`} fill={color} opacity={0.9} />
        ))}
      </Svg>
    </View>
  );
}
