"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavLink {
  label: string;
  href: string;
  scrollTop?: boolean;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: "About SAA 2025", href: "/", scrollTop: true },
  { label: "Award Information", href: "/awards-information" },
  { label: "Sun* Kudos", href: "/sun-kudos" },
];

function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
  // BR-007: logo click navigates home and scrolls to top.
  if (window.location.pathname === "/") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"VN" | "EN">("VN");

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 bg-[#101417]/80 px-6 py-3 backdrop-blur-sm sm:px-9 lg:px-[144px]">
      <div className="flex items-center gap-8 lg:gap-16">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="block h-12 w-[52px] shrink-0 transition-opacity hover:opacity-80"
          aria-label="Sun* Annual Awards home"
        >
          {/* mm:I2167:9091;178:1033;178:1030 */}
          <Image
            src="/homepage-saa/logo.png"
            alt="Sun* Annual Awards logo"
            width={52}
            height={48}
            className="h-full w-full object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={link.scrollTop ? handleLogoClick : undefined}
              className="rounded px-2 py-4 font-montserrat text-sm font-bold tracking-[0.1px] text-white transition-colors hover:text-[#ffea9e] focus-visible:text-[#ffea9e] focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangOpen((open) => !open)}
            className="flex items-center gap-0.5 rounded p-2 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e] sm:p-4"
            aria-haspopup="menu"
            aria-expanded={isLangOpen}
          >
            <span aria-hidden className="text-base leading-none">
              🇻🇳
            </span>
            <span>{selectedLang}</span>
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform ${isLangOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {isLangOpen && (
            <ul
              role="menu"
              className="absolute right-0 top-full mt-2 min-w-[96px] overflow-hidden rounded-md border border-[#998c5f] bg-[#101417] shadow-lg"
            >
              {(["VN", "EN"] as const).map((lang) => (
                <li key={lang}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedLang(lang);
                      setIsLangOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
                  >
                    {lang}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" aria-hidden>
            <path
              d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.66V5a2 2 0 1 0-4 0v.34A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d4271d]" aria-hidden />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsAccountOpen((open) => !open)}
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={isAccountOpen}
            className="flex h-10 w-10 items-center justify-center rounded border border-[#998c5f] bg-transparent transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffea9e]"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" aria-hidden>
              <circle cx="12" cy="8" r="3.5" strokeWidth={1.5} />
              <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </button>
          {isAccountOpen && (
            <ul
              role="menu"
              className="absolute right-0 top-full mt-2 min-w-[160px] overflow-hidden rounded-md border border-[#998c5f] bg-[#101417] shadow-lg"
            >
              <li>
                <span className="block px-4 py-2 text-sm text-white/50">Profile</span>
              </li>
              <li>
                <span className="block px-4 py-2 text-sm text-white/50">Sign out</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
