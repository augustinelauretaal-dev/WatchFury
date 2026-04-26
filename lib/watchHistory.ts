export interface WatchHistoryItem {
  id: number;
  title: string;
  poster_path: string | null;
  mediaType: 'tv' | 'movie';
  season?: number;
  episode?: number;
  watchedAt: number;
}

const KEY = 'wf_watch_history';
const MAX = 20;

export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveToWatchHistory(item: WatchHistoryItem) {
  const history = getWatchHistory().filter((h) => h.id !== item.id);
  history.unshift(item);
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, MAX)));
}

export function removeFromWatchHistory(id: number) {
  const history = getWatchHistory().filter((h) => h.id !== id);
  localStorage.setItem(KEY, JSON.stringify(history));
}
