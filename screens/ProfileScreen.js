import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  title: { fontSize: FONT_SIZES.title, fontWeight: '600', color: COLORS.ink },
  subtitle: { fontSize: FONT_SIZES.body, color: COLORS.textMuted, marginTop: SPACING.sm },
});
