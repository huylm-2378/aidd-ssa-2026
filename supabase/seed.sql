-- F007_KudosData — sample data for the Sun* Kudos board.
-- Run this AFTER supabase/migrations/0001_kudos_schema.sql, in the SQL Editor.
-- Re-runnable: clears the board tables first, then re-inserts deterministic rows.

truncate public.kudos, public.sunners, public.recent_gifts restart identity cascade;

-- ============================================================================
-- Sunners (deterministic ids so kudos can reference them)
-- ============================================================================
insert into public.sunners (id, name, role_code, tier, department) values
  ('00000000-0000-0000-0000-000000000001', 'Huỳnh Dương Xuân Nhật', 'CEVC10', 'New Hero',    'CEVC'),
  ('00000000-0000-0000-0000-000000000002', 'Trần Minh Anh',         'CEVC19', 'Legend Hero', 'CEVC'),
  ('00000000-0000-0000-0000-000000000003', 'Phạm Thu Hà',           'CEVC07', 'Rising Hero', 'Product'),
  ('00000000-0000-0000-0000-000000000004', 'Nguyễn Hoàng Linh',     'CEVC12', 'Legend Hero', 'CEVC'),
  ('00000000-0000-0000-0000-000000000005', 'Lê Quốc Bảo',           'CEVC22', 'Legend Hero', 'Design'),
  ('00000000-0000-0000-0000-000000000006', 'Đỗ Khánh Chi',          'CEVC05', 'Rising Hero', 'Design'),
  ('00000000-0000-0000-0000-000000000007', 'Vũ Ngọc Mai',           'CEVC14', 'Rising Hero', 'Design'),
  ('00000000-0000-0000-0000-000000000008', 'Hoàng Anh Tú',          'CEVC30', 'New Hero',    'Marketing'),
  ('00000000-0000-0000-0000-000000000009', 'Ngô Phương Thảo',       'CEVC18', 'Rising Hero', 'Marketing'),
  ('00000000-0000-0000-0000-000000000010', 'Đặng Hải Đăng',         'CEVC26', 'New Hero',    'Operation'),
  ('00000000-0000-0000-0000-000000000011', 'Bùi Thanh Sơn',         'CEVC02', 'Legend Hero', 'Marketing'),
  ('00000000-0000-0000-0000-000000000012', 'Trịnh Bảo Ngọc',        'CEVC09', 'Rising Hero', 'Operation');

-- + 50 generated sunners (ids 13-62) so the Spotlight constellation has ~62
-- distinct names. Deterministic 3-part Vietnamese names from fixed component
-- arrays indexed by g (different multipliers → varied combos, collisions rare).
insert into public.sunners (id, name, role_code, tier, department)
select
  ('00000000-0000-0000-0000-0000000000' || lpad(g::text, 2, '0'))::uuid,
  (array['Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Phan','Vũ','Đặng','Bùi',
         'Đỗ','Ngô','Dương','Lý','Mai','Đinh'])[(g % 16) + 1]
    || ' ' ||
  (array['Minh','Ngọc','Thanh','Quang','Hải','Thu','Gia','Khánh','Phương','Tuấn',
         'Bảo','Hữu','Đức','Kim','Hồng','Xuân'])[((g * 3) % 16) + 1]
    || ' ' ||
  (array['An','Bình','Cường','Dũng','Hà','Hùng','Khoa','Lan','Mai','Nam',
         'Phúc','Quân','Sơn','Trang','Uyên','Vy','Yến','Đạt','Linh','Thảo'])[((g * 7) % 20) + 1],
  'CEVC' || lpad(((g % 40) + 13)::text, 2, '0'),
  (array['New Hero','Rising Hero','Legend Hero'])[(g % 3) + 1],
  (array['CEVC','Design','Product','Marketing','Operation'])[(g % 5) + 1]
from generate_series(13, 62) as g;

-- ============================================================================
-- Kudos (varied like_count so the Highlight top-5 is meaningful; created_at
-- descending so the All Kudos "recent" feed order matches the current design)
-- ============================================================================
insert into public.kudos
  (sender_id, receiver_id, title, body, hashtags, image_urls, department, like_count, is_anonymous, created_at) values
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002',
   'IDOL GIỚI TRẺ',
   'Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...',
   '{#Dedicated,#Inspring}', '{ph1,ph2,ph3,ph4,ph5,ph6}', 'CEVC', 1000, false, '2025-10-30 10:00:00+07'),
  ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000004',
   'NGƯỜI THẦM LẶNG',
   'Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...',
   '{#Teamwork,#Support}', '{ph1,ph2,ph3,ph4,ph5}', 'CEVC', 1000, false, '2025-10-28 09:15:00+07'),
  ('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000006',
   'CHỖ DỰA CỦA TEAM',
   'Cảm ơn anh đã luôn kiên nhẫn review từng dòng code và chỉ cho em những điểm cần cải thiện. Em học được rất nhiều từ cách anh làm việc mỗi ngày.',
   '{#Leadership,#Trust}', '{ph1,ph2,ph3,ph4,ph5,ph6}', 'Design', 1520, false, '2025-10-25 14:40:00+07'),
  ('00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000008',
   'SÁNG TẠO KHÔNG NGỪNG',
   'Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...',
   '{#Creative,#Inspring}', '{ph1,ph2,ph3,ph4,ph5}', 'Design', 1000, false, '2025-10-22 16:20:00+07'),
  ('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000009',
   'TẬN TÂM VỚI KHÁCH HÀNG',
   'Cảm ơn anh đã luôn kiên nhẫn review từng dòng code và chỉ cho em những điểm cần cải thiện. Em học được rất nhiều từ cách anh làm việc mỗi ngày.',
   '{#Dedicated,#Customer}', '{}', 'Marketing', 958, false, '2025-10-20 11:05:00+07'),
  ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000012',
   'NĂNG LƯỢNG TÍCH CỰC',
   'Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...',
   '{#Positive,#Energy}', '{}', 'Operation', 1104, false, '2025-10-18 08:30:00+07'),
  ('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000003',
   'TRUYỀN LỬA',
   'Cảm ơn người em bình thường nhưng phi thường :D Cảm ơn sự chăm chỉ, cần mẫn của em đã tạo động lực rất nhiều cho team, để luôn nhắc mình luôn phải nỗ lực hơn nữa trong công việc. <3 và cuộc sống...',
   '{#Leadership,#Inspring}', '{}', 'CEVC', 1289, false, '2025-10-16 13:20:00+07'),
  ('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007',
   'ĐỒNG ĐỘI TUYỆT VỜI',
   'Cảm ơn anh đã luôn kiên nhẫn review từng dòng code và chỉ cho em những điểm cần cải thiện. Em học được rất nhiều từ cách anh làm việc mỗi ngày.',
   '{#Teamwork,#Dedicated}', '{}', 'Design', 1000, false, '2025-10-14 09:45:00+07');

