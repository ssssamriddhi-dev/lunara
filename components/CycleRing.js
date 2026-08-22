import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS, TYPE, SPACING } from '../constants/theme';

const SIZE = 240;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function CycleRing({ day, total, phase, periodLength = 5 }) {
  const cycleLength = total || 28;
  const progress = Math.min(day / cycleLength, 1);
  const bleedFraction = Math.min(periodLength / cycleLength, 1);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE}>
        <G rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={COLORS.surfaceMuted} strokeWidth={STROKE} fill="none" />
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={COLORS.terracotta} strokeWidth={STROKE} fill="none" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - bleedFraction)} strokeLinecap="round" opacity={0.4} />
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={COLORS.ink} strokeWidth={STROKE} fill="none" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)} strokeLinecap="round" />
        </G>
      </Svg>
      <View style={styles.center}>
        <Text style={styles.label}>Cycle day</Text>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.phase}>{phase}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', height: SIZE },
  center: { position: 'absolute', alignItems: 'center' },
  label: { ...TYPE.label, color: COLORS.textMuted },
  day: { ...TYPE.hero, fontSize: 64, color: COLORS.ink, marginTop: 2 },
  phase: { ...TYPE.bodyMedium, color: COLORS.slate, marginTop: SPACING.xs },
});
