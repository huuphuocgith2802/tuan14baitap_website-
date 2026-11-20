# NHẬT KÝ ĐỐI THOẠI VIBE CODING & AI REFACTORING (`prompt_log.md`)
## DỰ ÁN: UNITECH CAMPUS STORE · HỌC PHẦN 111101: THIẾT KẾ WEB
### TRƯỜNG ĐẠI HỌC LẠC HỒNG (LHU) · KHOA CÔNG NGHỆ THÔNG TIN
**Sinh viên thực hiện:** Đinh Hữu Phước — **MSSV:** 125000155  
**Giai đoạn:** Tuần 14 · Sprint 2: Logic Thông Minh & Kiểm Thử (Final Push)  
**Tiêu chí Mentor:** Đánh giá tính linh hoạt trong kỹ năng Prompting — Cách sinh viên mô tả bug cụ thể để AI đề xuất giải pháp tối ưu từng phần (không sao chép mù quáng hay yêu cầu viết lại toàn bộ).

---

## 🧭 MỤC LỤC 7 CHẶNG ĐỐI THOẠI KỸ THUẬT VỚI AI

- [Chặng 1: Nâng cấp dữ liệu JSON độc lập & Giải quyết lỗi CORS khi chạy `file:///`](#chặng-1-nâng-cấp-dữ-liệu-json-độc-lập--giải-quyết-lỗi-cors-khi-chạy-file)
- [Chặng 2: Khắc phục lag khi gõ phím nhanh với thuật toán Debounce 250ms](#chặng-2-khắc-phục-lag-khi-gõ-phím-nhanh-với-thuật-toán-debounce-250ms)
- [Chặng 3: Xây dựng Bộ lọc đa tiêu chí kết hợp (Combined Multi-Filter) & Empty State](#chặng-3-xây-dựng-bộ-lọc-đa-tiêu-chí-kết-hợp-combined-multi-filter--empty-state)
- [Chặng 4: Tinh chỉnh biểu thức chính quy (Regex) Form Validation chuẩn sinh viên LHU](#chặng-4-tinh-chỉnh-biểu-thức-chính-quy-regex-form-validation-chuẩn-sinh-viên-lhu)
- [Chặng 5: Triển khai Dark / Light Mode sang trọng bằng CSS Semantic Variables](#chặng-5-triển-khai-dark--light-mode-sang-trọng-bằng-css-semantic-variables)
- [Chặng 6: Đồng bộ hóa giỏ hàng, Wishlist và Lịch sử đơn hàng vào LocalStorage](#chặng-6-đồng-bộ-hóa-giỏ-hàng-wishlist-và-lịch-sử-đơn-hàng-vào-localstorage)
- [Chặng 7: Rà soát Zero Console Error, Audit Responsive Mobile & Đóng gói DoD](#chặng-7-rà-soát-zero-console-error-audit-responsive-mobile--đóng-gói-dod)

---

## CHẶNG 1: NÂNG CẤP DỮ LIỆU JSON ĐỘC LẬP & GIẢI QUYẾT LỖI CORS KHI CHẠY `FILE:///`

### 1. Bối cảnh & Vấn đề thực tế (Problem Description)
Ở Sprint 1 (Tuần 13), danh sách 12 sản phẩm được lưu trực tiếp dưới dạng biến toàn cục trong file `js/data.js`. Giảng viên yêu cầu ở Sprint 2 phải chuẩn hóa dữ liệu thành file `data/products.json` độc lập để mô phỏng API thực tế. Tuy nhiên, khi dùng hàm `fetch('data/products.json')` trên trình duyệt mở bằng đường dẫn cục bộ (`file:///c:/Users/.../index.html`), trình duyệt lập tức ném lỗi bảo mật:  
`Access to fetch at 'data/products.json' from origin 'null' has been blocked by CORS policy`.

### 2. Prompt sinh viên gửi AI (Targeted Bug Description)
> *"Chào AI, mình đang phát triển dự án UniTech Campus Store bằng JavaScript thuần. Khi chuyển dữ liệu sang file `data/products.json` và dùng `fetch('data/products.json')`, code chạy tốt trên Live Server (`http://localhost:5500`), nhưng nếu thầy cô hoặc bạn cùng lớp nhấp đúp trực tiếp vào file `index.html` từ ổ đĩa (`file:///`) thì bị lỗi CORS: 'URL scheme "file" is only supported for protocol schemes: http, https...'.*  
> *Bạn đừng viết lại toàn bộ code của mình. Hãy giúp mình thiết kế một module nạp dữ liệu thông minh `DataLoader` có khả năng kiểm tra giao thức mạng hiện tại (`window.location.protocol`), nếu chạy qua HTTP/HTTPS thì nạp file JSON, còn nếu chạy qua `file://` thì tự động dùng mảng Object fallback trong `data.js` để website không bao giờ bị trắng trang!"*

### 3. Phân tích nguyên nhân & Giải pháp AI đưa ra (Root Cause & AI Solution)
* **Nguyên nhân:** Chính sách bảo mật Same-Origin Policy của trình duyệt chặn truy xuất tệp cục bộ không đồng nhất qua XMLHttpRequest / Fetch API khi origin là `null`.
* **Giải pháp:** Xây dựng `DataLoader.fetchProducts()` theo mô hình **Graceful Degradation**:
  ```javascript
  const DataLoader = {
    async fetchProducts() {
      if (window.location.protocol === "http:" || window.location.protocol === "https:") {
        try {
          const res = await fetch(APP_CONFIG.jsonPath);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          return data.products || PRODUCTS;
        } catch (err) {
          console.warn("[DataLoader] Fetch JSON lỗi, dùng Fallback:", err);
          return PRODUCTS;
        }
      }
      // Khi chạy trực tiếp file://
      console.log("[DataLoader] Chế độ file local, nạp PRODUCTS fallback");
      return PRODUCTS;
    }
  };
  ```

### 4. Đúc kết kinh nghiệm kỹ thuật (Key Learning)
* Biết cách xử lý lỗi bất đồng bộ mà không phá vỡ tính tương thích khi giáo viên chấm bài offline.

---

## CHẶNG 2: KHẮC PHỤC LAG KHI GÕ PHÍM NHANH VỚI THUẬT TOÁN DEBOUNCE 250MS

### 1. Bối cảnh & Vấn đề thực tế (Problem Description)
Ở chức năng tìm kiếm thời gian thực (Real-time Live Search), mỗi khi người dùng nhấn 1 phím, sự kiện `input` kích hoạt hàm lọc và render lại toàn bộ lưới DOM. Khi người dùng gõ chuỗi `"bàn phím cơ không dây"` với tốc độ gõ nhanh (fast typing), sự kiện được kích hoạt 21 lần liên tục, làm CPU trình duyệt tăng vọt và giao diện giật cục (dropped frames).

### 2. Prompt sinh viên gửi AI (Targeted Bug Description)
> *"Chào AI, thanh tìm kiếm sản phẩm trong `js/app.js` của mình hiện đang lắng nghe sự kiện `input` như sau:*
> ```javascript
> searchInput.addEventListener('input', (e) => {
>   this.state.searchQuery = e.target.value.trim().toLowerCase();
>   this.applyFiltersAndRender();
> });
> ```
> *Vấn đề là khi mình gõ nhanh một từ dài, hàm `applyFiltersAndRender()` bị gọi liên tục 15-20 lần khiến máy tính bảng và điện thoại bị giật lag rõ rệt. Hãy viết giúp mình một hàm tiện ích `debounce(func, wait)` chuẩn ES6 gắn vào object `App`, và chỉ dẫn cách bọc hàm tìm kiếm với độ trễ 250ms để nó chỉ render khi người dùng dừng tay gõ phím!"*

### 3. Phân tích nguyên nhân & Giải pháp AI đưa ra (Root Cause & AI Solution)
* **Nguyên nhân:** Thao tác đọc/ghi DOM (`innerHTML`) là tác vụ tốn kém (expensive operation). Việc gọi hàm render dồn dập khiến trình duyệt phải liên tục tính toán lại Layout và Repaint.
* **Giải pháp:** Triển khai cơ chế đóng gói (Closure) lưu giữ `timer`, tự động hủy `clearTimeout` nếu có phím mới được gõ trong khoảng thời gian chờ:
  ```javascript
  debounce(func, wait = 250) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  ```
* **Kết quả:** Số lần render giảm từ 21 lần xuống còn đúng 1 lần khi dừng gõ, trải nghiệm lướt web đạt chuẩn 60fps mượt mà!

---

## CHẶNG 3: XÂY DỰNG BỘ LỌC ĐA TIÊU CHÍ KẾT HỢP (COMBINED MULTI-FILTER) & EMPTY STATE

### 1. Bối cảnh & Vấn đề thực tế (Problem Description)
Người dùng mong muốn có thể vừa chọn danh mục *"Chuột & Bàn phím"*, vừa chọn mức giá *"Dưới 300k"*, vừa bật nhãn *"Trợ giá LHU"*, và sắp xếp theo *"Giá: Thấp đến Cao"*. Ở phiên bản cũ, việc bấm danh mục sẽ làm ghi đè và làm mất các điều kiện lọc khác.

### 2. Prompt sinh viên gửi AI (Targeted Bug Description)
> *"Chào AI, mình muốn nâng cấp hàm `applyFiltersAndRender()` trong `js/app.js`. Hiện tại state của mình mới chỉ có `currentCategory`. Mình đã bổ sung vào `App.state`:*
> * `currentPriceRange`: 'all' | 'under-300' | '300-700' | 'above-700'*
> * `currentBadge`: 'all' | 'lhu-support' | 'flash-sale' | 'best-seller'*
> * `searchQuery`: string*
> * `sortBy`: string*
> *Hãy giúp mình viết đoạn logic lọc lồng nhau (Pipelining / Method chaining) trên mảng kết quả, sau đó hiển thị các chip bộ lọc đang bật (Active Filter Chips) có nút xóa nhanh [x] từng điều kiện. Nếu không có sản phẩm nào thỏa mãn, hãy hiển thị giao diện Empty State gợi ý từ khóa hot!"*

### 3. Phân tích nguyên nhân & Giải pháp AI đưa ra (Root Cause & AI Solution)
* **Giải pháp:** Áp dụng mô hình xử lý đường ống (Data Pipeline):
  1. Khởi tạo mảng sao chép: `let result = [...this.state.products];`
  2. Lọc danh mục: `if (currentCategory !== 'all') result = result.filter(...)`
  3. Lọc khoảng giá: `switch (currentPriceRange) { case 'under-300': ... }`
  4. Lọc ưu đãi: `if (currentBadge !== 'all') result = result.filter(...)`
  5. Lọc từ khóa: Tìm kiếm đa trường (tên, danh mục, mô tả ngắn, bảng specs).
  6. Sắp xếp: `switch (sortBy) { case 'price-asc': ... }`
  7. Gọi `UI.renderActiveFilterChips()` hiển thị trạng thái tương tác trực quan.

---

## CHẶNG 4: TINH CHỈNH BIỂU THỨC CHÍNH QUY (REGEX) FORM VALIDATION CHUẨN SINH VIÊN LHU

### 1. Bối cảnh & Vấn đề thực tế (Problem Description)
Form đặt hàng trợ giá yêu cầu kiểm tra dữ liệu nghiêm ngặt để tránh sinh viên nhập bừa:
* Mã số sinh viên (MSSV) của Đại học Lạc Hồng thường có độ dài từ 6 đến 12 ký tự số (ví dụ: `125000155`).
* Số điện thoại phải đúng 10 chữ số của các nhà mạng Việt Nam (đầu số 03, 05, 07, 08, 09).
* Họ và tên phải hỗ trợ đầy đủ bảng mã tiếng Việt có dấu Unicode (ví dụ: `Đinh Hữu Phước`).
* Email sinh viên phải có định dạng chuẩn RFC 5322 (`mssv@lachong.edu.vn`).

### 2. Prompt sinh viên gửi AI (Targeted Bug Description)
> *"Chào AI, hàm validation của mình gặp lỗi khi người dùng nhập tên tiếng Việt có dấu như 'Đinh Hữu Phước' thì bị regex `^[a-zA-Z ]+$` báo đỏ sai. Ngoài ra, mình muốn kiểm tra MSSV LHU (chỉ gồm số, từ 6 đến 12 ký tự) và số điện thoại di động Việt Nam 10 chữ số chuẩn. Hãy viết cho mình bộ Regex chính xác nhất, kèm theo logic bật/tắt nút Submit form: Nút bấm chỉ được kích hoạt (disabled = false và thêm class 'btn-ready') khi toàn bộ 6 trường đều hợp lệ!"*

### 3. Phân tích nguyên nhân & Giải pháp AI đưa ra (Root Cause & AI Solution)
* **Bộ Regex tối ưu được AI tinh chỉnh:**
  * **Họ tên tiếng Việt:** `/^[a-zA-ZÀ-ỹ\s]+$/` (Hỗ trợ toàn bộ ký tự Latinh mở rộng có dấu tiếng Việt).
  * **MSSV LHU:** `/^[0-9]{6,12}$/` (Chặn ký tự chữ hoặc dấu cách).
  * **SĐT Việt Nam:** `/^(0[3|5|7|8|9])[0-9]{8}$/` (Bắt buộc 10 số, bắt đầu bằng 03, 05, 07, 08, 09).
  * **Email:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
* **Phản hồi thời gian thực (Real-time Feedback):**
  * Tự động thêm class `.is-valid` (viền xanh + icon tích xanh) hoặc `.has-error` (viền đỏ + thông báo lỗi cụ thể bên dưới input).

---

## CHẶNG 5: TRIỂN KHAI DARK / LIGHT MODE SANG TRỌNG BẰNG CSS SEMANTIC VARIABLES

### 1. Bối cảnh & Vấn đề thực tế (Problem Description)
Sinh viên thường thức đêm làm đồ án và học bài, do đó giao diện nền trắng dễ gây mỏi mắt. Cần có chế độ Dark Mode chuyển đổi êm dịu, không giật màn hình và ghi nhớ trạng thái vào `localStorage`.

### 2. Prompt sinh viên gửi AI (Targeted Bug Description)
> *"Chào AI, mình muốn thêm nút đổi giao diện Sáng / Tối vào thanh header. Trong file `css/style.css` mình đã có `:root` chứa các biến màu như `--primary`, `--surface`, `--bg-main`, `--text-main`. Hãy chỉ mình cách viết selector `[data-theme='dark']` với bảng màu chuẩn Navy/Slate hiện đại (nền `#0b1120`, thẻ `#131d33`, viền `#243456`), và viết hàm JS `toggleTheme()` tự động lưu vào `localStorage.getItem('unitech_theme')` để khi người dùng nhấn F5 không bị mất chế độ!"*

### 3. Giải pháp AI & Kết quả thực tế
* Khởi tạo thuộc tính `data-theme="light"` trên thẻ `<html>`.
* Viết CSS transition mượt mà cho màu nền và màu chữ (`transition: background-color 0.3s ease, color 0.3s ease`).
* Khi bấm nút, icon mặt trăng `bi-moon-stars-fill` tự động đổi thành icon mặt trời `bi-sun-fill text-warning`.

---

## CHẶNG 6: ĐỒNG BỘ HÓA GIỎ HÀNG, WISHLIST VÀ LỊCH SỬ ĐƠN HÀNG VÀO LOCALSTORAGE

### 1. Bối cảnh & Vấn đề thực tế (Problem Description)
Người dùng khi tắt tab hoặc tải lại trang thường bị mất dữ liệu giỏ hàng, danh sách sản phẩm yêu thích (Wishlist) và các đơn hàng đã đặt.

### 2. Prompt sinh viên gửi AI (Targeted Bug Description)
> *"Chào AI, hãy giúp mình hoàn thiện 3 luồng lưu trữ `localStorage` trong `js/app.js`:*
> * 1. `unitech_cart`: Lưu mảng các sản phẩm trong giỏ hàng.*
> * 2. `unitech_wishlist`: Lưu mảng các ID sản phẩm được thả tim.*
> * 3. `unitech_orders`: Khi submit đơn hàng thành công, lưu lại toàn bộ object `orderData` kèm mã vận đơn `LHU-ORDER-xxxxxx` và thời gian đặt hàng.*
> *Yêu cầu phải có `try...catch` an toàn để phòng trường hợp người dùng bật chế độ ẩn danh (Incognito) hoặc bộ nhớ trình duyệt bị đầy!"*

### 3. Giải pháp AI & Kết quả thực tế
* Bọc toàn bộ các thao tác `JSON.parse()` và `JSON.stringify()` trong khối `try...catch`.
* Khi tải trang, hàm `init()` tự động phục hồi toàn bộ badge giỏ hàng và danh sách yêu thích mà không phát sinh bất kỳ lỗi Console nào.

---

## CHẶNG 7: RÀ SOÁT ZERO CONSOLE ERROR, AUDIT RESPONSIVE MOBILE & ĐÓNG GÓI DOD

### 1. Bối cảnh & Vấn đề thực tế (Problem Description)
Tiêu chuẩn Definition of Done (DoD) của Sprint 2 yêu cầu: **Zero Console Error** trên trình duyệt và hiển thị hoàn hảo trên các màn hình di động nhỏ (375px).

### 2. Prompt sinh viên gửi AI (Targeted Bug Description)
> *"Chào AI, hãy cùng mình làm bước Final Push kiểm thử chất lượng: Hãy rà soát lại toàn bộ 3 file `data.js`, `ui.js`, `app.js` và `index.html` để đảm bảo:*
> * 1. Không có biến nào bị `undefined` khi người dùng bấm vào các nút khi chưa có dữ liệu.*
> * 2. Mọi thẻ `<img>` đều có thuộc tính `onerror` dự phòng ảnh mẫu phòng khi mất mạng.*
> * 3. Bổ sung modal trực quan 'Agile & DoD Inspector' để giảng viên có thể click vào xem ngay kết quả đánh giá 4 tiêu chí DoD, biên bản Stand-up và tóm tắt Git Flow ngay trên giao diện web!"*

### 3. Kết quả nghiệm thu (Final Acceptance)
* Console log sạch 100%, không có bất kỳ dòng chữ đỏ nào.
* Kiểm thử trên Chrome DevTools với kích thước 375px (iPhone SE), 414px (iPhone 11) và 768px (iPad): Bố cục co giãn linh hoạt, không bị vỡ chữ hay tràn ngang màn hình.
* Đạt 100% tiêu chí "Vibe Code" khắt khe của học phần Thiết kế Web LHU!
