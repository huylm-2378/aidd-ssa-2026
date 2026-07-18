# Clarifications — Open Secret Box

## Session 2026-07-18

- Q: Phạm vi lần này làm đến đâu (Figma còn frame "action bấm mở" + 8 frame "Standby sau khi đã bấm")? → A: Modal "chưa mở" theo frame J3-4YFIpMM + backend mở box thật (click box → badge hiện trong khung, counter trừ 1); các frame animation/standby OUT of scope.
- Q: Số Secret Box chưa mở của user lấy từ đâu? → A: Tính từ ❤️ thật: unopened = floor(tổng hearts trên kudos mình nhận / 5) − số box đã mở (khớp thể lệ "5 ❤️ = 1 Secret Box").
- Q: Cơ chế mở box + lưu badge (app chỉ có anon key)? → A: Migration mới: bảng sunner_badges + Postgres RPC SECURITY DEFINER open_secret_box() — entitlement check + weighted random (Stay Gold 30%, Flow to Horizon 25%, Beyond the Boundary 10%, Root Further 5%, Touch of Light 20%, Revival 10%) + insert atomically; client chỉ gọi RPC.
- Q: Modal mở từ nút nào? → A: Cả 2 nút visual-only hiện có (kudos-sidebar.tsx + profile-stats.tsx) gắn cùng một modal.
- Q: Xử lý lớp spec (SDD on, chưa có spec)? → A: Author spec draft trước vào plans/260718-0451-open-secret-box/spec/open-secret-box/; F### + promote khi chạy /tkm:takumi.
- Q: Title modal dùng chữ nào (spec item A ghi "MỞ SECRET BOX THÀNH CÔNG" nhưng ảnh design frame "chưa mở" ghi khác)? → A: Dùng theo ảnh design của frame này: "KHÁM PHÁ SECRET BOX CỦA BẠN" (title "THÀNH CÔNG" thuộc frame trạng thái success).
