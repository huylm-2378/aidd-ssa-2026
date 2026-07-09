/**
 * Vietnamese message fragment — the F014 round 1/2 catalog (chrome, homepage,
 * Profile, Awards-information). Split out of `vi.ts` so no single catalog
 * file crosses the 200-line budget (see `.claude/rules/development-rules.md`
 * "File Size Management"). `vi.ts` composes this with `vi-kudos.ts` via
 * object spread — see that file for the compile-check contract.
 *
 * Deliberately NOT typed here (no `: Messages` / `: Record<...>` annotation)
 * so `typeof viCore` stays a precise literal-key map; `vi.ts` derives the
 * canonical `Messages` shape from the composed object, and `en-core.ts`
 * type-checks against `keyof typeof viCore` instead.
 */
export const viCore = {
  "common.logoHome": "Sun* Annual Awards home",
  "common.logoAlt": "Sun* Annual Awards logo",
  "common.detail": "Chi tiết",
  "common.sectionEyebrow": "Sun* Annual Awards 2025",

  "nav.about": "About SAA 2025",
  "nav.awards": "Award Information",
  "nav.kudos": "Sun* Kudos",

  "header.notifications": "Notifications",

  "footer.copyright": "Bản quyền thuộc về Sun* © 2025",

  "accountMenu.trigger": "Account menu",
  "accountMenu.profile": "Profile",
  "accountMenu.signOut": "Sign out",
  "accountMenu.signIn": "Sign in",

  "hero.comingSoon": "Coming soon",
  "hero.timeLabel": "Thời gian:",
  "hero.venueLabel": "Địa điểm:",
  "hero.broadcastNote": "Tường thuật trực tiếp qua sóng Livestream",
  "hero.aboutAwards": "ABOUT AWARDS",
  "hero.aboutKudos": "ABOUT KUDOS",
  "hero.sectionAria": "Event hero",
  "hero.logoAlt": "Root Further",

  "countdown.days": "DAYS",
  "countdown.hours": "HOURS",
  "countdown.minutes": "MINUTES",

  "rootFurther.sectionAria": "Root Further theme story",
  "rootFurther.logoAlt": "Root Further",
  "rootFurther.top1": `Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi Sunner đều là “problem-solver” - chuyên gia trong việc giải quyết mọi vấn đề, tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.`,
  "rootFurther.top2": `Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào sâu để bứt phá trong kỷ nguyên AI, “Root Further” đã được chọn để trở thành chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.`,
  "rootFurther.top3": `Vượt ra khỏi nét nghĩa bề mặt, “Root Further” chính là hành trình chúng ta không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng “địa chất” ẩn sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua từng lớp “trầm tích” để thẩm thấu những gì tinh tuý nhất, người Sun* cũng đang “hấp thụ” dưỡng chất từ thời đại và những thử thách của thị trường để làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ “bén rễ” vào kỷ nguyên AI - một tầng “địa chất” hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ vô vàn tiềm năng cùng cơ hội.`,
  "rootFurther.quote": "A tree with deep roots fears no storm",
  "rootFurther.quoteAttr": "(Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)",
  "rootFurther.bottom1": `Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách, làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi của chương mới trên hành trình phát triển tổ chức, “Root Further” còn như một lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là điều kiện tiên quyết để trường tồn.`,
  "rootFurther.bottom2": `Không ai biết trước ẩn sâu trong “lòng đất” của ngành công nghệ và thị trường hiện đại còn biết bao tầng “địa chất” bí ẩn. Chỉ biết rằng khi “Root Further” đã trở thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy háo hức trước bất cứ vùng vô định nào trên hành trình tiến về phía trước. Vì ta luôn tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình đang chờ ta.`,

  "awards.eyebrow": "Sun* annual awards 2025",
  "awards.heading": "Hệ thống giải thưởng",
  "awards.sectionAria": "Awards",
  "awards.desc.top-talent": "Vinh danh top cá nhân xuất sắc trên mọi phương diện",
  "awards.desc.top-project":
    "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật",
  "awards.desc.top-project-leader":
    "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá,",
  "awards.desc.best-manager":
    "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
  "awards.desc.signature-2025-creator":
    "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",
  "awards.desc.mvp": "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm",

  "banner.sectionAria": "Sun* Kudos promo",
  "banner.eyebrow": "Phong trào ghi nhận",
  "banner.title": "Sun* Kudos",
  "banner.newPoint": "ĐIỂM MỚI CỦA SAA 2025",
  "banner.body": `Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.`,
  "banner.wordmarkAlt": "Sun* Kudos",

  "profile.iconCollection": "Bộ sưu tập icon của tôi",
  "profile.openSecretBox": "Mở Secret Box",
  "profile.tabSent": "Đã gửi",
  "profile.tabReceived": "Đã nhận",
  "profile.emptyKudos": "Chưa có Kudo nào",
  "profile.ariaYourKudos": "Kudos của bạn",

  "stats.received": "Số Kudos bạn nhận được:",
  "stats.sent": "Số Kudos bạn đã gửi:",
  "stats.hearts": "Số tim bạn nhận được:",
  "stats.secretOpened": "Số Secret Box bạn đã mở:",
  "stats.secretUnopened": "Số Secret Box chưa mở:",

  "filter.clearAll": "Tất cả",

  "awardsHero.title": "Hệ thống giải thưởng SAA 2025",

  "awardsDetail.quantityLabel": "Số lượng giải thưởng:",
  "awardsDetail.prizeValueLabel": "Giá trị giải thưởng:",
  "awardsDetail.or": "Hoặc",
  "awardsDetail.qty.individual": "Cá nhân",
  "awardsDetail.qty.collective": "Tập thể",
  "awardsDetail.qty.individualOrCollective": "Cá nhân hoặc tập thể",
  "awardsDetail.note.perAward": "cho mỗi giải thưởng",
  "awardsDetail.note.individual": "cho giải cá nhân",
  "awardsDetail.note.collective": "cho giải tập thể",

  "awards.long.top-talent":
    "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.",
  "awards.long.top-project":
    "Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng, hiệu quả vận hành tối ưu và tinh thần làm việc tận tâm. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả tối ưu hóa nguồn lực và chi phí tốt, đề xuất các ý tưởng có giá trị cho khách hàng, đem lại lợi nhuận vượt trội và nhận được phản hồi tích cực từ khách hàng. Các thành viên tuân thủ nghiêm ngặt các tiêu chuẩn phát triển nội bộ trong phát triển dự án, tạo nên một hình mẫu về sự xuất sắc và chuyên nghiệp.",
  "awards.long.top-project-leader":
    "Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người hội tụ năng lực quản lý vững vàng, khả năng truyền cảm hứng mạnh mẽ, và tư duy “Aim High – Be Agile” trong mọi bài toán và bối cảnh. Dưới sự dẫn dắt của họ, các thành viên không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đề ra, mà còn giữ vững ngọn lửa nhiệt huyết, tinh thần Wasshoi, và trưởng thành để trở thành phiên bản tinh hoa – hạnh phúc hơn của chính mình.",
  "awards.long.best-manager":
    "Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn chinh phục và làm chủ mọi mục tiêu bằng năng lực đa nhiệm, khả năng phối hợp hiệu quả, và tư duy ứng dụng công nghệ linh hoạt trong kỷ nguyên số. Họ truyền cảm hứng để tập thể trở nên tự tin tràn đầy năng lượng, sẵn sàng đón nhận, thậm chí dẫn dắt tạo ra những thay đổi có tính cách mạng.",
  "awards.long.signature-2025-creator":
    "Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ.  Trong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần “Creator” đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.",
  "awards.long.mvp":
    "Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*. Họ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun* suốt năm qua.  Không chỉ nổi bật bởi hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng lan tỏa – thông qua suy nghĩ, hành động và ảnh hưởng tích cực của mình đối với tập thể. MVP là người hội tụ đầy đủ phẩm chất của người Sun* ưu tú, đồng thời mang trên mình trọng trách lớn lao: trở thành hình mẫu đại diện cho con người và tinh thần Sun*, góp phần dẫn dắt tập thể vươn tới những đỉnh cao mới.",

  "login.subtitle1": "Bắt đầu hành trình của bạn cùng SAA 2025.",
  "login.subtitle2": "Đăng nhập để khám phá!",
  "login.googleButton": "LOGIN With Google",

  "prelaunch.heading": "Sự kiện sẽ bắt đầu sau",

  "authError.heading": "Đăng nhập chưa hoàn tất",
  "authError.body": "Có lỗi xảy ra khi xác thực với Google. Vui lòng thử đăng nhập lại.",
  "authError.backToLogin": "Quay lại đăng nhập",
};
