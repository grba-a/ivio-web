/**
 * Shared with the footer clock and the hero's sun arc, so "the current moment
 * of the day" is computed exactly once and both visuals stay in agreement.
 */
export function dubrovnikNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zagreb',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return { h, m, label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, fraction: (h * 60 + m) / 1440 };
}
