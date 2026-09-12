import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Circle, Line, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, SPACING, TYPE, SHADOW_SOFT } from '../constants/theme';
import { PALETTE } from './Flora';

/* Shown instead of graphs until enough data exists */
export function NotEnoughYet({ have, need = 4 }) {
  const left = need - have;
  return (
    <View style={s.lockCard}>
      <View style={s.lockDots}>
        {Array.from({ length: need }).map((_, i) => (
          <View
            key={i}
            style={[s.lockDot, i < have && { backgroundColor: COLORS.orchid, borderColor: COLORS.orchid }]}
          />
        ))}
      </View>
      <Text style={s.lockTitle}>
        {have === 0 ? 'Your charts will appear here' : `${left} more ${left === 1 ? 'cycle' : 'cycles'} to go`}
      </Text>
      <Text style={s.lockBody}>
        Lunara needs {need} logged cycles before it can show your patterns. With fewer than that, any
        chart would be more guess than fact.
      </Text>
      <Text style={s.lockBody}>
        You have {have} {have === 1 ? 'cycle' : 'cycles'} so far. Keep logging each period and these
        will unlock on their own.
      </Text>
    </View>
  );
}

/* ---- 1. Cycle length over time, as a line ---- */
export function LengthLine({ cycles, average }) {
  const draw = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(draw, { toValue: 1, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [cycles.length]);

  const data = cycles.slice(-8);
  const W = 300, H = 130, pad = 16;
  const max = Math.max(...data) + 2;
  const min = Math.min(...data) - 2;
  const span = max - min || 1;

  const pt = (n, i) => ({
    x: pad + (i * (W - pad * 2)) / Math.max(data.length - 1, 1),
    y: pad + (1 - (n - min) / span) * (H - pad * 2),
  });

  const path = data.map((n, i) => {
    const { x, y } = pt(n, i);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const avgY = pad + (1 - (average - min) / span) * (H - pad * 2);

  return (
    <View style={s.card}>
      <Text style={s.eyebrow}>Cycle length</Text>
      <Text style={s.title}>How it has moved</Text>

      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={PALETTE.magenta} stopOpacity="0.42" />
            <Stop offset="1" stopColor={PALETTE.magenta} stopOpacity="0.02" />
          </LinearGradient>
          <LinearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={PALETTE.sky} />
            <Stop offset="0.5" stopColor={PALETTE.plum} />
            <Stop offset="1" stopColor={PALETTE.magenta} />
          </LinearGradient>
        </Defs>

        <Path d={`${path} L ${W - pad} ${H - pad} L ${pad} ${H - pad} Z`} fill="url(#fade)" />

        <Line x1={pad} y1={avgY} x2={W - pad} y2={avgY}
          stroke={PALETTE.amber} strokeWidth="1.4" strokeDasharray="5 5" opacity="0.8" />
        <Path d={path} stroke="url(#stroke)" strokeWidth="3.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" />
        {data.map((n, i) => {
          const { x, y } = pt(n, i);
          return (
            <G key={i}>
              <Circle cx={x} cy={y} r="8" fill={n > average ? PALETTE.magenta : PALETTE.sky} opacity="0.18" />
              <Circle cx={x} cy={y} r="5" fill={COLORS.surface}
                stroke={n > average ? PALETTE.magenta : PALETTE.sky} strokeWidth="3" />
            </G>
          );
        })}
      </Svg>

      <View style={s.axis}>
        {data.map((n, i) => <Text key={i} style={s.axisLabel}>{n}</Text>)}
      </View>
      <Text style={s.caption}>Dashed line is your average of {average} days</Text>
    </View>
  );
}

/* ---- 2. Consistency dial ---- */
export function Consistency({ cycles }) {
  const a = useRef(new Animated.Value(0)).current;
  const data = cycles.slice(-8);
  const avg = data.reduce((x, y) => x + y, 0) / data.length;
  const spread = Math.max(...data) - Math.min(...data);
  const score = Math.max(0, Math.min(100, Math.round(100 - spread * 9)));

  useEffect(() => {
    Animated.timing(a, { toValue: score / 100, duration: 1100, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [score]);

  const verdict =
    spread <= 3 ? 'Your recent cycles have been very consistent.'
    : spread <= 6 ? 'Your recent cycles have been fairly consistent.'
    : spread <= 10 ? 'Your cycle length has varied somewhat. That is common.'
    : 'Your cycle length has varied noticeably. Keep tracking to understand your own pattern.';

  const tint = spread <= 6 ? PALETTE.sage : spread <= 10 ? PALETTE.amber : COLORS.terracotta;

  return (
    <View style={s.card}>
      <Text style={s.eyebrow}>Consistency</Text>
      <Text style={s.title}>{spread} day spread</Text>

      <View style={s.segRow}>
        {data.map((n, i) => {
          const d = Math.abs(n - avg);
          const c = d <= 1.5 ? PALETTE.sage : d <= 3 ? PALETTE.butter : d <= 5 ? PALETTE.coral : PALETTE.magenta;
          return (
            <Animated.View
              key={i}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 8,
                backgroundColor: c,
                opacity: a,
                transform: [{ scaleY: a.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }) }],
              }}
            />
          );
        })}
      </View>
      <View style={s.segLabels}>
        {data.map((n, i) => <Text key={i} style={s.segLabel}>{n}</Text>)}
      </View>

      <Text style={s.body}>{verdict}</Text>
      <Text style={s.caption}>
        Shortest {Math.min(...data)} days · Longest {Math.max(...data)} days
      </Text>
      <Text style={s.disclaimer}>
        Variation between cycles is normal. This is a description of your pattern, not a
        judgement of your health.
      </Text>
    </View>
  );
}

/* ---- 3. Symptoms by phase ---- */
export function SymptomPhases({ counts, labels }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [counts]);

  const top = Object.entries(counts).sort((x, y) => y[1] - x[1]).slice(0, 5);
  if (!top.length) return null;
  const max = top[0][1];
  const TINTS = [COLORS.terracotta, COLORS.orchid, PALETTE.rose, COLORS.slate, PALETTE.sky];

  return (
    <View style={s.card}>
      <Text style={s.eyebrow}>Symptoms</Text>
      <Text style={s.title}>What you log most</Text>

      {top.map(([id, n], i) => (
        <View key={id} style={s.symRow}>
          <Text style={s.symLabel} numberOfLines={1}>{labels[id] || id}</Text>
          <View style={s.symTrack}>
            <Animated.View
              style={[s.fill, {
                backgroundColor: TINTS[i],
                width: a.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${Math.max((n / max) * 100, 8)}%`] }),
              }]}
            />
          </View>
          <Text style={s.symNum}>{n}</Text>
        </View>
      ))}
      <Text style={s.caption}>Times logged across all your entries</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    ...SHADOW_SOFT,
  },
  eyebrow: { ...TYPE.label, color: COLORS.textMuted },
  title: { ...TYPE.title, fontSize: 22, color: COLORS.ink, marginTop: 2, marginBottom: SPACING.md },
  body: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 22, marginTop: SPACING.md },
  caption: { ...TYPE.caption, color: COLORS.textMuted, marginTop: SPACING.sm },
  disclaimer: { ...TYPE.caption, color: COLORS.textMuted, marginTop: SPACING.md, lineHeight: 17, fontStyle: 'italic' },
  axis: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  axisLabel: { ...TYPE.caption, color: COLORS.textMuted, fontSize: 10 },
  segRow: { flexDirection: 'row', gap: 5, marginTop: SPACING.sm },
  segLabels: { flexDirection: 'row', gap: 5, marginTop: 5 },
  segLabel: { flex: 1, ...TYPE.caption, color: COLORS.textMuted, fontSize: 10, textAlign: 'center' },
  track: { height: 10, borderRadius: 6, backgroundColor: COLORS.surfaceMuted, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
  symRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  symLabel: { ...TYPE.caption, color: COLORS.textSecondary, width: 104 },
  symTrack: { flex: 1, height: 9, borderRadius: 5, backgroundColor: COLORS.surfaceMuted, overflow: 'hidden' },
  symNum: { ...TYPE.caption, color: COLORS.textMuted, width: 24, textAlign: 'right' },
  lockCard: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceMuted,
  },
  lockDots: { flexDirection: 'row', gap: 8, marginBottom: SPACING.md },
  lockDot: {
    width: 11, height: 11, borderRadius: 6,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: 'transparent',
  },
  lockTitle: { ...TYPE.subtitle, color: COLORS.ink },
  lockBody: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 22, marginTop: SPACING.sm },
});
