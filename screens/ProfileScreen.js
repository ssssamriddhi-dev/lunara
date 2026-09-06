import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBackHandler from '../components/useBackHandler';
import { COLORS, SPACING, RADIUS, TYPE, SHADOW_SOFT } from '../constants/theme';
import ScreenBackdrop from '../components/ScreenBackdrop';
import { getPeriods, dataSummary, getNickname, setNickname, clearAll } from '../storage/store';
import { cycleStats, formatDate } from '../utils/cycle';
import { MOODS } from '../data/moods';

const PRIVACY = [
  { h: 'Where your data lives', p: 'Everything you log stays on this device. Lunara has no account system, no server, and does not upload your cycle, mood or symptom data anywhere.' },
  { h: 'What Lunara collects', p: 'Only what you type in: period dates, flow, symptoms, moods, and an optional nickname. No real name, no email, no location, no contacts.' },
  { h: 'Working offline', p: 'Lunara does not need an internet connection. Nothing is sent, so nothing needs sending.' },
  { h: 'Deleting your data', p: 'Clearing all data below removes everything permanently from this device. Uninstalling Lunara also removes it. There is no copy elsewhere to request deletion of.' },
  { h: 'Sharing', p: 'Your health data is never sold, shared with advertisers, or used for analytics.' },
  { h: 'A limitation worth knowing', p: 'Because data is stored on the device rather than in an account, it is not encrypted separately from your phone. Anyone who can unlock your phone can open Lunara. Using a device passcode is the main protection.' },
];

