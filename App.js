import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import SplashScreen from './screens/SplashScreen';
import Onboarding from './screens/Onboarding';
import { isOnboarded } from './storage/store';
import { COLORS } from './constants/theme';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [onboarded, setOnboarded] = useState(null);

  const [loaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    isOnboarded().then(setOnboarded);
  }, []);

  if (!loaded || onboarded === null) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.slate} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {!splashDone ? (
        <SplashScreen onDone={() => setSplashDone(true)} />
      ) : !onboarded ? (
        <Onboarding onDone={() => setOnboarded(true)} />
      ) : (
        <AppNavigator />
      )}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
