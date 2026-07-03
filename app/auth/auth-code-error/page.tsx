import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../_components/homepage-saa/header";
import Footer from "../../_components/homepage-saa/footer";

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
        <h1 className="font-montserrat text-2xl font-bold text-[#ffea9e] sm:text-3xl">
          Đăng nhập chưa hoàn tất
        </h1>
        <p className="max-w-md font-montserrat text-base text-white/80">
          Có lỗi xảy ra khi xác thực với Google. Vui lòng thử đăng nhập lại.
        </p>
        <Link
          href="/login"
          className="inline-flex h-12 items-center rounded bg-[#ffea9e] px-6 font-montserrat text-base font-bold text-[#00101a] transition-colors hover:bg-[#fff8e1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101a]"
        >
          Quay lại đăng nhập
        </Link>
      </main>
      <Footer minimal />
    </div>
  );
}
