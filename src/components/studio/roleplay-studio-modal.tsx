import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Users,
  Send,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { initSpeechRecognition } from '@/lib/speech-analyzer';
import { recordDrillCompletion } from '@/lib/practice-store';

interface RoleplayStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScenario?: string;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  feedback?: string;
}

interface ScenarioConfig {
  id: string;
  title: string;
  partnerName: string;
  role: string;
  description: string;
  openingLine: string;
  aiResponses: { matchKeywords: string[]; reply: string; tip: string }[];
  defaultReplies: { reply: string; tip: string }[];
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'interview',
    title: 'Job Interview (Behavioral)',
    partnerName: 'Marcus Vance',
    role: 'Hiring Director',
    description: 'Answer tough behavioral questions using the STAR framework under realistic pressure.',
    openingLine:
      "Welcome! Thanks for taking the time today. To start off, could you tell me about a time you led a challenging project with conflicting stakeholder priorities?",
    aiResponses: [
      {
        matchKeywords: ['conflict', 'prioritize', 'stakeholder', 'compromise', 'team'],
        reply:
          "That sounds like a delicate balance. How did you verify that everyone was genuinely aligned rather than just agreeing passively?",
        tip: "Great job focusing on consensus. Emphasize measurable outcomes next.",
      },
      {
        matchKeywords: ['result', 'deliver', 'success', 'metric', 'deadline', 'impact'],
        reply:
          "Impressive metrics. If you had to redo that project today, what is the single biggest thing you would execute differently?",
        tip: "Strong demonstration of accountability. Reflecting on lessons learned shows maturity.",
      },
    ],
    defaultReplies: [
      {
        reply: "Understood. Can you walk me through how you handled the communication flow during that period?",
        tip: "Be specific with examples of communication cadences (e.g. daily standups, weekly summaries).",
      },
      {
        reply: "That clarifies things well. What would your previous manager say is your greatest superpower in these situations?",
        tip: "Own your strengths with humble confidence.",
      },
    ],
  },
  {
    id: 'negotiation',
    title: 'Salary & Value Negotiation',
    partnerName: 'Elena Rostova',
    role: 'VP of People',
    description: 'Advocate for higher compensation grounded in delivered value and market benchmarks.',
    openingLine:
      "We've reviewed your proposal. While we appreciate your contributions, our standard budget ceiling is pretty firm for this band. Why should we adjust the offer upwards?",
    aiResponses: [
      {
        matchKeywords: ['market', 'benchmark', 'data', 'industry', 'research'],
        reply:
          "I hear your market point. Beyond market rates, how has your direct output affected team velocity or revenue this past quarter?",
        tip: "Anchor your case in specific dollar or efficiency impact.",
      },
      {
        matchKeywords: ['revenue', 'growth', 'expanded', 'efficiency', 'led'],
        reply:
          "Those numbers definitely stand out. If base salary has tight bands, would you be open to exploring bonus targets or equity incentives?",
        tip: "Good leverage! Keep options flexible while holding firm on total comp.",
      },
    ],
    defaultReplies: [
      {
        reply: "I appreciate the transparency. Let's see how we can bridge the difference between the expectations.",
        tip: "Stay collaborative, framing it as problem-solving together.",
      },
    ],
  },
  {
    id: 'networking',
    title: 'Networking & Casual Introduction',
    partnerName: 'David Chen',
    role: 'Industry Founder',
    description: 'Make a lasting, memorable impression at an industry mixer without sounding robotic.',
    openingLine:
      "Hey there! It's pretty crowded tonight. What brings you to this summit?",
    aiResponses: [
      {
        matchKeywords: ['building', 'startup', 'product', 'design', 'ai', 'engineer'],
        reply:
          "Oh very cool! That space is moving so fast right now. What has been the most surprising roadblock you've encountered so far?",
        tip: "Engaging response! Showing curiosity in return builds genuine rapport.",
      },
    ],
    defaultReplies: [
      {
        reply: "Totally agree with you. Have you checked out any of the demo booths today?",
        tip: "Keep the conversational tennis match going by tossing a question back.",
      },
    ],
  },
];

