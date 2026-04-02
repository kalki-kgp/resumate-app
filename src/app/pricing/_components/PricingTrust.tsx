'use client';

import { TRUST_ITEMS } from './constants';

export const PricingTrust = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-8 md:px-8 md:pb-10">
      <div
        className="rounded-3xl border p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 justify-between"
        style={{
          borderColor: '#d8cab7',
          backgroundColor: 'rgba(255, 250, 244, 0.82)',
        }}
      >
        {TRUST_ITEMS.map(({ icon: Icon, text, sub }) => (
          <div key={text} className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ backgroundColor: '#f0e6d8' }}>
              <Icon className="h-5 w-5" style={{ color: '#c46f45' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#2f1e16' }}>
                {text}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#9a7260' }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
