'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export type CookieConsent = 'accepted' | 'rejected' | null;

export const CONSENT_KEY = 'cookie_consent';

export interface ConsentRecord {
  choice: 'accepted' | 'rejected';
  timestamp: string; // ISO 8601
}

export function getCookieConsent(): CookieConsent {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const record: ConsentRecord = JSON.parse(raw);
    return record.choice ?? null;
  } catch {
    // Legacy plain-string value - treat as-is
    return (localStorage.getItem(CONSENT_KEY) as CookieConsent) ?? null;
  }
}

export function resetConsent() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
  window.location.reload();
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      setVisible(true);
    }

    // Listen for custom event so the footer "Cookie Settings" link can re-open the banner
    const handler = () => setVisible(true);
    window.addEventListener('open-cookie-banner', handler);
    return () => window.removeEventListener('open-cookie-banner', handler);
  }, []);

  const respond = (choice: 'accepted' | 'rejected') => {
    const record: ConsentRecord = {
      choice,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    // Immediately update GA consent mode without waiting for reload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as any).gtag;
    if (gtag) {
      gtag('consent', 'update', {
        analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    setVisible(false);
    window.location.reload();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[2000] border-t border-[#2c1d14]/20 bg-[#edf0e6] px-6 py-5 shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm text-[#2c1d14]/80 leading-relaxed">
          We use cookies to understand how visitors use our site (Google Analytics).
          No tracking happens without your consent.{' '}
          <Link href="/cookies" className="underline hover:text-[#a93e33]">
            Cookie Policy
          </Link>
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => respond('rejected')}
            className="rounded border border-[#2c1d14]/30 px-4 py-2 font-sans text-sm text-[#2c1d14] transition-colors hover:bg-[#2c1d14]/10"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={() => respond('accepted')}
            className="rounded bg-[#a93e33] px-4 py-2 font-sans text-sm text-white transition-colors hover:bg-[#7a2d24]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