export function RoleplayStudioModal({
  isOpen,
  onClose,
  initialScenario = 'interview',
}: RoleplayStudioModalProps) {
  const [activeScenarioId, setActiveScenarioId] = useState(initialScenario);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isMicListening, setIsMicListening] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // Initialize opening line when scenario changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          sender: 'ai',
          text: scenario.openingLine,
        },
      ]);
      setIsCompleted(false);
      setSavedSuccess(false);
      setInputText('');
    }
  }, [isOpen, activeScenarioId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  useEffect(() => {
    return () => {
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleClose = () => {
    if (speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsMicListening(false);
    onClose();
  };

  const toggleMic = () => {
    if (isMicListening) {
      if (speechRecRef.current) {
        try {
          speechRecRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsMicListening(false);
    } else {
      try {
        const rec = initSpeechRecognition((interim, final) => {
          setInputText(final + (interim ? ' ' + interim : ''));
        });
        if (rec) {
          speechRecRef.current = rec;
          rec.start();
          setIsMicListening(true);
        } else {
          alert('Speech recognition is not supported in this browser. You can type your response.');
        }
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || isAiTyping) return;

    if (isMicListening && speechRecRef.current) {
      try {
        speechRecRef.current.stop();
      } catch {
        // ignore
      }
      setIsMicListening(false);
    }

    const userText = inputText.trim();
    setInputText('');

    // Append user message
    const userMsgIndex = messages.length;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    setIsAiTyping(true);

    // Simulate AI thinking and smart contextual answer
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let matched = scenario.aiResponses.find((r) =>
        r.matchKeywords.some((kw) => lower.includes(kw))
      );

      if (!matched) {
        const defaultIndex = userMsgIndex % scenario.defaultReplies.length;
        matched = scenario.defaultReplies[defaultIndex];
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: matched.reply,
          feedback: matched.tip,
        },
      ]);
      setIsAiTyping(false);
    }, 1200);
  };

  const handleFinishScenario = () => {
    setIsCompleted(true);
  };

  const handleSaveToProgress = () => {
    recordDrillCompletion({
      type: 'roleplay',
      title: `Roleplay: ${scenario.title}`,
      durationSeconds: messages.length * 30,
      score: 86,
      date: 'Just now',
      transcriptSnippet: messages[messages.length - 1]?.text.slice(0, 85) || 'Completed scenario dialogue.',
      wpm: 135,
      fillerCount: 1,
    });
    setSavedSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Main Studio Modal */}
      <div className="relative z-10 w-full max-w-3xl rounded-[16px] border border-[#ebdccf] bg-[#fbfaf8] p-5 sm:p-7 shadow-2xl my-auto flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ebdccf]/70 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
              <Users size={18} />
            </span>
            <div>
              <h2 className="font-display text-[18px] sm:text-[20px] font-bold text-[#1a1411]">
                AI Roleplay Simulator
              </h2>
              <p className="text-[12px] text-[#6e5d52]">
                Interactive conversation practice with realistic AI partners.
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

        {/* Scenario Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScenarioId(s.id)}
              className={`rounded-[8px] px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-colors border ${
                activeScenarioId === s.id
                  ? 'bg-[#844925] text-white border-[#844925]'
                  : 'bg-white text-[#6e5d52] border-[#ebdccf] hover:bg-[#f6ede5]'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Scenario Context Card */}
        <div className="rounded-[10px] border border-[#ebdccf] bg-[#f9f1ea] p-3 flex items-center justify-between mb-4">
          <div>
            <p className="text-[12.5px] font-bold text-[#1a1411]">
              Partner: {scenario.partnerName} ({scenario.role})
            </p>
            <p className="text-[11.5px] text-[#6e5d52]">{scenario.description}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMessages([{ sender: 'ai', text: scenario.openingLine }]);
              setIsCompleted(false);
            }}
            className="flex items-center gap-1 rounded-[6px] bg-white border border-[#ebdccf] px-2.5 py-1 text-[11px] font-semibold text-[#844925] hover:bg-[#f6ede5]"
          >
            <RotateCcw size={12} /> Restart
          </button>
        </div>

        {/* Chat Stream Area */}
        <div className="flex-1 overflow-y-auto space-y-3.5 rounded-[12px] border border-[#ebdccf] bg-white p-4 shadow-inner min-h-[220px] max-h-[360px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  m.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                    m.sender === 'user'
                      ? 'bg-[#844925] text-white'
                      : 'bg-[#f6ede5] text-[#844925] border border-[#e4d1bf]'
                  }`}
                >
                  {m.sender === 'user' ? <User size={14} /> : <Bot size={15} />}
                </span>
                <div
                  className={`rounded-[12px] p-3.5 text-[13px] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#844925] text-white rounded-tr-none'
                      : 'bg-[#f9f1ea] text-[#1a1411] border border-[#ebdccf] rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>

              {/* In-line AI Coaching Feedback pill */}
              {m.feedback && (
                <div className="mt-1.5 ml-10 flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] text-emerald-800">
                  <Sparkles size={12} className="text-emerald-600" />
                  <span>{m.feedback}</span>
                </div>
              )}
            </div>
          ))}

          {isAiTyping && (
            <div className="flex items-center gap-2 text-[#8b7c71] text-[12px] italic">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                <Bot size={13} />
              </span>
              <span>{scenario.partnerName} is thinking...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Completed Scorecard Modal Overlay if finished */}
        {isCompleted ? (
          <div className="mt-4 rounded-[12px] border border-[#ebdccf] bg-[#f9f1ea] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-[22px] font-bold text-[#844925]">
                  86% Score
                </span>
                <span className="text-[13px] font-bold text-[#1a1411]">
                  Scenario Completed!
                </span>
              </div>
              <p className="text-[12px] text-[#6e5d52]">
                Strong communication clarity and conversational adaptability demonstrated.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!savedSuccess ? (
                <button
                  type="button"
                  onClick={handleSaveToProgress}
                  className="button-lift flex items-center gap-1.5 rounded-[8px] bg-[#844925] px-4 py-2 text-[12px] font-bold text-[#fffaf5]"
                >
                  <CheckCircle2 size={14} /> Save to Progress
                </button>
              ) : (
                <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-[6px] border border-emerald-200">
                  <CheckCircle2 size={14} /> Logged!
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Input Bar */
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
                isMicListening
                  ? 'border-red-400 bg-red-100 text-red-600 animate-pulse'
                  : 'border-[#ebdccf] bg-white text-[#6e5d52] hover:bg-[#f6ede5]'
              }`}
              title={isMicListening ? 'Stop listening' : 'Speak your answer'}
            >
              {isMicListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isMicListening ? 'Listening to speech...' : 'Type or speak your reply...'}
              className="flex-1 rounded-[10px] border border-[#d9cac0] bg-white px-4 py-2.5 text-[13px] text-[#1a1411] placeholder:text-[#a89a8f] focus:border-[#844925] focus:outline-none focus:ring-1 focus:ring-[#844925]"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isAiTyping}
              className="button-lift flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#844925] text-white disabled:opacity-50"
            >
              <Send size={16} />
            </button>

            {messages.length >= 3 && (
              <button
                type="button"
                onClick={handleFinishScenario}
                className="rounded-[8px] bg-[#f6ede5] border border-[#e4d1bf] px-3 py-2 text-[12px] font-bold text-[#844925] hover:bg-[#eddccf] whitespace-nowrap ml-1"
              >
                Finish & Evaluate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
