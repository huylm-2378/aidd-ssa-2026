import Image from "next/image";
import Link from "next/link";

export default function KudosBanner() {
  return (
    <section
      className="mx-auto max-w-[1512px] px-6 pb-16 sm:px-12 lg:px-[144px] lg:pb-24"
      aria-label="Sun* Kudos promo"
    >
      <div className="relative isolate overflow-hidden rounded-2xl bg-[#0f0f0f]">
        {/* mm:I3390:10349;313:8416 */}
        <Image
          src="/homepage-saa/kudos-bg-v2.png"
          alt=""
          fill
          aria-hidden
          className="object-cover"
        />

        <div className="relative flex flex-col items-start gap-8 px-6 py-12 sm:px-12 lg:max-w-[457px] lg:gap-8 lg:px-16 lg:py-24">
          <div className="flex flex-col items-start gap-4">
            <p className="font-montserrat text-2xl leading-8 text-white">
              Phong trào ghi nhận
            </p>
            <h2 className="font-montserrat text-4xl font-bold leading-[1.1] tracking-tight text-[#ffea9e] sm:text-5xl lg:text-[57px] lg:leading-[64px]">
              Sun* Kudos
            </h2>
            <p className="text-justify font-montserrat text-base font-bold leading-6 tracking-[0.5px] text-white">
              <span className="block font-bold">ĐIỂM MỚI CỦA SAA 2025</span>
              Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn
              ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào
              tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi
              nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là
              chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn
              người đạt giải.
            </p>
          </div>

          <Link
            href="/sun-kudos"
            className="flex items-center gap-2 rounded bg-[#ffea9e] px-4 py-4 font-montserrat text-base font-bold text-[#00101a] transition-all duration-200 hover:bg-[#fff8e1] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea9e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] active:scale-[0.98]"
          >
            Chi tiết
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* mm:I3390:10349;329:2948 */}
        <Image
          src="/homepage-saa/kudos-logo.png"
          alt="Sun* Kudos"
          width={364}
          height={72}
          className="absolute bottom-16 right-8 hidden w-[220px] sm:block lg:right-16 lg:w-[280px]"
        />
      </div>
    </section>
  );
}
