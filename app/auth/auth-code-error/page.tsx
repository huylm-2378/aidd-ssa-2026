import type { Metadata } from "next";
import Header from "../../_components/homepage-saa/header";
import Footer from "../../_components/homepage-saa/footer";
import AuthErrorContent from "./auth-error-content";

export const metadata: Metadata = {
  title: "Đăng nhập thất bại — Sun* Annual Awards 2025",
  description: "Không thể hoàn tất đăng nhập. Vui lòng thử lại.",
};

// F005: fallback shown when the OAuth code exchange fails or no code is present (FR-006 / SC-003).
export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#00101a]">
      <Header minimal />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <AuthErrorContent />
      </main>
      <Footer minimal />
    </div>
  );
}
