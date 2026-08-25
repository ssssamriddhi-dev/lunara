import { useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, TYPE, SHADOW_SOFT } from '../constants/theme';
import { MOODS } from '../data/moods';
import { RESPONSES } from '../data/responses';
import ResponseCard from '../components/ResponseCard';
import { Bloom, MoonPhases } from '../components/Botanicals';
import ScreenBackdrop from '../components/ScreenBackdrop';
import { getCheckin, saveCheckin, todayKey, getNickname } from '../storage/store';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 22) return 'Good evening';
  return 'Winding down';
}

export default function HomeScreen() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nick, setNick] = useState(null);

  useEffect(() => {
    let active = true;
    getNickname().then((n) => { if (active) setNick(n); });
    getCheckin(todayKey()).then((entry) => {
      if (active && entry) setSelected(entry.moods);
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const toggleMood = (id) => {
    const next = selected.includes(id)
      ? selected.filter((m) => m !== id)
      : [...selected, id];
    setSelected(next);
    saveCheckin(todayKey(), next);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={COLORS.slate} />
      </SafeAreaView>
    );
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackdrop variant="a" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>{today}</Text>
        <Text style={styles.title}>{greeting()}{nick ? `, ${nick}` : ''}</Text>
        <MoonPhases width={140} opacity={0.4} style={styles.phases} />

        <View style={styles.card}>
          <Bloom size={78} opacity={0.16} style={styles.cardBloom} />
          <Text style={styles.question}>How are you feeling?</Text>
          <Text style={styles.hint}>Choose as many as you like</Text>

          <View style={styles.chipWrap}>
            {MOODS.map((mood) => {
              const isOn = selected.includes(mood.id);
              return (
                <Pressable
                  key={mood.id}
                  onPress={() => toggleMood(mood.id)}
                  style={[styles.chip, isOn && styles.chipOn]}
                >
                  <Text style={[styles.chipText, isOn && styles.chipTextOn]}>
                    {mood.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {selected.length > 0 && (
          <View style={styles.responses}>
            {selected.map((id) => (
              <ResponseCard key={id} response={RESPONSES[id]} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xl },
  vine: { position: 'absolute', top: -20, right: -50 },
  eyebrow: { ...TYPE.label, color: COLORS.gold },
  title: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs },
  phases: { marginTop: SPACING.sm },
  card: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOW_SOFT,
  },
  cardBloom: { position: 'absolute', right: -8, top: -6 },
  question: { ...TYPE.subtitle, color: COLORS.ink },
  hint: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 2 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: SPACING.lg },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipOn: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  chipText: { ...TYPE.body, color: COLORS.textSecondary },
  chipTextOn: { ...TYPE.bodyMedium, color: COLORS.textOnDark },
  responses: { marginTop: SPACING.lg },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginTop: SPACING.xxl,
    opacity: 0.8,
  },
});
