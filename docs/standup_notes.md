# BIÊN BẢN HỌP DAILY STAND-UP (SPRINT 2 - FINAL PUSH)
## DỰ ÁN: UNITECH CAMPUS STORE · HỌC PHẦN 111101 (LẠC HỒNG UNIVERSITY)
**Thời gian:** 08:00 - 08:15 AM · Thứ Năm, Tuần 14  
**Hình thức:** Agile Stand-up Meeting (15 phút)  
**Địa điểm:** Phòng Lab Công nghệ Thông tin - Trường Đại học Lạc Hồng (LHU)  
**Mục tiêu Sprint 2:** Hoàn thiện Logic JavaScript thông minh (Vibe Logic), Kiểm thử chất lượng (Zero Console Error), Responsive Mobile và đóng gói sản phẩm chuẩn bị Demo Hackathon (Tuần 15).

---

## 👥 THÀNH PHẦN THAM DỰ & BÁO CÁO 3 CÂU HỎI KINH ĐIỂN

### 1. Đinh Hữu Phước — Vai trò: Scrum Master & Lead Developer
* **1. Hôm qua đã làm gì? (Yesterday):**
  - Đã rà soát lại toàn bộ kết quả Sprint 1 (Tuần 13).
  - Đã nghiệm thu khung giao diện HTML5 Semantic và hệ thống dữ liệu 12 sản phẩm ban đầu trong `js/data.js`.
  - Khởi tạo danh sách công việc (Sprint 2 Backlog) và thiết lập tiêu chí Definition of Done (DoD).
* **2. Hôm nay sẽ làm gì? (Today):**
  - Nâng cấp cấu trúc dữ liệu JSON lên 16+ thiết bị công nghệ thiết thực cho sinh viên LHU (`data/products.json`).
  - Triển khai tính năng nạp dữ liệu bất đồng bộ (Async Fetch với cơ chế Fallback an toàn cho cả môi trường local và web live).
  - Triển khai bộ lọc đa chiều thông minh (Combined Filter: Danh mục + Khoảng giá + Badge + Sắp xếp) kết hợp thuật toán Debounce 250ms cho Live Search.
* **3. Có gặp khó khăn/trở ngại gì không? (Blockers):**
  - *Khó khăn:* Trình duyệt thường chặn hàm `fetch()` khi mở file HTML trực tiếp từ ổ cứng (`file:///`) do chính sách CORS.
  - *Giải pháp AI Vibe Coding:* Sử dụng Prompt yêu cầu AI tư vấn giải pháp Modular Loader: Tự động phát hiện giao thức mạng (`window.location.protocol === 'file:'`), nếu chạy local sẽ lấy ngay mảng Object trong bộ nhớ; nếu chạy web server/GitHub Pages sẽ tải từ file `data/products.json`.

---

### 2. Thành viên phụ trách Frontend & UI/UX (Frontend Dev)
* **1. Hôm qua đã làm gì? (Yesterday):**
  - Tối ưu hệ thống biến CSS Variables, kiểm tra độ tương phản màu sắc đạt chuẩn WCAG AA.
  - Hoàn thiện bố cục lưới CSS Grid và Flexbox thích ứng trên màn hình máy tính và máy tính bảng.
* **2. Hôm nay sẽ làm gì? (Today):**
  - Xây dựng giao diện Dark / Light Mode sang trọng với hiệu ứng chuyển đổi mượt mà (CSS Transitions).
  - Bổ sung thanh lọc khoảng giá (Price Range Filter) và các chip trạng thái lọc nhanh (Filter Badges).
  - Thiết kế lại màn hình giỏ hàng và modal đặt hàng (Checkout Modal) thân thiện hơn với thao tác chạm trên điện thoại di động (Mobile Touch Friendly).
* **3. Có gặp khó khăn/trở ngại gì không? (Blockers):**
  - *Khó khăn:* Khi chuyển đổi Dark Mode, một số thẻ badge và viền input bị chìm màu nền hoặc khó nhìn trên màn hình OLED.
  - *Giải pháp AI Vibe Coding:* Dùng AI rà soát toàn bộ bộ màu CSS semantic, tách biến `--bg-card`, `--text-muted`, `--border-color` theo 2 bộ theme `[data-theme="light"]` và `[data-theme="dark"]`.

