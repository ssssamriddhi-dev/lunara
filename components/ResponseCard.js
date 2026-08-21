import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

export default function ResponseCard({ response }) {
  if (!response) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{response.title}</Text>

      {response.body && <Text style={styles.body}>{response.body}</Text>}

      {response.steps && (
        <View style={styles.steps}>
          {response.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.dot} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {response.suggestion && (
        <Text style={styles.suggestion}>{response.suggestion}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.subtitle,
    fontWeight: '600',
    color: COLORS.ink,
    lineHeight: 26,
  },
  body: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginTop: SPACING.sm,
  },
  steps: { marginTop: SPACING.md },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginRight: SPACING.md,
  },
  stepText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  suggestion: {
    fontSize: FONT_SIZES.body,
    color: COLORS.slate,
    lineHeight: 24,
    marginTop: SPACING.md,
    fontStyle: 'italic',
  },
});
