import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS, TYPE, SHADOW_SOFT, SHADOW_LIFT } from '../constants/theme';
import { getPeriods } from '../storage/store';
import { cycleStats, currentCycle, formatDate } from '../utils/cycle';
import CycleRing from '../components/CycleRing';
import { Halo } from '../components/Botanicals';
import ScreenBackdrop from '../components/ScreenBackdrop';
import LogPeriodScreen from './LogPeriodScreen';

export default function CycleScreen() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);

  const load = useCallback(() => {
    getPeriods().then((list) => {
      setPeriods(list);
      setLoading(false);
    });
  }, []);

  useFocusEffect(load);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={COLORS.slate} />
      </SafeAreaView>
    );
  }

  const stats = cycleStats(periods);
  const cycle = currentCycle(periods);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackdrop variant="c" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>Your cycle</Text>
        <Text style={styles.title}>Where you are</Text>

        {!cycle ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nothing logged yet</Text>
            <Text style={styles.emptyBody}>
              Log your first period and Lunara will start learning your pattern.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.ringWrap}>
              <Halo size={290} opacity={0.13} style={styles.halo} />
              <CycleRing
                day={cycle.dayOfCycle}
                total={cycle.averageCycle}
                phase={cycle.phase}
                periodLength={stats.averagePeriod || 5}
              />
            </View>

            {cycle.daysUntilNext !== null && (
              <View style={styles.predictCard}>
                <Text style={styles.eyebrowSm}>Estimated next period</Text>
                <View style={styles.predictRow}>
                  <Text style={styles.predictValue}>
                    {cycle.daysUntilNext > 0
                      ? cycle.daysUntilNext
                      : cycle.daysUntilNext === 0
                      ? '—'
                      : Math.abs(cycle.daysUntilNext)}
                  </Text>
                  <View style={styles.predictMeta}>
                    <Text style={styles.predictUnit}>
                      {cycle.daysUntilNext > 0
                        ? 'days away'
                        : cycle.daysUntilNext === 0
                        ? 'around today'
                        : 'days overdue'}
                    </Text>
                    <Text style={styles.predictDate}>{formatDate(cycle.nextStart)}</Text>
                  </View>
                </View>
                <View style={styles.hair} />
                <Text style={styles.predictNote}>
                  An estimate from your average. Cycles vary, especially irregular ones.
                </Text>
              </View>
            )}

            {stats.cycleCount === 0 && (
              <View style={styles.noteCard}>
                <Text style={styles.noteText}>
                  Keep logging and Lunara will learn your pattern.
                </Text>
              </View>
            )}

            {stats.cycleCount > 0 && (
              <View style={styles.statRow}>
                <Stat label="Avg cycle" value={stats.averageCycle} />
                <Stat label="Avg period" value={stats.averagePeriod} />
              </View>
            )}

            {stats.cycleCount > 1 && (
              <View style={styles.statRow}>
                <Stat label="Shortest" value={stats.shortestCycle} />
                <Stat label="Longest" value={stats.longestCycle} />
              </View>
            )}
          </>
        )}

        <Pressable style={styles.logButton} onPress={() => setLogging(true)}>
          <Text style={styles.logButtonText}>Log a period</Text>
        </Pressable>

        {periods.length > 0 && (
          <View style={styles.history}>
            <Text style={styles.eyebrowSm}>Recent</Text>
            {periods.slice(0, 5).map((p) => (
              <View key={p.id} style={styles.historyRow}>
                <View style={styles.historyDot} />
                <Text style={styles.historyText}>
                  {formatDate(p.start)}
                  {p.end ? ` – ${formatDate(p.end)}` : ' – ongoing'}
                </Text>
                {p.flow && <Text style={styles.historyFlow}>{p.flow}</Text>}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={logging} animationType="slide" presentationStyle="pageSheet">
        <LogPeriodScreen
          onSaved={() => {
            setLogging(false);
            load();
          }}
        />
        <Pressable style={styles.close} onPress={() => setLogging(false)}>
          <Text style={styles.closeText}>Cancel</Text>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value !== null ? value : '—'}</Text>
      <Text style={styles.statUnit}>days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xxl },
  vine: { position: 'absolute', top: -20, right: -50 },
  eyebrow: { ...TYPE.label, color: COLORS.gold },
  eyebrowSm: { ...TYPE.label, color: COLORS.textMuted },
  title: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs },
  ringWrap: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: { position: 'absolute' },
  predictCard: {
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    ...SHADOW_SOFT,
  },
  predictRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: SPACING.sm },
  predictValue: { ...TYPE.hero, fontSize: 48, color: COLORS.ink, lineHeight: 52 },
  predictMeta: { marginLeft: SPACING.md, marginBottom: 6 },
  predictUnit: { ...TYPE.bodyMedium, color: COLORS.textSecondary },
  predictDate: { ...TYPE.caption, color: COLORS.terracotta, marginTop: 1 },
  hair: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  predictNote: { ...TYPE.caption, color: COLORS.textMuted, lineHeight: 18 },
  statRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  stat: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceMuted,
  },
  statLabel: { ...TYPE.caption, color: COLORS.textSecondary },
  statValue: { ...TYPE.title, fontSize: 28, color: COLORS.ink, marginTop: 2 },
  statUnit: { ...TYPE.caption, color: COLORS.textMuted, marginTop: -2 },
  emptyCard: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceMuted,
  },
  emptyTitle: { ...TYPE.subtitle, color: COLORS.ink },
  emptyBody: { ...TYPE.body, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 22 },
  noteCard: {
    marginTop: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceMuted,
  },
  noteText: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 22 },
  logButton: {
    marginTop: SPACING.xl,
    paddingVertical: 15,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    ...SHADOW_LIFT,
  },
  logButtonText: { ...TYPE.bodyMedium, color: COLORS.textOnDark },
  history: { marginTop: SPACING.xl },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.terracotta,
    marginRight: SPACING.md,
  },
  historyText: { flex: 1, ...TYPE.body, color: COLORS.textSecondary },
  historyFlow: { ...TYPE.caption, color: COLORS.textMuted },
  close: { padding: SPACING.lg, alignItems: 'center', backgroundColor: 'transparent' },
  closeText: { ...TYPE.body, color: COLORS.slate },
});
