import type { Metadata } from "next";
import Image from "next/image";
import Header from "../_components/homepage-saa/header";
import Footer from "../_components/homepage-saa/footer";
import GoogleLoginButton from "../_components/login/google-login-button";
import LoginWelcome from "../_components/login/login-welcome";

export const metadata: Metadata = {
  title: "Đăng nhập — Sun* Annual Awards 2025",
  description:
    "Đăng nhập để bắt đầu hành trình của bạn cùng Sun* Annual Awards 2025 (Root Further).",
};

// Frame "Login" (GzbNeVGJHz, node 662:14387): full-bleed "Root Further" keyvisual behind a minimal
// header, the ROOT FURTHER logotype, a two-line welcome, and the gold "LOGIN With Google" button.
export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#00101a]">
      {/* mms_C_Keyvisual (662:14388) + Cover (662:14390) -- the "Root Further" artwork fills the
          viewport; a left-anchored scrim keeps the white logotype and text legible over it. Reuses
          the shared keyvisual asset (same artwork family as the homepage). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/homepage-saa/keyvisual-bg.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00101a_0%,#00101a_28%,rgba(0,16,26,0.62)_46%,rgba(0,16,26,0)_68%)]" />
      </div>

      <Header minimal />

      <main className="flex flex-1 items-center px-6 py-16 sm:px-9 lg:px-[144px]">
        <div className="flex max-w-[520px] flex-col items-start gap-10 sm:gap-14">
          {/* mms_B.1_Key Visual / MM_MEDIA_Root Further Logo (2939:9548, 451x200) -- reused asset. */}
          <Image
            src="/homepage-saa/root-further-logo.png"
            alt="Root Further"
            width={451}
            height={200}
            priority
            className="h-auto w-[280px] sm:w-[380px] lg:w-[451px]"
          />

          <div className="flex flex-col items-start gap-6">
            {/* mms_B.2_content (662:14753) -- Montserrat 700, ~20px/40px, letter-spacing 0.5px. */}
            <LoginWelcome />

            <GoogleLoginButton />
          </div>
        </div>
      </main>

      <Footer minimal />
    </div>
  );
}
