"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AccountMenu from "./account-menu";

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

// `minimal` (default false) renders the Login-screen header variant: logo + language switcher only,
// with no nav links, notification bell, or account button. Default keeps the full header for all
// other routes byte-for-byte unchanged.
export default function Header({ minimal = false }: { minimal?: boolean }) {
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
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
            src="/header-and-footer/MM_MEDIA_Logo.png"
            alt="Sun* Annual Awards logo"
            width={52}
            height={48}
            className="h-full w-full object-contain"
            priority
          />
        </Link>

        {!minimal && (
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            // mm:I2167:9091;186:1579 -- the active route uses the Figma "Selected state":
            // gold text (#FFEA9E) + 1px gold bottom border + soft glow. Inactive links stay white
            // with a transparent border so toggling selection causes no layout shift.
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={link.scrollTop ? handleLogoClick : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`border-b px-2 py-4 font-montserrat text-sm font-bold tracking-[0.1px] transition-colors focus-visible:text-[#ffea9e] focus-visible:outline-none ${
                  isActive
                    ? "border-[#ffea9e] text-[#ffea9e] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
                    : "border-transparent text-white hover:text-[#ffea9e]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        )}
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

        {!minimal && (
        <>
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

        <AccountMenu />
        </>
        )}
      </div>
    </header>
  );
}
