import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  checkins: 'lunara:checkins',
  nickname: 'lunara:nickname',
  periods: 'lunara:periods',
};

async function read(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.log('Storage read failed:', key, e);
    return fallback;
  }
}

async function write(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.log('Storage write failed:', key, e);
    return false;
  }
}

export const todayKey = () => new Date().toISOString().slice(0, 10);

export async function getCheckins() {
  return read(KEYS.checkins, {});
}

export async function saveCheckin(date, moods) {
  const all = await getCheckins();
  if (moods.length === 0) {
    delete all[date];
  } else {
    all[date] = { moods, savedAt: new Date().toISOString() };
  }
  return write(KEYS.checkins, all);
}

export async function getCheckin(date) {
  const all = await getCheckins();
  return all[date] || null;
}

export async function clearAll() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
