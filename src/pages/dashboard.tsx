import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock,
  Crown,
  Globe,
  Headphones,
  HelpCircle,
  Home as HomeIcon,
  Layers,
  Lock,
  Mail,
  Menu,
  MessageCircle,
  Mic2,
  Palette,
  Play,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  User,
  Users,
  Video,
  Volume2,
  X,
  Zap,
} from 'lucide-react';

/* ─── Shared Loomy mark ─── */
function LoomyMark({ size = 'default' }: { size?: 'default' | 'large' }) {
  const h = size === 'large' ? 'h-7 w-7' : 'h-5 w-5';
  const inner = size === 'large' ? 'h-[20px] w-[12px] border-[1.5px]' : 'h-[15px] w-[9px] border-[1.25px]';
  return (
    <span className={`relative flex ${h} items-center justify-center`} aria-hidden="true">
      <span className={`absolute ${inner} rotate-45 rounded-[7px] border-[#754421]`} />
      <span className={`absolute ${inner} -rotate-45 rounded-[7px] border-[#754421]`} />
    </span>
  );
}

/* ─── Header Thread Art Wave ─── */
function ThreadHeaderArt() {
  return (
    <svg viewBox="-50 0 520 110" className="h-full w-full" aria-hidden="true">
      <path className="thread-line" d="M-50 55 C 40 45, 120 25, 190 50 S 280 95, 340 60 S 420 15, 520 55" />
      <path className="thread-line" d="M-50 63 C 40 51, 124 31, 194 55 S 284 87, 345 53 S 423 25, 520 63" />
      <path className="thread-line" d="M-50 71 C 40 57, 127 37, 198 60 S 288 79, 350 46 S 427 35, 520 71" />
      <path className="thread-line warm" d="M-50 59 C 40 43, 122 28, 192 52 S 282 91, 342 57 S 421 20, 520 59" />
      <circle cx="190" cy="50" r="3.5" fill="#8d4c28" />
      <circle cx="340" cy="60" r="3.5" fill="#8d4c28" />
      <circle cx="190" cy="50" r="7" fill="none" stroke="#c39c82" strokeWidth="0.8" opacity=".4" />
      <circle cx="340" cy="60" r="7" fill="none" stroke="#c39c82" strokeWidth="0.8" opacity=".4" />
      {/* Tiny diamond spark */}
      <path d="M 410 18 L 413 23 L 418 25 L 413 27 L 410 32 L 407 27 L 402 25 L 407 23 Z" fill="#b88e74" opacity=".6" />
      {/* Dot matrix grid */}
      <g opacity=".45" fill="#b88e74">
        {[0, 6, 12, 18].map((dx) =>
          [0, 6, 12].map((dy) => (
            <circle key={`${dx}-${dy}`} cx={120 + dx} cy={22 + dy} r="1" />
          ))
        )}
      </g>
    </svg>
  );
}

/* ─── Thread Spool illustration for bottom of sidebar ─── */
function ThreadSpool() {
  return (
    <div className="relative h-16 w-full overflow-hidden px-4 opacity-75">
      <svg viewBox="0 0 160 60" className="h-full w-full" aria-hidden="true">
        {/* Spool */}
        <g transform="translate(16, 12)">
          <ellipse cx="14" cy="5" rx="11" ry="3.5" fill="#c39a7a" stroke="#8d4c28" strokeWidth="1" />
          <path d="M 5 5 L 7 28 L 21 28 L 23 5 Z" fill="#8d4c28" />
          {/* Thread windings */}
          <line x1="6.5" y1="10" x2="21.5" y2="10" stroke="#f6ede5" strokeWidth="1.2" />
          <line x1="7" y1="14" x2="21" y2="14" stroke="#e8d1bd" strokeWidth="1.2" />
          <line x1="7" y1="18" x2="21" y2="18" stroke="#f6ede5" strokeWidth="1.2" />
          <line x1="7" y1="22" x2="21" y2="22" stroke="#e8d1bd" strokeWidth="1.2" />
          <ellipse cx="14" cy="28" rx="11" ry="3.5" fill="#a47250" stroke="#8d4c28" strokeWidth="1" />
        </g>
        {/* Trailing thread curve */}
        <path d="M 37 32 C 60 40, 85 18, 110 30 S 140 45, 160 22" fill="none" stroke="#c89b7b" strokeWidth="1.2" />
        <circle cx="110" cy="30" r="2" fill="#8d4c28" />
        <circle cx="75" cy="24" r="1" fill="#b88e74" />
      </svg>
    </div>
  );
}

/* ─── Navigation structure ─── */
type NavTab =
  | 'Home'
  | 'Train'
  | 'Challenges'
  | 'Skills'
  | 'Progress'
  | 'Resources'
  | 'Community'
  | 'Calendar'
  | 'Profile'
  | 'Settings'
  | 'Help';

const mainNavItems = [
  { id: 'Home' as NavTab, label: 'Home', icon: HomeIcon },
  { id: 'Train' as NavTab, label: 'Train', icon: Volume2 },
  { id: 'Challenges' as NavTab, label: 'Challenges', icon: Star },
  { id: 'Skills' as NavTab, label: 'Skills', icon: Layers },
  { id: 'Progress' as NavTab, label: 'Progress', icon: BarChart3 },
  { id: 'Resources' as NavTab, label: 'Resources', icon: BookOpen },
  { id: 'Community' as NavTab, label: 'Community', icon: Users },
  { id: 'Calendar' as NavTab, label: 'Calendar', icon: Calendar },
  { id: 'Profile' as NavTab, label: 'Profile', icon: CircleUserRound },
];