-- + 92 generated kudos so the board + Spotlight count are well-populated (~100
-- total). Deterministic (no random()): sender/receiver cycle through all 62
-- sunners (so each becomes a Spotlight node); title/body/hashtags/department
-- cycle through fixed sets; like_count
-- and created_at spread for variety. Re-runnable via the truncate at the top.
insert into public.kudos
  (sender_id, receiver_id, title, body, hashtags, image_urls, department, like_count, is_anonymous, created_at)
select
  ('00000000-0000-0000-0000-0000000000' || lpad((((g * 5) % 62) + 1)::text, 2, '0'))::uuid,
  ('00000000-0000-0000-0000-0000000000' || lpad((((g * 7 + 3) % 62) + 1)::text, 2, '0'))::uuid,
  (array['NGƯỜI TRUYỀN CẢM HỨNG','ĐỒNG ĐỘI ĂN Ý','CHIẾN BINH THẦM LẶNG','NGÔI SAO SÁNG',
         'TRÁI TIM ẤM ÁP','BỘ ÓC SÁNG TẠO','NGƯỜI HÙNG DỰ ÁN','NĂNG LƯỢNG TÍCH CỰC',
         'TẬN TÂM HẾT MÌNH','LÃNH ĐẠO TRUYỀN LỬA'])[(g % 10) + 1],
  (array['Cảm ơn bạn đã luôn hỗ trợ team hết mình!',
         'Sự tận tâm của bạn là nguồn cảm hứng cho tất cả mọi người.',
         'Cảm ơn vì đã luôn sẵn sàng giúp đỡ đồng đội khi cần.',
         'Bạn đã làm việc thật tuyệt vời trong dự án vừa qua!'])[(g % 4) + 1],
  case g % 6
    when 0 then '{#Teamwork,#Support}'::text[]
    when 1 then '{#Leadership,#Trust}'::text[]
    when 2 then '{#Creative,#Inspring}'::text[]
    when 3 then '{#Dedicated,#Customer}'::text[]
    when 4 then '{#Positive,#Energy}'::text[]
    else '{#GoFast,#Wasshoi}'::text[]
  end,
  case when g % 3 = 0 then '{ph1,ph2,ph3}'::text[] else '{}'::text[] end,
  (array['CEVC','Design','Product','Marketing','Operation'])[(g % 5) + 1],
  (50 + (g * 37) % 1500),
  (g % 7 = 0),
  '2025-10-13 20:00:00+07'::timestamptz - (g * interval '71 minutes')
from generate_series(1, 92) as g;

-- ============================================================================
-- Recent gifts — "10 Sunner nhận quà mới nhất" (created_at descending)
-- ============================================================================
insert into public.recent_gifts (name, note, created_at) values
  ('Huỳnh Dương Xuân', 'Nhận được 1 áo phông SAA',       '2025-10-30 18:00:00+07'),
  ('Trần Minh Anh',    'Nhận được 1 áo phông SAA',       '2025-10-30 17:30:00+07'),
  ('Phạm Thu Hà',      'Nhận được 1 bình giữ nhiệt SAA', '2025-10-30 17:00:00+07'),
  ('Nguyễn Hoàng Linh','Nhận được 1 áo phông SAA',       '2025-10-30 16:30:00+07'),
  ('Lê Quốc Bảo',      'Nhận được 1 sổ tay SAA',         '2025-10-30 16:00:00+07'),
  ('Đỗ Khánh Chi',     'Nhận được 1 áo phông SAA',       '2025-10-30 15:30:00+07'),
  ('Vũ Ngọc Mai',      'Nhận được 1 bình giữ nhiệt SAA', '2025-10-30 15:00:00+07'),
  ('Hoàng Anh Tú',     'Nhận được 1 áo phông SAA',       '2025-10-30 14:30:00+07'),
  ('Ngô Phương Thảo',  'Nhận được 1 sổ tay SAA',         '2025-10-30 14:00:00+07'),
  ('Đặng Hải Đăng',    'Nhận được 1 áo phông SAA',       '2025-10-30 13:30:00+07');

-- ============================================================================
-- Sidebar stats (single row) — demo values matching the design's "25"
-- ============================================================================
insert into public.kudos_stats (id, received, sent, hearts, secret_box_opened, secret_box_unopened)
values (1, 25, 25, 25, 25, 25)
on conflict (id) do update set
  received = excluded.received,
  sent = excluded.sent,
  hearts = excluded.hearts,
  secret_box_opened = excluded.secret_box_opened,
  secret_box_unopened = excluded.secret_box_unopened;
