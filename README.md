# UNITECH - CAMPUS STORE 🎓💻
### BÀI TẬP LỚN (PBL) · HỌC PHẦN 111101: THIẾT KẾ WEB
### ĐẠI HỌC LẠC HỒNG (LHU) · KHOA CÔNG NGHỆ THÔNG TIN
**TUẦN 13 · SPRINT 1: PLANNING & CORE UI (PBL PHASE 1)**

---

## 📌 GIỚI THIỆU DỰ ÁN
**UniTech - Campus Store** là giải pháp website thương mại điện tử chuyên cung cấp thiết bị và phụ kiện công nghệ thông minh, trợ giá thân thiện dành riêng cho sinh viên Đại học Lạc Hồng (LHU). Dự án được triển khai theo mô hình **Agile / Scrum** đơn giản kết hợp phương pháp **Vibe Coding** (AI-assisted development).

* **Sinh viên thực hiện:** Đinh Hữu Phước
* **Mã số sinh viên (MSSV):** 125000155
* **Email:** 125000155@lachong.edu.vn
* **Repository GitHub:** [huuphuocgith2802/tuan13baitap_website-](https://github.com/huuphuocgith2802/tuan13baitap_website-)

---

## 🚀 ĐẠT 3 THỬ THÁCH KỸ THUẬT BẮT BUỘC (PROJECT CHALLENGES)

| Thử thách | Yêu cầu từ giáo trình LHU (Trang 76) | Giải pháp kỹ thuật trong dự án | Trạng thái |
| :--- | :--- | :--- | :---: |
| **1. Thử thách Dynamic** | Website **tuyệt đối không dùng HTML tĩnh** cho danh sách sản phẩm. Toàn bộ phải render từ mảng Object (Tuần 12). | Trong `index.html`, thẻ `#product-grid` hoàn toàn rỗng. Hàm `UI.renderProducts()` trong `ui.js` duyệt mảng 12 sản phẩm từ `data.js` để render động toàn bộ giao diện sản phẩm. | ✅ ĐẠT 100% |
| **2. Thử thách UX** | Phải có ít nhất một chức năng **Real-time** (tìm kiếm đến đâu hiện kết quả đến đó hoặc validate form khi gõ). | **Vượt mức yêu cầu với 2 tính năng Real-time:**<br>1. **Live Search Real-time**: Bắt sự kiện `input` trên ô tìm kiếm, lọc tức thì trong < 100ms.<br>2. **Real-time Form Validation**: Kiểm tra hợp lệ Regex SĐT Việt Nam, MSSV, Họ tên và Địa chỉ ngay khi người dùng gõ từng phím. | ✅ ĐẠT 100% |
| **3. Thử thách Clean Code**| Mã nguồn phải tổ chức thành **3 Module rõ ràng**: `data.js`, `ui.js`, `app.js`. | Mã nguồn được phân chia chính xác thành 3 file độc lập:<br>• `js/data.js`: Quản lý mảng Object dữ liệu.<br>• `js/ui.js`: Quản lý tương tác DOM, Modals, Toasts.<br>• `js/app.js`: Quản lý Logic chính, Event listeners và Controller. | ✅ ĐẠT 100% |

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT STRUCTURE)

```
tuan13baitap_website/
├── assets/
│   ├── images/                 # Tài nguyên hình ảnh minh họa
│   └── icons/                  # Icons hệ thống
├── css/
│   ├── style.css               # Bố cục giao diện hiện đại, CSS variables, animation
│   └── responsive.css          # Tối ưu responsive cho Mobile, Tablet, Desktop
├── js/
│   ├── data.js                 # Module 1: Mảng Object dữ liệu 12 sản phẩm, voucher, config
│   ├── ui.js                   # Module 2: Xử lý hiển thị DOM, Quick View modal, Cart, Toast
│   └── app.js                  # Module 3: Controller điều phối, Live search, Giỏ hàng, Validation
├── docs/
│   ├── wireframe.md            # Bản vẽ phác thảo giao diện Wireframe chi tiết
│   └── sprint1-issues.md       # Danh sách 10 GitHub Issues phân chia công việc Scrum
├── index.html                  # Khung HTML5 Semantic chuẩn SEO, accessibility
├── PLAN.md                     # Kế hoạch dự án PBL Milestone 1 theo chuẩn LLO 4.1.1 - 4.1.4
└── README.md                   # Hướng dẫn dự án và báo cáo kết quả
```

---

## 📋 DANH MỤC CHECKLIST MILESTONE 1 (PBL MILESTONE 1)

Dựa trên bảng Checklist Trang 76 Giáo trình Lạc Hồng:

