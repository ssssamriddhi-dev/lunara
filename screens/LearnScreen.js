import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBackHandler from '../components/useBackHandler';
import { COLORS, SPACING, TYPE, SHADOW_SOFT } from '../constants/theme';
import ScreenBackdrop from '../components/ScreenBackdrop';
import { CATEGORIES, ARTICLES } from '../data/learn';
import { PhaseWheel, FadeIn } from '../components/Visuals';

function Article({ article, onClose }) {

  return (
    <SafeAreaView style={styles.readerWrap} edges={['top']}>
      <ScreenBackdrop variant="b" />
      <ScrollView contentContainerStyle={styles.reader} showsVerticalScrollIndicator={false}>
        <Text style={styles.readTime}>{article.read} read</Text>
        <Text style={styles.readerTitle}>{article.title}</Text>

        {article.id === 'phases' && <PhaseWheel size={210} />}

        {article.body.map((b, i) => {
          if (b.t === 'h') return <Text key={i} style={styles.h}>{b.v}</Text>;
          if (b.t === 'p') return <Text key={i} style={styles.p}>{b.v}</Text>;
          if (b.t === 'note') return <Text key={i} style={styles.note}>{b.v}</Text>;
          if (b.t === 'warn') return (
            <View key={i} style={styles.warn}>
              <Text style={styles.warnText}>{b.v}</Text>
            </View>
          );
          if (b.t === 'list') return (
            <View key={i} style={styles.list}>
              {b.v.map((item, j) => (
                <View key={j} style={styles.li}>
                  <View style={styles.bullet} />
                  <Text style={styles.liText}>{item}</Text>
                </View>
              ))}
            </View>
          );
          return null;
        })}
      </ScrollView>

      <Pressable style={styles.close} onPress={onClose}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default function LearnScreen() {
  const [open, setOpen] = useState(null);
  useBackHandler(!!open, () => setOpen(null));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackdrop variant="b" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>Learn</Text>
        <Text style={styles.title}>Your body, explained</Text>

        {CATEGORIES.map((cat) => {
          const items = ARTICLES.filter((a) => a.cat === cat.id);
          if (!items.length) return null;
          return (
            <View key={cat.id} style={styles.section}>
              <Text style={[styles.catTitle, { color: COLORS[cat.accent] || COLORS.ink }]}>
                {cat.title}
              </Text>
              <Text style={styles.catBlurb}>{cat.blurb}</Text>

              {items.map((a, i) => (
                <FadeIn key={a.id} delay={i * 60}>
                <Pressable style={styles.card} onPress={() => setOpen(a)}>
                  <View style={styles.cardMain}>
                    <Text style={styles.cardTitle}>{a.title}</Text>
                    <Text style={styles.cardRead}>{a.read}</Text>
                  </View>
                  <Text style={styles.chev}>›</Text>
                </Pressable>
                </FadeIn>
              ))}
            </View>
          );
        })}

        <Text style={styles.disclaimer}>
          Lunara provides general information only. It cannot diagnose, and it is not a substitute
          for advice from a qualified healthcare professional.
        </Text>
      </ScrollView>

      <Modal visible={!!open} animationType="slide" presentationStyle="pageSheet">
        {open && <Article article={open} onClose={() => setOpen(null)} />}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.xxl },
  eyebrow: { ...TYPE.label, color: COLORS.gold },
  title: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs },
  section: { marginTop: SPACING.xl },
  catTitle: { ...TYPE.title, fontSize: 22 },
  catBlurb: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 2, marginBottom: SPACING.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
    ...SHADOW_SOFT,
  },
  cardMain: { flex: 1 },
  cardTitle: { ...TYPE.bodyMedium, color: COLORS.ink },
  cardRead: { ...TYPE.caption, color: COLORS.textMuted, marginTop: 1 },
  chev: { fontSize: 22, color: COLORS.textMuted, marginLeft: SPACING.sm },
  disclaimer: {
    ...TYPE.caption,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginTop: SPACING.xxl,
    textAlign: 'center',
  },
  readerWrap: { flex: 1, backgroundColor: COLORS.background },
  reader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.xxl },
  readTime: { ...TYPE.label, color: COLORS.gold },
  readerTitle: { ...TYPE.title, color: COLORS.ink, marginTop: SPACING.xs, marginBottom: SPACING.md },
  h: { ...TYPE.subtitle, color: COLORS.ink, marginTop: SPACING.lg, marginBottom: SPACING.xs },
  p: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 24, marginTop: SPACING.sm },
  list: { marginTop: SPACING.sm },
  li: { flexDirection: 'row', marginBottom: 9 },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.orchid,
    marginTop: 8,
    marginRight: SPACING.md,
  },
  liText: { ...TYPE.body, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
  warn: {
    padding: SPACING.md,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceMuted,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.terracotta,
    borderRadius: 0,
    marginTop: SPACING.md,
  },
  warnText: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 22 },
  note: { ...TYPE.caption, color: COLORS.textMuted, marginTop: SPACING.xl, fontStyle: 'italic' },
  close: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  closeText: { ...TYPE.bodyMedium, color: COLORS.slate },
});
