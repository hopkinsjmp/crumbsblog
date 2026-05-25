'use client';
import React, { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getCookieConsent, CookieConsent } from './cookie-banner';

export function ConditionalAnalytics({ gaId }: { gaId: string }) {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setConsent(getCookieConsent());
    setIsOwner(localStorage.getItem('ga_exclude_owner') === 'true');
  }, []);

  if (consent !== 'accepted' || isOwner) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
