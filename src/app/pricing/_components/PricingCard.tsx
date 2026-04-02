'use client';

import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import type { CreditPack } from './types';

type PricingCardProps = {
  pack: CreditPack;
  onBuy: (packId: CreditPack['id']) => void;
};

export const PricingCard = ({ pack, onBuy }: PricingCardProps) => {
  const Icon = pack.icon;
  const isFeatured = !!pack.featured;
  const isPower = pack.id === 'power';

  return (
    <article
      className="relative h-full overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
      style={{
        borderColor: isFeatured ? '#c46f45' : '#e0d0bd',
        background: isFeatured ? 'linear-gradient(155deg, #fff8f2 0%, #ffe8d2 100%)' : '#fffaf4',
        boxShadow: isFeatured ? '0 28px 60px rgba(95, 53, 30, 0.2)' : '0 12px 32px rgba(95, 53, 30, 0.07)',
        padding: isFeatured ? '22px 18px' : '18px',
      }}
    >
      {pack.badge ? (
        <div className="absolute right-4 top-4">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
            style={{
              backgroundColor: isFeatured ? '#2f1e16' : '#2d5a3d',
              color: isFeatured ? '#fde8d4' : '#d4f5e0',
            }}
          >
            {pack.badge}
          </span>
        </div>
      ) : null}

      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
          style={{
            backgroundColor: isFeatured ? '#c46f45' : isPower ? '#2d5a3d' : '#efe0d0',
            color: isFeatured || isPower ? '#fff' : '#8b5a3c',
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-tight" style={{ fontFamily: 'var(--font-fraunces), serif', color: '#2f1e16' }}>
            {pack.name}
          </h2>
          <p className="text-[11px] mt-0.5" style={{ color: '#9a7260' }}>
            {pack.tagline}
          </p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[2.6rem] font-black leading-none" style={{ fontFamily: 'var(--font-fraunces), serif', color: '#2f1e16' }}>
            {pack.credits.toLocaleString()}
          </span>
          <span className="text-sm font-medium" style={{ color: '#9a7260' }}>
            credits
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xl font-bold" style={{ color: '#c46f45' }}>
            ₹{pack.price}
          </span>
          <span className="text-xs rounded-full px-2.5 py-0.5 font-medium" style={{ backgroundColor: '#f0e4d6', color: '#7a4f36' }}>
            ₹{pack.perCredit.toFixed(2)}/credit
          </span>
          {pack.savingsPct ? (
            <span className="text-xs font-bold rounded-full px-2.5 py-0.5" style={{ backgroundColor: '#dcf5e3', color: '#1e6636' }}>
              Save {pack.savingsPct}%
            </span>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl px-3 py-2 mb-3 flex flex-wrap gap-2 text-[11px] mt-2" style={{ backgroundColor: isFeatured ? 'rgba(196,111,69,0.09)' : 'rgba(47,30,22,0.05)' }}>
        {pack.useCases.map(uc => (
          <div key={uc} className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 flex-none" style={{ color: '#3f7250' }} />
            <span style={{ color: '#5e4235' }}>≈ {uc}</span>
          </div>
        ))}
      </div>

      <ul className="space-y-1.5 mb-4">
        {pack.perks.map(perk => (
          <li key={perk} className="flex items-start gap-2 text-xs md:text-sm">
            <Check className="mt-0.5 h-4 w-4 flex-none" style={{ color: '#3f7250' }} />
            <span style={{ color: '#4a3028' }}>{perk}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onBuy(pack.id)}
        className="mt-auto w-full rounded-2xl px-4 py-3 text-xs md:text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        style={{
          backgroundColor: isFeatured ? '#c46f45' : isPower ? '#2d5a3d' : '#2f1e16',
          color: '#fff',
        }}
      >
        Get {pack.credits.toLocaleString()} Credits for ₹{pack.price}
        <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
};
