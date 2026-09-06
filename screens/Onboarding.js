import { useState, useRef, useEffect } from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING, RADIUS, TYPE, GRADIENTS } from '../constants/theme';
import WombLine from '../components/WombLine';
import { saveOnboarding } from '../storage/store';
import useBackHandler from '../components/useBackHandler';

const PERIOD_OPTIONS = [
  { id: 3, label: '2–3 days' },
  { id: 5, label: '4–5 days' },
  { id: 7, label: '6–7 days' },
  { id: null, label: 'Not sure' },
];

const CYCLE_OPTIONS = [
  { id: 23, label: '21–24 days' },
  { id: 27, label: '25–28 days' },
  { id: 31, label: '29–32 days' },
  { id: 34, label: '33–35 days' },
  { id: null, label: 'Not sure' },
];

const iso = (d) => d.toISOString().slice(0, 10);
const pretty = (d) =>
  d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [lastPeriod, setLastPeriod] = useState(null);
  const [picker, setPicker] = useState(false);
  const [periodLength, setPeriodLength] = useState(undefined);
  const [cycleLength, setCycleLength] = useState(undefined);

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    fade.setValue(0);
    rise.setValue(14);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [step]);

  const finish = async () => {
    await saveOnboarding({
      nickname: nickname.trim() || null,
      lastPeriod: lastPeriod ? iso(lastPeriod) : null,
      periodLength: periodLength ?? null,
      cycleLength: cycleLength ?? null,
    });
    onDone();
  };

  const next = () => (step === 4 ? finish() : setStep(step + 1));

  useBackHandler(step > 0, () => setStep(step - 1));

  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENTS.screen} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.dots}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotOn]} />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>

            {step === 0 && (
              <View style={styles.welcome}>
                <WombLine size={190} tint={COLORS.orchid} />
                <Text style={styles.brand}>Lunara</Text>
                <Text style={styles.tagline}>Every phase. Every feeling. Every you.</Text>
                <Text style={styles.sub}>Understand your cycle. Understand yourself.</Text>
              </View>
            )}

            {step === 1 && (
              <>
                <Text style={styles.q}>What should we call you?</Text>
                <Text style={styles.hint}>
                  Optional, and it never leaves your phone. A nickname is fine.
                </Text>
                <TextInput
                  style={styles.input}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="Nickname"
                  placeholderTextColor={COLORS.textMuted}
                  maxLength={24}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.q}>When did your last period start?</Text>
                <Text style={styles.hint}>
                  A rough guess is fine. This lets Lunara show your cycle straight away.
                </Text>
                <Pressable style={styles.field} onPress={() => setPicker(true)}>
                  <Text style={[styles.fieldText, !lastPeriod && styles.fieldEmpty]}>
                    {lastPeriod ? pretty(lastPeriod) : 'Choose a date'}
                  </Text>
                </Pressable>

                {picker && (
                  <>
                    <DateTimePicker
                      value={lastPeriod || new Date()}
                      mode="date"
                      maximumDate={new Date()}
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      onChange={(e, d) => {
                        if (Platform.OS === 'android') setPicker(false);
                        if (d) setLastPeriod(d);
                      }}
                    />
                    {Platform.OS === 'ios' && (
                      <Pressable style={styles.done} onPress={() => setPicker(false)}>
                        <Text style={styles.doneText}>Done</Text>
                      </Pressable>
                    )}
                  </>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <Text style={styles.q}>How long does your period usually last?</Text>
                <Text style={styles.hint}>An average is enough.</Text>
                {PERIOD_OPTIONS.map((o) => (
                  <Option
                    key={o.label}
                    label={o.label}
                    on={periodLength === o.id}
                    onPress={() => setPeriodLength(o.id)}
                  />
                ))}
              </>
            )}

            {step === 4 && (
              <>
                <Text style={styles.q}>What is your usual cycle length?</Text>
                <Text style={styles.hint}>
                  First day of one period to the day before the next. If you don't know, skip it —
                  Lunara will work it out as you log.
                </Text>
                {CYCLE_OPTIONS.map((o) => (
                  <Option
                    key={o.label}
                    label={o.label}
                    on={cycleLength === o.id}
                    onPress={() => setCycleLength(o.id)}
                  />
                ))}
              </>
            )}

          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.cta} onPress={next}>
            <Text style={styles.ctaText}>
              {step === 0 ? 'Get started' : step === 4 ? 'Finish' : 'Continue'}
            </Text>
          </Pressable>

          {step > 0 && (
            <Pressable style={styles.skip} onPress={next}>
              <Text style={styles.skipText}>Skip this</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function Option({ label, on, onPress }) {
  return (
    <Pressable style={[styles.option, on && styles.optionOn]} onPress={onPress}>
      <Text style={[styles.optionText, on && styles.optionTextOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: SPACING.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotOn: { backgroundColor: COLORS.orchid, width: 18 },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.lg },
  welcome: { alignItems: 'center', marginTop: SPACING.lg },
  brand: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 52,
    color: COLORS.ink,
    letterSpacing: 2,
    marginTop: SPACING.sm,
  },
  tagline: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 20,
    color: COLORS.slate,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 29,
  },
  sub: {
    ...TYPE.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  q: { ...TYPE.title, fontSize: 28, color: COLORS.ink, lineHeight: 36 },
  hint: { ...TYPE.body, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 22 },
  input: {
    ...TYPE.body,
    color: COLORS.ink,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  field: {
    padding: SPACING.md,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xl,
  },
  fieldText: { ...TYPE.body, color: COLORS.ink },
  fieldEmpty: { color: COLORS.textMuted },
  done: { padding: SPACING.sm, alignItems: 'center' },
  doneText: { ...TYPE.body, color: COLORS.slate },
  option: {
    padding: SPACING.md,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  optionOn: { backgroundColor: COLORS.orchid, borderColor: COLORS.orchid },
  optionText: { ...TYPE.body, color: COLORS.textSecondary },
  optionTextOn: { ...TYPE.bodyMedium, color: COLORS.white },
  footer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  cta: {
    paddingVertical: 15,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
  },
  ctaText: { ...TYPE.bodyMedium, color: COLORS.white },
  skip: { paddingVertical: SPACING.md, alignItems: 'center' },
  skipText: { ...TYPE.caption, color: COLORS.textMuted },
});
