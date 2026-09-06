import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

export default function useBackHandler(active, onBack) {
  useEffect(() => {
    if (Platform.OS !== 'android' || !active) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [active, onBack]);
}
