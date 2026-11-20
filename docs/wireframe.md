# TÀI LIỆU BẢN VẼ PHÁC THẢO GIAO DIỆN (WIREFRAME PROTOTYPE)
## DỰ ÁN: UNITECH - CAMPUS STORE (TUẦN 13 · SPRINT 1)

---

## 1. MỤC ĐÍCH THIẾT KẾ WIREFRAME
Wireframe đóng vai trò là "bản thiết kế kỹ thuật" của giao diện người dùng (UI), giúp:
- Xác định bố cục, vị trí các khối thành phần (Header, Hero, Filter, Product Grid, Modals, Footer) trước khi viết CSS chi tiết.
- Tối ưu luồng trải nghiệm người dùng (UX) khi thao tác tìm kiếm, lọc, xem chi tiết và đặt hàng.
- Đảm bảo tính khả thi khi chia nhỏ giao diện thành các thành phần để các thành viên trong nhóm phát triển song song.

---

## 2. BẢN VẼ WIREFRAME BẬC THẤP (LOW-FIDELITY WIREFRAME - DESKTOP)

```text
========================================================================================
[1. HEADER / NAVIGATION BAR] (Sticky Top)
+--------------------------------------------------------------------------------------+
| [Logo UniTech Campus]   [🔍 Tìm kiếm sản phẩm realtime...]    [Trợ giá SV]  [🛒 Giỏ (3)]|
+--------------------------------------------------------------------------------------+

[2. HERO BANNER SECTION]
+--------------------------------------------------------------------------------------+
|                                                                                      |
|   🎓 UNITECH CAMPUS STORE - CÔNG NGHỆ CHO SINH VIÊN ĐẠI HỌC LẠC HỒNG (LHU)           |
|   "Setup góc học tập & Lập trình đỉnh cao - Trợ giá sinh viên đến 35%"              |
|                                                                                      |
|   [ 🚀 Xem ngay các Deal HOT ]       [ 🎟️ Lấy mã voucher SINHVIEN10 ]                |
|                                                                                      |
+--------------------------------------------------------------------------------------+

[3. FILTER & TOOLBAR SECTION]
+--------------------------------------------------------------------------------------+
|  Danh mục: [Tất cả (12)] [Chuột & Bàn phím] [Âm thanh] [Cáp sạc GaN] [Setup bàn học]  |
|                                                                                      |
|  Sắp xếp theo: [ Giá: Thấp đến Cao ▼ ]                 Kết quả: Đang hiện 12 sản phẩm|
+--------------------------------------------------------------------------------------+

[4. DYNAMIC PRODUCT GRID] (Render động 100% bằng JavaScript từ data.js)
+-------------------+  +-------------------+  +-------------------+  +-------------------+
| [Badge: Bán chạy] |  | [Badge: -29%]     |  | [Badge: Học tập]  |  | [Badge: Mới về]   |
| [ Ảnh sản phẩm ]  |  | [ Ảnh sản phẩm ]  |  | [ Ảnh sản phẩm ]  |  | [ Ảnh sản phẩm ]  |
| Chuột Logitech    |  | Bàn phím cơ K500  |  | Tai nghe chống ồn |  | Giá đỡ Laptop 360 |
| ⭐ 4.8 (142 đánh)  |  | ⭐ 4.9 (88 đánh)   |  | ⭐ 4.7 (95 đánh)   |  | ⭐ 4.9 (210 đánh)  |
| 320.000đ  450.000đ|  | 690.000đ  890.000đ|  | 550.000đ  750.000đ|  | 249.000đ  350.000đ|
| [Xem nhanh] [🛒+] |  | [Xem nhanh] [🛒+] |  | [Xem nhanh] [🛒+] |  | [Xem nhanh] [🛒+] |
+-------------------+  +-------------------+  +-------------------+  +-------------------+

[5. FOOTER]
+--------------------------------------------------------------------------------------+
|  UniTech Campus Store · Đồ án Thiết Kế Web (Học phần 111101) - Đại học Lạc Hồng     |
|  Thành viên: Đinh Hữu Phước - MSSV: 125000155                                        |
+--------------------------------------------------------------------------------------+
========================================================================================
```

---

## 3. WIREFRAME GIAO DIỆN DI ĐỘNG (MOBILE LAYOUT - 375PX ~ 430PX)

