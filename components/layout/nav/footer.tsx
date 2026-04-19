"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "../../icon";
import { useLayout } from "../layout-context";

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header, footer } = globalSettings!;

  const openCookieSettings = () => {
    window.dispatchEvent(new Event('open-cookie-banner'));
  };

  return (
    <footer className="border-t border-[#2c1d14]/20 bg-[#d5dbc5] pt-10 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-12 flex flex-wrap items-center gap-6 border-t py-6 flex-col md:flex-row md:justify-between">

          <div className="order-last flex flex-col items-center gap-1 md:order-first md:items-start">
            <div className="flex items-center">
              <Link href="/" aria-label="go home">
                <Icon
                  parentColor={header!.color!}
                  data={header!.icon}
                />
              </Link>
              <span className="self-center text-muted-foreground text-sm ml-2">© {new Date().getFullYear()} {header?.name}, All rights reserved</span>
            </div>
            <button
              onClick={openCookieSettings}
              className="font-sans text-xs text-[#2c1d14]/50 hover:text-[#a93e33] hover:underline"
            >
              Cookie Settings
            </button>
          </div>

          <div className="order-first flex justify-center gap-6 text-sm md:order-last md:justify-end">
            {footer?.social?.map((link, index) => (
              <Link key={`${link!.icon}${index}`} href={link!.url!} target="_blank" rel="noopener noreferrer" >
                <Icon data={{ ...link!.icon, size: 'small' }} className="text-muted-foreground hover:text-primary block" />
              </Link>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
