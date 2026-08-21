import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import { MOODS } from '../data/moods';
import { RESPONSES } from '../data/responses';
import ResponseCard from '../components/ResponseCard';

export default function HomeScreen() {
  const [selected, setSelected] = useState([]);

  const toggleMood = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((m) => m !== id)
        : [...current, id]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>Hi there 🌙</Text>
        <View style={styles.rule} />

        <Text style={styles.question}>How are you feeling today?</Text>
        <Text style={styles.hint}>Choose as many as you like.</Text>

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
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  greeting: { fontSize: FONT_SIZES.title, fontWeight: '600', color: COLORS.ink },
  rule: {
    width: 32,
    height: 1,
    backgroundColor: COLORS.gold,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  question: { fontSize: FONT_SIZES.subtitle, fontWeight: '600', color: COLORS.ink },
  hint: { fontSize: FONT_SIZES.caption, color: COLORS.textMuted, marginTop: SPACING.xs },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipOn: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  chipText: { fontSize: FONT_SIZES.body, color: COLORS.textSecondary },
  chipTextOn: { color: COLORS.textOnDark },
  responses: { marginTop: SPACING.xl },
});
