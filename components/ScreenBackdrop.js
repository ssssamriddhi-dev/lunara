import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../constants/theme';
import WombLine from './WombLine';

const { width, height } = Dimensions.get('window');
const px = (x) => (x / 360) * width;
const py = (y) => (y / 800) * height;

const MARKS = {
  a: { size: width * 1.15, x: -60, y: 300, o: 0.16 },
  b: { size: width * 1.0, x: 150, y: 380, o: 0.14 },
  c: { size: width * 1.25, x: -90, y: 200, o: 0.13 },
};

export default function ScreenBackdrop({ variant = 'a' }) {
  const m = MARKS[variant] || MARKS.a;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={GRADIENTS.screen}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ position: 'absolute', left: px(m.x), top: py(m.y), opacity: m.o }}>
        <WombLine size={m.size} animate={false} tint="#B98FC4" />
      </View>
    </View>
  );
}
