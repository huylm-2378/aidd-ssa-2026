"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation, type MessageKey } from "../../_lib/i18n/use-translation";
import AccountMenu from "./account-menu";
import LanguageSwitcher from "./language-switcher";

interface NavLink {
  labelKey: MessageKey;
  href: string;
  scrollTop?: boolean;
}

const NAV_LINKS: readonly NavLink[] = [
  { labelKey: "nav.about", href: "/", scrollTop: true },
  { labelKey: "nav.awards", href: "/awards-information" },
  { labelKey: "nav.kudos", href: "/sun-kudos" },
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
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 bg-[#101417]/80 px-6 py-3 backdrop-blur-sm sm:px-9 lg:px-[144px]">
      <div className="flex items-center gap-8 lg:gap-16">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="block h-12 w-[52px] shrink-0 transition-opacity hover:opacity-80"
          aria-label={t("common.logoHome")}
        >
          {/* mm:I2167:9091;178:1033;178:1030 */}
          <Image
            src="/header-and-footer/MM_MEDIA_Logo.png"
            alt={t("common.logoAlt")}
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
                key={link.href + link.labelKey}
                href={link.href}
                onClick={link.scrollTop ? handleLogoClick : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`border-b px-2 py-4 font-montserrat text-sm font-bold tracking-[0.1px] transition-colors focus-visible:text-[#ffea9e] focus-visible:outline-none ${
                  isActive
                    ? "border-[#ffea9e] text-[#ffea9e] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
                    : "border-transparent text-white hover:text-[#ffea9e]"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Figma order (Frame 482, left→right): notification bell, then language, then avatar. */}
        {!minimal && (
        <button
          type="button"
          aria-label={t("header.notifications")}
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
        )}

        <LanguageSwitcher />

        {!minimal && <AccountMenu />}
      </div>
    </header>
  );
}
