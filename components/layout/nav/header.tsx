"use client";
import React from "react";
import Link from "next/link";
import { useSidebar } from "../sidebar-context";

const NAV = [
  { label: "About",     href: "/about" },
  { label: "All Posts", href: "/posts" },
];

export const Header = () => {
  const { toggle } = useSidebar();

  return (
    <header className="w-full bg-[#e0e6cf]">
      {/* ── Title row */}
      <div className="mx-auto max-w-[922px] px-8">
        <div className="relative flex items-start py-6">

          {/* Hamburger — mobile / < xl */}
          <button
            onClick={toggle}
            aria-label="Open menu"
            className="absolute left-0 top-2 flex h-6 w-6 flex-col justify-between py-1 xl:hidden"
          >
            <span className="block h-0.5 w-full bg-[#2c1d14]" />
            <span className="block h-0.5 w-full bg-[#2c1d14]" />
            <span className="block h-0.5 w-full bg-[#2c1d14]" />
          </button>

          {/* Site title + tagline */}
          <div className="ml-10 xl:ml-0">
            <h1 className="font-heading text-4xl font-normal uppercase tracking-[2px] text-[#2c1d14]">
              <Link href="/" className="text-[#2c1d14] no-underline hover:no-underline">
                Crumbs of Sanity
              </Link>
            </h1>
            <p className="mt-2 font-sans text-sm text-[#2c1d14]/60">
              Recipes and tales to bring comfort through academia and beyond
            </p>
          </div>

        </div>
      </div>

      {/* ── Navigation bar */}
      <div className="border-t border-[#2c1d14]/20">
        <div className="mx-auto max-w-[922px] px-8">
          <nav className="ml-10 xl:ml-0">
            <ul className="flex items-center py-2">
              {NAV.map((item, i) => (
                <React.Fragment key={item.href}>
                  {i > 0 && (
                    <li className="select-none px-1.5 text-xs text-[#2c1d14]">·</li>
                  )}
                  <li>
                    <Link
                      href={item.href}
                      className="font-sans text-xs font-normal uppercase tracking-[0.5px] text-[#2c1d14] no-underline hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