```text
+-----------------------------------+
| [≡] [UniTech Logo]       [🛒 (3)] |
+-----------------------------------+
| [🔍 Tìm kiếm nhanh sản phẩm...  ] |
+-----------------------------------+
|                                   |
|   HERO: UniTech Campus Store      |
|   Trợ giá sinh viên LHU đến 35%   |
|   [ Mua ngay ]                    |
|                                   |
+-----------------------------------+
| Lọc danh mục: (Cuộn ngang)        |
| [Tất cả] [Chuột/Phím] [Tai nghe] >|
+-----------------------------------+
| Sắp xếp: [Giá tăng dần v]         |
+-----------------------------------+
| +-------------------------------+ |
| | [Ảnh sản phẩm full width]     | |
| | [Bán chạy] [Giảm 29%]         | |
| | Chuột Logitech Pebble Silent  | |
| | ⭐ 4.8 (142 đánh giá)         | |
| | 320.000đ   450.000đ           | |
| | [ Chi tiết ]  [ 🛒 Thêm giỏ ] | |
| +-------------------------------+ |
| +-------------------------------+ |
| | [Ảnh sản phẩm full width]     | |
| | Bàn phím cơ Machenike K500    | |
| | 690.000đ   890.000đ           | |
| | [ Chi tiết ]  [ 🛒 Thêm giỏ ] | |
| +-------------------------------+ |
+-----------------------------------+
|  Footer di động - LHU Web 2026    |
+-----------------------------------+
```

---

## 4. WIREFRAME CÁC MODAL VÀ DRAWER TƯƠNG TÁC (INTERACTIVE OVERLAYS)

### 4.1. Quick View Modal (Chi tiết sản phẩm)
```text
+-------------------------------------------------------------------+
|  CHI TIẾT SẢN PHẨM                                            [X] |
+-------------------------------------------------------------------+
|  [ Ảnh phóng to ]   |  Tên: Chuột Logitech Pebble M350 Silent     |
|  [                ]   |  Danh mục: Chuột & Bàn phím                 |
|  [                ]   |  Đánh giá: ⭐ 4.8/5.0 (142 đánh giá)        |
|  [                ]   |  Giá bán: 320.000đ  (Tiết kiệm 130.000đ)    |
|  ------------------   |  ------------------------------------------ |
|  Trạng thái:          |  Thông số kỹ thuật:                         |
|  ✓ Còn hàng (35 cái)  |  - Kết nối: Bluetooth + USB 2.4GHz          |
|                       |  - Độ phân giải: 1000 DPI                   |
|                       |  - Độ ồn: Silent click 90% (học thư viện)   |
|                       |  - Bảo hành: 12 tháng 1 đổi 1               |
|                       |                                             |
|                       |  Số lượng: [-] [ 1 ] [+]                    |
|                       |  [    🛒 THÊM VÀO GIỎ HÀNG    ]             |
+-------------------------------------------------------------------+
```

### 4.2. Shopping Cart Drawer (Trượt từ bên phải)
```text
                               +------------------------------------+
                               | GIỎ HÀNG CỦA BẠN (2 món)       [X] |
                               +------------------------------------+
                               | [Ảnh] Chuột Logitech Pebble M350   |
                               |       320.000đ                     |
                               |       [-]  1  [+]      [Xóa 🗑️]     |
                               +------------------------------------+
                               | [Ảnh] Giá đỡ Laptop nhôm 360       |
                               |       249.000đ                     |
                               |       [-]  2  [+]      [Xóa 🗑️]     |
                               +------------------------------------+
                               | Mã giảm giá sinh viên:             |
                               | [SINHVIEN10        ] [Áp dụng]     |
                               | ✓ Đã giảm 10% cho sinh viên        |
                               +------------------------------------+
                               | Tạm tính:                 818.000đ |
                               | Giảm giá SV (10%):        -81.800đ |
                               | TỔNG TIỀN:                736.200đ |
                               | [     TIẾN HÀNH ĐẶT HÀNG      ]    |
                               +------------------------------------+
```

### 4.3. Checkout Order Modal với Real-time Validation
```text
+-------------------------------------------------------------------+
|  HOÀN TẤT ĐẶT HÀNG - DÀNH CHO SINH VIÊN                       [X] |
+-------------------------------------------------------------------+
|  Họ và tên sinh viên:                                             |
|  [ Đinh Hữu Phước                                     ]  ✓ Hợp lệ  |
|                                                                   |
|  Số điện thoại (10 chữ số):                                       |
|  [ 0987654321                                         ]  ✓ Hợp lệ  |
|                                                                   |
|  Mã số sinh viên (MSSV):                                          |
|  [ 125000155                                          ]  ✓ Hợp lệ  |
|                                                                   |
|  Địa chỉ nhận hàng (Phòng trọ / Ký túc xá LHU):                   |
|  [ Ký túc xá LHU, Cơ sở 1, Biên Hòa, Đồng Nai         ]  ✓ Hợp lệ  |
|                                                                   |
|  Phương thức thanh toán:                                          |
|  (•) Thanh toán khi nhận hàng (COD)                               |
|  ( ) Quét mã QR chuyển khoản sinh viên (VietQR)                   |
|                                                                   |
|  Ghi chú đơn hàng:                                                |
|  [ Giao giờ nghỉ trưa giúp mình nhé!                            ] |
+-------------------------------------------------------------------+
|  Tổng tiền thanh toán: 736.200 VNĐ                                |
|  [          XÁC NHẬN ĐẶT HÀNG NGAY (ENABLED)           ]           |
+-------------------------------------------------------------------+
```
