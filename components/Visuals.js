import { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Rect, Line, Ellipse } from 'react-native-svg';
import { COLORS, TYPE, SPACING } from '../constants/theme';
import { PALETTE } from './Flora';

/* ---------- Fade-and-rise wrapper for any card ---------- */
export function FadeIn({ delay = 0, children, style }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 420,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: a,
          transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/* ---------- The four phases, as a wheel ---------- */
const PHASES = [
  { label: 'Menstrual', days: '1–5', color: COLORS.terracotta, from: 0, to: 64 },
  { label: 'Follicular', days: '1–13', color: PALETTE.sage, from: 64, to: 178 },
  { label: 'Ovulation', days: '~14', color: PALETTE.amber, from: 178, to: 210 },
  { label: 'Luteal', days: '15–28', color: COLORS.orchid, from: 210, to: 360 },
];

function arc(cx, cy, r, a0, a1) {
  const rad = (d) => ((d - 90) * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0));
  const y0 = cy + r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1));
  const y1 = cy + r * Math.sin(rad(a1));
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

export function PhaseWheel({ size = 220 }) {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 18000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const S = 200, c = S / 2, r = 74;

  return (
    <View style={[vs.wheelWrap, { height: size + 90 }]}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={size} height={size} viewBox={`0 0 ${S} ${S}`}>
          <Circle cx={c} cy={c} r={r} stroke={COLORS.border} strokeWidth="18" fill="none" />
          {PHASES.map((p) => (
            <Path key={p.label} d={arc(c, c, r, p.from + 1.5, p.to - 1.5)}
              stroke={p.color} strokeWidth="18" fill="none" strokeLinecap="round" />
          ))}
        </Svg>
      </Animated.View>

      <View style={vs.wheelCenter}>
        <Text style={vs.wheelNum}>4</Text>
        <Text style={vs.wheelLabel}>phases</Text>
      </View>

      <View style={vs.legend}>
        {PHASES.map((p) => (
          <View key={p.label} style={vs.legendRow}>
            <View style={[vs.swatch, { backgroundColor: p.color }]} />
            <Text style={vs.legendText}>{p.label}</Text>
            <Text style={vs.legendDays}>{p.days}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* ---------- Bar chart of recent cycle lengths ---------- */
export function CycleChart({ cycles = [], average }) {
  const grow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(grow, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [cycles.length]);

  if (!cycles.length) return null;
  const data = cycles.slice(-8);
  const max = Math.max(...data, average || 0) + 3;
  const min = Math.max(Math.min(...data) - 4, 0);
  const span = max - min || 1;

  return (
    <View style={vs.chart}>
      <View style={vs.bars}>
        {data.map((n, i) => {
          const pct = ((n - min) / span) * 100;
          return (
            <View key={i} style={vs.barCol}>
              <Animated.View
                style={[
                  vs.bar,
                  {
                    height: grow.interpolate({ inputRange: [0, 1], outputRange: ['2%', `${Math.max(pct, 8)}%`] }),
                    backgroundColor: n > (average || 28) ? COLORS.orchid : COLORS.blush,
                  },
                ]}
              />
              <Text style={vs.barNum}>{n}</Text>
            </View>
          );
        })}
      </View>
      <Text style={vs.chartCaption}>
        Your last {data.length} cycles, in days
      </Text>
    </View>
  );
}

/* ---------- Simple figure illustrations for exercises ---------- */
export function PoseArt({ pose = 'rest', size = 88, color = COLORS.orchid }) {
  const body = {
    child: (
      <G stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M14 70 C30 70, 46 66, 58 58" />
        <Path d="M58 58 C68 52, 76 46, 84 44" />
        <Circle cx="20" cy="64" r="7" fill={color} stroke="none" />
        <Path d="M58 58 C58 68, 62 74, 70 72" />
        <Path d="M28 70 L52 70" />
      </G>
    ),
    cat: (
      <G stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round">
        <Path d="M22 56 C34 40, 62 40, 74 56" />
        <Circle cx="18" cy="58" r="7" fill={color} stroke="none" />
        <Path d="M30 56 L30 76" />
        <Path d="M66 56 L66 76" />
        <Path d="M74 56 L82 62" />
      </G>
    ),
    knee: (
      <G stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round">
        <Path d="M12 66 L44 66" />
        <Circle cx="16" cy="60" r="7" fill={color} stroke="none" />
        <Path d="M44 66 C56 66, 60 54, 54 46" />
        <Path d="M54 46 C48 40, 40 44, 40 52" />
        <Path d="M12 74 L70 74" strokeWidth="2" opacity="0.35" />
      </G>
    ),
    walk: (
      <G stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round">
        <Circle cx="48" cy="20" r="8" fill={color} stroke="none" />
        <Path d="M48 30 L48 52" />
        <Path d="M48 52 L38 76" />
        <Path d="M48 52 L60 74" />
        <Path d="M48 36 L34 44" />
        <Path d="M48 36 L62 30" />
      </G>
    ),
    breathe: (
      <G stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round">
        <Circle cx="48" cy="24" r="9" fill={color} stroke="none" />
        <Path d="M48 34 L48 58" />
        <Path d="M48 58 L34 76" />
        <Path d="M48 58 L62 76" />
        <Ellipse cx="48" cy="46" rx="20" ry="14" opacity="0.28" />
        <Ellipse cx="48" cy="46" rx="30" ry="21" opacity="0.14" />
      </G>
    ),
    rest: (
      <G stroke={color} strokeWidth="3.2" fill="none" strokeLinecap="round">
        <Path d="M14 62 L74 62" />
        <Circle cx="18" cy="55" r="7" fill={color} stroke="none" />
        <Path d="M74 62 L84 40" />
        <Path d="M10 70 L86 70" strokeWidth="2" opacity="0.35" />
      </G>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 96 96">
      <Circle cx="48" cy="48" r="46" fill={color} opacity="0.08" />
      {body[pose] || body.rest}
    </Svg>
  );
}

const vs = StyleSheet.create({
  wheelWrap: { alignItems: 'center', marginVertical: SPACING.md },
  wheelCenter: { position: 'absolute', top: 82, alignItems: 'center' },
  wheelNum: { ...TYPE.title, fontSize: 34, color: COLORS.ink },
  wheelLabel: { ...TYPE.caption, color: COLORS.textMuted, marginTop: -4 },
  legend: { marginTop: SPACING.md, width: '100%' },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  swatch: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.md },
  legendText: { ...TYPE.body, color: COLORS.textSecondary, flex: 1 },
  legendDays: { ...TYPE.caption, color: COLORS.textMuted },
  chart: { marginTop: SPACING.md },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: 8 },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 8, minHeight: 8 },
  barNum: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 6, fontSize: 11 },
  chartCaption: { ...TYPE.caption, color: COLORS.textMuted, marginTop: SPACING.md, textAlign: 'center' },
});
