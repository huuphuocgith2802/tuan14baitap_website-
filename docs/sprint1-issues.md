# DANH SÁCH GITHUB ISSUES CHI TIẾT (SPRINT 1 - PLANNING & CORE UI)
## DỰ ÁN: UNITECH CAMPUS STORE · HỌC PHẦN 111101 (LẠC HỒNG)

---

### Issue #01: [SETUP] Khởi tạo cấu trúc thư mục dự án và tài liệu PLAN.md
- **Người thực hiện:** Đinh Hữu Phước (Scrum Master / Product Owner)
- **Nhãn (Labels):** `documentation`, `setup`, `p0`
- **Mô tả nhiệm vụ:**
  - Thiết lập cấu trúc thư mục dự án chuẩn: `assets/`, `css/`, `js/`, `docs/`.
  - Soạn thảo tài liệu `PLAN.md` theo chuẩn LLO 4.1.1 - 4.1.4: Phân tích bài toán, 5 User Stories, User Flow, Data Flow, Wireframe và Checklist.
- **Tiêu chí hoàn thành (DoD):**
  - File `PLAN.md` và `docs/wireframe.md` được tạo đầy đủ.

---

### Issue #02: [UI/UX] Xây dựng bộ khung HTML5 Semantic & Responsive Layout
- **Người thực hiện:** Dev Frontend
- **Nhãn (Labels):** `html`, `css`, `ui`, `p0`
- **Mô tả nhiệm vụ:**
  - Tạo `index.html` với cấu trúc Semantic: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer...>`.
  - Khởi tạo CSS với biến hệ thống (CSS Variables: colors, typography, spacing, shadows).
  - Đảm bảo `#product-grid` để trống sẵn sàng cho Dynamic JavaScript render.
- **Tiêu chí hoàn thành (DoD):**
  - Giao diện đáp ứng mượt mà trên điện thoại di động (375px+), tablet (768px+) và máy tính (1200px+).

---

### Issue #03: [DATA] Thiết kế cấu trúc dữ liệu Object cho 12+ sản phẩm công nghệ trong data.js
- **Người thực hiện:** Dev Logic
- **Nhãn (Labels):** `javascript`, `data`, `p0`
- **Mô tả nhiệm vụ:**
  - Định nghĩa mảng `PRODUCTS` gồm 12 sản phẩm công nghệ chọn lọc cho sinh viên.
  - Mỗi sản phẩm có đầy đủ: `id`, `name`, `category`, `price`, `originalPrice`, `discount`, `rating`, `reviewsCount`, `image`, `inStock`, `badges`, `specs`.
  - Định nghĩa danh mục `CATEGORIES` và danh sách mã voucher `VOUCHERS`.
- **Tiêu chí hoàn thành (DoD):**
  - Dữ liệu chuẩn xác, không có lỗi cú pháp, kiểm tra logic đầy đủ.

---

### Issue #04: [CORE] Xây dựng module ui.js: Render danh sách sản phẩm động (Dynamic Challenge)
- **Người thực hiện:** Dev Logic / Frontend
- **Nhãn (Labels):** `javascript`, `ui`, `challenge-1`, `p0`
- **Mô tả nhiệm vụ:**
  - Viết hàm `renderProducts(products, container)` duyệt mảng và sinh HTML DOM card sản phẩm.
  - Hiển thị đầy đủ nhãn giảm giá, sao đánh giá, giá gốc gạch ngang, nút "Xem nhanh" và "Thêm vào giỏ".
  - Viết hàm `renderEmptyState()` khi không có kết quả tìm kiếm.
- **Tiêu chí hoàn thành (DoD):**
  - Vượt qua Thử thách 1: Website hoàn toàn không có HTML tĩnh cho danh sách sản phẩm.

---

### Issue #05: [REAL-TIME] Phát triển tính năng Live Search thời gian thực (Real-time Search Challenge)
- **Người thực hiện:** Dev Logic
- **Nhãn (Labels):** `javascript`, `realtime`, `challenge-2`, `p0`
- **Mô tả nhiệm vụ:**
  - Bắt sự kiện `input` trên ô tìm kiếm `#search-input`.
  - Lọc sản phẩm theo tên hoặc mô tả theo thời gian thực (real-time live search).
  - Tích hợp nút xóa nhanh (Clear button) ô search.
- **Tiêu chí hoàn thành (DoD):**
  - Vượt qua Thử thách 2: Kết quả lọc thay đổi tức thời theo từng ký tự gõ phím.

---

