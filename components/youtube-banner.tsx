'use client';
import React from 'react';
import Link from 'next/link';
import { FaYoutube } from 'react-icons/fa6';

const CHANNEL_URL = 'https://www.youtube.com/@Crumbs_of_Sanity';

interface YouTubeBannerProps {
  videoUrl?: string | null;
}

export function YouTubeBanner({ videoUrl }: YouTubeBannerProps = {}) {
  const href = videoUrl || CHANNEL_URL;
  const isVideo = !!videoUrl;

  return (
    <div className="rounded-lg bg-[#f7f4ef] border border-[#2c1d14]/10 shadow-sm px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
      {/* YouTube icon */}
      <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#ff0000]/10">
        <FaYoutube className="text-[#ff0000] text-2xl" />
      </div>

      {/* Text */}
      <div className="flex-1 text-center sm:text-left">
        <p className="font-heading text-lg font-normal text-[#2c1d14] leading-snug">
          {isVideo ? 'This post has a video!' : 'Now on YouTube!'}
        </p>
        <p className="mt-0.5 font-sans text-sm text-[#2c1d14]/60">
          {isVideo
            ? 'Watch the video version of this recipe on YouTube.'
            : 'A calm little corner of Youtube. For slow living and everyday moments for academics, at every stage of their journey.'}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-2 rounded-md bg-[#ff0000] px-4 py-2 font-sans text-sm font-medium text-white no-underline transition-colors hover:bg-[#cc0000]"
      >
        <FaYoutube className="text-base" />
        {isVideo ? 'Watch now' : 'Subscribe'}
      </Link>
    </div>
  );
}
