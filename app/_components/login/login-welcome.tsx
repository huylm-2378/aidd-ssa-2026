"use client";

import { useTranslation } from "../../_lib/i18n/use-translation";

/**
 * Two-line welcome copy on the login page (F004 `mms_B.2_content`, F014 i18n).
 * Client child because `app/login/page.tsx` is a Server Component exporting
 * `metadata` and cannot read the language context itself.
 */
export default function LoginWelcome() {
  const { t } = useTranslation();
  return (
    <p className="font-montserrat text-lg font-bold leading-[1.8] tracking-[0.5px] text-white sm:text-xl">
      <span className="block">{t("login.subtitle1")}</span>
      <span className="block">{t("login.subtitle2")}</span>
    </p>
  );
}
