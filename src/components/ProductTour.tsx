'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type TourStep = {
  /** data-tour attribute value on the target element */
  target: string;
  /** Tooltip title */
  title: string;
  /** Tooltip description */
  description: string;
  /** Preferred tooltip placement relative to the target */
  placement?: 'top' | 'bottom' | 'left' | 'right';
};

export type ProductTourProps = {
  /** Unique key used to persist "seen" state in localStorage */
  tourId: string;
  /** Ordered list of tour steps */
  steps: TourStep[];
  /** Accent color for buttons and highlights */
  accentColor?: string;
  /** Secondary text color */
  mutedColor?: string;
  /** Callback when tour ends (completed or skipped) */
  onComplete?: () => void;
};

const SPOTLIGHT_PADDING = 10;
const TOOLTIP_GAP = 14;
const TOOLTIP_MAX_W = 340;

function getStorageKey(tourId: string) {
  return `resumate_tour_${tourId}_done`;
}

type Rect = { top: number; left: number; width: number; height: number };

function getElementRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    left: r.left + window.scrollX,
    width: r.width,
    height: r.height,
  };
}

function computeTooltipPosition(
  targetRect: Rect,
  placement: TourStep['placement'],
  tooltipW: number,
  tooltipH: number
) {
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const scrollY = window.scrollY;

  // Target position relative to viewport
  const tTop = targetRect.top - scrollY;
  const tLeft = targetRect.left;

  let top = 0;
  let left = 0;
  let resolvedPlacement = placement || 'bottom';

  // Auto-resolve if no room
  if (resolvedPlacement === 'bottom' && tTop + targetRect.height + TOOLTIP_GAP + tooltipH > viewH) {
    resolvedPlacement = 'top';
  }
  if (resolvedPlacement === 'top' && tTop - TOOLTIP_GAP - tooltipH < 0) {
    resolvedPlacement = 'bottom';
  }

  switch (resolvedPlacement) {
    case 'top':
      top = tTop - tooltipH - TOOLTIP_GAP;
      left = tLeft + targetRect.width / 2 - tooltipW / 2;
      break;
    case 'bottom':
      top = tTop + targetRect.height + TOOLTIP_GAP;
      left = tLeft + targetRect.width / 2 - tooltipW / 2;
      break;
    case 'left':
      top = tTop + targetRect.height / 2 - tooltipH / 2;
      left = tLeft - tooltipW - TOOLTIP_GAP;
      break;
    case 'right':
      top = tTop + targetRect.height / 2 - tooltipH / 2;
      left = tLeft + targetRect.width + TOOLTIP_GAP;
      break;
  }

  // Clamp to viewport
  left = Math.max(12, Math.min(left, viewW - tooltipW - 12));
  top = Math.max(12, Math.min(top, viewH - tooltipH - 12));

  return { top, left, placement: resolvedPlacement };
}

