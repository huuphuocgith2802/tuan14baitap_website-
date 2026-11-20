# DANH SÁCH NHIỆM VỤ SPRINT 2 (FINAL PUSH & KIỂM THỬ)
## HỌC PHẦN 111101 · THIẾT KẾ WEB · ĐẠI HỌC LẠC HỒNG (LHU)
**Sprint:** Sprint 2 (Tuần 14) — Chuẩn bị Hackathon Demo (Tuần 15)  
**Mục tiêu PBL:** Hoàn thiện giải pháp kỹ thuật, logic thông minh, tối ưu hiệu năng và kiểm thử toàn diện.

---

## 📋 BẢNG THEO DÕI CÔNG VIỆC SPRINT 2 (TASK BOARD)

| Mã Task | Phân loại | Tên công việc & Nội dung thực hiện | Người phụ trách | Trạng thái | Tiêu chuẩn nghiệm thu (DoD) |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **SP2-01** | `Agile/Docs` | Khởi tạo tài liệu Sprint 2, biên bản Daily Stand-up và tiêu chuẩn Definition of Done (DoD). | Đinh Hữu Phước | ✅ HOÀN THÀNH | Đầy đủ 3 câu hỏi Stand-up và 4 tiêu chí DoD. |
| **SP2-02** | `Data/JSON` | Xây dựng file dữ liệu JSON độc lập (`data/products.json`) mở rộng lên 16+ thiết bị công nghệ sinh viên. | Logic Dev | ✅ HOÀN THÀNH | Dữ liệu đúng chuẩn JSON, có đầy đủ specs, rating, badges, trợ giá LHU. |
| **SP2-03** | `Logic/Loader` | Xây dựng cơ chế tải dữ liệu Async kết hợp fallback an toàn (chạy cả `file://` lẫn `http://`). | Lead Dev | ✅ HOÀN THÀNH | Không bị lỗi CORS khi mở trực tiếp file HTML. |
| **SP2-04** | `Logic/Search` | Tích hợp thuật toán **Debounce** (250ms) cho thanh tìm kiếm Real-time Live Search. | Logic Dev | ✅ HOÀN THÀNH | Giảm tần suất render DOM, tìm mượt mà không lag khi gõ nhanh. |
| **SP2-05** | `Logic/Filter` | Nâng cấp bộ lọc đa tiêu chí (Combined Filter): Danh mục + Khoảng giá + Badge + Sắp xếp giá/đánh giá. | Logic Dev | ✅ HOÀN THÀNH | Lọc kết hợp chính xác, hiển thị chip lọc đang kích hoạt và nút xóa nhanh. |
| **SP2-06** | `Logic/Validation` | Hoàn thiện Form Validation thời gian thực với biểu thức chính quy (Regex) MSSV LHU, SĐT, Email, Địa chỉ. | Logic Dev | ✅ HOÀN THÀNH | Phản hồi ngay khi gõ: icon xanh khi đúng, thông báo lỗi đỏ khi sai. |
| **SP2-07** | `Logic/Checkout` | Xử lý quy trình đặt hàng: Tạo mã vận đơn điện tử LHU, lưu đơn hàng vào LocalStorage, hiển thị Modal hóa đơn. | Logic Dev | ✅ HOÀN THÀNH | Hóa đơn hiển thị đầy đủ chi tiết, tự động dọn giỏ hàng sau khi đặt. |
| **SP2-08** | `UI/Dark-Mode` | Tích hợp chế độ Dark / Light Mode sang trọng với chuyển đổi mượt mà, lưu tùy chọn vào LocalStorage. | Frontend Dev | ✅ HOÀN THÀNH | Đổi theme tức thì, đồng bộ biến màu CSS semantic, ghi nhớ khi tải lại trang. |
| **SP2-09** | `UI/Wishlist` | Xây dựng tính năng Danh sách sản phẩm yêu thích (Wishlist) với nút thả tim và drawer xem nhanh. | Frontend Dev | ✅ HOÀN THÀNH | Bấm tim đổi trạng thái, cập nhật số lượng badge và lưu LocalStorage. |
| **SP2-10** | `UI/Quick-View` | Hoàn thiện Modal Quick View thông số kỹ thuật, đánh giá sinh viên, chọn số lượng sản phẩm. | Frontend Dev | ✅ HOÀN THÀNH | Modal mở mượt mà, hiển thị bảng Specs kỹ thuật chi tiết. |
| **SP2-11** | `UI/Inspector` | Bổ sung hộp thoại Demo "Agile & DoD Inspector" ngay trên giao diện web cho giảng viên kiểm tra nhanh. | Lead Dev | ✅ HOÀN THÀNH | Bấm nút trên thanh điều hướng để mở bảng tự đánh giá trực quan. |
| **SP2-12** | `QA/Console` | Kiểm thử F12 DevTools toàn diện trên mọi thao tác, loại bỏ 100% lỗi đỏ và cảnh báo Console. | QA / Tester | ✅ HOÀN THÀNH | Console log sạch sẽ, có thông báo trạng thái app thân thiện. |
| **SP2-13** | `QA/Mobile` | Tinh chỉnh hiển thị trên thiết bị di động (Responsive Breakpoints 375px, 414px, 768px, 1200px). | QA / Tester | ✅ HOÀN THÀNH | Không có thanh cuộn ngang, nút bấm to rõ, dễ thao tác ngón cái. |
| **SP2-14** | `Docs/Prompting` | Lập nhật ký `prompt_log.md` ghi lại hành trình trao đổi và giải quyết lỗi thực tế cùng AI. | Đinh Hữu Phước | ✅ HOÀN THÀNH | Thể hiện đúng tiêu chí "Vibe Code": Mô tả bug cụ thể, AI gợi ý giải pháp. |
| **SP2-15** | `Docs/Pitching` | Soạn thảo kịch bản thuyết trình Pitching 2 phút cho buổi Demo Hackathon (Tuần 15). | Đinh Hữu Phước | ✅ HOÀN THÀNH | Cấu trúc chuẩn: Problem -> Solution -> Demo -> Traction -> Future. |
| **SP2-16** | `Release/Deploy` | Đóng gói mã nguồn, hoàn thiện `README.md` chuyên nghiệp và đẩy lên GitHub Pages chạy Live. | Scrum Master | ✅ HOÀN THÀNH | Repo GitHub đầy đủ commits, GitHub Pages hoạt động 100%. |
