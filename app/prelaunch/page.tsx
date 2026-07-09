import type { Metadata } from "next";
import Image from "next/image";
import CountdownRow from "./countdown-row";
import PrelaunchHeading from "./prelaunch-heading";

export const metadata: Metadata = {
  title: "Sắp diễn ra — Sun* Annual Awards 2025",
  description:
    "Sun* Annual Awards 2025 (Root Further) sắp bắt đầu — theo dõi đếm ngược khai mạc tại đây.",
};

// Frame "Countdown - Prelaunch page" (MoMorph 8PJQswPZmU, F011): standalone full-screen route with
// NO Header/Footer chrome. Reuses the login page's full-bleed keyvisual pattern (mm 662:14388 /
// 662:14390 family) plus the homepage hero's countdown wiring, trimmed to a centered heading and
// countdown only.
export default function PrelaunchPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#00101a] px-6 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/prelaunch/MM_MEDIA_BG%20Image.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00101a_0%,#00101a_28%,rgba(0,16,26,0.62)_46%,rgba(0,16,26,0)_68%)]" />
      </div>

      <div className="flex flex-col items-center gap-10 text-center sm:gap-14">
        <PrelaunchHeading />
        <CountdownRow />
      </div>
    </div>
  );
}
