export function loadLeaderboard() {
  if (typeof window === 'undefined') return { player: 0, computer: 0, draws: 0 };
  try {
    const raw = window.localStorage.getItem('ttt_leaderboard');
    if (!raw) return { player: 0, computer: 0, draws: 0 };
    const data = JSON.parse(raw);
    if (
      typeof data === 'object' && data &&
      typeof data.player === 'number' &&
      typeof data.computer === 'number' &&
      typeof data.draws === 'number'
    ) {
      return data;
    }
  } catch (_) {}
  return { player: 0, computer: 0, draws: 0 };
}

export function saveLeaderboard(lb) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('ttt_leaderboard', JSON.stringify(lb));
  } catch (_) {}
}


