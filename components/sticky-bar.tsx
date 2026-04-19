'use client';
import React, { useEffect, useState } from 'react';

const DISMISSED_KEY = 'sticky_bar_dismissed';

export function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  const openCookieSettings = () => {
    window.dispatchEvent(new Event('open-cookie-banner'));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1900] bg-[#e8c9c1] text-[#2c1d14] border-t border-[#2c1d14]/15 px-4 py-2.5 flex items-center justify-between gap-4 shadow-lg">
      {/* Subscribe nudge */}
      <p className="font-sans text-xs text-[#2c1d14]/70 leading-snug hidden sm:block shrink-0">
        Enjoying the blog?
      </p>
      <a
        href="https://crumbsofsanity.substack.com/subscribe"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-1.5 rounded bg-[#a93e33] hover:bg-[#7a2d24] px-3 py-1 font-sans text-xs font-medium text-white transition-colors no-underline"
      >
        📬 Subscribe for free
      </a>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Cookie settings */}
      <button
        onClick={openCookieSettings}
        className="font-sans text-xs text-[#2c1d14]/45 hover:text-[#2c1d14]/80 transition-colors shrink-0"
      >
        Cookie Settings
      </button>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="font-sans text-sm text-[#2c1d14]/40 hover:text-[#2c1d14]/80 transition-colors leading-none shrink-0 ml-1"
      >
        ✕
      </button>
    </div>
  );
}
