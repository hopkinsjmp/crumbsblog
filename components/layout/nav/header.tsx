"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "../sidebar-context";


import { usePathname } from "next/navigation";

const TABS = [
  { label: "The Blog", href: "/" },
  { label: "About", href: "/about" },
  { label: "How to contribute", href: "/contribute" },
];

const HERO_SRC =
  "https://blogger.googleusercontent.com/img/a/AVvXsEg8QAx2my2VCVbPy5G1Re0h4xjGDtRggMc5ZDyie0k9f-4MQz5L1IVXsc7YwwBNqTgCJmuhFMQdOTvFXty6-LPmPnz0clMQ6UNh924F376y4kCdMjFHZ15W_Ia2GXJBLUpjdpqxe6EJnBaQftyJW6xgvxhLC4Ufa2VaTEjTibo9ui1IVIA52Kvd__UoRFE=s1600";


export const Header = () => {
  const { toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#e0e6cf]">
      <div className="mx-auto max-w-[922px] px-8">
        <div className="relative py-6">
          <div className="grid grid-cols-1 relative">
            {/* Main column: logo row, then tagline/tabs */}
            <div className="flex flex-col justify-start relative">
              {/* Hamburger — mobile / < xl, absolutely positioned */}
              <button
                onClick={toggle}
                aria-label="Open menu"
                className="xl:hidden flex h-6 w-6 flex-col justify-between py-1 absolute -left-10 top-2"
                style={{ zIndex: 10 }}
              >
                <span className="block h-0.5 w-full bg-[#2c1d14]" />
                <span className="block h-0.5 w-full bg-[#2c1d14]" />
                <span className="block h-0.5 w-full bg-[#2c1d14]" />
              </button>
              {/* Logo row: logo horizontally aligned */}
              <div className="flex items-center">
                <h1 className="font-serif text-4xl font-normal uppercase tracking-[0.15em] text-[#2c1d14] m-0 p-0 leading-none">
                  <Link href="/" className="text-[#2c1d14] no-underline hover:no-underline">
                    Crumbs of Sanity
                  </Link>
                </h1>
              </div>
              {/* Tagline and tabs stacked below */}
              <div>
                <p className="mt-1 mb-0 font-sans italic text-sm text-gray-600 text-left m-0 p-0">
                  Recipes and tales to bring comfort through academia and beyond
                </p>
                <nav aria-label="Main tabs" className="mt-4">
                  <ul className="flex items-center m-0 p-0">
                    {TABS.map((tab, i) => {
                      const isActive =
                        (tab.href === "/" && pathname === "/") ||
                        (tab.href !== "/" && pathname.startsWith(tab.href));
                      return (
                        <React.Fragment key={tab.href}>
                          {i > 0 && (
                            <li aria-hidden="true" className="select-none px-1.5 text-sm text-[#2c1d14]">·</li>
                          )}
                          <li className="m-0 p-0">
                            <Link
                              href={tab.href}
                              className={
                                `font-sans text-sm font-normal uppercase tracking-wider transition-colors duration-150 m-0 p-0
                                ${isActive
                                  ? "text-[#2c1d14] underline underline-offset-4 decoration-[#2c1d14]"
                                  : "text-[#2c1d14]/80 hover:text-[#2c1d14]"}
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c1d14]/40`
                              }
                              aria-current={isActive ? "page" : undefined}
                            >
                              {tab.label}
                            </Link>
                          </li>
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── Hero banner — full-width, 400px tall on desktop, fluid on mobile */}
      <div className="relative mb-8 h-[min(400px,62.5vw)] min-h-[200px] w-full overflow-hidden">
        <Image
          src={HERO_SRC}
          alt="Crumbs of Sanity — hero image"
          fill
          priority
          className="object-cover object-center"
          unoptimized
        />
        {/* Subtle dark scrim matching the original site */}
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      </div>
    </header>
  );
};
