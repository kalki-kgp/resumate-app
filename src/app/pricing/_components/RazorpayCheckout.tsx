'use client';

import { useMemo, useState } from 'react';
import {
  Building2,
  Check,
  CreditCard,
  Lock,
  RefreshCw,
  Smartphone,
  X,
} from 'lucide-react';
import type { CreditPack, PaymentMethod, PaymentStep } from './types';

type RazorpayCheckoutProps = {
  pack: CreditPack;
  onClose: () => void;
};

export function RazorpayCheckout({ pack, onClose }: RazorpayCheckoutProps) {
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [step, setStep] = useState<PaymentStep>('method');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const orderId = useMemo(() => `RM${Date.now().toString().slice(-8).toUpperCase()}`, []);

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(' ') ?? digits;
  };

  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const canPay = () => {
    if (method === 'upi') return upiId.includes('@') && upiId.length >= 5;
    if (method === 'card') {
      return (
        cardNumber.replace(/\s/g, '').length === 16 &&
        expiry.length === 5 &&
        cvv.length === 3 &&
        cardName.length >= 2
      );
    }
    return !!selectedBank;
  };

  const handlePay = () => {
    if (method === 'upi') {
      if (!upiId.includes('@') || upiId.length < 5) {
        setUpiError('Enter a valid UPI ID (e.g. name@okhdfcbank)');
        return;
      }
      setUpiError('');
      setStep('upi_waiting');
      window.setTimeout(() => setStep('processing'), 2500);
      window.setTimeout(() => setStep('success'), 4200);
      return;
    }

    if (method === 'card') {
      setStep('otp');
      return;
    }

    setStep('netbank_redirect');
    window.setTimeout(() => setStep('processing'), 2000);
    window.setTimeout(() => setStep('success'), 3800);
  };

  const handleOtp = () => {
    if (otp.length !== 6) return;
    setStep('processing');
    window.setTimeout(() => setStep('success'), 1800);
  };

  const banks = [
    { id: 'sbi', name: 'SBI', color: '#1B4E8C' },
    { id: 'hdfc', name: 'HDFC', color: '#004C8F' },
    { id: 'icici', name: 'ICICI', color: '#B02A30' },
    { id: 'axis', name: 'Axis', color: '#97144D' },
    { id: 'kotak', name: 'Kotak', color: '#E31837' },
    { id: 'pnb', name: 'PNB', color: '#1C3F7A' },
    { id: 'bob', name: 'BoB', color: '#F47921' },
    { id: 'idfc', name: 'IDFC', color: '#4A148C' },
  ];

  const methodLabel: Record<PaymentMethod, string> = {
    upi: 'UPI',
    card: 'Debit / Credit Card',
    netbanking: 'Net Banking',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="w-full overflow-hidden rounded-t-3xl sm:rounded-2xl shadow-2xl"
        style={{ maxWidth: '680px', fontFamily: 'var(--font-dm-sans), sans-serif' }}
      >
        <div className="flex min-h-0 flex-col sm:flex-row" style={{ minHeight: '460px' }}>
          <div
            className="flex flex-row sm:flex-col sm:justify-between p-4 sm:p-6 sm:w-[240px] sm:min-w-[240px]"
            style={{ backgroundColor: '#072654', color: '#fff' }}
          >
            <div className="hidden sm:flex items-center gap-2 mb-7">
              <div className="flex h-6 w-6 items-center justify-center rounded font-extrabold text-xs text-white" style={{ backgroundColor: '#3395FF' }}>
                R
              </div>
              <span className="text-sm font-bold tracking-wide" style={{ color: 'rgba(255,255,255,0.9)' }}>
                razorpay
              </span>
            </div>

            <div className="hidden sm:block mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl font-bold text-xl text-white mb-2.5" style={{ backgroundColor: '#c46f45' }}>
                R
              </div>
              <p className="text-sm font-semibold text-white">ResuMate</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                AI Resume Builder
              </p>
            </div>

            <div className="hidden sm:block mb-5">
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Amount to Pay
              </p>
              <p className="text-3xl font-bold text-white">₹{pack.price}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {pack.credits.toLocaleString()} credits · {pack.name} Pack
              </p>
            </div>

            <div className="hidden sm:block rounded-lg px-3 py-2.5 mb-auto" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Order ID
              </p>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                #{orderId}
              </p>
            </div>

            <div className="flex sm:hidden items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-base text-white" style={{ backgroundColor: '#c46f45' }}>
                  R
                </div>
                <div>
                  <p className="text-xs font-medium text-white">ResuMate</p>
                  <p className="text-lg font-bold text-white leading-none mt-0.5">₹{pack.price}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-1">
                <X className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.6)' }} />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 mt-5">
              <Lock className="h-3 w-3" style={{ color: 'rgba(255,255,255,0.35)' }} />
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Secured by Razorpay
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-white p-5 sm:p-6">
            <div className="hidden sm:flex items-center justify-between mb-5">
              <p className="text-sm font-semibold" style={{ color: '#222' }}>
                {step === 'method' && 'Select Payment Method'}
                {step === 'otp' && 'OTP Verification'}
                {step === 'upi_waiting' && 'Awaiting UPI Approval'}
                {step === 'netbank_redirect' && 'Redirecting to Bank'}
                {step === 'processing' && 'Processing Payment'}
                {step === 'success' && 'Payment Successful'}
              </p>
              <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {step === 'method' ? (
              <>
                <div className="flex border-b mb-4" style={{ borderColor: '#e5e7eb' }}>
                  {(['upi', 'card', 'netbanking'] as PaymentMethod[]).map(m => {
                    const icons = { upi: Smartphone, card: CreditCard, netbanking: Building2 };
                    const labels = { upi: 'UPI', card: 'Cards', netbanking: 'Net Banking' };
                    const Icon = icons[m];
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors"
                        style={{
                          color: method === m ? '#3395FF' : '#888',
                          borderBottom: method === m ? '2px solid #3395FF' : '2px solid transparent',
                          marginBottom: '-1px',
                        }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {labels[m]}
                      </button>
                    );
                  })}
                </div>

                {method === 'upi' ? (
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#aaa' }}>
                      Quick Pay
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { name: 'Google Pay', short: 'GPay', color: '#4285F4', bg: '#EEF4FF', initial: 'G' },
                        { name: 'PhonePe', short: 'PhonePe', color: '#5F259F', bg: '#F3EEFF', initial: 'Ph' },
                        { name: 'Paytm', short: 'Paytm', color: '#00BAF2', bg: '#E5F9FF', initial: 'P' },
                      ].map(app => (
                        <button
                          key={app.name}
                          type="button"
                          onClick={() => {
                            setUpiId(`user@${app.name.toLowerCase().replace(/ /g, '')}`);
                            setUpiError('');
                          }}
                          className="flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs transition-all hover:shadow-sm active:scale-95"
                          style={{ borderColor: '#e5e7eb', backgroundColor: app.bg }}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-white text-xs" style={{ backgroundColor: app.color }}>
                            {app.initial}
                          </div>
                          <span className="font-medium" style={{ color: '#333' }}>{app.short}</span>
                        </button>
                      ))}
                    </div>
                    <div className="relative flex items-center gap-3 mb-3">
                      <div className="flex-1 border-t" style={{ borderColor: '#e5e7eb' }} />
                      <span className="text-xs text-gray-400">or enter UPI ID</span>
                      <div className="flex-1 border-t" style={{ borderColor: '#e5e7eb' }} />
                    </div>
                    <div className="relative">
                      <input
                        value={upiId}
                        onChange={e => {
                          setUpiId(e.target.value);
                          setUpiError('');
                        }}
                        placeholder="yourname@okhdfcbank"
                        className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors"
                        style={{ borderColor: upiError ? '#ef4444' : '#d1d5db', color: '#111' }}
                      />
                      {upiId.includes('@') && upiId.length >= 5 ? (
                        <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                      ) : null}
                    </div>
                    {upiError ? <p className="mt-1 text-xs text-red-500">{upiError}</p> : null}
                  </div>
                ) : null}

                {method === 'card' ? (
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Card Number</label>
                      <div className="relative">
                        <input value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} placeholder="0000 0000 0000 0000" className="w-full rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: '#d1d5db', color: '#111', letterSpacing: '0.06em', fontFamily: 'monospace' }} />
                        <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Expiry Date</label>
                        <input value={expiry} onChange={e => setExpiry(formatExp(e.target.value))} placeholder="MM / YY" className="w-full rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: '#d1d5db', color: '#111' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">CVV</label>
                        <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="•••" type="password" className="w-full rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: '#d1d5db', color: '#111' }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Name on Card</label>
                      <input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="JOHN DOE" className="w-full rounded-lg border px-4 py-3 text-sm outline-none" style={{ borderColor: '#d1d5db', color: '#111', letterSpacing: '0.05em' }} />
                    </div>
                  </div>
                ) : null}

                {method === 'netbanking' ? (
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#aaa' }}>Popular Banks</p>
                    <div className="grid grid-cols-4 gap-2">
                      {banks.map(bank => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className="flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-[11px] font-medium transition-all"
                          style={{
                            borderColor: selectedBank === bank.id ? bank.color : '#e5e7eb',
                            backgroundColor: selectedBank === bank.id ? `${bank.color}12` : '#fff',
                          }}
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded font-bold text-white text-[10px]" style={{ backgroundColor: bank.color }}>
                            {bank.name.slice(0, 2)}
                          </div>
                          <span style={{ color: selectedBank === bank.id ? bank.color : '#555' }}>
                            {bank.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={!canPay()}
                  className="mt-4 w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#3395FF' }}
                >
                  Pay ₹{pack.price}
                </button>
                <div className="mt-2.5 flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3 text-gray-300" />
                  <p className="text-[10px] text-gray-400">
                    Powered by <span className="font-semibold" style={{ color: '#3395FF' }}>Razorpay</span> · 256-bit SSL Encryption
                  </p>
                </div>
              </>
            ) : null}

            {step === 'upi_waiting' ? (
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <div className="relative mb-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#EEF4FF' }}>
                    <Smartphone className="h-8 w-8" style={{ color: '#3395FF' }} />
                  </div>
                  <div className="absolute -right-1 -top-1 h-5 w-5 animate-pulse rounded-full flex items-center justify-center" style={{ backgroundColor: '#22c55e' }}>
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>
                </div>
                <p className="text-base font-semibold" style={{ color: '#1a1a1a' }}>Payment Request Sent</p>
                <p className="mt-1.5 text-sm max-w-[220px]" style={{ color: '#666' }}>
                  Open your UPI app and approve the payment of <span className="font-semibold" style={{ color: '#333' }}>₹{pack.price}</span>
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-full px-4 py-2 text-xs" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', color: '#999' }}>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Waiting for approval...
                </div>
              </div>
            ) : null}

            {step === 'otp' ? (
              <div className="flex-1">
                <p className="text-sm mb-1" style={{ color: '#555' }}>
                  Enter the 6-digit OTP sent to your registered mobile number ending in <span className="font-semibold text-gray-700">••••</span>
                </p>
                <p className="text-xs mb-5" style={{ color: '#aaa' }}>Valid for 10 minutes</p>
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full rounded-xl border px-4 py-3.5 text-center text-3xl font-bold outline-none"
                  style={{ borderColor: '#d1d5db', color: '#111', fontFamily: 'monospace', letterSpacing: '0.5em' }}
                />
                <p className="text-xs text-center mt-3 mb-5" style={{ color: '#aaa' }}>
                  Didn&apos;t receive? <button type="button" className="font-semibold" style={{ color: '#3395FF' }}>Resend OTP</button>
                </p>
                <button type="button" onClick={handleOtp} disabled={otp.length !== 6} className="w-full rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: '#3395FF' }}>
                  Verify &amp; Pay ₹{pack.price}
                </button>
              </div>
            ) : null}

            {step === 'netbank_redirect' ? (
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 h-12 w-12 rounded-full border-[3px] animate-spin" style={{ borderColor: '#3395FF', borderTopColor: 'transparent' }} />
                <p className="text-base font-semibold" style={{ color: '#1a1a1a' }}>Redirecting to your bank</p>
                <p className="mt-1.5 text-sm" style={{ color: '#888' }}>Please do not press back or refresh...</p>
              </div>
            ) : null}

            {step === 'processing' ? (
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 h-12 w-12 rounded-full border-[3px] animate-spin" style={{ borderColor: '#3395FF', borderTopColor: 'transparent' }} />
                <p className="text-base font-semibold" style={{ color: '#1a1a1a' }}>Processing Payment</p>
                <p className="mt-1.5 text-sm" style={{ color: '#888' }}>Please don&apos;t close this window...</p>
              </div>
            ) : null}

            {step === 'success' ? (
              <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#ECFDF5' }}>
                  <Check className="h-8 w-8" style={{ color: '#16a34a' }} />
                </div>
                <p className="text-xl font-bold" style={{ color: '#1a1a1a', fontFamily: 'var(--font-fraunces), serif' }}>
                  Payment Successful!
                </p>
                <p className="mt-1 text-sm" style={{ color: '#888' }}>
                  ₹{pack.price} paid via {methodLabel[method]}
                </p>
                <div className="mt-4 w-full rounded-xl border px-5 py-4" style={{ borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}>
                  <p className="text-3xl font-bold" style={{ color: '#16a34a' }}>+{pack.credits.toLocaleString()}</p>
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>credits added to your ResuMate wallet</p>
                </div>
                <button type="button" onClick={onClose} className="mt-5 w-full rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: '#3395FF' }}>
                  Go to Dashboard
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
