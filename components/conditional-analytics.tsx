'use client';
import React, { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getCookieConsent, CookieConsent } from './cookie-banner';

export function ConditionalAnalytics({ gaId }: { gaId: string }) {
  const [consent, setConsent] = useState<CookieConsent>(null);

  useEffect(() => {
    setConsent(getCookieConsent());
  }, []);

  if (consent !== 'accepted') return null;

  return <GoogleAnalytics gaId={gaId} />;
}
