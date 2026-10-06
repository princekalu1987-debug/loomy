import { useState, useEffect } from 'react';

export interface DrillSession {
  id: string;
  type: 'voice' | 'video' | 'roleplay';
  title: string;
  durationSeconds: number;
  score: number;
  date: string;
  timestamp: number;
  transcriptSnippet: string;
  wpm?: number;
  fillerCount?: number;
}

export interface PracticeStats {
  communicationProgress: number;
  publicSpeakingProgress: number;
  socialConfidenceProgress: number;
  challengesCompleted: number;
  streakDays: number;
}

const SESSIONS_KEY = 'loomy_drill_sessions';
const STATS_KEY = 'loomy_practice_stats';

const INITIAL_SESSIONS: DrillSession[] = [
  {
    id: 'seed-1',
    type: 'voice',
    title: 'Introduction Practice',
    durationSeconds: 45,
    score: 84,
    date: 'Today',
    timestamp: Date.now() - 3600000,
    transcriptSnippet: "Hello everyone, my name is Alex and I'm excited to share our progress...",
    wpm: 132,
    fillerCount: 1,
  },
  {
    id: 'seed-2',
    type: 'roleplay',
    title: 'Roleplay - Networking',
    durationSeconds: 120,
    score: 79,
    date: 'Yesterday',
    timestamp: Date.now() - 86400000,
    transcriptSnippet: "Nice to meet you! How did you get started in this space?",
    wpm: 140,
    fillerCount: 3,
  },
  {
    id: 'seed-3',
    type: 'voice',
    title: 'Voice Clarity Drill',
    durationSeconds: 30,
    score: 88,
    date: '2 days ago',
    timestamp: Date.now() - 172800000,
    transcriptSnippet: "She sells seashells by the seashore with clear enunciation.",
    wpm: 128,
    fillerCount: 0,
  },
];

const INITIAL_STATS: PracticeStats = {
  communicationProgress: 78,
  publicSpeakingProgress: 64,
  socialConfidenceProgress: 56,
  challengesCompleted: 0,
  streakDays: 7,
};

// Dispatch custom event on change
function dispatchStoreUpdate() {
  window.dispatchEvent(new Event('loomy_practice_update'));
}

export function getSavedSessions(): DrillSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return INITIAL_SESSIONS;
}

export function getSavedStats(): PracticeStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return INITIAL_STATS;
}

export function recordDrillCompletion(session: Omit<DrillSession, 'id' | 'timestamp'>) {
  const currentSessions = getSavedSessions();
  const currentStats = getSavedStats();

  const newSession: DrillSession = {
    ...session,
    id: `drill-${Date.now()}`,
    timestamp: Date.now(),
  };

  const updatedSessions = [newSession, ...currentSessions];

  // Increment skills slightly based on type
  const updatedStats: PracticeStats = {
    ...currentStats,
    challengesCompleted: currentStats.challengesCompleted + 1,
    communicationProgress: Math.min(100, currentStats.communicationProgress + (session.type === 'roleplay' ? 3 : 2)),
    publicSpeakingProgress: Math.min(100, currentStats.publicSpeakingProgress + (session.type === 'video' ? 4 : 2)),
    socialConfidenceProgress: Math.min(100, currentStats.socialConfidenceProgress + (session.type === 'roleplay' ? 4 : 2)),
  };

  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
  } catch {
    // storage error
  }

  dispatchStoreUpdate();
  return newSession;
}

export function usePracticeStore() {
  const [sessions, setSessions] = useState<DrillSession[]>(getSavedSessions);
  const [stats, setStats] = useState<PracticeStats>(getSavedStats);

  useEffect(() => {
    const handleUpdate = () => {
      setSessions(getSavedSessions());
      setStats(getSavedStats());
    };

    window.addEventListener('loomy_practice_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('loomy_practice_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    sessions,
    stats,
    recordDrillCompletion,
  };
}
