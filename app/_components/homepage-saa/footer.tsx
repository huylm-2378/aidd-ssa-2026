"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_NAV_LINKS: readonly { label: string; href: string }[] = [
  { label: "About SAA 2025", href: "/" },
  { label: "Award Information", href: "/awards-information" },
  { label: "Sun* Kudos", href: "/sun-kudos" },
];

// `minimal` (default false) renders the Login-screen footer variant: the centered copyright line
// only, with no logo or nav links. Default keeps the full footer for all other routes unchanged.
export default function Footer({ minimal = false }: { minimal?: boolean }) {
  const pathname = usePathname();

  return (
    <footer
      className={`flex flex-col items-center gap-6 border-t border-[#2e3940] bg-[#00101a] px-6 py-10 sm:px-12 lg:px-[90px] ${
        minimal ? "sm:justify-center" : "sm:flex-row sm:justify-between"
      }`}
    >
      {!minimal && (
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-20">
        <Link
          href="/"
          className="block h-16 w-[69px] shrink-0 transition-opacity hover:opacity-80"
          aria-label="Sun* Annual Awards home"
        >
          {/* mm:I5001:14800;342:1408;178:1030 */}
          <Image
            src="/header-and-footer/MM_MEDIA_Logo%20(1).png"
            alt="Sun* Annual Awards logo"
            width={69}
            height={64}
            className="h-full w-full object-contain"
          />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {FOOTER_NAV_LINKS.map((link) => {
            // Active route mirrors the header's gold "Selected state": gold text
            // + gold bottom border + aria-current. Inactive links keep a
            // transparent border so toggling selection causes no layout shift.
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-none border-b-2 px-4 py-4 font-montserrat text-base font-bold transition-colors focus-visible:text-[#ffea9e] focus-visible:outline-none ${
                  isActive
                    ? "border-[#ffea9e] text-[#ffea9e]"
                    : "border-transparent text-white hover:text-[#ffea9e]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      )}

      <p className="font-montserrat-alt text-sm font-bold text-white">
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  );
}
