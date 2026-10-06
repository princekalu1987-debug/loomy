import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  BarChart3,
  Check,
  CircleUserRound,
  FileText,
  MessageCircle,
  Mic2,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Video,
  Volume2,
  Bell,
  Menu,
  Home as HomeIcon,
  Star,
  Layers,
  Settings,
  HelpCircle,
  Shield,
  Clock,
  BookOpen,
  Users,
  Calendar,
  Crown,
  Lock,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Dashboard from '@/pages/dashboard';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/lib/auth-context';

const queryClient = new QueryClient();

function LoomyMark() {
  return (
    <span className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
      <span className="absolute h-[15px] w-[9px] rotate-45 rounded-[7px] border-[1.25px] border-[#754421]" />
      <span className="absolute h-[15px] w-[9px] -rotate-45 rounded-[7px] border-[1.25px] border-[#754421]" />
    </span>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const benefits = [
    { icon: <CircleUserRound />, title: 'Personalized', sub: 'Coaching' },
    { icon: <FileText />, title: 'Real Practice', sub: 'Scenarios' },
    { icon: <MessageCircle />, title: 'Intelligent', sub: 'Feedback' },
    { icon: <TrendingUp />, title: 'Track Your', sub: 'Progress' },
  ];
  const stages = [
    { number: '01', icon: <FileText />, title: 'Learn', text: 'Understand the skill' },
    { number: '02', icon: <Mic2 />, title: 'Practice', text: 'Use it in real situations' },
    { number: '03', icon: <BarChart3 />, title: 'Get Feedback', text: 'See what to improve' },
    { number: '04', icon: <Target />, title: 'Improve', text: 'Make intentional changes' },
    { number: '05', icon: <Star />, title: 'Master', text: 'Demonstrate the skill' },
    { number: '06', icon: <Check />, title: 'Apply', text: 'Use it in real life' },
  ];
  const features = [
    { icon: <Mic2 />, title: 'Voice Coaching', text: 'Record your voice and get AI feedback on clarity, pace, and tone.' },
    { icon: <Video />, title: 'Video Coaching', text: 'Record videos and improve your delivery, posture and presence.' },
    { icon: <MessageCircle />, title: 'AI Roleplay', text: 'Practice real conversations in realistic scenarios.' },
    { icon: <Volume2 />, title: 'Pronunciation Training', text: 'Practice words and sounds until you speak with clarity.' },
    { icon: <TrendingUp />, title: 'Progress Tracking', text: 'Track your real progress and see improvements over time.' },
    { icon: <Target />, title: 'Skill Mastery', text: 'Master skills through consistent practice and feedback.' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="loomy-page grain min-h-[100dvh] overflow-x-hidden">
      <div className="loomy-shell w-full overflow-hidden">
        <header className="relative z-20 flex h-[64px] items-center justify-between border-b border-[#eee8e2] bg-[#fbfaf8]/90 px-8 sm:px-16">
          <a href="#top" data-testid="link-logo" className="flex items-center gap-2 text-[#171311]">
            <LoomyMark />
            <span className="text-[19px] font-bold tracking-[-.06em]">LOOMY</span>
          </a>
          <nav className="hidden items-center gap-10 text-[14px] font-semibold text-[#211b18] sm:flex" aria-label="Main navigation">
            <a href="#how-it-works" data-testid="link-how-it-works" className="loomy-link">How It Works</a>
            <a href="#features" data-testid="link-features" className="loomy-link">Features</a>
            <a href="#founder" data-testid="link-founder" className="loomy-link">About</a>
            <a href="#founder" data-testid="link-founder-2" className="loomy-link">Founder</a>
            <a href="#preview" data-testid="link-preview" className="loomy-link">Preview</a>
            <a href="/dashboard" data-testid="link-dashboard" className="loomy-link font-bold text-[#844925]">Dashboard</a>
          </nav>
          <div className="hidden items-center gap-6 text-[14px] font-semibold sm:flex">
            <a href="/dashboard" data-testid="link-log-in" className="loomy-link">Log in</a>
            <a href="/dashboard" data-testid="link-get-started" className="button-lift rounded-[6px] bg-[#844925] px-5 py-2.5 text-[#fffaf5]">Get Started</a>
          </div>
          <button
            type="button"
            data-testid="button-mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md border border-[#e4dbd2] p-2 sm:hidden"
          >
            <span className="block h-px w-5 bg-[#5b3823]" />
            <span className="my-1.5 block h-px w-5 bg-[#5b3823]" />
            <span className="block h-px w-5 bg-[#5b3823]" />
          </button>
          {menuOpen && (
            <nav className="absolute left-3 right-3 top-[59px] flex flex-col gap-0.5 rounded-lg border border-[#e7ded6] bg-[#fbfaf8] p-2 text-[14px] shadow-[0_9px_24px_rgba(75,42,24,.1)] sm:hidden">
              <a href="#how-it-works" onClick={closeMenu} className="rounded-md px-3 py-2 hover:bg-[#f0e7de]">How It Works</a>
              <a href="#features" onClick={closeMenu} className="rounded-md px-3 py-2 hover:bg-[#f0e7de]">Features</a>
              <a href="#founder" onClick={closeMenu} className="rounded-md px-3 py-2 hover:bg-[#f0e7de]">About</a>
              <a href="#preview" onClick={closeMenu} className="rounded-md px-3 py-2 hover:bg-[#f0e7de]">Preview</a>
              <a href="/dashboard" onClick={closeMenu} className="rounded-md px-3 py-2 font-bold text-[#844925] hover:bg-[#f0e7de]">Dashboard</a>
              <a href="/dashboard" onClick={closeMenu} className="mt-1 rounded-md bg-[#844925] px-3 py-2 font-semibold text-[#fffaf5]">Get Started</a>
            </nav>
          )}
        </header>

        <main id="top">
          <section className="relative min-h-[480px] overflow-hidden border-b border-[#eee8e2] px-8 pb-16 pt-16 sm:min-h-[580px] sm:px-16 sm:pt-[88px]">
            <div className="relative z-[1] max-w-[500px]">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eadacb] bg-[#fbfaf8] px-4 py-1.5 text-[12px] font-bold tracking-[.07em] text-[#754421]">
                <Sparkles size={15} strokeWidth={1.5} /> AI COACH FOR CONFIDENCE
              </div>
              <h1 className="font-display text-[64px] leading-[.84] tracking-[-.035em] text-[#171311] sm:text-[88px]">
                Build the<br />confidence<br />to <span className="font-display italic text-[#8d4c28]">become you.</span>
              </h1>
              <p className="mt-6 max-w-[370px] text-[15px] leading-[1.65] text-[#5a514b] sm:max-w-[430px] sm:text-[17px]">
                Loomy is your AI confidence and personal-growth coach. Practice real-world skills, get intelligent feedback, and master them for life.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <a href="/dashboard" data-testid="button-start-journey" className="button-lift inline-flex h-12 items-center gap-2.5 rounded-[6px] bg-[#844925] px-6 text-[15px] font-semibold text-[#fffaf5]">
                  Start Your Journey <ArrowRight size={17} />
                </a>
                <a href="#how-it-works" data-testid="button-see-how-it-works" className="button-lift inline-flex h-12 items-center gap-2 rounded-[6px] border border-[#c8ae9d] bg-transparent px-6 text-[15px] font-semibold text-[#2b201a] hover:bg-[#f6ede5]">
                  See How It Works <Play size={15} fill="currentColor" strokeWidth={1.5} />
                </a>
              </div>
            </div>
            <div className="pointer-events-none absolute left-[8%] top-[54px] h-[380px] w-[100%] opacity-90 sm:left-[5%] sm:top-[56px] sm:h-[480px] sm:w-[100%]">
              <ThreadArt />
            </div>
            <div className="pointer-events-none absolute right-[34%] top-[62px] hidden h-8 w-8 opacity-60 sm:block">
              <span className="absolute left-1/2 top-0 h-8 w-px rotate-45 bg-[#d7b39c]" />
              <span className="absolute left-1/2 top-0 h-8 w-px -rotate-45 bg-[#d7b39c]" />
            </div>
          </section>

          <section aria-label="Loomy benefits" className="grid grid-cols-2 border-b border-[#eee8e2] bg-[#fcfbf9] sm:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} data-testid={`benefit-${index}`} className={`flex min-h-[72px] items-center gap-3 px-5 sm:justify-center sm:px-3 ${index < 3 ? 'border-r border-[#eee8e2]' : ''} ${index > 1 ? 'border-t sm:border-t-0' : ''}`}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#87502f] [&>svg]:h-[18px] [&>svg]:w-[18px]">{benefit.icon}</span>
                <span className="text-[13px] font-semibold leading-[1.35] text-[#2a211c]">{benefit.title}<br />{benefit.sub}</span>
              </div>
            ))}
          </section>

          <section id="how-it-works" className="scroll-mt-5 border-b border-[#eee8e2] px-8 py-14 sm:px-20 sm:py-20">
            <div className="text-center">
              <p className="eyebrow mb-3 text-[#986044]">How Loomy Works</p>
              <h2 className="font-display text-[38px] leading-none tracking-[-.02em] text-[#1a1411] sm:text-[48px]">A proven path to real confidence.</h2>
            </div>
            <div className="mx-auto mt-12 grid max-w-[1100px] grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-6 sm:gap-0">
              {stages.map((stage, index) => (
                <div key={stage.number} className="relative text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#ead9cb] bg-[#fdfaf7] text-[#87502f] [&>svg]:h-[22px] [&>svg]:w-[22px]">
                    {stage.icon}
                  </div>
                  <p className="mt-3 text-[13px] font-bold text-[#2a211c]">{stage.title}</p>
                  <p className="mx-auto mt-1 max-w-[110px] text-[12px] leading-[1.4] text-[#776b62]">{stage.text}</p>
                  {index < stages.length - 1 && <ArrowRight size={16} className="absolute -right-3 top-4 hidden text-[#b28e77] sm:block" />}
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="scroll-mt-5 border-b border-[#e1d5ca] bg-[#eee4da] px-8 py-14 sm:px-20 sm:py-20">
            <div className="text-center">
              <p className="eyebrow mb-3 text-[#986044]">Features</p>
              <h2 className="font-display text-[38px] leading-none tracking-[-.02em] text-[#1a1411] sm:text-[48px]">Powerful features to help you grow.</h2>
            </div>
            <div className="mx-auto mt-12 grid max-w-[1200px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <article key={feature.title} data-testid={`feature-card-${index}`} className="group min-h-[160px] rounded-[10px] border border-[#e1d3c8] bg-[#f8f3ed] p-6 transition-colors hover:bg-[#fcfaf7] hover:shadow-sm">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8beaa] bg-[#fbfaf8] text-[#8d4c28] [&>svg]:h-[20px] [&>svg]:w-[20px]">{feature.icon}</span>
                  </div>
                  <h3 className="mt-5 text-[16px] font-semibold text-[#2c211b]">{feature.title}</h3>
                  <p className="mt-2 max-w-[245px] text-[13px] leading-[1.55] text-[#75675e]">{feature.text}</p>
                  <a href="#final-cta" data-testid={`link-learn-more-${index}`} className="loomy-link mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#8d4c28]">Learn more <ArrowRight size={13} /></a>
                </article>
              ))}
            </div>
          </section>

          <section id="preview" className="scroll-mt-5 border-b border-[#eee8e2] px-8 py-14 sm:px-20 sm:py-20">
            <div className="text-center">
              <p className="eyebrow mb-3 text-[#986044]">Dashboard Preview</p>
              <h2 className="font-display text-[38px] leading-none tracking-[-.02em] text-[#1a1411] sm:text-[48px]">See what your Loomy dashboard looks like.</h2>
            </div>
            <DashboardPreview />
            <p className="mt-4 text-center text-[13px] text-[#9b887b]">This is a preview of what your dashboard can look like.</p>
            <div className="mt-4 flex justify-center">
              <a
                href="/dashboard"
                data-testid="button-open-dashboard"
                className="button-lift inline-flex items-center gap-2 rounded-[6px] bg-[#844925] px-5 py-2.5 text-[13.5px] font-bold text-[#fffaf5]"
              >
                Open Full Dashboard <ArrowRight size={15} />
              </a>
            </div>
          </section>

          <section id="founder" className="scroll-mt-5 border-b border-[#eee8e2] bg-[#fbfaf8] px-8 py-14 sm:px-20 sm:py-20">
            <div className="mx-auto grid max-w-[1200px] items-center gap-10 sm:grid-cols-[.8fr_1.2fr] sm:gap-16">
              <div className="relative mx-auto w-full max-w-[280px]">
                <div className="absolute -left-3 -top-3 h-full w-full rounded-full border border-[#dcc7b6]" />
                <div className="relative aspect-square overflow-hidden rounded-full border-[6px] border-[#fbfaf8] bg-[#c59c7d]">
                  <img src="/loomy-founder.png" alt="Prince Kalu" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="max-w-[540px]">
                <p className="eyebrow mb-2 text-[#986044]">Meet the Founder</p>
                <h2 className="font-display text-[44px] leading-[.9] tracking-[-.02em] text-[#1a1411] sm:text-[54px]">Prince Kalu</h2>
                <p className="mt-2 text-[14px] font-semibold text-[#70432a]">Founder of Loomy · Age 17</p>
                <p className="mt-5 text-[15px] leading-[1.65] text-[#62574f]">
                  Loomy was created with a simple belief: confidence is a skill anyone can build with the right practice and guidance. My mission is to help people become the best version of themselves.
                </p>
                <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                  <a href="#final-cta" data-testid="button-founder-story" className="button-lift inline-flex h-11 items-center gap-2 rounded-[6px] bg-[#844925] px-5 text-[14px] font-semibold text-[#fffaf5]">
                    Read Prince's Story <ArrowRight size={15} />
                  </a>
                  <div className="flex-1 rounded-[10px] border border-[#e8ded5] bg-[#fdfaf7] p-5">
                    <p className="text-[14px] italic leading-[1.5] text-[#694027]">
                      “I built Loomy for anyone who wants to become more confident, express themselves better and create the life they want.”<br />
                      <span className="not-italic mt-2 block font-semibold">— Prince Kalu</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="final-cta" className="scroll-mt-5 relative overflow-hidden bg-[#f4ede6] px-8 py-16 text-center sm:px-20 sm:py-24">
            <div className="pointer-events-none absolute left-1/2 top-8 text-[#a47b62] -translate-x-1/2"><Sparkles size={18} strokeWidth={1} /></div>
            <div className="relative z-[1] mx-auto max-w-[560px]">
              <h2 className="font-display text-[42px] leading-none tracking-[-.02em] text-[#251a14] sm:text-[52px]">Your confidence journey starts here.</h2>
              <p className="mx-auto mt-4 max-w-[400px] text-[15px] leading-[1.55] text-[#75675e]">Start today and take the first step toward becoming your best self.</p>
              <a href="#top" data-testid="button-final-cta" className="button-lift mt-6 inline-flex h-12 items-center gap-2.5 rounded-[6px] bg-[#844925] px-6 text-[14px] font-bold text-[#fff8f1]">
                Start Your Journey <ArrowRight size={16} />
              </a>
            </div>
          </section>

          <footer id="footer" className="flex flex-col items-center justify-between gap-6 border-t border-[#eee8e2] bg-[#fbfaf8] px-8 py-8 text-center sm:flex-row sm:text-left sm:px-20">
            <a href="#top" data-testid="footer-link-logo" className="flex items-center gap-2 text-[#171311]">
              <LoomyMark />
              <span className="text-[17px] font-bold tracking-[-.06em]">LOOMY</span>
            </a>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[14px] font-semibold text-[#5e5149]">
              <a href="#how-it-works" data-testid="footer-link-how-it-works" className="loomy-link">How It Works</a>
              <a href="#features" data-testid="footer-link-features" className="loomy-link">Features</a>
              <a href="#founder" data-testid="footer-link-about" className="loomy-link">About</a>
              <a href="#founder" data-testid="footer-link-founder" className="loomy-link">Founder</a>
              <a href="#top" data-testid="footer-link-instagram" className="loomy-link">Instagram</a>
            </div>
            <p className="text-[13px] text-[#a08e82]">© 2026 Loomy. Keep becoming.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

function ThreadArt({ light = false }: { light?: boolean }) {
  return (
    <svg viewBox="-200 0 920 350" className="h-full w-full thread-float-soft" aria-hidden="true">
      <g className={light ? '[&>path]:!stroke-[#d9bba6]' : ''}>
        <path className="thread-line" d="M-200 191 C -80 162, 60 132, 190 167 S 315 296, 410 199 S 557 55, 756 185" />
        <path className="thread-line" d="M-200 204 C -80 172, 64 142, 194 176 S 319 283, 417 190 S 559 71, 756 198" />
        <path className="thread-line" d="M-200 217 C -80 183, 67 153, 198 185 S 322 270, 423 181 S 566 87, 756 211" />
        <path className="thread-line" d="M-200 230 C -80 196, 71 166, 201 194 S 325 257, 428 172 S 571 103, 756 224" />
        <path className="thread-line" d="M-200 243 C -80 209, 75 179, 207 202 S 330 243, 434 163 S 578 119, 756 237" />
        <path className="thread-line" d="M-200 256 C -80 223, 78 193, 212 210 S 335 229, 440 154 S 584 135, 756 250" />
        <path className="thread-line warm" d="M-200 210 C -80 168, 65 145, 190 171 S 313 291, 414 195 S 553 63, 756 192" />
        <path className="thread-line warm" d="M-200 224 C -80 182, 69 158, 198 181 S 322 276, 422 178 S 564 91, 756 218" />
        <circle cx="188" cy="168" r="4.5" fill="#8d4c28" />
        <circle cx="317" cy="231" r="4.5" fill="#8d4c28" />
        <circle cx="566" cy="86" r="4.5" fill="#8d4c28" />
        <circle cx="188" cy="168" r="9" fill="none" stroke="#c39c82" strokeWidth="1" opacity=".4" />
        <circle cx="317" cy="231" r="9" fill="none" stroke="#c39c82" strokeWidth="1" opacity=".4" />
      </g>
      <g opacity=".6">
        <circle className="thread-dash" cx="487" cy="78" r="17" fill="none" />
        <circle className="thread-dash" cx="487" cy="78" r="24" fill="none" />
        <circle className="thread-dash" cx="455" cy="103" r="2" fill="#b88e74" />
        <circle className="thread-dash" cx="474" cy="112" r="2" fill="#b88e74" />
      </g>
    </svg>
  );
}

function DashboardPreview() {
  return (
    <div className="dashboard-shadow mx-auto mt-10 max-w-[1240px] overflow-hidden rounded-[14px] border border-[#e2d7ce] bg-[#fbfaf8]">
      {/* Top Breadcrumb & Actions Bar matching actual dashboard header */}
      <div className="flex h-14 items-center justify-between border-b border-[#eee8e2] bg-[#fdfdfc] px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="flex items-center gap-2">
            <LoomyMark />
            <span className="text-[16px] font-bold tracking-[-.04em] text-[#171311]">LOOMY</span>
          </a>
          <span className="hidden text-[13px] font-medium text-[#8c7a6e] sm:inline-block">
            Loomy / <span className="font-semibold text-[#2a211c]">Home</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#e9e1da] bg-[#fdfdfc] text-[#6e5d52]">
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#844925]" />
          </div>
          <a
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-full border border-[#ebdccf] bg-[#fbfaf8] py-1 pl-1 pr-3 transition-colors hover:bg-[#f6ede5]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#844925] text-[12px] font-bold text-[#fff8f1]">
              A
            </div>
            <div className="text-left leading-none">
              <p className="text-[12px] font-bold text-[#2a211c]">Alex</p>
              <p className="text-[10px] text-[#8c7a6e]">Level 2 Member</p>
            </div>
          </a>
        </div>
      </div>

      <div className="grid min-h-[580px] sm:grid-cols-[200px_1fr]">
        {/* Left Navigation matching exact dashboard.tsx sidebar */}
        <aside className="hidden border-r border-[#eee6df] bg-[#fbfaf8] p-3.5 sm:flex sm:flex-col sm:justify-between">
          <div className="space-y-4">
            <div className="space-y-1 text-[13px] font-semibold text-[#5e5149]">
              <div className="flex items-center gap-2.5 rounded-[8px] bg-[#f4ece4] px-3 py-2 font-bold text-[#844925] shadow-xs">
                <HomeIcon size={16} strokeWidth={2.3} /> Home
              </div>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <Volume2 size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Train
              </a>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <Star size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Challenges
              </a>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <Layers size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Skills
              </a>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <BarChart3 size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Progress
              </a>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <BookOpen size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Resources
              </a>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <Users size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Community
              </a>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <Calendar size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Calendar
              </a>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <CircleUserRound size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Profile
              </a>
            </div>

            <div className="h-px w-full bg-[#eee6df]" />

            <div className="space-y-1 text-[13px] font-semibold text-[#5e5149]">
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <Settings size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Settings
              </a>
              <a href="/dashboard" className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 transition-colors hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]">
                <HelpCircle size={16} strokeWidth={1.8} className="text-[#8d6f5c]" /> Help
              </a>
            </div>
          </div>

          {/* Sidebar Bottom CTA matching actual dashboard */}
          <div className="pt-4">
            <div className="rounded-[10px] border border-[#ebdccf] bg-[#f8f1ea] p-3.5 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#e8d5c4] bg-[#fdfaf7] text-[#844925]">
                <Crown size={14} />
              </div>
              <p className="text-[11.5px] font-bold leading-tight text-[#2a211c]">
                Unlock your full potential
              </p>
              <p className="mt-1 text-[10.5px] leading-snug text-[#78665a]">
                Upgrade to Loomy Premium for unlimited drills.
              </p>
              <a
                href="/dashboard"
                className="button-lift mt-2.5 block w-full rounded-[6px] bg-[#844925] py-1.5 text-[11.5px] font-bold text-[#fffaf5]"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </aside>

        {/* Dashboard Main Area */}
        <div className="bg-[#fbfaf8] p-5 sm:p-8">
          {/* Greeting Hero with streak and thread art banner */}
          <div className="relative mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-[30px] leading-tight text-[#211814] sm:text-[36px]">
                Good morning, Alex 👋
              </h3>
              <p className="mt-1 text-[14px] text-[#6e5d52]">
                Let's continue your journey. Your streak:{' '}
                <span className="font-bold text-[#844925]">7 days</span>.
              </p>
            </div>
            <div className="pointer-events-none absolute -top-4 right-0 hidden h-[90px] w-[45%] opacity-70 sm:block">
              <svg viewBox="-50 0 520 110" className="h-full w-full thread-float-soft" aria-hidden="true">
                <path className="thread-line" d="M-50 55 C 40 45, 120 25, 190 50 S 280 95, 340 60 S 420 15, 520 55" />
                <path className="thread-line" d="M-50 63 C 40 51, 124 31, 194 55 S 284 87, 345 53 S 423 25, 520 63" />
                <path className="thread-line warm" d="M-50 59 C 40 43, 122 28, 192 52 S 282 91, 342 57 S 421 20, 520 59" />
                <circle cx="190" cy="50" r="3.5" fill="#8d4c28" />
                <circle cx="340" cy="60" r="3.5" fill="#8d4c28" />
              </svg>
            </div>
          </div>

          {/* Top 3 Cards Grid */}
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            {/* Today's Training */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs">
              <div className="relative z-10">
                <p className="mb-3 text-[12px] font-bold text-[#2a211c]">Today's Training</p>
                <h4 className="text-[19px] font-bold text-[#1a1411]">Speak Clearly</h4>
                <p className="mt-1 text-[12px] text-[#6e5d52]">Level 2 • 12 min</p>
                <p className="mt-2.5 text-[12px] text-[#8b7c71]">Focus: Speak at a steady pace</p>
                <a
                  href="/dashboard"
                  className="button-lift mt-4 inline-block rounded-[6px] bg-[#844925] px-4 py-2 text-[12px] font-bold text-[#fff8f1] hover:bg-[#713f20]"
                >
                  Start Training
                </a>
              </div>
              <img
                src="/dashboard-mountain.png"
                alt="Mountain illustration"
                className="pointer-events-none absolute bottom-0 right-0 h-28 object-contain opacity-95"
              />
            </div>

            {/* Your Progress */}
            <div className="flex flex-col justify-between rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs">
              <div>
                <p className="mb-4 text-[12px] font-bold text-[#2a211c]">Your Progress</p>
                <div className="space-y-3.5 text-[12px] font-medium text-[#2a211c]">
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Communication</span>
                      <span className="font-semibold text-[#844925]">78%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#f2e6dc]">
                      <div className="h-full w-[78%] rounded-full bg-[#844925]" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Public Speaking</span>
                      <span className="font-semibold text-[#844925]">64%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#f2e6dc]">
                      <div className="h-full w-[64%] rounded-full bg-[#844925]" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Social Confidence</span>
                      <span className="font-semibold text-[#844925]">56%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#f2e6dc]">
                      <div className="h-full w-[56%] rounded-full bg-[#844925]" />
                    </div>
                  </div>
                </div>
              </div>
              <a
                href="/dashboard"
                className="mt-4 flex items-center gap-1 text-[11.5px] font-bold text-[#8d4c28] hover:underline"
              >
                View all progress <ArrowRight size={12} />
              </a>
            </div>

            {/* Your Skills */}
            <div className="flex flex-col justify-between rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[12px] font-bold text-[#2a211c]">Your Skills</p>
                  <a href="/dashboard" className="text-[11px] text-[#8b7c71] hover:underline">
                    View all
                  </a>
                </div>
                <div className="space-y-3 text-[12px] font-medium text-[#2a211c]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                        <Mic2 size={13} />
                      </span>
                      Communication
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#8b7c71]">Level 2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                        <Target size={13} />
                      </span>
                      Public Speaking
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#8b7c71]">Level 1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                        <Shield size={13} />
                      </span>
                      Social Confidence
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#8b7c71]">Level 1</span>
                  </div>
                </div>
              </div>
              <a
                href="/dashboard"
                className="mt-4 text-[11.5px] font-bold text-[#8d4c28] hover:underline"
              >
                Explore new skills →
              </a>
            </div>
          </div>

          {/* Bottom 3 Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Recent Activity */}
            <div className="rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[12px] font-bold text-[#2a211c]">Recent Activity</p>
                <a href="/dashboard" className="text-[11px] text-[#8b7c71] hover:underline">
                  View all
                </a>
              </div>
              <div className="space-y-3 text-[12px] font-medium text-[#2a211c]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f0e7de] text-[#8d4c28]">
                      <Mic2 size={13} />
                    </span>
                    <span className="font-semibold">Introduction Practice</span>
                  </div>
                  <span className="text-[11px] text-[#8b7c71]">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f0e7de] text-[#8d4c28]">
                      <MessageCircle size={13} />
                    </span>
                    <span className="font-semibold">Roleplay - Networking</span>
                  </div>
                  <span className="text-[11px] text-[#8b7c71]">Yesterday</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f0e7de] text-[#8d4c28]">
                      <Volume2 size={13} />
                    </span>
                    <span className="font-semibold">Voice Clarity Drill</span>
                  </div>
                  <span className="text-[11px] text-[#8b7c71]">2 days ago</span>
                </div>
              </div>
            </div>

            {/* Challenges */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs">
              <div className="relative z-10 mb-3 flex items-center justify-between">
                <p className="text-[12px] font-bold text-[#2a211c]">Challenges</p>
                <a href="/dashboard" className="text-[11px] text-[#8b7c71] hover:underline">
                  View all
                </a>
              </div>
              <div className="relative z-10 rounded-[8px] border border-[#f0e8e0] bg-[#fbfaf8] p-3.5">
                <div className="mb-1 flex items-center gap-2.5">
                  <span className="font-display text-[24px] text-[#8d4c28]">0</span>
                  <span className="text-[12px] font-bold text-[#1a1411]">
                    Challenges completed
                  </span>
                </div>
                <p className="text-[11px] text-[#6e5d52]">
                  Complete your first challenge to get started.
                </p>
              </div>
              <a
                href="/dashboard"
                className="button-lift relative z-10 mt-3.5 block w-full rounded-[6px] bg-[#844925] py-2 text-center text-[12px] font-bold text-[#fff8f1]"
              >
                Browse Challenges
              </a>
              <img
                src="/dashboard-flag.png"
                alt="Flag"
                className="pointer-events-none absolute bottom-2 right-3 h-11 object-contain opacity-80"
              />
            </div>

            {/* Quick Actions */}
            <div className="rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs">
              <p className="mb-3.5 text-[12px] font-bold text-[#2a211c]">Quick Actions</p>
              <div className="space-y-2">
                <a
                  href="/dashboard"
                  className="flex items-center justify-between rounded-[8px] border border-transparent p-1.5 transition-colors hover:border-[#eee6df] hover:bg-[#fbfaf8]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                      <Mic2 size={13} />
                    </span>
                    <div>
                      <p className="text-[12px] font-bold text-[#1a1411]">Record Voice</p>
                      <p className="text-[10.5px] text-[#8b7c71]">Practice speaking</p>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#c8beba]" />
                </a>

                <a
                  href="/dashboard"
                  className="flex items-center justify-between rounded-[8px] border border-transparent p-1.5 transition-colors hover:border-[#eee6df] hover:bg-[#fbfaf8]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                      <Video size={13} />
                    </span>
                    <div>
                      <p className="text-[12px] font-bold text-[#1a1411]">Record Video</p>
                      <p className="text-[10.5px] text-[#8b7c71]">Practice your delivery</p>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#c8beba]" />
                </a>

                <a
                  href="/dashboard"
                  className="flex items-center justify-between rounded-[8px] border border-transparent p-1.5 transition-colors hover:border-[#eee6df] hover:bg-[#fbfaf8]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                      <MessageCircle size={13} />
                    </span>
                    <div>
                      <p className="text-[12px] font-bold text-[#1a1411]">Start Roleplay</p>
                      <p className="text-[10.5px] text-[#8b7c71]">Have a conversation</p>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#c8beba]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;