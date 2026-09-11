import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS, SPACING, TYPE } from '../constants/theme';
import { MOODS } from '../data/moods';

const AC = Animated.createAnimatedComponent(Circle);

/* ---- Compact cycle ring for Home ---- */
export function MiniRing({ day, total = 28, phase, size = 150 }) {
  const grow = useRef(new Animated.Value(0)).current;
  const S = 120, c = S / 2, r = 50, CIRC = 2 * Math.PI * r;

  useEffect(() => {
    Animated.timing(grow, {
      toValue: Math.min(day / total, 1),
      duration: 1100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [day, total]);

  const offset = grow.interpolate({ inputRange: [0, 1], outputRange: [CIRC, 0] });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${S} ${S}`}>
        <G rotation="-90" origin={`${c}, ${c}`}>
          <Circle cx={c} cy={c} r={r} stroke={COLORS.surfaceMuted} strokeWidth="9" fill="none" />
          <AC cx={c} cy={c} r={r} stroke={COLORS.orchid} strokeWidth="9" fill="none"
              strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round" />
        </G>
      </Svg>
      <View style={s.ringCenter}>
        <Text style={s.ringDay}>{day}</Text>
        <Text style={s.ringLabel}>{phase === 'Estimated ovulation' ? 'ovulation' : phase?.toLowerCase()}</Text>
      </View>
    </View>
  );
}

/* ---- Horizontal bars: your most logged moods ---- */
export function MoodBars({ checkins = {}, days = 30 }) {
  const grow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(grow, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [Object.keys(checkins).length]);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutISO = cutoff.toISOString().slice(0, 10);

  const counts = {};
  Object.entries(checkins).forEach(([date, entry]) => {
    if (date < cutISO) return;
    (entry.moods || []).forEach((m) => { counts[m] = (counts[m] || 0) + 1; });
  });

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (!top.length) return null;

  const max = top[0][1];
  const label = (id) => MOODS.find((m) => m.id === id)?.label || id;
  const TINTS = [COLORS.orchid, COLORS.blush, COLORS.terracotta, COLORS.slate, COLORS.petal];

  return (
    <View style={s.moodWrap}>
      {top.map(([id, n], i) => (
        <View key={id} style={s.moodRow}>
          <Text style={s.moodLabel} numberOfLines={1}>{label(id)}</Text>
          <View style={s.track}>
            <Animated.View
              style={[
                s.fill,
                {
                  backgroundColor: TINTS[i],
                  width: grow.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${Math.max((n / max) * 100, 8)}%`],
                  }),
                },
              ]}
            />
          </View>
          <Text style={s.moodNum}>{n}</Text>
        </View>
      ))}
      <Text style={s.caption}>Days logged in the last {days}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  ringCenter: { position: 'absolute', alignItems: 'center' },
  ringDay: { ...TYPE.title, fontSize: 36, color: COLORS.ink },
  ringLabel: { ...TYPE.caption, color: COLORS.textMuted, marginTop: -4, fontSize: 11 },
  moodWrap: { marginTop: SPACING.md },
  moodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  moodLabel: { ...TYPE.caption, color: COLORS.textSecondary, width: 92 },
  track: { flex: 1, height: 9, borderRadius: 5, backgroundColor: COLORS.surfaceMuted, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
  moodNum: { ...TYPE.caption, color: COLORS.textMuted, width: 22, textAlign: 'right' },
  caption: { ...TYPE.caption, color: COLORS.textMuted, marginTop: SPACING.sm },
});
