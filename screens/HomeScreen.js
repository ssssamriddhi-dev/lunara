import { useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, TYPE, SHADOW_SOFT } from '../constants/theme';
import { MOODS } from '../data/moods';
import { SYMPTOMS } from '../data/symptoms';
import { RESPONSES } from '../data/responses';
import ResponseCard from '../components/ResponseCard';
import ScreenBackdrop from '../components/ScreenBackdrop';
import PhaseCard from '../components/PhaseCard';
import { MiniRing, MoodBars } from '../components/HomeCharts';
import { PetalFall } from '../components/Motion';
import { currentCycle } from '../utils/cycle';
import {
  getCheckin, saveCheckin, todayKey, getNickname, getPeriods, getCheckins,
} from '../storage/store';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 22) return 'Good evening';
  return 'Winding down';
}

function Chips({ items, selected, onToggle, tint }) {
  return (
    <View style={styles.chipWrap}>
      {items.map((it) => {
        const on = selected.includes(it.id);
        return (
          <Pressable
            key={it.id}
            onPress={() => onToggle(it.id)}
            style={[styles.chip, on && { backgroundColor: tint, borderColor: tint }]}
          >
            <Text style={[styles.chipText, on && styles.chipTextOn]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const [moods, setMoods] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nick, setNick] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [allCheckins, setAllCheckins] = useState({});

  useEffect(() => {
    let active = true;
    getNickname().then((n) => { if (active) setNick(n); });
    getPeriods().then((ps) => { if (active) setCycle(currentCycle(ps)); });
    getCheckins().then((c) => { if (active) setAllCheckins(c); });
    getCheckin(todayKey()).then((entry) => {
      if (active && entry) {
        setMoods(entry.moods || []);
        setSymptoms(entry.symptoms || []);
      }
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const toggle = (list, setList, id, otherList, isMood) => {
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    setList(next);
    saveCheckin(todayKey(), isMood ? next : otherList, isMood ? otherList : next);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={COLORS.slate} />
      </SafeAreaView>
    );
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackdrop variant="a" />
      <PetalFall count={6} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>{today}</Text>
        <Text style={styles.title}>{greeting()}{nick ? `, ${nick}` : ''}</Text>

        {cycle && (
          <View style={styles.ringCard}>
            <MiniRing
              day={cycle.dayOfCycle}
              total={cycle.averageCycle || 28}
              phase={cycle.phase}
              size={130}
            />
            <View style={styles.ringSide}>
              <Text style={styles.ringTitle}>{cycle.phase}</Text>
              {cycle.daysUntilNext !== null && (
                <Text style={styles.ringSub}>
                  {cycle.daysUntilNext > 0
                    ? `Period estimated in ${cycle.daysUntilNext} days`
                    : cycle.daysUntilNext === 0
                    ? 'Period estimated around today'
                    : `${Math.abs(cycle.daysUntilNext)} days past estimate`}
                </Text>
              )}
            </View>
          </View>
        )}

        {cycle && <PhaseCard phase={cycle.phase} day={cycle.dayOfCycle} />}

        <View style={styles.card}>
          <Text style={styles.question}>How are you feeling?</Text>
          <Text style={styles.hint}>Choose as many as you like</Text>
          <Chips
            items={MOODS}
            selected={moods}
            tint={COLORS.ink}
            onToggle={(id) => toggle(moods, setMoods, id, symptoms, true)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.question}>Anything else you're feeling?</Text>
          <Text style={styles.hint}>Physical symptoms, if any</Text>
          <Chips
            items={SYMPTOMS}
            selected={symptoms}
            tint={COLORS.terracotta}
            onToggle={(id) => toggle(symptoms, setSymptoms, id, moods, false)}
          />
        </View>

        {Object.keys(allCheckins).length > 2 && (
          <View style={styles.card}>
            <Text style={styles.question}>Your recent feelings</Text>
            <MoodBars checkins={allCheckins} days={30} />
          </View>
        )}

        {moods.length > 0 && (
          <View style={styles.responses}>
            {moods.map((id) => (
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
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xxl },
  eyebrow: { ...TYPE.label, color: COLORS.gold },
  title: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs },
  ringCard: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW_SOFT,
  },
  ringSide: { flex: 1, marginLeft: SPACING.sm },
  ringTitle: { ...TYPE.title, fontSize: 22, color: COLORS.ink },
  ringSub: { ...TYPE.caption, color: COLORS.textSecondary, marginTop: 4, lineHeight: 17 },
  card: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    ...SHADOW_SOFT,
  },
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
  chipText: { ...TYPE.body, color: COLORS.textSecondary },
  chipTextOn: { ...TYPE.bodyMedium, color: COLORS.white },
  responses: { marginTop: SPACING.lg },
});
