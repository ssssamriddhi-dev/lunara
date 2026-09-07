import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import { savePeriod } from '../storage/store';

const FLOWS = ['Light', 'Medium', 'Heavy'];

const fmt = (d) =>
  d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const isoDate = (d) => d.toISOString().slice(0, 10);

export default function LogPeriodScreen({ onSaved }) {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(null);
  const [flow, setFlow] = useState(null);
  const [picker, setPicker] = useState(null);

  const onPick = (event, date) => {
    if (Platform.OS === 'android') setPicker(null);
    if (!date) return;
    if (picker === 'start') setStart(date);
    if (picker === 'end') setEnd(date);
  };

  const handleSave = async () => {
    if (end && end < start) {
      Alert.alert('Check the dates', 'The end date is before the start date.');
      return;
    }
    await savePeriod({
      id: isoDate(start),
      start: isoDate(start),
      end: end ? isoDate(end) : null,
      flow,
    });
    Alert.alert('Saved', 'Your period has been logged.');
    setEnd(null);
    setFlow(null);
    if (onSaved) onSaved();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Log your period</Text>
        <View style={styles.rule} />

        <Text style={styles.label}>When did your period start?</Text>
        <Pressable style={styles.field} onPress={() => setPicker('start')}>
          <Text style={styles.fieldText}>{fmt(start)}</Text>
        </Pressable>

        <Text style={styles.label}>When did it end?</Text>
        <Pressable style={styles.field} onPress={() => setPicker('end')}>
          <Text style={[styles.fieldText, !end && styles.fieldEmpty]}>
            {end ? fmt(end) : 'Still ongoing'}
          </Text>
        </Pressable>

        <Text style={styles.label}>How was your flow?</Text>
        <View style={styles.row}>
          {FLOWS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFlow(flow === f ? null : f)}
              style={[styles.chip, flow === f && styles.chipOn]}
            >
              <Text style={[styles.chipText, flow === f && styles.chipTextOn]}>{f}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.save} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>

        {picker && (
          <DateTimePicker
            value={picker === 'start' ? start : end || start}
            mode="date"
            maximumDate={new Date()}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            themeVariant="light"
            accentColor={COLORS.orchid}
            textColor={COLORS.ink}
            onChange={onPick}
          />
        )}

        {picker && Platform.OS === 'ios' && (
          <Pressable style={styles.done} onPress={() => setPicker(null)}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  heading: { fontSize: FONT_SIZES.title, fontWeight: '600', color: COLORS.ink },
  rule: {
    width: 32,
    height: 1,
    backgroundColor: COLORS.gold,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.ink,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  field: {
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldText: { fontSize: FONT_SIZES.body, color: COLORS.ink },
  fieldEmpty: { color: COLORS.textMuted },
  row: { flexDirection: 'row', gap: SPACING.sm },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipOn: { backgroundColor: COLORS.terracotta, borderColor: COLORS.terracotta },
  chipText: { fontSize: FONT_SIZES.body, color: COLORS.textSecondary },
  chipTextOn: { color: COLORS.white },
  save: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
  },
  saveText: { fontSize: FONT_SIZES.body, fontWeight: '600', color: COLORS.textOnDark },
  done: { marginTop: SPACING.sm, padding: SPACING.sm, alignItems: 'center' },
  doneText: { fontSize: FONT_SIZES.body, color: COLORS.slate },
});
