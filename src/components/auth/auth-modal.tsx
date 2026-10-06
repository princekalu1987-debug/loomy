import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'signin' }: AuthModalProps) {
  const { login, signup, loginAsDemo } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await signup(name, email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign up.');
          setLoading(false);
          return;
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in.');
          setLoading(false);
          return;
        }
      }

      onSuccess?.();
      onClose();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-[440px] rounded-[16px] border border-[#ebdccf] bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#8b7c71] hover:bg-[#f6ede5] hover:text-[#1a1411] transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f9f0e6] text-[#844925] border border-[#ebdccf]">
            <Lock size={20} />
          </div>
          <h2 className="font-display text-[24px] font-bold text-[#1a1411]">
            {mode === 'signin' ? 'Welcome Back to Loomy' : 'Create Your Loomy Account'}
          </h2>
          <p className="mt-1 text-[13px] text-[#6e5d52]">
            {mode === 'signin'
              ? 'Sign in to access your personal drills, recordings and progress.'
              : 'Join to start practicing speech, tracking streaks and building confidence.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 rounded-[8px] bg-[#f5ede5] p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`rounded-[6px] py-1.5 text-[13px] font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#844925] shadow-xs'
                : 'text-[#6e5d52] hover:text-[#1a1411]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`rounded-[6px] py-1.5 text-[13px] font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#844925] shadow-xs'
                : 'text-[#6e5d52] hover:text-[#1a1411]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-[8px] bg-red-50 border border-red-200 p-3 text-[12.5px] text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[12px] font-bold text-[#2a211c] mb-1">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8b7c71]">
                  <User size={15} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex or Jordan"
                  className="w-full rounded-[8px] border border-[#d9cac0] bg-[#fcfbfa] py-2.5 pl-9 pr-3 text-[13px] text-[#1a1411] placeholder:text-[#a89a8f] focus:border-[#844925] focus:outline-none focus:ring-1 focus:ring-[#844925]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-bold text-[#2a211c] mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8b7c71]">
                <Mail size={15} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[8px] border border-[#d9cac0] bg-[#fcfbfa] py-2.5 pl-9 pr-3 text-[13px] text-[#1a1411] placeholder:text-[#a89a8f] focus:border-[#844925] focus:outline-none focus:ring-1 focus:ring-[#844925]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[12px] font-bold text-[#2a211c]">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link has been simulated. You can also sign in directly or use Demo Sign In!')}
                  className="text-[11px] font-semibold text-[#844925] hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8b7c71]">
                <Lock size={15} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[8px] border border-[#d9cac0] bg-[#fcfbfa] py-2.5 pl-9 pr-3 text-[13px] text-[#1a1411] placeholder:text-[#a89a8f] focus:border-[#844925] focus:outline-none focus:ring-1 focus:ring-[#844925]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-lift mt-2 w-full rounded-[8px] bg-[#844925] py-2.5 text-[13px] font-bold text-[#fffaf5] hover:bg-[#723e1f] transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#ebdccf]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-[#8b7c71]">
            <span className="bg-white px-2">or quick test</span>
          </div>
        </div>

        {/* One-click Demo Account */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="w-full rounded-[8px] border border-[#d9cac0] bg-[#fdfbf9] py-2 px-3 text-[12px] font-bold text-[#844925] hover:bg-[#f6ede5] transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={14} />
          Continue with Demo Account (Alex)
        </button>
      </div>
    </div>
  );
}