export default function ProfileScreen() {
  const [summary, setSummary] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const [sheet, setSheet] = useState(null);
  useBackHandler(!!sheet, () => setSheet(null));

  const load = useCallback(() => {
    Promise.all([dataSummary(), getPeriods(), getNickname()]).then(([s, p, n]) => {
      setSummary(s);
      setPeriods(p);
      setName(n || '');
    });
  }, []);

  useFocusEffect(load);

  const confirmClear = () => {
    Alert.alert(
      'Clear all data?',
      'This permanently removes every period, mood and symptom you have logged. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear everything',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            load();
            Alert.alert('Cleared', 'All your data has been removed from this device.');
          },
        },
      ]
    );
  };

  const saveName = async () => {
    await setNickname(name.trim() || null);
    setEditing(false);
  };

  const stats = cycleStats(periods);
  const moodLabel = summary?.topMood
    ? (MOODS.find((m) => m.id === summary.topMood)?.label || summary.topMood)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackdrop variant="c" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>Profile</Text>
        <Text style={styles.title}>{name ? name : 'Yours'}</Text>

        <Pressable style={styles.nameRow} onPress={() => setEditing(true)}>
          <Text style={styles.nameHint}>
            {name ? 'Change what Lunara calls you' : 'Add a nickname (optional)'}
          </Text>
          <Text style={styles.chev}>›</Text>
        </Pressable>

        <Text style={styles.section}>What Lunara knows</Text>
        <View style={styles.statRow}>
          <Stat label="Periods logged" value={summary?.periodCount ?? '—'} />
          <Stat label="Days checked in" value={summary?.checkinDays ?? '—'} />
        </View>
        <View style={styles.statRow}>
          <Stat label="Average cycle" value={stats.averageCycle ?? '—'} unit="days" />
          <Stat label="Average period" value={stats.averagePeriod ?? '—'} unit="days" />
        </View>

        {moodLabel && (
          <View style={styles.insight}>
            <Text style={styles.insightText}>
              Your most frequently logged feeling has been {moodLabel.toLowerCase()}, on {summary.topMoodCount}{' '}
              {summary.topMoodCount === 1 ? 'day' : 'days'}.
            </Text>
          </View>
        )}

        {periods.length > 0 && (
          <>
            <Text style={styles.section}>Cycle history</Text>
            <View style={styles.card}>
              {periods.slice(0, 8).map((p, i) => (
                <View key={p.id} style={[styles.histRow, i === 0 && { borderTopWidth: 0 }]}>
                  <View style={styles.histDot} />
                  <Text style={styles.histText}>
                    {formatDate(p.start)}{p.end ? ` – ${formatDate(p.end)}` : ' – ongoing'}
                  </Text>
                  {p.flow && <Text style={styles.histFlow}>{p.flow}</Text>}
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.section}>Privacy and data</Text>
        <Pressable style={styles.linkRow} onPress={() => setSheet('privacy')}>
          <Text style={styles.linkText}>How Lunara handles your data</Text>
          <Text style={styles.chev}>›</Text>
        </Pressable>
        <Pressable style={styles.linkRow} onPress={() => setSheet('about')}>
          <Text style={styles.linkText}>About Lunara</Text>
          <Text style={styles.chev}>›</Text>
        </Pressable>

        <Pressable style={styles.danger} onPress={confirmClear}>
          <Text style={styles.dangerText}>Clear all data</Text>
        </Pressable>
        <Text style={styles.dangerNote}>
          Permanently removes everything logged on this device.
        </Text>
      </ScrollView>

      <Modal visible={editing} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>What should we call you?</Text>
            <Text style={styles.dialogHint}>Optional. A nickname is fine.</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nickname"
              placeholderTextColor={COLORS.textMuted}
              autoFocus
              maxLength={24}
            />
            <View style={styles.dialogRow}>
              <Pressable style={styles.dialogBtn} onPress={() => setEditing(false)}>
                <Text style={styles.dialogCancel}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.dialogBtn, styles.dialogSave]} onPress={saveName}>
                <Text style={styles.dialogSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!sheet} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.readerWrap} edges={['top']}>
          <ScreenBackdrop variant="b" />
          <ScrollView contentContainerStyle={styles.reader} showsVerticalScrollIndicator={false}>
            {sheet === 'privacy' ? (
              <>
                <Text style={styles.eyebrow}>Privacy</Text>
                <Text style={styles.readerTitle}>Your data, plainly</Text>
                {PRIVACY.map((s, i) => (
                  <View key={i}>
                    <Text style={styles.h}>{s.h}</Text>
                    <Text style={styles.p}>{s.p}</Text>
                  </View>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.eyebrow}>About</Text>
                <Text style={styles.readerTitle}>Lunara</Text>
                <Text style={styles.p}>Every phase. Every feeling. Every you.</Text>
                <Text style={styles.h}>What Lunara is</Text>
                <Text style={styles.p}>
                  A cycle tracker and emotional check-in that works offline and keeps your data on
                  your own device.
                </Text>
                <Text style={styles.h}>What Lunara is not</Text>
                <Text style={styles.p}>
                  Not a medical device, not a diagnostic tool, and not a contraceptive. Predictions
                  are estimates from your own logged history, and can be wrong, particularly with
                  irregular cycles.
                </Text>
                <Text style={styles.p}>
                  For anything concerning about your health, please speak to a qualified healthcare
                  professional.
                </Text>
                <Text style={styles.note}>Version 1.0</Text>
              </>
            )}
          </ScrollView>
          <Pressable style={styles.close} onPress={() => setSheet(null)}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function Stat({ label, value, unit }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {unit && <Text style={styles.statUnit}>{unit}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xxl },
  eyebrow: { ...TYPE.label, color: COLORS.gold },
  title: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  nameHint: { ...TYPE.caption, color: COLORS.textMuted, flex: 1 },
  section: { ...TYPE.label, color: COLORS.textMuted, marginTop: SPACING.xl, marginBottom: SPACING.md },
  statRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  stat: { flex: 1, padding: SPACING.lg, borderRadius: 20, backgroundColor: COLORS.surfaceMuted },
  statLabel: { ...TYPE.caption, color: COLORS.textSecondary },
  statValue: { ...TYPE.title, fontSize: 28, color: COLORS.ink, marginTop: 2 },
  statUnit: { ...TYPE.caption, color: COLORS.textMuted, marginTop: -2 },
  insight: {
    marginTop: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    ...SHADOW_SOFT,
  },
  insightText: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 23 },
  card: { padding: SPACING.md, borderRadius: 20, backgroundColor: COLORS.surface, ...SHADOW_SOFT },
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  histDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.terracotta,
    marginRight: SPACING.md,
  },
  histText: { flex: 1, ...TYPE.body, color: COLORS.textSecondary },
  histFlow: { ...TYPE.caption, color: COLORS.textMuted },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
    ...SHADOW_SOFT,
  },
  linkText: { ...TYPE.bodyMedium, color: COLORS.ink, flex: 1 },
  chev: { fontSize: 22, color: COLORS.textMuted },
  danger: {
    marginTop: SPACING.xl,
    paddingVertical: 14,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.terracotta,
    alignItems: 'center',
  },
  dangerText: { ...TYPE.bodyMedium, color: COLORS.terracotta },
  dangerNote: {
    ...TYPE.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(74,55,96,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  dialog: {
    width: '100%',
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  dialogTitle: { ...TYPE.title, fontSize: 22, color: COLORS.ink },
  dialogHint: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 2 },
  input: {
    ...TYPE.body,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  dialogRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  dialogBtn: { flex: 1, paddingVertical: 12, borderRadius: RADIUS.pill, alignItems: 'center' },
  dialogCancel: { ...TYPE.bodyMedium, color: COLORS.slate },
  dialogSave: { backgroundColor: COLORS.orchid },
  dialogSaveText: { ...TYPE.bodyMedium, color: COLORS.white },
  readerWrap: { flex: 1, backgroundColor: COLORS.background },
  reader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.xxl },
  readerTitle: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs },
  h: { ...TYPE.subtitle, color: COLORS.ink, marginTop: SPACING.lg },
  p: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 24, marginTop: SPACING.sm },
  note: { ...TYPE.caption, color: COLORS.textMuted, marginTop: SPACING.xl },
  close: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  closeText: { ...TYPE.bodyMedium, color: COLORS.slate },
});
