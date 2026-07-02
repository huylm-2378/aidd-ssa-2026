import Image from "next/image";

const BODY_PARAGRAPHS_TOP = [
  `Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là “problem-solver” - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.`,
  `Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, “Root Further” đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.`,
  `Vượt ra khỏi nét nghĩa bề mặt, “Root Further” chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng “địa chất” ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua từng lớp “trầm tích” để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang “hấp thụ” dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ “bén rễ” vào kỷ nguyên AI - một tầng “địa chất” hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.`,
];

const BODY_PARAGRAPHS_BOTTOM = [
  `Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương mới trên hành trình phát triển tổ chức, “Root Further” còn như một lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn.`,
  `Không ai biết trước ẩn sâu trong “lòng đất” của ngành công nghệ và thị trường hiện đại còn biết bao tầng “địa chất” bí ẩn. Chỉ biết rằng khi “Root Further” đã trở thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy háo hức trước bất cứ vùng vô định nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.`,
];

export default function RootFurtherContent() {
  return (
    <section
      className="mx-auto flex max-w-[1512px] flex-col items-center justify-center px-6 py-16 sm:px-12 lg:px-[180px] lg:pb-24 lg:pt-[120px]"
      aria-label="Root Further theme story"
    >
      <div className="flex w-full max-w-[1152px] flex-col items-center gap-8 rounded-lg py-8 sm:gap-10 lg:py-16">
        {/* mm:2788:12911 */}
        <Image
          src="/homepage-saa/root-further-logo-mid.png"
          alt="Root Further"
          width={290}
          height={134}
          className="h-auto w-[180px] sm:w-[240px] lg:w-[290px]"
        />

        <div className="flex flex-col gap-6 text-justify font-montserrat text-base font-bold leading-7 text-white sm:text-lg lg:text-2xl lg:leading-8">
          {BODY_PARAGRAPHS_TOP.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <blockquote className="text-center font-montserrat text-lg font-bold italic leading-8 text-white">
          <p>&ldquo;A tree with deep roots fears no storm&rdquo;</p>
          <p className="mt-1 text-base">
            (Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)
          </p>
        </blockquote>

        <div className="flex flex-col gap-6 text-justify font-montserrat text-base font-bold leading-7 text-white sm:text-lg lg:text-2xl lg:leading-8">
          {BODY_PARAGRAPHS_BOTTOM.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
