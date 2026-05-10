"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaYoutube } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { useSidebar } from "../sidebar-context";
import { SearchBox } from "@/components/search-box";
import { withBasePath } from "@/lib/utils";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/crumbsofsanityblog",
    icon: <AiFillInstagram className="text-lg text-[#E1306C]" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Crumbs_of_Sanity",
    icon: <FaYoutube className="text-lg text-[#FF0000]" />,
  },
  {
    label: "Email Subscribe",
    href: "https://crumbsofsanity.substack.com/subscribe",
    icon: <span className="text-lg leading-none">📬</span>,
  },
];

const LEGAL = [
  { label: "Terms",     href: "/terms" },
  { label: "Privacy",   href: "/privacy" },
  { label: "Cookies",   href: "/cookies" },
  { label: "Copyright", href: "/copyright" },
];

export function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Dark overlay - all screen sizes */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/54"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-0 left-0 z-[1000] h-full w-[284px] overflow-y-auto",
          "bg-[#edf0e6] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "translate-x-[-284px]",
          isOpen ? "!translate-x-0" : "",
        ].join(" ")}
        aria-label="Sidebar"
      >
        <div className="p-10">
          {/* Back / close button */}
          <button
            onClick={close}
            className="mb-6 flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-[#2c1d14]"
          >
            <span className="text-xl leading-none">←</span>
            <span>Back</span>
          </button>

          {/* Bio widget */}
          <div className="mb-10 border-b border-black pb-10">
            <div className="mb-4 w-full overflow-hidden rounded">
              <Image
                src={withBasePath("/uploads/authors/carmel-bio.png")}
                alt="Carmel - author of Crumbs of Sanity"
                width={326}
                height={435}
                className="w-full h-auto rounded"
                unoptimized
              />
            </div>
            <p className="font-sans text-sm leading-snug text-[#2c1d14]">
              Welcome to <em>Crumbs of Sanity</em>, where I share recipes and
              food musings that kept me sane during my PhD journey and beyond.
              Expect a dash of humour, a sprinkle of anecdotes, and a dollop of
              delicious distractions.
            </p>
            <p className="mt-2 font-sans text-sm text-[#2c1d14]">
              - Carmel, PhD survivor
            </p>
          </div>

          {/* Social widget */}
          <div className="mb-10 border-b border-black pb-10">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 flex items-center gap-2.5 rounded px-2 py-2 font-sans text-sm text-[#2c1d14] hover:bg-[#dfe3d7] no-underline transition-colors"
              >
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>

          {/* Search widget */}
          <div className="mb-10 border-b border-black pb-10">
            <Suspense fallback={<div className="h-9 rounded border border-[#2c1d14]/30 bg-white/50" />}>
              <SearchBox />
            </Suspense>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-2 font-sans text-base text-black/54">Legal</p>
            <ul className="space-y-1">
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
