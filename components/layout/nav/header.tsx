"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaYoutube } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { useSidebar } from "../sidebar-context";
import { useLayout } from "../layout-context";
import { usePathname, useRouter } from "next/navigation";
import { withBasePath } from "@/lib/utils";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/crumbsofsanityblog",
    icon: <AiFillInstagram className="text-base" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Crumbs_of_Sanity",
    icon: <FaYoutube className="text-base" />,
  },
  {
    label: "Substack Newsletter",
    href: "https://crumbsofsanity.substack.com/subscribe",
    icon: <span className="text-base">📬</span>,
  },
];

const HERO_SRC = "/uploads/photos/header-hero.jpg";

export const Header = () => {
  const { toggle, isOpen } = useSidebar();
  const { recentPosts } = useLayout();
  const pathname = usePathname();
  const router = useRouter();
  const [blogOpen, setBlogOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      router.push(`/posts?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/posts");
    }
    setSearch("");
  }

  function handleBlogClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("posts")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header className="w-full">
      {/* ── Sticky nav bar ── */}
      <div className="sticky top-0 z-50 w-full bg-[#e0e6cf]">
        <div className="mx-auto max-w-[922px] px-8">
          <div className="relative py-6">
          <div className="grid grid-cols-1 relative">
            {/* Search form — absolutely positioned top-right */}
            <form onSubmit={handleSearch} className="absolute right-0 top-0 z-10 flex items-center gap-1.5">
              <label htmlFor="header-search" className="sr-only">Search posts</label>
              <input
                id="header-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-32 rounded border border-[#2c1d14]/30 bg-white/70 px-2.5 py-1 font-sans text-xs text-[#2c1d14] placeholder:text-[#2c1d14]/40 focus:border-[#a93e33] focus:outline-none sm:w-40"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="flex items-center justify-center rounded bg-[#a93e33] px-2 py-1 text-white hover:bg-[#7a2d24] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            {/* Main column */}
            <div className="flex flex-col justify-start">
              {/* Logo row */}
              <div className="relative flex items-center">
                <button
                  onClick={toggle}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  className="flex h-6 w-6 flex-col justify-between py-1 absolute -left-10 top-1/2 -translate-y-1/2"
                  style={{ zIndex: 10 }}
                >
                  <span className="block h-0.5 w-full bg-[#2c1d14]" />
                  <span className="block h-0.5 w-full bg-[#2c1d14]" />
                  <span className="block h-0.5 w-full bg-[#2c1d14]" />
                </button>
                <h1 className="font-serif text-4xl font-normal uppercase tracking-[0.05em] text-[#2c1d14] m-0 p-0 leading-none">
                  <Link
                    href="/"
                    className="text-[#2c1d14] no-underline hover:no-underline"
                    style={{
                      WebkitTextSizeAdjust: "100%",
                      wordBreak: "break-word",
                      wordWrap: "break-word",
                      margin: 0,
                      textTransform: "uppercase",
                      color: "#2c1d14",
                      font: "normal 400 36px EB Garamond, serif",
                    }}
                  >
                    Crumbs of Sanity
                  </Link>
                </h1>
              </div>

              {/* Tagline + nav tabs */}
              <div>
                <p className="mt-2 mb-0 font-sans italic text-sm text-gray-600 text-left m-0 p-0">
                  Recipes and tales to bring comfort through academia and beyond
                </p>
                <nav aria-label="Main tabs" className="mt-2">
                  <ul className="flex items-center m-0 p-0">

                    {/* ── The Blog (with recent posts dropdown) ── */}
                    <li
                      className="relative m-0 p-0"
                      onMouseEnter={() => setBlogOpen(true)}
                      onMouseLeave={() => setBlogOpen(false)}
                    >
                      <span className="inline-flex items-center gap-0 m-0 p-0">
                        <Link
                          href="/"
                          onClick={(e) => {
                            setBlogOpen(false);
                            handleBlogClick(e);
                          }}
                          className={`inline-flex items-center font-sans text-sm font-normal uppercase tracking-wider transition-colors duration-150 m-0 p-0
                            ${pathname === "/" ? "text-[#2c1d14] underline underline-offset-4 decoration-[#2c1d14]" : "text-[#2c1d14]/80 hover:text-[#2c1d14]"}
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c1d14]/40`}
                          aria-current={pathname === "/" ? "page" : undefined}
                        >
                          The Blog
                        </Link>
                        <button
                          onClick={() => setBlogOpen((o) => !o)}
                          aria-label="Toggle blog menu"
                          className="ml-0.5 text-[#2c1d14]/60 hover:text-[#2c1d14] focus:outline-none"
                        >
                          <BiChevronDown className={`text-base transition-transform duration-150 ${blogOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </span>
                      {blogOpen && recentPosts.length > 0 && (
                        <div className="absolute left-0 top-full z-50 pt-1">
                          <div className="min-w-max rounded-md border border-[#2c1d14]/10 bg-[#f7f4ef] shadow-lg py-1">
                            {recentPosts.map((post) => (
                              <Link
                                key={post.url}
                                href={post.url}
                                onClick={() => setBlogOpen(false)}
                                className="flex items-center gap-3 px-3 py-1.5 font-sans text-xs text-[#2c1d14] hover:bg-[#e8e4db] hover:text-[#a93e33] no-underline whitespace-nowrap"
                              >
                                <div className="shrink-0 w-8 h-8 rounded overflow-hidden bg-[#e8e4db]">
                                  {post.heroImg ? (
                                    <Image
                                      src={withBasePath(post.heroImg)}
                                      alt=""
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#2c1d14]/20 text-xs">✦</div>
                                  )}
                                </div>
                                {post.title}
                              </Link>
                            ))}
                            {/* Explore more */}
                            <div className="border-t border-[#2c1d14]/10 mt-1 pt-1">
                              <button
                                onClick={() => {
                                  setBlogOpen(false);
                                  if (pathname === "/") {
                                    document.getElementById("posts")?.scrollIntoView({ behavior: "smooth" });
                                  } else {
                                    window.location.href = "/#posts";
                                  }
                                }}
                                className="flex w-full items-center justify-between px-3 py-1.5 font-sans text-xs font-medium text-[#a93e33] hover:bg-[#e8e4db] whitespace-nowrap"
                              >
                                Explore more
                                <span className="ml-4">→</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>

                    <li aria-hidden="true" className="select-none px-1.5 text-sm text-[#2c1d14]">·</li>

                    {/* ── About ── */}
                    <li className="m-0 p-0">
                      <Link
                        href="/about"
                        className={`font-sans text-sm font-normal uppercase tracking-wider transition-colors duration-150 m-0 p-0
                          ${pathname?.startsWith("/about") ? "text-[#2c1d14] underline underline-offset-4 decoration-[#2c1d14]" : "text-[#2c1d14]/80 hover:text-[#2c1d14]"}
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c1d14]/40`}
                        aria-current={pathname?.startsWith("/about") ? "page" : undefined}
                      >
                        About
                      </Link>
                    </li>

                    <li aria-hidden="true" className="select-none px-1.5 text-sm text-[#2c1d14]">·</li>

                    {/* ── How to contribute ── */}
                    <li className="m-0 p-0">
                      <Link
                        href="/contribute"
                        className={`font-sans text-sm font-normal uppercase tracking-wider transition-colors duration-150 m-0 p-0
                          ${pathname?.startsWith("/contribute") ? "text-[#2c1d14] underline underline-offset-4 decoration-[#2c1d14]" : "text-[#2c1d14]/80 hover:text-[#2c1d14]"}
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c1d14]/40`}
                        aria-current={pathname?.startsWith("/contribute") ? "page" : undefined}
                      >
                        How to contribute
                      </Link>
                    </li>

                    <li aria-hidden="true" className="select-none px-1.5 text-sm text-[#2c1d14]">·</li>

                    {/* ── Socials (with dropdown) ── */}
                    <li
                      className="relative m-0 p-0"
                      onMouseEnter={() => setSocialsOpen(true)}
                      onMouseLeave={() => setSocialsOpen(false)}
                    >
                      <button
                        onClick={() => setSocialsOpen((o) => !o)}
                        className="inline-flex items-center gap-0.5 font-sans text-sm font-normal uppercase tracking-wider text-[#2c1d14]/80 hover:text-[#2c1d14] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c1d14]/40"
                      >
                        Socials
                        <BiChevronDown className={`text-base opacity-60 transition-transform duration-150 ${socialsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {socialsOpen && (
                        <div className="absolute left-0 top-full z-50 pt-1">
                          <div className="min-w-[200px] rounded-md border border-[#2c1d14]/10 bg-[#f7f4ef] shadow-lg py-1">
                            {SOCIALS.map((s) => (
                              <a
                                key={s.href}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setSocialsOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 font-sans text-xs text-[#2c1d14] hover:bg-[#e8e4db] hover:text-[#a93e33] no-underline"
                              >
                                {s.icon}
                                {s.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>

                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>{/* end sticky wrapper */}

      {pathname === "/" && (
        <div className="relative mb-8 h-[min(400px,62.5vw)] min-h-[200px] w-full overflow-hidden">
          <Image
            src={HERO_SRC}
            alt="Crumbs of Sanity — hero image"
            fill
            priority
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        </div>
      )}
    </header>
  );
};