export function ProductTour({
  tourId,
  steps,
  accentColor = '#c96442',
  mutedColor = '#8b7355',
  onComplete,
}: ProductTourProps) {
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; placement: string }>({
    top: 0,
    left: 0,
    placement: 'bottom',
  });
  const [transitioning, setTransitioning] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check if tour was already completed
  useEffect(() => {
    try {
      if (localStorage.getItem(getStorageKey(tourId))) return;
    } catch {
      // localStorage unavailable
    }

    // Delay start to let page render
    const timer = setTimeout(() => {
      setActive(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [tourId]);

  const finish = useCallback(() => {
    setActive(false);
    try {
      localStorage.setItem(getStorageKey(tourId), '1');
    } catch {
      // ignore
    }
    onComplete?.();
  }, [tourId, onComplete]);

  // Position spotlight and tooltip for the current step
  useEffect(() => {
    if (!active || !steps[current]) return;

    const step = steps[current];

    const doPosition = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) return;

      const rect = getElementRect(el);
      setTargetRect(rect);

      // Scroll element into view if needed
      const viewTop = window.scrollY;
      const viewBottom = viewTop + window.innerHeight;
      const elCenter = rect.top + rect.height / 2;
      if (elCenter < viewTop + 100 || elCenter > viewBottom - 100) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        requestAnimationFrame(() => {
          setTargetRect(getElementRect(el));
        });
      }

      // Position tooltip after it renders
      requestAnimationFrame(() => {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;
        const pos = computeTooltipPosition(
          getElementRect(el),
          step.placement,
          tooltip.offsetWidth,
          tooltip.offsetHeight
        );
        setTooltipPos(pos);
      });
    };

    // Defer initial positioning to avoid synchronous setState
    const frame = requestAnimationFrame(doPosition);

    const onResize = () => doPosition();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [active, current, steps]);

  const goTo = useCallback(
    (idx: number) => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(idx);
        setTransitioning(false);
      }, 200);
    },
    []
  );

  const next = useCallback(() => {
    if (current < steps.length - 1) {
      goTo(current + 1);
    } else {
      finish();
    }
  }, [current, steps.length, goTo, finish]);

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
      if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, next, prev, finish]);

  if (!active || !targetRect) return null;

  const step = steps[current];
  const spotlightStyle = {
    top: targetRect.top - window.scrollY - SPOTLIGHT_PADDING,
    left: targetRect.left - SPOTLIGHT_PADDING,
    width: targetRect.width + SPOTLIGHT_PADDING * 2,
    height: targetRect.height + SPOTLIGHT_PADDING * 2,
  };

  return (
    <div className="fixed inset-0 z-[9999]" aria-modal="true" role="dialog">
      {/* Overlay with spotlight cutout using clip-path */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          clipPath: `polygon(
            0% 0%, 0% 100%,
            ${spotlightStyle.left}px 100%,
            ${spotlightStyle.left}px ${spotlightStyle.top}px,
            ${spotlightStyle.left + spotlightStyle.width}px ${spotlightStyle.top}px,
            ${spotlightStyle.left + spotlightStyle.width}px ${spotlightStyle.top + spotlightStyle.height}px,
            ${spotlightStyle.left}px ${spotlightStyle.top + spotlightStyle.height}px,
            ${spotlightStyle.left}px 100%,
            100% 100%, 100% 0%
          )`,
        }}
        onClick={finish}
      />

      {/* Spotlight ring glow */}
      <div
        className="pointer-events-none absolute rounded-xl transition-all duration-300"
        style={{
          ...spotlightStyle,
          boxShadow: `0 0 0 3px ${accentColor}, 0 0 20px 4px ${accentColor}40`,
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed transition-all duration-300"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          maxWidth: TOOLTIP_MAX_W,
          width: 'max-content',
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'scale(0.95)' : 'scale(1)',
          zIndex: 10000,
        }}
      >
        <div
          className="rounded-2xl p-5 shadow-2xl"
          style={{
            backgroundColor: '#ffffff',
            border: `1px solid ${accentColor}30`,
          }}
        >
          {/* Header */}
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3
              className="text-base font-bold leading-snug"
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                color: '#2c1810',
              }}
            >
              {step.title}
            </h3>
            <button
              onClick={finish}
              className="flex-shrink-0 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-black/5"
              style={{ color: mutedColor }}
            >
              Skip
            </button>
          </div>

          {/* Description */}
          <p
            className="mb-4 text-sm leading-relaxed"
            style={{ color: mutedColor }}
          >
            {step.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Step counter */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 20 : 6,
                    backgroundColor: i === current ? accentColor : `${accentColor}30`,
                  }}
                />
              ))}
            </div>

            {/* Nav buttons */}
            <div className="flex items-center gap-2">
              {current > 0 && (
                <button
                  onClick={prev}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="h-4 w-4" style={{ color: mutedColor }} />
                </button>
              )}
              <button
                onClick={next}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: accentColor }}
              >
                {current < steps.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </>
                ) : (
                  "Got it!"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
