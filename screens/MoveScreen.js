import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBackHandler from '../components/useBackHandler';
import { COLORS, SPACING, RADIUS, TYPE, SHADOW_SOFT } from '../constants/theme';
import ScreenBackdrop from '../components/ScreenBackdrop';
import GrowingVine from '../components/GrowingVine';
import { Aurora } from '../components/Motion';
import { MOVE_CATEGORIES, EXERCISES } from '../data/exercises';
import { PoseArt, FadeIn } from '../components/Visuals';
import { PALETTE } from '../components/Flora';

const POSE = {
  'childs-pose': 'child',
  'cat-cow': 'cat',
  'knee-chest': 'knee',
  'pelvic-tilt': 'rest',
  'walk-short': 'walk',
  'torso-twist': 'cat',
  'supine-twist': 'knee',
  'mobility-5': 'walk',
  'legs-up': 'rest',
  'breathing': 'breathe',
  'shoulder-release': 'breathe',
  'slow-stretch': 'walk',
};

function Detail({ item, tint = COLORS.orchid, onClose }) {

  return (
    <SafeAreaView style={styles.readerWrap} edges={['top']}>
      <ScreenBackdrop variant="a" />
      <Aurora count={3} />
      <ScrollView contentContainerStyle={styles.reader} showsVerticalScrollIndicator={false}>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: tint }]}>{item.duration}</Text>
          <View style={styles.dot} />
          <Text style={styles.meta}>{item.level}</Text>
        </View>
        <Text style={styles.readerTitle}>{item.title}</Text>

        <View style={styles.artWrap}>
          <PoseArt pose={POSE[item.id] || 'rest'} size={150} color={tint} />
        </View>

        <View style={styles.steps}>
          {item.steps.map((s, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.stepNum}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </View>

        {item.note && <Text style={styles.note}>{item.note}</Text>}

        <View style={styles.safe}>
          <Text style={styles.safeText}>{item.safe}</Text>
        </View>
      </ScrollView>

      <Pressable style={styles.close} onPress={onClose}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default function MoveScreen() {
  const [cat, setCat] = useState(MOVE_CATEGORIES[0].id);
  const [open, setOpen] = useState(null);
  useBackHandler(!!open, () => setOpen(null));

  const active = MOVE_CATEGORIES.find((c) => c.id === cat);
  const list = EXERCISES.filter((e) => e.cats.includes(cat));
  const tint = COLORS[active.accent] || PALETTE[active.accent] || COLORS.orchid;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackdrop variant="a" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>Move</Text>
        <Text style={styles.title}>What might help</Text>
        <GrowingVine height={72} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          style={styles.chipScroll}
        >
          {MOVE_CATEGORIES.map((c) => {
            const on = c.id === cat;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCat(c.id)}
                style={[styles.chip, on && { backgroundColor: COLORS[c.accent] || PALETTE[c.accent] || COLORS.orchid, borderColor: COLORS[c.accent] || PALETTE[c.accent] || COLORS.orchid }]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{c.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.blurb}>{active.blurb}</Text>

        {list.map((e, i) => (
          <FadeIn key={e.id} delay={i * 70}>
          <Pressable style={[styles.card, { borderLeftColor: tint }]} onPress={() => setOpen(e)}>
            <PoseArt pose={POSE[e.id] || 'rest'} size={46} color={tint} />
            <View style={[styles.cardMain, { marginLeft: SPACING.md }]}>
              <Text style={styles.cardTitle}>{e.title}</Text>
              <Text style={styles.cardSteps} numberOfLines={1}>{e.steps[0]}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.durBadge, { backgroundColor: tint + '22' }]}>
                  <Text style={[styles.durText, { color: tint }]}>{e.duration}</Text>
                </View>
                <Text style={styles.levelText}>{e.level}</Text>
              </View>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
          </FadeIn>
        ))}

        <Text style={styles.disclaimer}>
          These are gentle suggestions, not medical advice. Stop anything that hurts, and speak to a
          healthcare professional about persistent or severe pain.
        </Text>
      </ScrollView>

      <Modal visible={!!open} animationType="slide" presentationStyle="pageSheet">
        {open && <Detail item={open} tint={tint} onClose={() => setOpen(null)} />}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { paddingTop: SPACING.md, paddingBottom: SPACING.xxl },
  eyebrow: { ...TYPE.label, color: COLORS.gold, paddingHorizontal: SPACING.lg },
  title: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs, paddingHorizontal: SPACING.lg },
  chipScroll: { marginTop: SPACING.lg },
  chipRow: { paddingHorizontal: SPACING.lg, gap: 8 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipOn: { backgroundColor: COLORS.orchid, borderColor: COLORS.orchid },
  chipText: { ...TYPE.body, color: COLORS.textSecondary },
  chipTextOn: { ...TYPE.bodyMedium, color: COLORS.white },
  blurb: {
    ...TYPE.caption,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  card: {
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
    marginHorizontal: SPACING.lg,
    ...SHADOW_SOFT,
  },
  cardMain: { flex: 1 },
  cardSteps: { ...TYPE.caption, color: COLORS.textSecondary, marginTop: 3, lineHeight: 16 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  durBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  durText: { ...TYPE.caption, fontSize: 11, fontFamily: 'Inter_500Medium' },
  levelText: { ...TYPE.caption, color: COLORS.textMuted, fontSize: 11, marginLeft: SPACING.sm },
  artWrap: { alignItems: 'center', marginTop: SPACING.md },
  cardTitle: { ...TYPE.bodyMedium, color: COLORS.ink },
  cardMeta: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 1 },
  chev: { fontSize: 22, color: COLORS.textMuted, marginLeft: SPACING.sm },
  disclaimer: {
    ...TYPE.caption,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    textAlign: 'center',
  },
  readerWrap: { flex: 1, backgroundColor: COLORS.background },
  reader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.xxl },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  meta: { ...TYPE.label, color: COLORS.gold },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: SPACING.sm,
  },
  readerTitle: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs },
  steps: { marginTop: SPACING.lg },
  stepRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  stepNum: { ...TYPE.label, color: COLORS.slate, width: 28 },
  stepText: { ...TYPE.body, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
  note: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 18,
    color: COLORS.slate,
    lineHeight: 25,
    marginTop: SPACING.md,
  },
  safe: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.terracotta,
  },
  safeText: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 22 },
  close: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  closeText: { ...TYPE.bodyMedium, color: COLORS.slate },
});
