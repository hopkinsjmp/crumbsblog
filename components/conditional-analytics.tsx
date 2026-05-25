'use client';
import React, { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getCookieConsent, CookieConsent } from './cookie-banner';

function initConsentMode() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function (...args: unknown[]) { w.dataLayer.push(args); };
  w.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
  w.gtag('js', new Date());
}

function updateConsent(accepted: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag;
  if (typeof window === 'undefined' || !gtag) return;
  const value = accepted ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: value,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export function ConditionalAnalytics({ gaId }: { gaId: string }) {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const currentConsent = getCookieConsent();
    const ownerExcluded = localStorage.getItem('ga_exclude_owner') === 'true';
    setConsent(currentConsent);
    setIsOwner(ownerExcluded);

    if (!ownerExcluded) {
      initConsentMode();
      // Update consent based on stored choice
      if (currentConsent === 'accepted') updateConsent(true);
      else if (currentConsent === 'rejected') updateConsent(false);
      // null = no choice yet, stays at denied default
    }
  }, []);

  // Don't render GA tag at all for owners
  if (isOwner) return null;

  // Always render GA (it runs in denied mode until consent is granted)
  return <GoogleAnalytics gaId={gaId} />;
}
