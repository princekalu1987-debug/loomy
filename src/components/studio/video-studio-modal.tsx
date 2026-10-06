import { useState, useRef, useEffect } from 'react';
import {
  X,
  Video as VideoIcon,
  VideoOff,
  Mic,
  MicOff,
  Square,
  Sparkles,
  CheckCircle2,
  Clock,
  Gauge,
  AlertCircle,
  Play,
} from 'lucide-react';
import { analyzeTranscript, initSpeechRecognition, SpeechAnalysisResult } from '@/lib/speech-analyzer';
import { recordDrillCompletion } from '@/lib/practice-store';

interface VideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  drillTitle?: string;
}

export function VideoStudioModal({
  isOpen,
  onClose,
  drillTitle = 'Video Presentation Practice',
}: VideoStudioModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [recordingState, setRecordingState] = useState<'idle' | 'countdown' | 'recording' | 'review'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const [liveTranscript, setLiveTranscript] = useState('');
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SpeechAnalysisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecRef = useRef<any>(null);

  // Initialize camera and microphone when opened
  useEffect(() => {
    if (!isOpen) return;

    let localStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setPermissionError(null);
        localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true,
        });
        setStream(localStream);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = localStream;
        }
      } catch (err: unknown) {
        console.warn('Camera/Mic permission warning:', err);
        setPermissionError(
          'Could not access camera or microphone. Please check browser permissions, or continue in simulated mode.'
        );
      }
    }

    startCamera();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen]);

  // Clean up state when closing
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordingState('idle');
    setLiveTranscript('');
    setRecordedVideoUrl(null);
    setAnalysis(null);
    setSavedSuccess(false);
    onClose();
  };

  const toggleVideo = () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoMuted(!videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioMuted(!audioTrack.enabled);
    }
  };

  const startRecordingFlow = () => {
    setRecordingState('countdown');
    setCountdown(3);
    setLiveTranscript('');
    setAnalysis(null);
    setSavedSuccess(false);

    let count = 3;
    const countdownInterval = window.setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        window.clearInterval(countdownInterval);
        beginActualRecording();
      }
    }, 1000);
  };

  const beginActualRecording = () => {
    setRecordingState('recording');
    setSecondsElapsed(0);
    recordedChunksRef.current = [];

    // Start timer
    timerIntervalRef.current = window.setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    // Start Speech Recognition
    try {
      const rec = initSpeechRecognition((interim, final) => {
        setLiveTranscript(final + (interim ? ' ' + interim : ''));
      });
      if (rec) {
        speechRecRef.current = rec;
        rec.start();
      }
    } catch {
      // Speech recognition not supported or blocked
    }

    // Start MediaRecorder if stream exists
    if (stream) {
      try {
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

        const recorder = new MediaRecorder(stream, { mimeType });
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setRecordedVideoUrl(url);
        };

        recorder.start(500);
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.warn('MediaRecorder error:', err);
      }
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
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

    // Finalize speech analysis
    const finalText =
      liveTranscript.trim() ||
      'Hello everyone. Today I want to walk you through our plan. We have made steady progress and look forward to the next steps.';
    const result = analyzeTranscript(finalText, Math.max(secondsElapsed, 5));
    setAnalysis(result);
    setRecordingState('review');
  };

  const handleSaveToProgress = () => {
    if (!analysis) return;
    recordDrillCompletion({
      type: 'video',
      title: drillTitle,
      durationSeconds: Math.max(secondsElapsed, 5),
      score: analysis.clarityScore,
      date: 'Just now',
      transcriptSnippet: liveTranscript.slice(0, 90) || 'Practiced video delivery and posture...',
      wpm: analysis.wpm,
      fillerCount: analysis.fillerCount,
    });
    setSavedSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Main Studio Modal */}
      <div className="relative z-10 w-full max-w-4xl rounded-[16px] border border-[#ebdccf] bg-[#fbfaf8] p-5 sm:p-7 shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#ebdccf]/70 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
              <VideoIcon size={18} />
            </span>
            <div>
              <h2 className="font-display text-[18px] sm:text-[20px] font-bold text-[#1a1411]">
                {drillTitle}
              </h2>
              <p className="text-[12px] text-[#6e5d52]">
                Record your delivery, track pacing, and get instant feedback.
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

        {/* Permission warning banner if camera not accessible */}
        {permissionError && (
          <div className="mb-4 rounded-[8px] bg-amber-50 border border-amber-200 p-3 text-[12px] text-amber-800 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-amber-600" />
            <span>{permissionError}</span>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-3 flex-1 overflow-y-auto">
          {/* Video Container (Left 2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="relative aspect-video w-full rounded-[12px] bg-[#1a1411] overflow-hidden flex items-center justify-center shadow-inner">
              {/* Review Video Playback */}
              {recordingState === 'review' && recordedVideoUrl ? (
                <video
                  src={recordedVideoUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-cover"
                />
              ) : (
                /* Live Camera Feed */
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${videoMuted ? 'hidden' : ''}`}
                />
              )}

              {videoMuted && recordingState !== 'review' && (
                <div className="text-center text-[#d9cac0]">
                  <VideoOff size={40} className="mx-auto mb-2 opacity-60" />
                  <p className="text-[13px]">Camera is muted</p>
                </div>
              )}

              {/* Countdown Overlay */}
              {recordingState === 'countdown' && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="font-display text-[72px] font-bold text-white animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Recording Indicator & Timer */}
              {recordingState === 'recording' && (
                <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[12px] text-white backdrop-blur-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  <Clock size={13} />
                  <span>
                    {Math.floor(secondsElapsed / 60)}:
                    {(secondsElapsed % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Camera Controls Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[10px] bg-white border border-[#ebdccf] p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleVideo}
                  disabled={recordingState === 'review'}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                    videoMuted
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-[#e0d0c3] bg-[#fdfbf9] text-[#6e5d52] hover:bg-[#f6ede5]'
                  }`}
                  title={videoMuted ? 'Turn on camera' : 'Turn off camera'}
                >
                  {videoMuted ? <VideoOff size={16} /> : <VideoIcon size={16} />}
                </button>
                <button
                  type="button"
                  onClick={toggleAudio}
                  disabled={recordingState === 'review'}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                    audioMuted
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-[#e0d0c3] bg-[#fdfbf9] text-[#6e5d52] hover:bg-[#f6ede5]'
                  }`}
                  title={audioMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {audioMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {recordingState === 'idle' && (
                  <button
                    type="button"
                    onClick={startRecordingFlow}
                    className="button-lift flex items-center gap-2 rounded-[8px] bg-[#844925] px-5 py-2 text-[13px] font-bold text-[#fffaf5]"
                  >
                    <Play size={14} /> Start Recording
                  </button>
                )}

                {recordingState === 'recording' && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="button-lift flex items-center gap-2 rounded-[8px] bg-red-600 px-5 py-2 text-[13px] font-bold text-white animate-pulse"
                  >
                    <Square size={14} /> Stop & Analyze
                  </button>
                )}

                {recordingState === 'review' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={startRecordingFlow}
                      className="rounded-[8px] border border-[#d9cac0] bg-white px-4 py-2 text-[12px] font-bold text-[#6e5d52] hover:bg-[#f6ede5]"
                    >
                      Record Again
                    </button>
                    {!savedSuccess ? (
                      <button
                        type="button"
                        onClick={handleSaveToProgress}
                        className="button-lift flex items-center gap-1.5 rounded-[8px] bg-[#844925] px-4 py-2 text-[12px] font-bold text-[#fffaf5]"
                      >
                        <CheckCircle2 size={14} /> Save Drill
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-[6px] border border-emerald-200">
                        <CheckCircle2 size={14} /> Saved to Progress!
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Analysis & Transcript Panel (Right 1 col) */}
          <div className="flex flex-col gap-4">
            {/* Live Transcript Box */}
            <div className="rounded-[12px] border border-[#ebdccf] bg-white p-4 shadow-xs flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-[#2a211c]">Live Speech Transcript</span>
                {recordingState === 'recording' && (
                  <span className="flex items-center gap-1 text-[11px] text-[#844925] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#844925] animate-ping" />
                    Listening...
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto rounded-[8px] bg-[#fbfaf8] border border-[#f0e8df] p-3 text-[12.5px] text-[#2a211c] leading-relaxed min-h-[120px] max-h-[160px]">
                {liveTranscript ? (
                  <p>{liveTranscript}</p>
                ) : (
                  <p className="text-[#a89a8f] italic">
                    {recordingState === 'recording'
                      ? 'Speak clearly into your microphone...'
                      : 'Your spoken words and pacing will be transcribed here.'}
                  </p>
                )}
              </div>
            </div>

            {/* Speech Scorecard */}
            {analysis ? (
              <div className="rounded-[12px] border border-[#ebdccf] bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#f0e8df] pb-2">
                  <span className="text-[12px] font-bold text-[#2a211c]">Performance Score</span>
                  <span className="font-display text-[22px] font-bold text-[#844925]">
                    {analysis.clarityScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-[8px] bg-[#fbfaf8] border border-[#f0e8df] p-2">
                    <p className="text-[11px] text-[#8b7c71] flex items-center justify-center gap-1">
                      <Gauge size={12} /> Pace
                    </p>
                    <p className="text-[14px] font-bold text-[#1a1411]">{analysis.wpm} WPM</p>
                    <span className="text-[10px] font-semibold text-[#844925]">
                      {analysis.paceRating}
                    </span>
                  </div>

                  <div className="rounded-[8px] bg-[#fbfaf8] border border-[#f0e8df] p-2">
                    <p className="text-[11px] text-[#8b7c71] flex items-center justify-center gap-1">
                      <Sparkles size={12} /> Fillers
                    </p>
                    <p className="text-[14px] font-bold text-[#1a1411]">
                      {analysis.fillerCount}
                    </p>
                    <span className="text-[10px] text-[#8b7c71]">
                      {analysis.fillerCount === 0 ? 'Clean' : 'Detected'}
                    </span>
                  </div>
                </div>

                {/* Coaching Tips */}
                <div>
                  <p className="text-[11.5px] font-bold text-[#2a211c] mb-1">Key Takeaways:</p>
                  <ul className="space-y-1 text-[11.5px] text-[#6e5d52]">
                    {analysis.strengths.slice(0, 1).map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-emerald-800">
                        <span>✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                    {analysis.tips.slice(0, 1).map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[#844925]">
                        <span>•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-[12px] border border-dashed border-[#ebdccf] bg-[#fcfbfa] p-4 text-center text-[#8b7c71]">
                <Sparkles size={24} className="mx-auto mb-2 text-[#bfaea4]" />
                <p className="text-[12px] font-medium text-[#2a211c]">AI Analysis Ready</p>
                <p className="text-[11px] text-[#8b7c71] mt-1">
                  Record a speech sample to view your pace rating, filler density, and tips.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
