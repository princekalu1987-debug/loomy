import { useState, useRef, useEffect } from 'react';
import {
  X,
  Mic,
  Square,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Gauge,
  BookOpen,
} from 'lucide-react';
import { analyzeTranscript, initSpeechRecognition, SpeechAnalysisResult } from '@/lib/speech-analyzer';
import { recordDrillCompletion } from '@/lib/practice-store';

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDrill?: string;
}

const VOICE_DRILLS = [
  {
    title: '30-Second Elevator Pitch',
    prompt:
      'Introduce who you are, the core problem you solve, and what value you create — within 30 seconds.',
    sample:
      'Hi, I help engineering teams communicate technical decisions with clarity and conviction to executives.',
  },
  {
    title: 'Vocal Clarity & Steady Pacing',
    prompt:
      'Speak deliberately, enunciate clearly, and aim for a steady conversational pace around 130 WPM.',
    sample:
      'Clear communication is not about speaking quickly; it is about choosing purposeful pauses and precise words.',
  },
  {
    title: 'Overcoming Filler Words',
    prompt:
      'Answer a spontaneous question without saying "um", "uh", or "like". Use silent breath pauses instead.',
    sample:
      'When faced with uncertainty, my primary strategy is to break the challenge down into verifiable hypotheses.',
  },
];

