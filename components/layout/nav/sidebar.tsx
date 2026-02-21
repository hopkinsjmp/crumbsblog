"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "../sidebar-context";

const NAV = [
  { label: "Home",      href: "/" },
  { label: "About",     href: "/about" },
  { label: "All Posts", href: "/posts" },
];

const LEGAL = [
  { label: "Terms",     href: "/about" },
  { label: "Privacy",   href: "/about" },
  { label: "Cookies",   href: "/about" },
  { label: "Copyright", href: "/about" },
];

export function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Dark overlay — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/54 lg:hidden"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-0 left-0 z-[1000] h-full w-[284px] overflow-y-auto",
          "bg-[#edf0e6] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          /* desktop: always visible; mobile: slide in when open */
          "translate-x-[-284px]", // default hidden on mobile
          "xl:translate-x-0",    // always visible ≥1280px (xl breakpoint)
          isOpen ? "!translate-x-0" : "",
        ].join(" ")}
        aria-label="Sidebar"
      >
        <div className="p-10">
          {/* Back / close button */}
          <button
            onClick={close}
            className="mb-6 flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-[#2c1d14] xl:hidden"
          >
            <span className="text-xl leading-none">←</span>
            <span>Back</span>
          </button>

          {/* Bio widget */}
          <div className="mb-10 border-b border-black pb-10">
            <div className="relative mb-4 h-36 w-full overflow-hidden rounded">
              <Image
                src="https://blogger.googleusercontent.com/img/a/AVvXsEjB5efNHTOBYahLdXdEjgCcRwEL8S_smsjOLbL98E8A7l22PgVqv1cB-8jPAsATvRsbb7ZKDER3PXDf4zULwEruaIISGLy40fm6GCzzkADaI3DXkEYNhX2WLe0I-CuUXYlebQtkjYQmAtgWZr4tytfQtg5bb6L6o-4frGXt4rULkXPrZ9jpnh7FBminHeo=s435"
                alt="Carmel — author of Crumbs of Sanity"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="font-sans text-sm leading-relaxed text-[#2c1d14]">
              Welcome to <em>Crumbs of Sanity</em>, where I share recipes and
              food musings that kept me sane during my PhD journey and beyond.
              Expect a dash of humour, a sprinkle of anecdotes, and a dollop of
              delicious distractions.
            </p>
            <p className="mt-2 font-sans text-sm text-[#2c1d14]">
              — Carmel, PhD survivor
            </p>
          </div>

          {/* Social widget */}
          <div className="mb-10 border-b border-black pb-10 text-center">
            <a
              href="https://instagram.com/crumbsofsanityblog"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 block font-sans text-sm uppercase tracking-widest text-[#a93e33] hover:underline"
            >
              Follow on Instagram
            </a>
            <a
              href="https://crumbsofsanity.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-[#a93e33] px-5 py-2 font-sans text-sm text-white hover:bg-[#7a2d24]"
            >
              📬 Subscribe to Crumbs
            </a>
          </div>

          {/* Mobile nav — repeats header links for convenience on small screens */}
          <nav className="mb-10 border-b border-black pb-10 xl:hidden">
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="font-sans text-sm uppercase tracking-widest text-[#2c1d14] hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <div>
            <p className="mb-4 font-sans text-base text-black/54">Legal</p>
            <ul className="space-y-4">
              {LEGAL.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="font-sans text-sm text-[#2c1d14] hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
