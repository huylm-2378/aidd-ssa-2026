"use client";

import Image from "next/image";
import { useTranslation } from "../../_lib/i18n/use-translation";

export default function RootFurtherContent() {
  const { t } = useTranslation();
  const bodyParagraphsTop = [t("rootFurther.top1"), t("rootFurther.top2"), t("rootFurther.top3")];
  const bodyParagraphsBottom = [t("rootFurther.bottom1"), t("rootFurther.bottom2")];

  return (
    <section
      className="mx-auto flex max-w-[1512px] flex-col items-center justify-center px-6 py-16 sm:px-12 lg:px-[180px] lg:pb-24 lg:pt-[120px]"
      aria-label={t("rootFurther.sectionAria")}
    >
      <div className="flex w-full max-w-[1152px] flex-col items-center gap-8 rounded-lg py-8 sm:gap-10 lg:py-16">
        {/* mm:2788:12911 */}
        <Image
          src="/homepage-saa/root-further-logo-mid.png"
          alt={t("rootFurther.logoAlt")}
          width={290}
          height={134}
          className="h-auto w-[180px] sm:w-[240px] lg:w-[290px]"
        />

        <div className="flex flex-col gap-6 text-justify font-montserrat text-base font-bold leading-7 text-white sm:text-lg lg:text-2xl lg:leading-8">
          {bodyParagraphsTop.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <blockquote className="text-center font-montserrat text-lg font-bold italic leading-8 text-white">
          <p>&ldquo;{t("rootFurther.quote")}&rdquo;</p>
          <p className="mt-1 text-base">{t("rootFurther.quoteAttr")}</p>
        </blockquote>

        <div className="flex flex-col gap-6 text-justify font-montserrat text-base font-bold leading-7 text-white sm:text-lg lg:text-2xl lg:leading-8">
          {bodyParagraphsBottom.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