const secondaryNavItems = [
  { id: 'Settings' as NavTab, label: 'Settings', icon: Settings },
  { id: 'Help' as NavTab, label: 'Help', icon: HelpCircle },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<NavTab>('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle to inspect Guest Teaser vs Active Alex Account
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleOpenLogin = () => setShowLoginModal(true);
  const handleSuccessLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  return (
    <div className="loomy-page grain min-h-[100dvh] flex flex-col">
      <div className="flex flex-1 min-h-[100dvh]">
        {/* ─── SIDEBAR ─── */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-40 flex w-[210px] flex-col border-r border-[#eee6df] bg-[#fbfaf8] transition-transform duration-200 ease-in-out sm:static sm:translate-x-0 shrink-0`}
        >
          {/* Logo */}
          <div className="flex h-16 items-center gap-2.5 px-6 border-b border-[#eee6df]/50">
            <a href="/" className="flex items-center gap-2.5 text-[#171311]">
              <LoomyMark size="large" />
              <span className="text-[20px] font-bold tracking-[-.06em]">LOOMY</span>
            </a>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1" aria-label="Dashboard navigation">
            <div className="space-y-1 text-[13.5px] font-semibold text-[#5e5149]">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-[8px] px-3.5 py-2 transition-all ${
                      isActive
                        ? 'bg-[#f4ece4] font-bold text-[#844925] shadow-xs'
                        : 'text-[#5e5149] hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]'
                    }`}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} className={isActive ? 'text-[#844925]' : 'text-[#8d6f5c]'} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="my-3.5 h-px bg-[#eee6df]" />

            <div className="space-y-1 text-[13.5px] font-semibold text-[#5e5149]">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-[8px] px-3.5 py-2 transition-all ${
                      isActive
                        ? 'bg-[#f4ece4] font-bold text-[#844925] shadow-xs'
                        : 'text-[#5e5149] hover:bg-[#f5ebe2]/60 hover:text-[#2a211c]'
                    }`}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} className={isActive ? 'text-[#844925]' : 'text-[#8d6f5c]'} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Sidebar Bottom CTA / Upgrade card (Exact match to references) */}
            <div className="pt-6">
              {!isLoggedIn ? (
                <div className="rounded-[10px] bg-[#f8f1ea] border border-[#ebdccf] p-4 text-center">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#fdfaf7] text-[#844925] border border-[#e8d5c4]">
                    <Lock size={15} />
                  </div>
                  <p className="text-[12px] font-bold text-[#2a211c] leading-tight">
                    Log in to unlock
                  </p>
                  <p className="mt-1 text-[11px] text-[#78665a] leading-snug">
                    Access your trainings, saved progress and custom drills.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLoggedIn(true)}
                    className="button-lift mt-3 w-full rounded-[6px] bg-[#844925] py-2 text-[12px] font-bold text-[#fffaf5]"
                  >
                    Log In
                  </button>
                </div>
              ) : (
                <div className="rounded-[10px] bg-[#f8f1ea] border border-[#ebdccf] p-4 text-center">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#fdfaf7] text-[#844925] border border-[#e8d5c4]">
                    <Crown size={15} />
                  </div>
                  <p className="text-[12px] font-bold text-[#2a211c] leading-tight">
                    Unlock your<br />full potential
                  </p>
                  <p className="mt-1 text-[11px] text-[#78665a] leading-snug">
                    Upgrade to Loomy Premium for exclusive features.
                  </p>
                  <button
                    type="button"
                    className="button-lift mt-3 w-full rounded-[6px] bg-[#844925] py-2 text-[12px] font-bold text-[#fffaf5]"
                  >
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>

            <ThreadSpool />
          </nav>
        </aside>

        {/* ─── MOBILE BACKDROP ─── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/25 backdrop-blur-xs sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── MAIN CONTENT CONTAINER ─── */}
        <div className="flex flex-1 flex-col min-w-0 bg-[#fbfaf8]">
          {/* Top minimal header matching reference images */}
          <header className="flex h-16 items-center justify-between px-6 sm:px-10 border-b border-[#eee8e2]/60">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Toggle sidebar"
                onClick={() => setSidebarOpen((o) => !o)}
                className="rounded-md border border-[#e4dbd2] p-2 text-[#5b3823] sm:hidden"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <span className="hidden text-[13px] font-medium text-[#8c7a6e] sm:inline-block">
                Loomy / <span className="text-[#2a211c] font-semibold">{activeTab}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Mode Toggle to experience both Guest Reference & Active Account */}
              <button
                type="button"
                onClick={() => setIsLoggedIn((v) => !v)}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#ebdccf] bg-[#f8f2eb] px-3 py-1 text-[11.5px] font-semibold text-[#844925] hover:bg-[#f1e5d9] transition-colors"
                title="Toggle between Guest Reference View and Active Account View"
              >
                <span className={`h-2 w-2 rounded-full ${isLoggedIn ? 'bg-emerald-600' : 'bg-[#844925]'}`} />
                {isLoggedIn ? 'Viewing: Logged In (Alex)' : 'Viewing: Guest Preview'}
              </button>

              <button
                type="button"
                aria-label="Notifications"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e9e1da] bg-[#fdfdfc] text-[#6e5d52] hover:bg-[#f5ebe2] transition-colors relative"
              >
                <Bell size={17} />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#844925]" />
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setActiveTab('Profile')}
                    className="flex items-center gap-2.5 pl-2 cursor-pointer group"
                  >
                    <img
                      src="/alex-avatar.png"
                      alt="Alex"
                      className="h-9 w-9 rounded-full object-cover border border-[#e0d0c3] group-hover:ring-2 group-hover:ring-[#844925]/30 transition-all"
                    />
                    <div className="hidden sm:block text-left leading-tight">
                      <p className="text-[13px] font-bold text-[#2a211c]">Alex</p>
                      <p className="text-[11px] text-[#8c7a6e]">Level 2 Member</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLoggedIn(false)}
                    className="text-[11.5px] font-semibold text-[#844925] hover:underline"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenLogin}
                  className="button-lift flex h-9 items-center gap-1.5 rounded-[6px] bg-[#844925] px-4 text-[12px] font-bold text-[#fff8f1]"
                >
                  <Lock size={12} /> Log in
                </button>
              )}
            </div>
          </header>

          {/* Active Tab Content Area */}
          <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 max-w-[1340px] w-full mx-auto">
            {activeTab === 'Home' && <HomeView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} onTabChange={setActiveTab} />}
            {activeTab === 'Train' && <TrainView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Challenges' && <ChallengesView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Skills' && <SkillsView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Progress' && <ProgressView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Resources' && <ResourcesView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Community' && <CommunityView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Calendar' && <CalendarView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Profile' && <ProfileView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Settings' && <SettingsView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
            {activeTab === 'Help' && <HelpView isLoggedIn={isLoggedIn} onLogin={handleOpenLogin} />}
          </main>

          {showLoginModal && (
            <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleSuccessLogin} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. HOME VIEW (Matches ChatGPT Image Aug 13, 2026, 11_57_07 AM & reference-homepage.png)
   ═══════════════════════════════════════════════════════════════════════════ */
function HomeView({
  isLoggedIn,
  onLogin,
  onTabChange,
}: {
  isLoggedIn: boolean;
  onLogin: () => void;
  onTabChange: (tab: NavTab) => void;
}) {
  if (isLoggedIn) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-[34px] leading-tight text-[#211814] sm:text-[42px]">
            Good morning, Alex 👋
          </h1>
          <p className="mt-1 text-[15px] text-[#6e5d52]">
            Let's continue your journey. Your streak: <span className="font-bold text-[#844925]">7 days</span>.
          </p>
        </div>

        {/* 3 Columns Top */}
        <div className="grid gap-5 sm:grid-cols-3">
          {/* Today's Training */}
          <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 relative overflow-hidden flex flex-col justify-between shadow-xs">
            <div className="relative z-10">
              <p className="text-[12px] font-bold text-[#2a211c] mb-3">Today's Training</p>
              <h3 className="text-[20px] font-bold text-[#1a1411]">Speak Clearly</h3>
              <p className="mt-1 text-[12.5px] text-[#6e5d52]">Level 2 • 12 min</p>
              <p className="mt-3 text-[12.5px] text-[#8b7c71]">Focus: Speak at a steady pace</p>
              <button
                type="button"
                className="button-lift mt-5 rounded-[6px] bg-[#844925] px-4 py-2 text-[12px] font-bold text-[#fff8f1]"
              >
                Start Training
              </button>
            </div>
            <img
              src="/dashboard-mountain.png"
              alt="Mountain illustration"
              className="absolute bottom-0 right-0 h-32 object-contain pointer-events-none opacity-95"
            />
          </div>

          {/* Your Progress */}
          <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 flex flex-col justify-between shadow-xs">
            <div>
              <p className="text-[12px] font-bold text-[#2a211c] mb-4">Your Progress</p>
              <div className="space-y-4 text-[12.5px] font-medium text-[#2a211c]">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span>Communication</span>
                    <span className="font-semibold text-[#844925]">78%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#f2e6dc] overflow-hidden">
                    <div className="h-full w-[78%] rounded-full bg-[#844925]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span>Public Speaking</span>
                    <span className="font-semibold text-[#844925]">64%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#f2e6dc] overflow-hidden">
                    <div className="h-full w-[64%] rounded-full bg-[#844925]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span>Social Confidence</span>
                    <span className="font-semibold text-[#844925]">56%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#f2e6dc] overflow-hidden">
                    <div className="h-full w-[56%] rounded-full bg-[#844925]" />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onTabChange('Progress')}
              className="mt-5 text-left text-[12px] font-bold text-[#8d4c28] hover:underline flex items-center gap-1"
            >
              View all progress <ArrowRight size={13} />
            </button>
          </div>

          {/* Your Skills */}
          <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[12px] font-bold text-[#2a211c]">Your Skills</p>
                <button
                  type="button"
                  onClick={() => onTabChange('Skills')}
                  className="text-[11.5px] text-[#8b7c71] hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3.5 text-[12.5px] font-medium text-[#2a211c]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                      <Mic2 size={15} />
                    </span>
                    Communication
                  </div>
                  <span className="text-[12px] font-semibold text-[#8b7c71]">Level 2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                      <Target size={15} />
                    </span>
                    Public Speaking
                  </div>
                  <span className="text-[12px] font-semibold text-[#8b7c71]">Level 1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                      <Shield size={15} />
                    </span>
                    Social Confidence
                  </div>
                  <span className="text-[12px] font-semibold text-[#8b7c71]">Level 1</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onTabChange('Skills')}
              className="mt-5 text-left text-[12px] font-bold text-[#8d4c28] hover:underline"
            >
              Explore new skills →
            </button>
          </div>
        </div>

        {/* 3 Columns Bottom */}
        <div className="grid gap-5 sm:grid-cols-3">
          {/* Recent Activity */}
          <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-bold text-[#2a211c]">Recent Activity</p>
              <button type="button" onClick={() => onTabChange('Progress')} className="text-[11.5px] text-[#8b7c71] hover:underline">
                View all
              </button>
            </div>
            <div className="space-y-3.5 text-[12.5px] font-medium text-[#2a211c]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f0e7de] text-[#8d4c28]">
                    <Mic2 size={14} />
                  </span>
                  Introduction Practice
                </div>
                <span className="text-[11px] text-[#8b7c71]">Today</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f0e7de] text-[#8d4c28]">
                    <MessageCircle size={14} />
                  </span>
                  Roleplay - Networking
                </div>
                <span className="text-[11px] text-[#8b7c71]">Yesterday</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f0e7de] text-[#8d4c28]">
                    <Volume2 size={14} />
                  </span>
                  Voice Clarity Drill
                </div>
                <span className="text-[11px] text-[#8b7c71]">2 days ago</span>
              </div>
            </div>
          </div>

          {/* Challenges */}
          <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 relative overflow-hidden flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-3 relative z-10">
              <p className="text-[12px] font-bold text-[#2a211c]">Challenges</p>
              <button type="button" onClick={() => onTabChange('Challenges')} className="text-[11.5px] text-[#8b7c71] hover:underline">
                View all
              </button>
            </div>
            <div className="rounded-[8px] bg-[#fbfaf8] border border-[#f0e8e0] p-4 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-display text-[26px] text-[#8d4c28]">0</span>
                <span className="text-[13px] font-bold text-[#1a1411]">Challenges completed</span>
              </div>
              <p className="text-[11.5px] text-[#6e5d52]">
                Complete your first challenge to get started.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onTabChange('Challenges')}
              className="button-lift mt-4 w-full rounded-[6px] bg-[#844925] py-2 text-[12px] font-bold text-[#fff8f1] relative z-10"
            >
              Browse Challenges
            </button>
            <img
              src="/dashboard-flag.png"
              alt="Flag"
              className="absolute bottom-2 right-3 h-12 object-contain pointer-events-none opacity-80"
            />
          </div>

          {/* Quick Actions */}
          <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
            <p className="text-[12px] font-bold text-[#2a211c] mb-4">Quick Actions</p>
            <div className="space-y-2.5">
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 rounded-[8px] hover:bg-[#fbfaf8] transition-colors border border-transparent hover:border-[#eee6df]"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                    <Mic2 size={15} />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold text-[#1a1411]">Record Voice</p>
                    <p className="text-[11px] text-[#8b7c71]">Practice speaking</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#c8beba]" />
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between p-2 rounded-[8px] hover:bg-[#fbfaf8] transition-colors border border-transparent hover:border-[#eee6df]"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                    <Video size={15} />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold text-[#1a1411]">Record Video</p>
                    <p className="text-[11px] text-[#8b7c71]">Practice your delivery</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#c8beba]" />
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between p-2 rounded-[8px] hover:bg-[#fbfaf8] transition-colors border border-transparent hover:border-[#eee6df]"
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ede5] text-[#8d4c28]">
                    <MessageCircle size={15} />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold text-[#1a1411]">Start Roleplay</p>
                    <p className="text-[11px] text-[#8b7c71]">Have a conversation</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#c8beba]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exact match to ChatGPT Image Aug 13, 2026, 11_57_07 AM
  return (
    <div className="space-y-8">
      {/* Hero title area */}
      <div className="relative">
        <div className="relative z-10 max-w-[540px]">
          <h1 className="font-display text-[38px] leading-[1.05] text-[#171311] sm:text-[48px]">
            Welcome to Loomy
          </h1>
          <p className="mt-2.5 text-[15px] text-[#6e5d52] leading-relaxed">
            Your confidence training space.
            <br />
            Sign in to access your personalized experience.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="button-lift mt-5 inline-flex items-center gap-2 rounded-[6px] bg-[#844925] px-6 py-2.5 text-[14px] font-bold text-[#fff8f1]"
          >
            <Lock size={14} /> Log in
          </button>
        </div>

        {/* Decorative thread art wave */}
        <div className="pointer-events-none absolute -top-4 right-0 h-[120px] w-[55%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      {/* 3x2 Grid of Cards with Lock Prompts */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Start Training */}
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1411] mb-3">Start Training</h3>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                <Mic2 size={20} />
              </span>
              <p className="text-[13px] text-[#6e5d52] leading-[1.55]">
                Access guided trainings to build your skills.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#8b7c71] hover:text-[#844925] transition-colors"
          >
            <Lock size={13} /> Log in to get started
          </button>
        </div>

        {/* Your Progress */}
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1411] mb-3">Your Progress</h3>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                <TrendingUp size={20} />
              </span>
              <p className="text-[13px] text-[#6e5d52] leading-[1.55]">
                Track your growth and see your improvements.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#8b7c71] hover:text-[#844925] transition-colors"
          >
            <Lock size={13} /> Log in to view your progress
          </button>
        </div>

        {/* Challenges */}
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1411] mb-3">Challenges</h3>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                <Star size={20} />
              </span>
              <p className="text-[13px] text-[#6e5d52] leading-[1.55]">
                Join challenges to stay motivated and consistent.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#8b7c71] hover:text-[#844925] transition-colors"
          >
            <Lock size={13} /> Log in to explore challenges
          </button>
        </div>

        {/* Skills */}
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1411] mb-3">Skills</h3>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                <Layers size={20} />
              </span>
              <p className="text-[13px] text-[#6e5d52] leading-[1.55]">
                Improve key skills step by step.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#8b7c71] hover:text-[#844925] transition-colors"
          >
            <Lock size={13} /> Log in to view your skills
          </button>
        </div>

        {/* Recent Activity */}
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1411] mb-3">Recent Activity</h3>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                <Clock size={20} />
              </span>
              <p className="text-[13px] text-[#6e5d52] leading-[1.55]">
                Your recent trainings and activities will appear here.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#8b7c71] hover:text-[#844925] transition-colors"
          >
            <Lock size={13} /> Log in to see your activity
          </button>
        </div>

        {/* Weekly Progress */}
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1411] mb-3">Weekly Progress</h3>
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                <Calendar size={20} />
              </span>
              <p className="text-[13px] text-[#6e5d52] leading-[1.55]">
                Your weekly overview will appear here.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#8b7c71] hover:text-[#844925] transition-colors"
          >
            <Lock size={13} /> Log in to view weekly progress
          </button>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rounded-[12px] border border-[#e4d5c8] bg-[#f9f0e6] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-4">
          <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#f2e2d1] text-[#844925] border border-[#e4d1bf]">
            <Trophy size={24} />
          </span>
          <div>
            <h3 className="text-[17px] font-bold text-[#1a1411]">Ready to begin your journey?</h3>
            <p className="mt-0.5 text-[13.5px] text-[#6e5d52]">
              Log in to access personalized trainings, track progress, and achieve your goals.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogin}
          className="button-lift inline-flex shrink-0 items-center gap-2 rounded-[6px] bg-[#844925] px-6 py-2.5 text-[13px] font-bold text-[#fff8f1]"
        >
          <Lock size={13} /> Log in
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. TRAIN VIEW (Matches ChatGPT Image Aug 13, 2026, 12_04_46 PM)
   ═══════════════════════════════════════════════════════════════════════════ */
function TrainView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const categories = [
    { title: 'Pronunciation', desc: 'Improve clarity and pronunciation.', icon: Mic2 },
    { title: 'Voice Training', desc: 'Develop a strong and confident voice.', icon: Volume2 },
    { title: 'Video Training', desc: 'Practice and improve your speaking on video.', icon: Video },
    { title: 'Public Speaking', desc: 'Build confidence for presentations.', icon: Target },
    { title: 'Communication', desc: 'Enhance everyday communication skills.', icon: MessageCircle },
    { title: 'AI Roleplay', desc: 'Practice real-life conversations.', icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Train</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">Build your confidence with guided training.</p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      <div>
        <h2 className="text-[15px] font-bold text-[#1a1411] mb-4">Training Categories</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925] mb-3">
                    <Icon size={19} />
                  </span>
                  <h3 className="text-[15px] font-bold text-[#1a1411]">{cat.title}</h3>
                  <p className="mt-1 text-[12.5px] text-[#6e5d52] leading-snug">{cat.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-4 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8b7c71] hover:text-[#844925]"
                >
                  <Lock size={12} /> Log in to access
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works & Popular Trainings */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
          <h3 className="text-[15px] font-bold text-[#1a1411] mb-4">How it works</h3>
          <div className="space-y-4">
            {[
              { num: '1', title: 'Learn', text: 'Watch or read short lessons designed by experts.' },
              { num: '2', title: 'Practice', text: 'Record yourself or complete practical exercises.' },
              { num: '3', title: 'Get Feedback', text: 'Receive instant AI feedback to improve.' },
              { num: '4', title: 'Improve', text: 'Apply feedback and track your progress.' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#844925] text-[12px] font-bold text-white">
                  {step.num}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-[#1a1411]">{step.title}</p>
                  <p className="text-[12px] text-[#6e5d52]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[8px] bg-[#f9f0e6] border border-[#e8d5c4] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#6e5d52]">
              <Lock size={13} className="text-[#844925]" />
              <span>Log in to start your training journey</span>
            </div>
            <button
              type="button"
              onClick={onLogin}
              className="rounded-[5px] bg-[#844925] px-3 py-1.5 text-[11.5px] font-bold text-[#fffaf5]"
            >
              Log in
            </button>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#1a1411]">Popular Trainings</h3>
            <p className="text-[12px] text-[#8b7c71] mb-4">Top picks to help you get started.</p>

            <div className="space-y-3">
              {[
                { title: 'Speak Clearly', desc: 'Basics of clear and confident speaking', icon: Volume2 },
                { title: 'Overcome Nervousness', desc: 'Manage fear and speak with confidence', icon: Shield },
                { title: 'Daily Conversation Practice', desc: 'Improve your everyday communication', icon: MessageCircle },
                { title: 'Message with Impact', desc: 'Learn to deliver your message effectively', icon: Video },
              ].map((t) => {
                const TIcon = t.icon;
                return (
                  <div key={t.title} className="flex items-center justify-between p-2.5 rounded-[8px] border border-[#f0e8df] bg-[#fdfbf9]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                        <TIcon size={15} />
                      </span>
                      <div>
                        <p className="text-[12.5px] font-bold text-[#1a1411]">{t.title}</p>
                        <p className="text-[11px] text-[#8b7c71]">{t.desc}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#8b7c71]">
                      <Lock size={11} /> Log in
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={onLogin}
            className="mt-6 w-full rounded-[6px] border border-[#e0d0c3] bg-[#fbfaf8] py-2.5 text-[12px] font-bold text-[#844925] hover:bg-[#f6ede5] transition-colors"
          >
            View all trainings →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. CHALLENGES VIEW (Matches ChatGPT Image Aug 13, 2026, 12_20_28 PM)
   ═══════════════════════════════════════════════════════════════════════════ */
function ChallengesView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const challengeCategories = [
    { title: 'Daily Challenges', desc: 'Small daily actions for big growth.', icon: Calendar },
    { title: 'Communication Challenges', desc: 'Improve how you express yourself.', icon: MessageCircle },
    { title: 'Speaking Challenges', desc: 'Build clarity and speaking confidence.', icon: Mic2 },
    { title: 'Social Confidence Challenges', desc: 'Strengthen your social confidence.', icon: Users },
    { title: 'Public Speaking Challenges', desc: 'Step up and speak with impact.', icon: Target },
  ];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Challenges</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">
            Push yourself and stay consistent. Complete challenges to build confidence and grow.
          </p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      <div>
        <h2 className="text-[15px] font-bold text-[#1a1411] mb-4">Challenge Categories</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          {challengeCategories.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-[12px] border border-[#e9ded5] bg-white p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925] mb-3">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-[13.5px] font-bold text-[#1a1411]">{c.title}</h3>
                  <p className="mt-1 text-[11.5px] text-[#6e5d52] leading-snug">{c.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-[#8b7c71] hover:text-[#844925]"
                >
                  <Lock size={11} /> Log in to access
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
          <h3 className="text-[15px] font-bold text-[#1a1411] mb-4">How Challenges Work</h3>
          <div className="space-y-4">
            {[
              { num: '1', title: 'Choose a Challenge', text: 'Pick a challenge that matches your goal.' },
              { num: '2', title: 'Complete the Tasks', text: 'Follow the steps and complete the challenge.' },
              { num: '3', title: 'Stay Consistent', text: 'Keep showing up every day and do your best.' },
              { num: '4', title: 'Earn Rewards', text: 'Earn points, badges and build lasting confidence.' },
            ].map((s) => (
              <div key={s.num} className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#844925] text-[12px] font-bold text-white">
                  {s.num}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-[#1a1411]">{s.title}</p>
                  <p className="text-[12px] text-[#6e5d52]">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[8px] bg-[#f9f0e6] border border-[#e8d5c4] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#6e5d52]">
              <Lock size={13} className="text-[#844925]" />
              <span>Log in to start completing challenges</span>
            </div>
            <button
              type="button"
              onClick={onLogin}
              className="rounded-[5px] bg-[#844925] px-3 py-1.5 text-[11.5px] font-bold text-[#fffaf5]"
            >
              Log in
            </button>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
          <h3 className="text-[15px] font-bold text-[#1a1411] mb-4">Why Take Challenges?</h3>
          <div className="space-y-4">
            {[
              { icon: TrendingUp, title: 'Build Discipline', text: 'Challenges help you stay consistent and build strong habits.' },
              { icon: Star, title: 'Boost Confidence', text: 'Complete challenges and see your confidence grow.' },
              { icon: Globe, title: 'Real World Growth', text: 'Practice real-life skills that help you in everyday situations.' },
              { icon: Trophy, title: 'Earn Rewards', text: 'Unlock badges, points and special achievements.' },
            ].map((item) => {
              const IIcon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                    <IIcon size={15} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-[#1a1411]">{item.title}</p>
                    <p className="text-[12px] text-[#6e5d52]">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Your Challenge Journey banner */}
      <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
            <Star size={22} />
          </span>
          <div>
            <h4 className="text-[15px] font-bold text-[#1a1411]">No challenges yet</h4>
            <p className="text-[12.5px] text-[#6e5d52]">You haven't joined any challenges. Log in to explore challenges and start your journey.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogin}
          className="button-lift rounded-[6px] bg-[#844925] px-4 py-2 text-[12px] font-bold text-[#fff8f1] shrink-0"
        >
          Log in to explore
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. SKILLS VIEW (Matches ChatGPT Image Aug 13, 2026, 12_23_29 PM)
   ═══════════════════════════════════════════════════════════════════════════ */
function SkillsView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const skills = [
    { title: 'Communication', desc: 'Express yourself clearly and connect with others.', icon: MessageCircle },
    { title: 'Speaking', desc: 'Build confidence and speak with impact.', icon: Mic2 },
    { title: 'Pronunciation', desc: 'Improve clarity and pronounce with ease.', icon: Volume2 },
    { title: 'Social Confidence', desc: 'Feel comfortable in social situations.', icon: Users },
    { title: 'Public Speaking', desc: 'Deliver powerful talks and presentations.', icon: Target },
    { title: 'Assertiveness', desc: 'Stand up for yourself with confidence.', icon: Shield },
    { title: 'Interview Skills', desc: 'Ace interviews and present your best self.', icon: BookOpen },
    { title: 'Leadership', desc: 'Inspire, influence and lead with confidence.', icon: Crown },
  ];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Skills</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">Develop essential skills and master them to become your best self.</p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      <div>
        <h2 className="text-[15px] font-bold text-[#1a1411] mb-4">Skill Categories</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {skills.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925] mb-3">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-[14px] font-bold text-[#1a1411]">{s.title}</h3>
                  <p className="mt-1 text-[12px] text-[#6e5d52] leading-snug">{s.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-4 flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8b7c71] hover:text-[#844925]"
                >
                  <Lock size={12} /> Log in to access
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
          <h3 className="text-[15px] font-bold text-[#1a1411] mb-4">Skill Development Path</h3>
          <div className="space-y-4">
            {[
              { num: '1', title: 'Learn', text: 'Understand the basics and key concepts.' },
              { num: '2', title: 'Practice', text: 'Apply what you learn through exercises.' },
              { num: '3', title: 'Track Progress', text: 'Monitor your improvement and stay on track.' },
              { num: '4', title: 'Master', text: 'Reach mastery and unlock new opportunities.' },
            ].map((s) => (
              <div key={s.num} className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#844925] text-[12px] font-bold text-white">
                  {s.num}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-[#1a1411]">{s.title}</p>
                  <p className="text-[12px] text-[#6e5d52]">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[8px] bg-[#f9f0e6] border border-[#e8d5c4] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[#6e5d52]">
              <Lock size={13} className="text-[#844925]" />
              <span>Log in to start developing your skills</span>
            </div>
            <button
              type="button"
              onClick={onLogin}
              className="rounded-[5px] bg-[#844925] px-3 py-1.5 text-[11.5px] font-bold text-[#fffaf5]"
            >
              Log in
            </button>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
          <h3 className="text-[15px] font-bold text-[#1a1411] mb-4">Why Build Skills?</h3>
          <div className="space-y-4">
            {[
              { icon: TrendingUp, title: 'Personal Growth', text: 'Build confidence and become the best version of yourself.' },
              { icon: Star, title: 'Better Opportunities', text: 'Strong skills open doors to new opportunities and success.' },
              { icon: Users, title: 'Stronger Relationships', text: 'Communicate better and build meaningful connections.' },
              { icon: Trophy, title: 'Long Term Success', text: 'Continuous skill building leads to lasting success in life.' },
            ].map((item) => {
              const IIcon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                    <IIcon size={15} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-[#1a1411]">{item.title}</p>
                    <p className="text-[12px] text-[#6e5d52]">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. PROGRESS VIEW (Matches ChatGPT Image Aug 13, 2026, 12_31_48 PM & 12_57_36 PM)
   ═══════════════════════════════════════════════════════════════════════════ */
function ProgressView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const topMetrics = [
    { title: 'Overall Progress', icon: TrendingUp },
    { title: 'Total Practice Time', icon: Clock },
    { title: 'Training Completed', icon: Calendar },
    { title: 'Challenges Completed', icon: Target },
  ];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Progress</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">
            Track your growth, celebrate wins, and keep improving every day.
          </p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {topMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs text-center">
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                <Icon size={18} />
              </span>
              <h3 className="text-[13px] font-bold text-[#1a1411] mb-2">{m.title}</h3>
              <button
                type="button"
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#8b7c71] hover:text-[#844925]"
              >
                <Lock size={12} /> Log in to view
              </button>
            </div>
          );
        })}
      </div>

      {/* Growth Overview & Skill Progress */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <h3 className="text-[15px] font-bold text-[#1a1411]">Your Growth Overview</h3>
          </div>
          <div className="my-6 max-w-[320px]">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#f8efe7] text-[#844925]">
              <TrendingUp size={44} strokeWidth={1.5} />
            </div>
            <h4 className="text-[16px] font-bold text-[#1a1411]">All your growth insights in one place.</h4>
            <p className="mt-2 text-[12.5px] text-[#6e5d52]">
              Log in to view detailed analysis of your skills, training, and progress over time.
            </p>
            <button
              type="button"
              onClick={onLogin}
              className="button-lift mt-5 rounded-[6px] bg-[#844925] px-6 py-2.5 text-[12.5px] font-bold text-[#fff8f1]"
            >
              Log in to view
            </button>
          </div>
          <div />
        </div>

        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#1a1411] mb-4">Skill Progress</h3>
            <div className="space-y-3">
              {[
                { name: 'Communication', icon: MessageCircle },
                { name: 'Speaking', icon: Mic2 },
                { name: 'Pronunciation', icon: Volume2 },
                { name: 'Social Confidence', icon: Users },
                { name: 'Public Speaking', icon: Target },
                { name: 'Assertiveness', icon: Shield },
              ].map((sp) => {
                const Icon = sp.icon;
                return (
                  <div key={sp.name} className="flex items-center justify-between text-[12.5px]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                        <Icon size={13} />
                      </span>
                      <span className="font-semibold text-[#2a211c]">{sp.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 rounded-full bg-[#f2e6dc]" />
                      <span className="flex items-center gap-1 text-[11px] text-[#8b7c71]">
                        <Lock size={10} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="mt-5 w-full rounded-[6px] border border-[#e0d0c3] bg-[#fbfaf8] py-2 text-[12px] font-bold text-[#844925] hover:bg-[#f6ede5] transition-colors"
          >
            View all skills →
          </button>
        </div>
      </div>

      {/* Consistency Over Time & Achievements */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
          <h3 className="text-[15px] font-bold text-[#1a1411]">Consistency Over Time</h3>
          <p className="text-[12px] text-[#8b7c71] mb-4">Stay consistent and build lasting habits.</p>
          <div className="flex justify-between items-center py-4 border-y border-[#f0e8df]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold text-[#8b7c71]">{day}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                  <Lock size={12} />
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11.5px] text-[#8b7c71] text-center">Log in to see your consistency streak and activity.</p>
        </div>

        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#1a1411]">Achievements</h3>
            <p className="text-[12px] text-[#8b7c71] mb-3">Earn badges and celebrate milestones.</p>
            <p className="text-[12px] text-[#6e5d52]">Log in to see your badges and achievements.</p>
            <button
              type="button"
              onClick={onLogin}
              className="button-lift mt-4 rounded-[6px] bg-[#844925] px-4 py-2 text-[12px] font-bold text-[#fff8f1]"
            >
              Log in
            </button>
          </div>
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8efe7] text-[#844925]">
            <Trophy size={36} strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. RESOURCES VIEW (Matches ChatGPT Image Aug 13, 2026, 01_06_53 PM & 01_08_39 PM)
   ═══════════════════════════════════════════════════════════════════════════ */
function ResourcesView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const categories = [
    { title: 'Guides & Articles', icon: BookOpen },
    { title: 'Videos', icon: Video },
    { title: 'Audio Lessons', icon: Headphones },
    { title: 'Templates', icon: BookOpen },
    { title: 'Tools & Checklists', icon: Target },
    { title: 'Recommended', icon: Star },
  ];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Resources</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">
            Explore helpful materials, guides, and tools to support your learning and growth.
          </p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      <div>
        <h2 className="text-[15px] font-bold text-[#1a1411] mb-4">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-[12px] border border-[#e9ded5] bg-white p-4 shadow-xs text-center flex flex-col justify-between">
                <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                  <Icon size={17} />
                </span>
                <h3 className="text-[12.5px] font-bold text-[#1a1411]">{c.title}</h3>
                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-3 text-[11px] font-bold text-[#844925] hover:underline"
                >
                  Explore →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-[#1a1411]">Featured Resources</h2>
          <button type="button" onClick={onLogin} className="text-[12px] font-bold text-[#844925] hover:underline">
            View all resources →
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { title: 'Communication Skills Guide', sub: 'Improve the way you express and connect with others.' },
            { title: 'Public Speaking Workbook', sub: 'Step-by-step exercises to build confidence on any stage.' },
            { title: 'Daily Practice Planner', sub: 'Plan your daily practice and stay consistent.' },
            { title: 'Mindset for Growth', sub: 'Build the right mindset to achieve lasting growth.' },
          ].map((item) => (
            <div key={item.title} className="rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925] mb-3">
                  <BookOpen size={18} />
                </span>
                <h3 className="text-[13.5px] font-bold text-[#1a1411]">{item.title}</h3>
                <p className="mt-1 text-[11.5px] text-[#6e5d52]">{item.sub}</p>
              </div>
              <button
                type="button"
                onClick={onLogin}
                className="button-lift mt-4 flex items-center justify-center gap-1.5 rounded-[6px] border border-[#e0d0c3] bg-[#fdfbf9] py-2 text-[11.5px] font-bold text-[#844925] hover:bg-[#f6ede5]"
              >
                <Lock size={12} /> Log in to access
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. COMMUNITY VIEW (Matches ChatGPT Image Aug 13, 2026, 01_14_47 PM)
   ═══════════════════════════════════════════════════════════════════════════ */
function CommunityView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Community</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">
            Connect with like-minded people, share, learn, and grow together.
          </p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      {/* Community Hero banner */}
      <div className="rounded-[14px] border border-[#ebdccf] bg-[#f9f1ea] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="max-w-[440px]">
          <h2 className="font-display text-[26px] sm:text-[30px] leading-tight text-[#251a14]">
            You are not alone on your growth journey.
          </h2>
          <p className="mt-2 text-[13.5px] text-[#6e5d52] leading-relaxed">
            Share your experiences, ask questions, get support, and celebrate progress together.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="button-lift mt-5 rounded-[6px] bg-[#844925] px-6 py-2.5 text-[13px] font-bold text-[#fffaf5]"
          >
            Log in to join the community
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-4">
            <div className="h-16 w-16 rounded-full bg-[#e8d5c4] border-2 border-white flex items-center justify-center font-bold text-[#844925]">
              LK
            </div>
            <div className="h-16 w-16 rounded-full bg-[#ebd0ba] border-2 border-white flex items-center justify-center font-bold text-[#844925]">
              PK
            </div>
            <div className="h-16 w-16 rounded-full bg-[#f2dfcf] border-2 border-white flex items-center justify-center font-bold text-[#844925]">
              JD
            </div>
          </div>
        </div>
      </div>

      {/* Ways to Connect */}
      <div>
        <h2 className="text-[15px] font-bold text-[#1a1411] mb-4">Ways to Connect</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { title: 'Discussions', desc: 'Start or join conversations on topics that matter to you.', icon: MessageCircle },
            { title: 'Study Groups', desc: 'Connect with others, learn together, and stay motivated.', icon: Users },
            { title: 'Support & Encouragement', desc: 'Give and receive support from people who understand.', icon: Shield },
            { title: 'Share & Inspire', desc: 'Share your journey and inspire someone today.', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[12px] border border-[#e9ded5] bg-white p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925] mb-3">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-[14px] font-bold text-[#1a1411]">{item.title}</h3>
                  <p className="mt-1 text-[12px] text-[#6e5d52] leading-snug">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-4 text-[12px] font-bold text-[#844925] hover:underline flex items-center gap-1"
                >
                  Explore <ArrowRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. CALENDAR VIEW (Matches ChatGPT Image Aug 13, 2026, 01_19_52 PM (2))
   ═══════════════════════════════════════════════════════════════════════════ */
function CalendarView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Calendar</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">
            Plan your practice, stay consistent, and keep moving forward.
          </p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Interactive Calendar Month Grid */}
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[17px] font-bold text-[#1a1411]">June 2026</h3>
            <div className="flex items-center gap-2">
              <button type="button" className="p-1 rounded-md border border-[#eee6df] text-[#6e5d52] hover:bg-[#f6ede5]">
                <ChevronLeft size={16} />
              </button>
              <button type="button" className="p-1 rounded-md border border-[#eee6df] text-[#6e5d52] hover:bg-[#f6ede5]">
                <ChevronRight size={16} />
              </button>
              <button type="button" className="px-3 py-1 rounded-md border border-[#eee6df] text-[12px] font-semibold text-[#6e5d52] hover:bg-[#f6ede5]">
                Today
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-bold text-[#8b7c71] mb-2">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid 5 weeks */}
          <div className="grid grid-cols-7 gap-1 text-center text-[13px] border-t border-[#f2e9e0] pt-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`h-12 flex flex-col items-center justify-center rounded-[6px] border border-transparent hover:border-[#ebdccf] transition-colors ${
                  day === 12 ? 'bg-[#f6ede5] font-bold text-[#844925]' : 'text-[#2a211c]'
                }`}
              >
                <span>{day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[#f0e8df] flex items-center justify-center gap-6 text-[11.5px] text-[#8b7c71]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#844925]" /> Training Session
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c89b7b]" /> Challenge Day
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#709b68]" /> Practice Reminder
            </span>
          </div>
        </div>

        {/* Upcoming panel */}
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between text-center">
          <div>
            <div className="flex items-center justify-between mb-4 text-left">
              <h3 className="text-[15px] font-bold text-[#1a1411]">Upcoming</h3>
              <Calendar size={18} className="text-[#844925]" />
            </div>
            <p className="text-[12px] text-[#8b7c71] text-left">Your scheduled activities will appear here.</p>

            <div className="my-8">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f8efe7] text-[#844925]">
                <Clock size={36} strokeWidth={1.5} />
              </div>
              <h4 className="text-[15px] font-bold text-[#1a1411]">Nothing scheduled yet.</h4>
              <p className="mt-1 text-[12px] text-[#6e5d52]">Plan your next practice session to build consistency.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogin}
            className="button-lift w-full rounded-[6px] bg-[#844925] py-2.5 text-[12px] font-bold text-[#fff8f1]"
          >
            Log in to schedule
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. PROFILE VIEW (Matches ChatGPT Image Aug 13, 2026, 01_19_51 PM (1))
   ═══════════════════════════════════════════════════════════════════════════ */
function ProfileView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Profile</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">Manage your account and personalize your Loomy experience.</p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="rounded-[14px] border border-[#ebdccf] bg-[#f9f1ea] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <img
          src="/alex-avatar.png"
          alt="Alex"
          className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-xs"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-[22px] font-bold text-[#1a1411]">Alex</h2>
          <p className="text-[13px] text-[#844925] font-semibold">Active Member • Joined June 2026</p>
          <p className="mt-2 text-[13.5px] text-[#6e5d52]">Track your journey, update your preferences, and stay motivated.</p>
        </div>
        <button
          type="button"
          onClick={onLogin}
          className="button-lift rounded-[6px] bg-[#844925] px-5 py-2.5 text-[12.5px] font-bold text-[#fff8f1] shrink-0"
        >
          {isLoggedIn ? 'Edit Profile' : 'Log in to access profile'}
        </button>
      </div>

      {/* Profile Overview cards */}
      <div>
        <h2 className="text-[15px] font-bold text-[#1a1411] mb-4">Profile Overview</h2>
        <div className="grid gap-4 sm:grid-cols-5">
          {[
            { title: 'Personal Information', sub: 'Update your basic details and contact info.', icon: User },
            { title: 'Goals & Interests', sub: 'Set your goals and tell us what you want to achieve.', icon: Target },
            { title: 'Preferences', sub: 'Customize your learning preferences and reminders.', icon: Star },
            { title: 'Privacy & Security', sub: 'Manage your privacy settings and account security.', icon: Shield },
            { title: 'Notifications', sub: 'Control how and when you want to be notified.', icon: Bell },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[12px] border border-[#e9ded5] bg-white p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925] mb-3">
                    <Icon size={18} />
                  </span>
                  <h3 className="text-[13px] font-bold text-[#1a1411]">{item.title}</h3>
                  <p className="mt-1 text-[11.5px] text-[#6e5d52]">{item.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-[#8b7c71] hover:text-[#844925]"
                >
                  <Lock size={11} /> {isLoggedIn ? 'Manage' : 'Login required'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   10. SETTINGS VIEW (Matches ChatGPT Image Aug 13, 2026, 01_26_44 PM)
   ═══════════════════════════════════════════════════════════════════════════ */
function SettingsView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const settingsRows = [
    { title: 'Account Settings', desc: 'Manage your personal information, profile details, and account preferences.', icon: User },
    { title: 'Notifications', desc: 'Choose how and when you want to be notified.', icon: Bell },
    { title: 'Privacy & Security', desc: 'Manage your privacy settings and account security.', icon: Shield },
    { title: 'Appearance', desc: 'Customize your theme, colors, and visual preferences.', icon: Palette },
    { title: 'Language', desc: 'Select your preferred language.', icon: Globe },
    { title: 'Email Preferences', desc: 'Manage emails from Loomy and what you receive.', icon: Mail },
    { title: 'Data & Export', desc: 'Download your data or manage your content.', icon: BookOpen },
    { title: 'Delete Account', desc: 'Permanently delete your account and all associated data.', icon: Trash2 },
  ];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Settings</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">
            Customize your experience, manage your preferences, and keep your account secure.
          </p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      {/* Settings list */}
      <div className="space-y-3">
        {settingsRows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.title}
              className="flex items-center justify-between p-4 rounded-[12px] border border-[#e9ded5] bg-white shadow-xs hover:border-[#ebdccf] transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6ede5] text-[#844925]">
                  <Icon size={19} />
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1a1411]">{row.title}</h3>
                  <p className="text-[12px] text-[#6e5d52]">{row.desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogin}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#844925] hover:underline shrink-0 ml-4"
              >
                <Lock size={12} /> Log in to update <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   11. HELP VIEW (Matches ChatGPT Image Aug 13, 2026, 01_55_48 PM)
   ═══════════════════════════════════════════════════════════════════════════ */
function HelpView({ isLoggedIn, onLogin }: { isLoggedIn: boolean; onLogin: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: 'How do I create an account?', a: 'Click on the Log in or Get Started buttons to register with your email or Google account.' },
    { q: 'How do I start my first training?', a: 'Navigate to the Train section on the sidebar, select any available category, and hit Start Training.' },
    { q: 'What types of challenges are available?', a: 'Loomy offers Daily Challenges, Communication Drills, Public Speaking milestones, and Social Confidence challenges.' },
    { q: 'How can I track my progress?', a: 'Visit the Progress tab to see your completion percentages, practice hours, and streak metrics.' },
    { q: 'Is my data safe on Loomy?', a: 'Yes, your recordings and practice sessions are private, encrypted, and never shared with third parties.' },
  ];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="relative z-10 max-w-[500px]">
          <h1 className="font-display text-[38px] leading-tight text-[#171311] sm:text-[46px]">Help Center</h1>
          <p className="mt-2 text-[15px] text-[#6e5d52]">We're here to help you every step of your growth journey.</p>
        </div>
        <div className="pointer-events-none absolute -top-4 right-0 h-[100px] w-[50%] opacity-85 hidden sm:block">
          <ThreadHeaderArt />
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-[600px]">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b7c71]" />
        <input
          type="text"
          placeholder="Search help articles or topics..."
          className="w-full rounded-[10px] border border-[#e4d6cb] bg-white pl-11 pr-4 py-3 text-[14px] text-[#1a1411] placeholder:text-[#8b7c71] focus:outline-none focus:border-[#844925]"
        />
      </div>

      {/* FAQ & Contact Support */}
      <div className="grid gap-6 sm:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs">
          <h3 className="text-[16px] font-bold text-[#1a1411] mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="rounded-[8px] border border-[#f0e7de] bg-[#fdfbf9] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-[13.5px] font-semibold text-[#1a1411]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180 text-[#844925]' : 'text-[#8b7c71]'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-[12.5px] text-[#6e5d52] leading-relaxed border-t border-[#f0e7de]/60 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[12px] border border-[#e9ded5] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1411] mb-2">Still need help?</h3>
            <p className="text-[12.5px] text-[#6e5d52]">Our support team is ready to assist you.</p>

            <div className="mt-6 rounded-[10px] bg-[#f9f1ea] border border-[#ebdccf] p-5 text-center">
              <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#844925] border border-[#e4d1bf]">
                <Headphones size={22} />
              </span>
              <h4 className="text-[14px] font-bold text-[#1a1411]">Contact Support</h4>
              <p className="mt-1 text-[11.5px] text-[#6e5d52]">Get personalized help from our dedicated support team.</p>
              <button
                type="button"
                className="button-lift mt-4 w-full rounded-[6px] bg-[#844925] py-2 text-[12px] font-bold text-[#fff8f1]"
              >
                Contact Support
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#f0e8df] space-y-1.5 text-[11.5px] text-[#8b7c71]">
            <p>✉️ Email: support@loomy.ai</p>
            <p>🕒 Response time: Within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