### Issue #06: [FEATURE] Phát triển tính năng Lọc danh mục & Sắp xếp giá linh hoạt
- **Người thực hiện:** Dev Logic
- **Nhãn (Labels):** `javascript`, `feature`, `p1`
- **Mô tả nhiệm vụ:**
  - Lọc theo các danh mục: Chuột & Bàn phím, Âm thanh & Tai nghe, Cáp sạc GaN, Setup bàn học.
  - Sắp xếp theo: Mặc định, Giá tăng dần, Giá giảm dần, Đánh giá cao nhất.
  - Kết hợp đồng thời cả bộ lọc danh mục, từ khóa search và bộ sắp xếp.
- **Tiêu chí hoàn thành (DoD):**
  - Bộ lọc hoạt động đồng bộ và mượt mà.

---

### Issue #07: [FEATURE] Xây dựng Modal Quick View xem chi tiết thông số sản phẩm
- **Người thực hiện:** Dev Frontend / Logic
- **Nhãn (Labels):** `ui`, `modal`, `p1`
- **Mô tả nhiệm vụ:**
  - Viết hàm mở/đóng modal hiển thị chi tiết sản phẩm khi bấm "Xem nhanh".
  - Hiển thị bảng thông số kỹ thuật (Specs), tình trạng kho hàng, chọn số lượng muốn mua.
- **Tiêu chí hoàn thành (DoD):**
  - Modal có hiệu ứng trượt mượt mà, đóng bằng nút [X], phím Escape hoặc click nền mờ.

---

### Issue #08: [CART] Xây dựng Drawer Giỏ hàng, tính tổng tiền & lưu LocalStorage
- **Người thực hiện:** Dev Logic
- **Nhãn (Labels):** `javascript`, `cart`, `storage`, `p0`
- **Mô tả nhiệm vụ:**
  - Thêm sản phẩm vào giỏ, cộng dồn số lượng nếu sản phẩm đã tồn tại.
  - Tăng/giảm số lượng (+/-) và xóa sản phẩm trong drawer giỏ hàng.
  - Tính tổng tiền tạm tính, áp dụng mã voucher (`SINHVIEN10` giảm 10%, `FREESHIP` miễn phí ship).
  - Đồng bộ trạng thái giỏ hàng vào `localStorage` của trình duyệt.
- **Tiêu chí hoàn thành (DoD):**
  - Tải lại trang vẫn giữ nguyên giỏ hàng, huy hiệu (badge) nhảy số sinh động.

---

### Issue #09: [VALIDATION] Xây dựng Form Đặt hàng với Real-time Validation (UX Challenge)
- **Người thực hiện:** Dev Logic
- **Nhãn (Labels):** `javascript`, `forms`, `realtime`, `p0`
- **Mô tả nhiệm vụ:**
  - Xây dựng form nhập: Họ tên, Số điện thoại, Mã số sinh viên (MSSV), Địa chỉ KTX/phòng trọ, Phương thức thanh toán.
  - Kiểm tra tính hợp lệ tức thời khi người dùng gõ từng ký tự:
    - SĐT: Đúng chuẩn đầu số viễn thông Việt Nam (10 chữ số).
    - Họ tên: Tối thiểu 3 ký tự, không chứa ký tự đặc biệt vô nghĩa.
    - MSSV: Tối thiểu 6 ký tự số/chữ.
    - Địa chỉ: Tối thiểu 6 ký tự.
  - Chỉ kích hoạt nút "Xác nhận đặt hàng" khi toàn bộ các trường đều hợp lệ.
- **Tiêu chí hoàn thành (DoD):**
  - Phản hồi trực quan bằng icon xanh/đỏ và thông báo lỗi dưới từng ô nhập.

---

### Issue #10: [POLISH] Tích hợp Toast Notification, tối ưu Clean Code & Clean UI
- **Người thực hiện:** Đinh Hữu Phước & Dev Team
- **Nhãn (Labels):** `polish`, `clean-code`, `challenge-3`, `p1`
- **Mô tả nhiệm vụ:**
  - Viết module Toast thông báo nổi góc màn hình (Success, Info, Warning).
  - Tách bạch 3 file rõ ràng: `data.js`, `ui.js`, `app.js`.
  - Viết tài liệu `README.md` hướng dẫn sử dụng và kiểm tra tiêu chí chấm điểm.
- **Tiêu chí hoàn thành (DoD):**
  - Vượt qua Thử thách 3 (Clean Code Modules). Mã nguồn sạch sẽ, chú thích rõ ràng.
