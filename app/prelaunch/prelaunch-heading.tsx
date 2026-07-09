"use client";

import { useTranslation } from "../_lib/i18n/use-translation";

/**
 * "Sự kiện sẽ bắt đầu sau" heading (F011, F014 i18n). Client child because
 * `app/prelaunch/page.tsx` is a Server Component exporting `metadata` and
 * cannot read the language context itself.
 */
export default function PrelaunchHeading() {
  const { t } = useTranslation();
  return (
    <h1 className="font-montserrat text-2xl font-bold leading-tight text-white sm:text-[36px] sm:leading-[1.2]">
      {t("prelaunch.heading")}
    </h1>
  );
}
