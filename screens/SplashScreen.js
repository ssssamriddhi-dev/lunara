import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Easing, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WombLine from '../components/WombLine';
import { GRADIENTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

function Speck({ x, y, r, delay }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 0.7, duration: 1800, delay, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.15, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: (x / 360) * width,
        top: (y / 800) * height,
        width: r,
        height: r,
        borderRadius: r / 2,
        backgroundColor: '#FFFFFF',
        opacity: a,
      }}
    />
  );
}

const SPECKS = [
  [40, 120, 3, 0], [320, 150, 4, 300], [60, 260, 2, 600], [300, 300, 3, 200],
  [30, 420, 3, 900], [330, 470, 2, 400], [70, 560, 4, 1100], [290, 620, 3, 700],
  [45, 690, 2, 500], [315, 720, 3, 1000], [150, 90, 2, 800], [210, 70, 3, 100],
];

export default function SplashScreen({ onDone }) {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(24)).current;
  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 1200, delay: 200, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 1200, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.9, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Pressable style={styles.container} onPress={onDone}>
      <LinearGradient
        colors={GRADIENTS.splash}
        locations={[0, 0.25, 0.5, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />

      {SPECKS.map(([x, y, r, d], i) => (
        <Speck key={i} x={x} y={y} r={r} delay={d} />
      ))}

      <Animated.View style={[styles.center, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <WombLine size={272} />
        <Text style={styles.name}>Lunara</Text>
        <Text style={styles.tagline}>Every phase. Every feeling. Every you.</Text>
      </Animated.View>

      <Animated.Text style={[styles.tap, { opacity: pulse }]}>
        Tap anywhere to begin
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', marginTop: -20 },
  name: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 54,
    color: '#FFFFFF',
    letterSpacing: 3,
    marginTop: 4,
  },
  tagline: {
    fontFamily: 'CormorantGaramond_400Regular',
    fontSize: 19,
    color: '#FFFFFF',
    opacity: 0.92,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 0.4,
  },
  tap: {
    position: 'absolute',
    bottom: 64,
    fontFamily: 'Inter_500Medium',
    fontSize: 10.5,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
});
