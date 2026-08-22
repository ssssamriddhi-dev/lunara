const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function daysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2 - d1) / MS_PER_DAY);
}

export function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}

export function cycleLengths(periods) {
  const sorted = [...periods].sort((a, b) => (a.start < b.start ? -1 : 1));
  const lengths = [];
  for (let i = 1; i < sorted.length; i++) {
    const len = daysBetween(sorted[i - 1].start, sorted[i].start);
    if (len > 15 && len < 60) lengths.push(len);
  }
  return lengths;
}

export function periodLengths(periods) {
  return periods
    .filter((p) => p.end)
    .map((p) => daysBetween(p.start, p.end) + 1)
    .filter((n) => n > 0 && n < 15);
}

const average = (nums) =>
  nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null;

export function cycleStats(periods) {
  const cycles = cycleLengths(periods);
  const bleeds = periodLengths(periods);

  const recent = cycles.slice(-6);

  return {
    cycleCount: cycles.length,
    averageCycle: average(recent),
    shortestCycle: cycles.length ? Math.min(...cycles) : null,
    longestCycle: cycles.length ? Math.max(...cycles) : null,
    averagePeriod: average(bleeds),
    allCycles: cycles,
  };
}

export function currentCycle(periods) {
  if (!periods.length) return null;

  const sorted = [...periods].sort((a, b) => (a.start < b.start ? 1 : -1));
  const lastStart = sorted[0].start;
  const stats = cycleStats(periods);

  const dayOfCycle = daysBetween(lastStart, todayISO()) + 1;
  if (dayOfCycle < 1) return null;

  const avg = stats.averageCycle;
  const nextStart = avg ? addDays(lastStart, avg) : null;
  const daysUntilNext = nextStart ? daysBetween(todayISO(), nextStart) : null;

  return {
    lastStart,
    dayOfCycle,
    averageCycle: avg,
    nextStart,
    daysUntilNext,
    phase: phaseFor(dayOfCycle, avg, stats.averagePeriod),
  };
}

function phaseFor(day, avgCycle, avgPeriod) {
  const bleedDays = avgPeriod || 5;
  if (day <= bleedDays) return 'Period';
  if (!avgCycle) return 'Follicular';
  const ovulationDay = avgCycle - 14;
  if (day < ovulationDay - 1) return 'Follicular';
  if (day <= ovulationDay + 1) return 'Estimated ovulation';
  return 'Luteal';
}
