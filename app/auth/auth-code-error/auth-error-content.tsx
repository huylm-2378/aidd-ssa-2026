"use client";

import Link from "next/link";
import { useTranslation } from "../../_lib/i18n/use-translation";

/**
 * Heading + body + back-to-login link for the OAuth failure page (F005,
 * F014 i18n). Client child because the page is a Server Component exporting
 * `metadata` and cannot read the language context itself.
 */
export default function AuthErrorContent() {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="font-montserrat text-2xl font-bold text-[#ffea9e] sm:text-3xl">
        {t("authError.heading")}
      </h1>
      <p className="max-w-md font-montserrat text-base text-white/80">{t("authError.body")}</p>
      <Link
        href="/login"
        className="inline-flex h-12 items-center rounded bg-[#ffea9e] px-6 font-montserrat text-base font-bold text-[#00101a] transition-colors hover:bg-[#fff8e1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a]"
      >
        {t("authError.backToLogin")}
      </Link>
    </>
  );
}
