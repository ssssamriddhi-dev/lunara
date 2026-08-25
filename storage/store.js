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

export async function getPeriods() {
  const list = await read(KEYS.periods, []);
  return list.sort((a, b) => (a.start < b.start ? 1 : -1));
}

export async function savePeriod(entry) {
  const list = await read(KEYS.periods, []);
  const withoutDupe = list.filter((p) => p.id !== entry.id);
  withoutDupe.push(entry);
  return write(KEYS.periods, withoutDupe);
}

export async function deletePeriod(id) {
  const list = await read(KEYS.periods, []);
  return write(KEYS.periods, list.filter((p) => p.id !== id));
}

export async function getNickname() {
  return read(KEYS.nickname, null);
}

export async function setNickname(name) {
  return write(KEYS.nickname, name);
}

export async function dataSummary() {
  const checkins = await getCheckins();
  const periods = await read(KEYS.periods, []);
  const moodCounts = {};
  Object.values(checkins).forEach((c) => {
    (c.moods || []).forEach((m) => { moodCounts[m] = (moodCounts[m] || 0) + 1; });
  });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  return {
    checkinDays: Object.keys(checkins).length,
    periodCount: periods.length,
    topMood: topMood ? topMood[0] : null,
    topMoodCount: topMood ? topMood[1] : 0,
  };
}
