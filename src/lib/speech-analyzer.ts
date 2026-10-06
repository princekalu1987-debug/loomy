export interface SpeechAnalysisResult {
  totalWords: number;
  durationSeconds: number;
  wpm: number;
  paceRating: 'Too Slow' | 'Optimal' | 'Fast' | 'Rushed';
  fillerCount: number;
  fillersDetected: { word: string; count: number }[];
  clarityScore: number;
  tone?: string;
  summary?: string;
  strengths: string[];
  tips: string[];
  isAiEvaluated?: boolean;
}

export const COMMON_FILLERS = [
  'um',
  'uh',
  'like',
  'you know',
  'actually',
  'basically',
  'sort of',
  'kind of',
  'literally',
  'honestly',
  'i mean',
  'right',
];

export function analyzeTranscriptLocal(text: string, durationSeconds: number): SpeechAnalysisResult {
  const safeDuration = Math.max(durationSeconds, 3);
  const words = text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const totalWords = words.length;
  const wpm = Math.round((totalWords / safeDuration) * 60);

  // Determine pace
  let paceRating: SpeechAnalysisResult['paceRating'] = 'Optimal';
  if (wpm < 110) {
    paceRating = 'Too Slow';
  } else if (wpm <= 155) {
    paceRating = 'Optimal';
  } else if (wpm <= 180) {
    paceRating = 'Fast';
  } else {
    paceRating = 'Rushed';
  }

  // Count filler words
  const lowerText = ` ${text.toLowerCase()} `;
  const fillersDetected: { word: string; count: number }[] = [];
  let fillerCount = 0;

  for (const filler of COMMON_FILLERS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillersDetected.push({ word: filler, count: matches.length });
      fillerCount += matches.length;
    }
  }

  // Calculate clarity score (out of 100)
  const fillerPenalty = Math.min(35, (fillerCount / Math.max(totalWords, 1)) * 120);
  const paceDeviation = Math.abs(135 - wpm);
  const pacePenalty = Math.min(30, (paceDeviation / 70) * 30);
  const lengthBonus = Math.min(10, totalWords > 20 ? 10 : (totalWords / 20) * 10);

  let rawScore = Math.round(95 - fillerPenalty - pacePenalty + lengthBonus);
  rawScore = Math.max(50, Math.min(98, rawScore));

  const strengths: string[] = [];
  const tips: string[] = [];

  if (paceRating === 'Optimal') {
    strengths.push('Great natural speaking pace (120–155 WPM).');
  } else if (paceRating === 'Too Slow') {
    tips.push('Try to build more momentum and energy to keep listeners fully engaged.');
  } else {
    tips.push('Take intentional pauses between thoughts to let key points land.');
  }

  if (fillerCount === 0 && totalWords > 8) {
    strengths.push('Clean articulation with zero filler words.');
  } else if (fillerCount <= 2) {
    strengths.push('Minimal use of verbal fillers.');
  } else {
    tips.push(`Replace verbal crutches ("${fillersDetected[0]?.word || 'um'}") with silent breath pauses.`);
  }

  if (totalWords > 25) {
    strengths.push('Good sustained flow and sentence continuity.');
  } else {
    tips.push('Expand on your elaboration and add a concrete example.');
  }

  return {
    totalWords,
    durationSeconds: Math.round(durationSeconds),
    wpm,
    paceRating,
    fillerCount,
    fillersDetected,
    clarityScore: rawScore,
    strengths,
    tips,
    isAiEvaluated: false,
  };
}

/**
 * Perform real AI speech analysis using Loomy Gemini intelligence server endpoint,
 * with seamless fallback to acoustic local heuristics.
 */
export async function analyzeTranscriptWithAi(
  text: string,
  durationSeconds: number,
  drillContext?: string
): Promise<SpeechAnalysisResult> {
  const localBase = analyzeTranscriptLocal(text, durationSeconds);

  try {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: text,
        durationSeconds,
        drillContext,
      }),
    });

    if (!res.ok) {
      console.warn('AI analysis API returned non-OK status:', res.status);
      return localBase;
    }

    const data = await res.json();
    return {
      totalWords: localBase.totalWords,
      durationSeconds: Math.round(durationSeconds),
      wpm: typeof data.wpm === 'number' ? data.wpm : localBase.wpm,
      paceRating: data.paceRating || localBase.paceRating,
      fillerCount: typeof data.fillerCount === 'number' ? data.fillerCount : localBase.fillerCount,
      fillersDetected: Array.isArray(data.fillersDetected) ? data.fillersDetected : localBase.fillersDetected,
      clarityScore: typeof data.clarityScore === 'number' ? data.clarityScore : localBase.clarityScore,
      tone: data.tone || 'Confident & articulate',
      summary: data.summary || '',
      strengths: Array.isArray(data.strengths) && data.strengths.length > 0 ? data.strengths : localBase.strengths,
      tips: Array.isArray(data.tips) && data.tips.length > 0 ? data.tips : localBase.tips,
      isAiEvaluated: true,
    };
  } catch (err) {
    console.warn('Falling back to local speech analyzer due to error:', err);
    return localBase;
  }
}

// Backward-compatible sync export
export const analyzeTranscript = analyzeTranscriptLocal;

// Browser SpeechRecognition helper
export function initSpeechRecognition(
  onTranscript: (interim: string, finalTranscript: string) => void,
  onError?: (err: unknown) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRec) {
    return null;
  }

  try {
    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let accumulatedFinal = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          accumulatedFinal += (accumulatedFinal ? ' ' : '') + item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }
      onTranscript(interim, accumulatedFinal);
    };

    if (onError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (e: any) => {
        // Ignore normal stops
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          onError(e);
        }
      };
    }

    return recognition;
  } catch (err) {
    if (onError) onError(err);
    return null;
  }
}