- [x] **Tiêu chí 1: Có file `PLAN.md` mô tả chi tiết các chức năng sẽ làm.**
  - Đã hoàn thiện tài liệu `PLAN.md` với đầy đủ: Đặt vấn đề, 5 User Stories kèm Acceptance Criteria, Sơ đồ User Flow (Mermaid), Sơ đồ Data Flow (Mermaid), Bảng phân vai Scrum, Cấu trúc dữ liệu và Đánh giá kỹ thuật.
- [x] **Tiêu chí 2: Cấu trúc dữ liệu Object đã hoàn thiện và được AI kiểm tra logic.**
  - Đã xây dựng 12 sản phẩm công nghệ trong `js/data.js` có đầy đủ: `id`, `name`, `category`, `price`, `originalPrice`, `discount`, `rating`, `reviewsCount`, `image`, `inStock`, `stockQuantity`, `badges`, `shortDesc`, `specs`.
- [x] **Tiêu chí 3: Phân chia công việc rõ ràng trên GitHub.**
  - Đã phân chia 10 GitHub Issues có nhãn, người phụ trách, độ ưu tiên trong `docs/sprint1-issues.md` và bảng phân công trong `PLAN.md`.
- [x] **Tiêu chí 4: Có ít nhất 01 bản vẽ phác thảo (Wireframe).**
  - Đã xây dựng tài liệu `docs/wireframe.md` phác thảo bố cục Desktop, Mobile, Quick View Modal, Cart Drawer và Checkout Modal.

---

## 🖥️ HƯỚNG DẪN TRẢI NGHIỆM VÀ KIỂM THỬ SẢN PHẨM

### 1. Cách mở trang web
Chỉ cần mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Cốc Cốc) hoặc sử dụng extension **Live Server** trong VS Code.

### 2. Các bước kiểm tra nhanh các tính năng cốt lõi:
1. **Kiểm tra Thử thách Dynamic (Render từ Object):**
   * Mở `index.html`, quan sát thấy thẻ `<div id="product-grid" class="product-grid">` hoàn toàn rỗng.
   * Khi tải trang, 12 sản phẩm lập tức hiển thị kèm nhãn giảm giá, giá khuyến mãi, sao đánh giá và thông số.
2. **Kiểm tra Real-time Live Search:**
   * Gõ chữ `chuột`, `bàn phím`, `tai nghe`, `65w` vào thanh tìm kiếm ở đầu trang.
   * Danh sách cập nhật tức thời theo từng ký tự gõ phím. Bấm dấu `(X)` để xóa nhanh.
3. **Kiểm tra Lọc danh mục & Sắp xếp:**
   * Bấm các nút danh mục: `Chuột & Bàn phím`, `Âm thanh & Tai nghe`, `Cáp sạc & GaN`.
   * Chọn sắp xếp: `Giá: Thấp đến Cao` hoặc `Đánh giá cao nhất`.
4. **Kiểm tra Giỏ hàng & LocalStorage:**
   * Bấm nút "Thêm" trên các card sản phẩm.
   * Quan sát icon Giỏ hàng trên header nhảy số kèm hiệu ứng nảy (bounce animation).
   * Mở giỏ hàng, thử tăng/giảm số lượng, xóa món.
   * Nhập mã giảm giá: `SINHVIEN10` (giảm 10%) hoặc `FREESHIP`.
   * Tải lại trang (F5): Giỏ hàng vẫn được lưu trữ nguyên vẹn bằng `localStorage`.
5. **Kiểm tra Real-time Form Validation (Xác thực thời gian thực):**
   * Trong giỏ hàng, bấm "Tiến hành đặt hàng".
   * Thử gõ vào từng ô:
     - Họ tên: Nhập < 3 ký tự hoặc nhập số -> Báo lỗi đỏ ngay khi gõ.
     - Số điện thoại: Nhập sai 10 số (hoặc đầu số lạ) -> Báo lỗi đỏ. Khi nhập đủ 10 số hợp lệ (ví dụ: `0987654321`) -> Viền chuyển xanh, hiện icon check.
     - MSSV: Nhập MSSV của bạn (ví dụ: `125000155`) -> Chuyển xanh.
   * Nút "Xác nhận đặt hàng" chỉ được kích hoạt (màu xanh lá) khi tất cả các ô đều hợp lệ.
   * Bấm đặt hàng -> Nhận ngay modal Hóa đơn tóm tắt và thông báo Toast chúc mừng.

---

## 👨‍💻 THÀNH VIÊN VÀ PHÂN CÔNG SCRUM

* **Đinh Hữu Phước** (MSSV: 125000155):
  * Đảm nhận vai trò **Product Owner** & **Scrum Master**: Quản lý kế hoạch Sprint 1, viết `PLAN.md`, cấu trúc GitHub Repository.
  * Phối hợp thiết kế module `js/data.js`, `js/ui.js`, `js/app.js` và layout `index.html`.

---
*© 2026 UniTech Campus Store · HỌC PHẦN 111101 THIẾT KẾ WEB · ĐẠI HỌC LẠC HỒNG (LHU)*
