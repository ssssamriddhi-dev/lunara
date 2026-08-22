import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPE, SHADOW_SOFT } from '../constants/theme';
import ScreenBackdrop from '../components/ScreenBackdrop';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackdrop variant="a" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>Yours</Text>
        <Text style={styles.title}>Settings and privacy</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Coming soon.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xxl },
  eyebrow: { ...TYPE.label, color: COLORS.gold },
  title: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs },
  card: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    ...SHADOW_SOFT,
  },
  cardText: { ...TYPE.body, color: COLORS.textSecondary },
});
