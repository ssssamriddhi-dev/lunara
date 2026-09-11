import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { COLORS, SPACING, TYPE, SHADOW_SOFT } from '../constants/theme';
import { PHASE_GUIDE, PHASE_WORDS } from '../data/phases';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PhaseCard({ phase, day }) {
  const [open, setOpen] = useState(false);
  const guide = PHASE_GUIDE[phase];
  if (!guide) return null;

  const tint = COLORS[guide.accent] || COLORS.orchid;
  const words = PHASE_WORDS[phase] || [];
  const word = words[day % words.length];

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(260, 'easeInEaseOut', 'opacity'));
    setOpen(!open);
  };

  return (
    <Pressable style={[styles.card, { borderLeftColor: tint }]} onPress={toggle}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.eyebrow, { color: tint }]}>Day {day} · {guide.title}</Text>
          <Text style={styles.word}>{word}</Text>
        </View>
        <Text style={[styles.chev, open && styles.chevOpen]}>⌄</Text>
      </View>

      {open && (
        <View style={styles.body}>
          <Text style={styles.opening}>{guide.opening}</Text>

          <Text style={styles.h}>What you might notice</Text>
          {guide.feel.map((f, i) => <Row key={i} text={f} tint={tint} />)}

          <Text style={styles.h}>What tends to help</Text>
          {guide.helps.map((h, i) => <Row key={i} text={h} tint={tint} />)}

          <View style={[styles.note, { borderLeftColor: tint }]}>
            <Text style={styles.noteText}>{guide.note}</Text>
          </View>
        </View>
      )}

      {!open && <Text style={styles.more}>Tap to read more about this phase</Text>}
    </Pressable>
  );
}

function Row({ text, tint }) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: tint }]} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    ...SHADOW_SOFT,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start' },
  eyebrow: { ...TYPE.label },
  word: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 21,
    color: COLORS.ink,
    lineHeight: 29,
    marginTop: SPACING.sm,
  },
  chev: { fontSize: 20, color: COLORS.textMuted, marginLeft: SPACING.sm, marginTop: -2 },
  chevOpen: { transform: [{ rotate: '180deg' }] },
  more: { ...TYPE.caption, color: COLORS.textMuted, marginTop: SPACING.md },
  body: { marginTop: SPACING.lg },
  opening: { ...TYPE.body, color: COLORS.textSecondary, lineHeight: 23 },
  h: { ...TYPE.subtitle, fontSize: 15, color: COLORS.ink, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', marginBottom: 9 },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 8, marginRight: SPACING.md },
  rowText: { ...TYPE.body, color: COLORS.textSecondary, flex: 1, lineHeight: 22 },
  note: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderLeftWidth: 3,
  },
  noteText: { ...TYPE.caption, color: COLORS.textSecondary, lineHeight: 19 },
});
