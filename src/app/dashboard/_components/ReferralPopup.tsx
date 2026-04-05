'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, Gift, Users, Sparkles, ChevronRight } from 'lucide-react';
import type { ReferralInfo } from './dashboard-types';

export type ReferralPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  referralInfo: ReferralInfo | null;
  isLoading: boolean;
};

const MILESTONES = [
  { referral: 1, credits: 50, cumulative: 50 },
  { referral: 2, credits: 100, cumulative: 150 },
  { referral: 3, credits: 150, cumulative: 300 },
];

export function ReferralPopup({ isOpen, onClose, referralInfo, isLoading }: ReferralPopupProps) {
  const [copied, setCopied] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!referralInfo) return;
    try {
      await navigator.clipboard.writeText(referralInfo.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = referralInfo.referral_link;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalEarned = referralInfo?.total_credits_earned ?? 0;
  const totalReferrals = referralInfo?.total_referrals ?? 0;
  const progressPercent = Math.min((totalEarned / 300) * 100, 100);
  const allComplete = totalReferrals >= 3;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: animateIn ? 1 : 0 }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl transition-all duration-500"
        style={{
          transform: animateIn ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
          opacity: animateIn ? 1 : 0,
        }}
      >
        {/* Decorative top gradient */}
        <div
          className="relative h-36 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ff8b2f 0%, #ff6b3d 40%, #f94f6d 100%)',
          }}
        >
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 animate-float"
                style={{
                  width: `${6 + (i % 4) * 4}px`,
                  height: `${6 + (i % 4) * 4}px`,
                  left: `${(i * 8.3) % 100}%`,
                  top: `${(i * 13.7) % 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + (i % 3)}s`,
                }}
              />
            ))}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <X size={18} />
          </button>

          {/* Header content */}
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Gift size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              Refer & Earn
            </h2>
            <p className="mt-1 text-sm text-white/80">
              Invite friends, earn up to 300 credits
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff8b2f] border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Progress section */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2a2f3a]">
                    {totalEarned} / 300 credits earned
                  </span>
                  <span className="text-[#8a909b]">
                    {totalReferrals}/3 friends
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative h-3 overflow-hidden rounded-full bg-[#f0f1f3]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      background: 'linear-gradient(90deg, #ff8b2f, #f94f6d)',
                    }}
                  />
                  {/* Shimmer effect */}
                  {totalEarned > 0 && totalEarned < 300 && (
                    <div
                      className="absolute inset-y-0 left-0 animate-shimmer rounded-full"
                      style={{
                        width: `${progressPercent}%`,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        backgroundSize: '200% 100%',
                      }}
                    />
                  )}
                </div>

                {/* Milestones */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {MILESTONES.map((m, i) => {
                    const achieved = totalReferrals > i;
                    return (
                      <div
                        key={m.referral}
                        className={`rounded-xl border px-3 py-2 text-center transition-all duration-300 ${
                          achieved
                            ? 'border-[#ff8b2f]/30 bg-[#fff7f0]'
                            : 'border-[#e8ebf0] bg-[#fafbfd]'
                        }`}
                      >
                        <div className={`text-lg font-bold ${achieved ? 'text-[#ff8b2f]' : 'text-[#c0c5ce]'}`}>
                          {achieved ? (
                            <span className="inline-flex items-center gap-1">
                              <Check size={16} className="text-green-500" />
                              +{m.credits}
                            </span>
                          ) : (
                            `+${m.credits}`
                          )}
                        </div>
                        <div className="text-[10px] text-[#8a909b]">
                          {i === 0 ? '1st' : i === 1 ? '2nd' : '3rd'} friend
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Referral link */}
              <div className="mb-5">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#2a2f3a]">
                  <Sparkles size={14} className="text-[#ff8b2f]" />
                  Your referral link
                </label>
                <div className="flex items-stretch gap-2">
                  <div className="flex-1 overflow-hidden rounded-xl border border-[#e4e7eb] bg-[#f8f9fb] px-3 py-2.5">
                    <p className="truncate text-xs text-[#5a6270]">
                      {referralInfo?.referral_link ?? '...'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-xl px-4 text-xs font-semibold text-white transition-all active:scale-95"
                    style={{
                      background: copied
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #ff8b2f, #f94f6d)',
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Referral list */}
              {referralInfo && referralInfo.referrals.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#2a2f3a]">
                    <Users size={14} className="text-[#ff8b2f]" />
                    Friends who joined
                  </h3>
                  <div className="space-y-2">
                    {referralInfo.referrals.map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-[#e8ebf0] bg-[#fafbfd] px-3 py-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #ff8b2f, #f94f6d)' }}
                          >
                            {entry.referred_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-[#2a2f3a]">
                            {entry.referred_name}
                          </span>
                        </div>
                        <span className="rounded-full bg-[#fff7f0] px-2.5 py-0.5 text-xs font-semibold text-[#ff8b2f]">
                          +{entry.credits_awarded} credits
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next reward hint */}
              {!allComplete && referralInfo && (
                <div className="rounded-xl border border-dashed border-[#ff8b2f]/30 bg-[#fff9f5] px-4 py-3 text-center">
                  <p className="text-xs text-[#8a909b]">
                    Invite {totalReferrals === 0 ? 'your first friend' : 'another friend'} to earn{' '}
                    <span className="font-bold text-[#ff8b2f]">+{referralInfo.next_reward} credits</span>
                  </p>
                </div>
              )}

              {/* All complete celebration */}
              {allComplete && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center">
                  <p className="text-xs font-semibold text-green-700">
                    You've earned the maximum 300 referral credits! Thank you for spreading the word!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
