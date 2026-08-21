import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from './constants/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.moon}>🌙</Text>
      <Text style={styles.title}>Lunara</Text>
      <Text style={styles.tagline}>Every phase. Every feeling. Every you.</Text>
      <View style={styles.rule} />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  moon: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '600',
    color: COLORS.ink,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  rule: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
    marginTop: SPACING.lg,
  },
});