export function VoiceStudioModal({
  isOpen,
  onClose,
  initialDrill = '30-Second Elevator Pitch',
}: VoiceStudioModalProps) {
  const [selectedDrillIndex, setSelectedDrillIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'review'>('idle');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SpeechAnalysisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecRef = useRef<any>(null);

  useEffect(() => {
    const idx = VOICE_DRILLS.findIndex((d) => d.title === initialDrill);
    if (idx !== -1) setSelectedDrillIndex(idx);
  }, [initialDrill]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const handleClose = () => {
    cleanupAudio();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setRecordingState('idle');
    setLiveTranscript('');
    setAudioUrl(null);
    setAnalysis(null);
    setSavedSuccess(false);
    onClose();
  };

  const startVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;

          // Warm Loomy brand gradient
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#844925');
          gradient.addColorStop(1, '#c28157');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - barHeight, barWidth - 3, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          x += barWidth;
        }
      };

      draw();
    } catch (err) {
      console.warn('AudioContext visualizer error:', err);
    }
  };

  const startVoiceRecording = async () => {
    try {
      cleanupAudio();
      setSavedSuccess(false);
      setLiveTranscript('');
      setAnalysis(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      startVisualizer(stream);

      // Start MediaRecorder
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;

      // Start speech recognition
      try {
        const rec = initSpeechRecognition((interim, final) => {
          setLiveTranscript(final + (interim ? ' ' + interim : ''));
        });
        if (rec) {
          speechRecRef.current = rec;
          rec.start();
        }
      } catch {
        // Speech recognition fallback
      }

      setSecondsElapsed(0);
      timerIntervalRef.current = window.setInterval(() => {
        setSecondsElapsed((p) => p + 1);
      }, 1000);

      setRecordingState('recording');
    } catch (err) {
      console.warn('Mic access error:', err);
      alert('Microphone access was denied or is not available. Please allow mic access to record voice drills.');
    }
  };

  const stopVoiceRecording = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    const currentPrompt = VOICE_DRILLS[selectedDrillIndex];
    const finalText = liveTranscript.trim() || currentPrompt.sample;
    const result = analyzeTranscript(finalText, Math.max(secondsElapsed, 4));
    setAnalysis(result);
    setRecordingState('review');
  };

  const handleSaveDrill = () => {
    if (!analysis) return;
    const drill = VOICE_DRILLS[selectedDrillIndex];
    recordDrillCompletion({
      type: 'voice',
      title: drill.title,
      durationSeconds: Math.max(secondsElapsed, 5),
      score: analysis.clarityScore,
      date: 'Just now',
      transcriptSnippet: liveTranscript.slice(0, 90) || drill.sample,
      wpm: analysis.wpm,
      fillerCount: analysis.fillerCount,
    });
    setSavedSuccess(true);
  };

  if (!isOpen) return null;

  const currentDrill = VOICE_DRILLS[selectedDrillIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Main Studio Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-[16px] border border-[#ebdccf] bg-[#fbfaf8] p-5 sm:p-7 shadow-2xl my-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ebdccf]/70 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
              <Mic size={19} />
            </span>
            <div>
              <h2 className="font-display text-[18px] sm:text-[20px] font-bold text-[#1a1411]">
                Voice Practice Studio
              </h2>
              <p className="text-[12px] text-[#6e5d52]">
                Audio drills with real-time waveform visualization and vocal scoring.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#8b7c71] hover:bg-[#f6ede5] hover:text-[#1a1411] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drill Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
          {VOICE_DRILLS.map((d, idx) => (
            <button
              key={d.title}
              type="button"
              onClick={() => {
                if (recordingState !== 'recording') {
                  setSelectedDrillIndex(idx);
                  setRecordingState('idle');
                  setAnalysis(null);
                }
              }}
              disabled={recordingState === 'recording'}
              className={`rounded-[8px] px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-colors border ${
                selectedDrillIndex === idx
                  ? 'bg-[#844925] text-white border-[#844925]'
                  : 'bg-white text-[#6e5d52] border-[#ebdccf] hover:bg-[#f6ede5]'
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>

        {/* Prompt Card */}
        <div className="rounded-[12px] border border-[#ebdccf] bg-[#f9f1ea] p-4 mb-4">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#844925] mb-1">
            <BookOpen size={14} /> Practice Prompt
          </div>
          <p className="text-[13px] font-semibold text-[#1a1411]">{currentDrill.prompt}</p>
          <p className="mt-2 text-[11.5px] text-[#6e5d52] italic border-t border-[#ebdccf]/60 pt-2">
            Example: "{currentDrill.sample}"
          </p>
        </div>

        {/* Waveform / Visualizer Stage */}
        <div className="rounded-[12px] border border-[#ebdccf] bg-white p-5 text-center shadow-xs mb-4">
          <div className="relative h-28 w-full flex items-center justify-center overflow-hidden rounded-[8px] bg-[#fdfbf9] border border-[#f0e8df]">
            <canvas ref={canvasRef} width={400} height={112} className="h-full w-full" />

            {recordingState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8b7c71]">
                <Mic size={28} className="text-[#c28157] mb-1" />
                <p className="text-[12px] font-medium">Click "Start Speaking" when ready</p>
              </div>
            )}

            {recordingState === 'recording' && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-red-100 text-red-700 px-2.5 py-0.5 text-[11px] font-bold">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                <span>
                  {Math.floor(secondsElapsed / 60)}:
                  {(secondsElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {recordingState === 'idle' && (
              <button
                type="button"
                onClick={startVoiceRecording}
                className="button-lift flex items-center gap-2 rounded-[8px] bg-[#844925] px-6 py-2.5 text-[13px] font-bold text-[#fffaf5]"
              >
                <Mic size={15} /> Start Speaking
              </button>
            )}

            {recordingState === 'recording' && (
              <button
                type="button"
                onClick={stopVoiceRecording}
                className="button-lift flex items-center gap-2 rounded-[8px] bg-red-600 px-6 py-2.5 text-[13px] font-bold text-white animate-pulse"
              >
                <Square size={15} /> Finish & Analyze
              </button>
            )}

            {recordingState === 'review' && (
              <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                {audioUrl && (
                  <audio src={audioUrl} controls className="h-9 max-w-[280px]" />
                )}
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="rounded-[8px] border border-[#d9cac0] bg-white px-3 py-2 text-[12px] font-bold text-[#6e5d52] hover:bg-[#f6ede5] flex items-center gap-1.5"
                >
                  <RotateCcw size={13} /> Retry
                </button>
                {!savedSuccess ? (
                  <button
                    type="button"
                    onClick={handleSaveDrill}
                    className="button-lift flex items-center gap-1.5 rounded-[8px] bg-[#844925] px-4 py-2 text-[12px] font-bold text-[#fffaf5]"
                  >
                    <CheckCircle2 size={14} /> Save to Progress
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-[6px] border border-emerald-200">
                    <CheckCircle2 size={14} /> Saved!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Speech Scorecard if in review */}
        {analysis && (
          <div className="rounded-[12px] border border-[#ebdccf] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#f0e8df] pb-2 mb-3">
              <span className="text-[12px] font-bold text-[#2a211c]">Drill Results</span>
              <span className="font-display text-[20px] font-bold text-[#844925]">
                {analysis.clarityScore}% Score
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="rounded-[8px] bg-[#fbfaf8] border border-[#f0e8df] p-2">
                <p className="text-[10.5px] text-[#8b7c71] flex items-center justify-center gap-1">
                  <Gauge size={11} /> Pace
                </p>
                <p className="text-[13px] font-bold text-[#1a1411]">{analysis.wpm} WPM</p>
                <span className="text-[10px] text-[#844925] font-semibold">{analysis.paceRating}</span>
              </div>
              <div className="rounded-[8px] bg-[#fbfaf8] border border-[#f0e8df] p-2">
                <p className="text-[10.5px] text-[#8b7c71] flex items-center justify-center gap-1">
                  <Sparkles size={11} /> Fillers
                </p>
                <p className="text-[13px] font-bold text-[#1a1411]">{analysis.fillerCount}</p>
                <span className="text-[10px] text-[#8b7c71]">Detected</span>
              </div>
              <div className="rounded-[8px] bg-[#fbfaf8] border border-[#f0e8df] p-2">
                <p className="text-[10.5px] text-[#8b7c71] flex items-center justify-center gap-1">
                  <Clock size={11} /> Time
                </p>
                <p className="text-[13px] font-bold text-[#1a1411]">{analysis.durationSeconds}s</p>
                <span className="text-[10px] text-[#8b7c71]">Duration</span>
              </div>
            </div>

            {liveTranscript && (
              <div className="rounded-[6px] bg-[#fdfbf9] border border-[#f0e8df] p-2.5 text-[11.5px] text-[#2a211c] mb-2 max-h-20 overflow-y-auto">
                <span className="font-bold text-[#844925]">Transcript: </span>
                {liveTranscript}
              </div>
            )}

            <div className="text-[11.5px] text-[#6e5d52] space-y-1">
              {analysis.strengths.map((s, i) => (
                <p key={i} className="text-emerald-800">
                  ✓ {s}
                </p>
              ))}
              {analysis.tips.map((t, i) => (
                <p key={i} className="text-[#844925]">
                  • {t}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