---

### 3. Thành viên phụ trách JavaScript Logic & Validation (Logic Dev)
* **1. Hôm qua đã làm gì? (Yesterday):**
  - Đã viết các hàm cơ bản thêm/xóa/sửa sản phẩm trong giỏ hàng.
  - Xây dựng logic áp dụng mã voucher sinh viên LHU (`SINHVIEN10`, `FREESHIP`).
* **2. Hôm nay sẽ làm gì? (Today):**
  - Nâng cấp module Real-time Form Validation với biểu thức chính quy (Regex) chặt chẽ cho MSSV Đại học Lạc Hồng (chuẩn định dạng), số điện thoại mạng viễn thông Việt Nam, và email sinh viên.
  - Bổ sung hiệu ứng phản hồi tức thì (Real-time Feedback): Hiển thị icon tích xanh `bi-check-circle-fill` khi đúng, viền đỏ cảnh báo khi sai ngay trong lúc người dùng đang nhập liệu.
  - Tích hợp tính năng Danh sách sản phẩm yêu thích (Wishlist) lưu vào `localStorage`.
* **3. Có gặp khó khăn/trở ngại gì không? (Blockers):**
  - *Khó khăn:* Xử lý sự kiện `input` trên thanh tìm kiếm liên tục làm kích hoạt hàm render DOM gây giật khung hình (frame drop) trên các thiết bị cấu hình yếu.
  - *Giải pháp AI Vibe Coding:* Tham vấn AI để triển khai kỹ thuật **Debounce** (độ trễ 250ms), giúp hệ thống chỉ kích hoạt tìm kiếm khi người dùng ngừng gõ phím.

---

### 4. Thành viên phụ trách Kiểm thử & Đảm bảo chất lượng (QA / Tester)
* **1. Hôm qua đã làm gì? (Yesterday):**
  - Lập bảng danh mục các ca kiểm thử (Test Cases) cho chức năng giỏ hàng và hiển thị danh mục.
* **2. Hôm nay sẽ làm gì? (Today):**
  - Kiểm thử chéo toàn bộ ứng dụng trên nhiều kích thước màn hình: Mobile (375px - iPhone SE, 414px - iPhone 11), Tablet (768px - iPad Mini), Desktop (1200px+).
  - Giám sát DevTools Console để đảm bảo **Zero Console Error** (không có lỗi cú pháp, cảnh báo deprecation hay unhandled promise).
  - Soát lỗi văn phong, chính tả, định dạng tiền tệ VNĐ và hình ảnh mô phỏng.
* **3. Có gặp khó khăn/trở ngại gì không? (Blockers):**
  - *Khó khăn:* Một số hình ảnh mẫu từ CDN Unsplash có thể tải chậm hoặc bị lỗi 404 khi người dùng mất mạng tạm thời.
  - *Giải pháp AI Vibe Coding:* Bổ sung thuộc tính `onerror="this.src='assets/images/fallback-product.png'"` hoặc fallback SVG placeholder tự động trong hàm render.

---

## 🎯 DEFINITION OF DONE (DoD) CỦA SPRINT 2
Nhóm thống nhất một tính năng chỉ được xem là **HOÀN THÀNH (DONE)** khi đạt đủ 4 tiêu chí khắt khe:
1. **Chạy đúng logic 100%:** Đáp ứng đúng User Story, kiểm thử thành công các ca kiểm thử thông thường và ca kiểm thử biên (Edge Cases).
2. **Không lỗi Console:** Mở F12 Console ở mọi trang, mọi tương tác (tìm kiếm, thêm giỏ hàng, submit form, đổi theme) không xuất hiện lỗi đỏ hoặc cảnh báo vàng.
3. **Hiển thị tối ưu trên Mobile:** Giao diện co giãn mượt mà, kích thước nút bấm tối thiểu 44x44px, không tràn thanh cuộn ngang (No horizontal scroll).
4. **Code sạch (AI Refactored):** Mã nguồn được tổ chức theo module rõ ràng, đặt tên biến có nghĩa bằng tiếng Anh/Việt nhất quán, loại bỏ mã thừa (Dead Code) và có chú thích (JSDoc) đầy đủ.
