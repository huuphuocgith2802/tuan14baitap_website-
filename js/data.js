/**
 * ============================================================================
 * MODULE 1: DATA (js/data.js)
 * Học phần: 111101 - Thiết Kế Web · Đại học Lạc Hồng (LHU)
 * Tuần 13: PBL Milestone 1 - Sprint 1 (Planning & Core UI)
 * Thử thách 3 (Clean Code): Quản lý toàn bộ cấu trúc dữ liệu Object
 * ============================================================================
 */

// 1. Danh mục sản phẩm (Categories)
const CATEGORIES = [
  { id: "all", name: "Tất cả sản phẩm", icon: "bi-grid-fill" },
  { id: "mouse-keyboard", name: "Chuột & Bàn phím", icon: "bi-keyboard" },
  { id: "audio", name: "Âm thanh & Tai nghe", icon: "bi-headphones" },
  { id: "charging", name: "Cáp sạc & GaN", icon: "bi-lightning-charge" },
  { id: "accessories", name: "Setup bàn học & Hub", icon: "bi-laptop" }
];

// 2. Mảng dữ liệu 12 sản phẩm công nghệ sinh viên (Products Data)
const PRODUCTS = [
  {
    id: 1,
    name: "Chuột Không Dây Logitech Pebble M350 Silent",
    category: "mouse-keyboard",
    categoryName: "Chuột & Bàn phím",
    price: 320000,
    originalPrice: 450000,
    discount: 29,
    rating: 4.8,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 35,
    badges: ["Bán chạy", "Silent Click"],
    shortDesc: "Chuột siêu êm chống ồn 90%, kết nối kép Bluetooth & USB receiver. Phù hợp ngồi thư viện.",
    specs: {
      "Kết nối": "Bluetooth Low Energy & USB 2.4GHz",
      "Độ phân giải": "1000 DPI mượt mà",
      "Thời lượng pin": "18 tháng (1 pin AA)",
      "Đặc tính": "Silent click chống ồn khi ngồi thư viện LHU",
      "Bảo hành": "12 tháng 1 đổi 1"
    }
  },
  {
    id: 2,
    name: "Bàn Phím Cơ Không Dây Machenike K500 Pro Hotswap",
    category: "mouse-keyboard",
    categoryName: "Chuột & Bàn phím",
    price: 690000,
    originalPrice: 890000,
    discount: 22,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 20,
    badges: ["Hot Deal", "Đèn RGB"],
    shortDesc: "Bàn phím cơ layout 94 phím tối ưu diện tích, Red Switch gõ êm ái, led RGB 16.8 triệu màu.",
    specs: {
      "Switch": "Custom Red Switch (Linear êm ái)",
      "Kết nối": "Type-C có dây & Bluetooth 5.0 & 2.4G",
      "Keycap": "PBT Doubleshot chống mờ",
      "Tính năng": "Hotswap dễ dàng thay switch tùy thích",
      "Bảo hành": "12 tháng chính hãng"
    }
  },
  {
    id: 3,
    name: "Tai Nghe Chụp Tai Bluetooth Baseus Bowie H1i Hi-Res",
    category: "audio",
    categoryName: "Âm thanh & Tai nghe",
    price: 550000,
    originalPrice: 750000,
    discount: 27,
    rating: 4.7,
    reviewsCount: 95,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 18,
    badges: ["Chống ồn ANC", "Pin 100h"],
    shortDesc: "Tai nghe chống ồn chủ động ANC -38dB, chứng nhận Hi-Res Audio, thời lượng pin 100 giờ.",
    specs: {
      "Chống ồn": "Active Noise Cancelling -38dB",
      "Chuẩn âm thanh": "Hi-Res Audio & LHDC decoding",
      "Thời lượng pin": "100 giờ (tắt ANC) / 70 giờ (bật ANC)",
      "Đệm tai": "Bọt biển nhớ hình êm ái không đau tai",
      "Bảo hành": "12 tháng"
    }
  },
  {
    id: 4,
    name: "Giá Đỡ Laptop Nhôm Xoay 360 Độ Công Thái Học",
    category: "accessories",
    categoryName: "Setup bàn học & Hub",
    price: 249000,
    originalPrice: 350000,
    discount: 29,
    rating: 4.9,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 50,
    badges: ["Bán chạy", "Xoay 360°"],
    shortDesc: "Khung hợp kim nhôm chịu tải 10kg, khớp xoay 360 độ tiện thảo luận nhóm và chống mỏi vai gáy.",
    specs: {
      "Chất liệu": "Hợp kim nhôm dày dặn, đệm silicon chống trầy",
      "Tính năng xoay": "Khớp bi xoay 360 độ mượt mà kèm tiếng click",
      "Tương thích": "Laptop từ 11 đến 17.3 inch và máy tính bảng",
      "Tản nhiệt": "Mặt đáy khoét thoáng khí giúp máy mát hơn",
      "Bảo hành": "Trọn đời lỗi cơ khí"
    }
  },
  {
    id: 5,
    name: "Củ Sạc Nhanh GaN 65W Ugreen Nexode 3 Cổng Type-C",
    category: "charging",
    categoryName: "Cáp sạc & GaN",
    price: 499000,
    originalPrice: 650000,
    discount: 23,
    rating: 4.9,
    reviewsCount: 176,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 40,
    badges: ["Trợ giá SV", "GaN Tech"],
    shortDesc: "Công nghệ Gallium Nitride siêu nhỏ gọn, sạc cùng lúc MacBook, iPhone và iPad tốc độ tối đa.",
    specs: {
      "Công suất": "Tối đa 65W chuẩn Power Delivery 3.0",
      "Cổng ra": "2 cổng Type-C + 1 cổng USB-A",
      "Bảo vệ": "Chống quá nhiệt, quá tải điện thông minh",
      "Kích thước": "Nhỏ hơn 50% so với sạc laptop thông thường",
      "Bảo hành": "18 tháng đổi mới"
    }
  },
  {
    id: 6,
    name: "Hub Chuyển Đổi Type-C 7-in-1 Baseus Metal Gleam 4K",
    category: "accessories",
    categoryName: "Setup bàn học & Hub",
    price: 390000,
    originalPrice: 520000,
    discount: 25,
    rating: 4.8,
    reviewsCount: 114,
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 28,
    badges: ["Chiếu slide 4K", "Nhôm nguyên khối"],
    shortDesc: "Cứu cánh khi thuyết trình đồ án trên giảng đường: Cổng HDMI 4K, 3x USB 3.0, khe SD/TF, sạc PD 100W.",
    specs: {
      "Cổng xuất hình": "HDMI hỗ trợ 4K@30Hz / 1080P@60Hz",
      "Cổng dữ liệu": "3 x USB 3.0 truyền tốc độ 5Gbps",
      "Cổng sạc": "Type-C PD 100W sạc ngược máy tính",
      "Khe thẻ nhớ": "Đọc đồng thời SD và MicroSD",
      "Bảo hành": "12 tháng chính hãng"
    }
  },
  {
    id: 7,
    name: "Đèn LED Treo Màn Hình Bảo Vệ Mắt Baseus i-wok 2",
    category: "accessories",
    categoryName: "Setup bàn học & Hub",
    price: 399000,
    originalPrice: 550000,
    discount: 27,
    rating: 4.8,
    reviewsCount: 79,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 22,
    badges: ["Chống mỏi mắt", "Học đêm"],
    shortDesc: "Chiếu sáng góc học tập bất đối xứng không gây chói màn hình, 3 chế độ nhiệt màu dịu mắt khi code đêm.",
    specs: {
      "Nguồn điện": "Cắm trực tiếp qua cổng USB máy tính 5V/1A",
      "Nhiệt độ màu": "2800K - 4000K - 5500K (Ấm, Tự nhiên, Trắng)",
      "Độ hoàn màu": "CRI Ra95 tái tạo màu chân thực",
      "Điều khiển": "Cảm ứng vô cấp điều chỉnh độ sáng",
      "Bảo hành": "12 tháng"
    }
  },
  {
    id: 8,
    name: "Tai Nghe True Wireless Soundpeats Free2 Classic",
    category: "audio",
    categoryName: "Âm thanh & Tai nghe",
    price: 360000,
    originalPrice: 490000,
    discount: 26,
    rating: 4.6,
    reviewsCount: 130,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 30,
    badges: ["Giá SV", "Mic lọc ồn"],
    shortDesc: "Tai nghe nhét tai nhỏ gọn, pin trâu 30 giờ, chống nước IPX5, đàm thoại mic trong trẻo khi học online.",
    specs: {
      "Kết nối": "Bluetooth 5.1 kết nối nhanh trong 10m",
      "Thời lượng pin": "8 giờ 1 lần sạc + hộp sạc nâng lên 30 giờ",
      "Chống nước": "Chuẩn IPX5 chống mồ hôi và mưa nhẹ",
      "Khối lượng": "Chỉ 4.06g mỗi tai, đeo cực nhẹ",
      "Bảo hành": "12 tháng"
    }
  },
  {
    id: 9,
    name: "Cáp Sạc Nhanh C To C 100W Baseus Bọc Dù Siêu Bền 2M",
    category: "charging",
    categoryName: "Cáp sạc & GaN",
    price: 99000,
    originalPrice: 150000,
    discount: 34,
    rating: 4.9,
    reviewsCount: 340,
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 100,
    badges: ["Bán chạy #1", "Bọc dù"],
    shortDesc: "Hỗ trợ sạc nhanh tối đa 100W (20V/5A) tích hợp chip E-Marker, bọc sợi dù Kevlar chống đứt gãy gập.",
    specs: {
      "Chiều dài": "2.0 mét thoải mái cắm ổ điện xa",
      "Công suất": "Hỗ trợ chuẩn PD 100W, sạc laptop/điện thoại",
      "Tốc độ truyền dữ liệu": "480 Mbps truyền file nhanh",
      "Độ bền": "Thử nghiệm gập bẻ hơn 10.000 lần",
      "Bảo hành": "12 tháng 1 đổi 1"
    }
  },
  {
    id: 10,
    name: "Bàn Di Chuột Da PU Chống Nước Khổ Lớn 80x40cm",
    category: "accessories",
    categoryName: "Setup bàn học & Hub",
    price: 119000,
    originalPrice: 180000,
    discount: 34,
    rating: 4.7,
    reviewsCount: 165,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 45,
    badges: ["Setup góc học", "Chống thấm nước"],
    shortDesc: "Chất liệu da PU 2 mặt cao cấp, chống bám bụi và chống thấm nước, giúp di chuột mượt mà và êm tay khi code.",
    specs: {
      "Kích thước": "80 x 40 cm phủ trọn bàn học",
      "Chất liệu": "Da PU nguyên miếng cao cấp chống trầy",
      "Tính năng": "Chống tràn nước, lau sạch dễ dàng",
      "Màu sắc": "Đen nhám / Xanh Navy sang trọng",
      "Bảo hành": "6 tháng"
    }
  },
  {
    id: 11,
    name: "Balo Laptop Chống Trộm Chống Thấm Nước 15.6 Inch",
    category: "accessories",
    categoryName: "Setup bàn học & Hub",
    price: 299000,
    originalPrice: 420000,
    discount: 29,
    rating: 4.8,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 25,
    badges: ["Trợ giá SV", "Khóa số chống trộm"],
    shortDesc: "Balo nhiều ngăn tiện ích: ngăn laptop chống sốc dày, cổng sạc USB tích hợp bên hông, quai đeo êm ái.",
    specs: {
      "Kích thước": "Đựng vừa laptop 15.6 inch và giáo trình A4",
      "Chất liệu": "Vải Oxford cao cấp kháng nước mưa",
      "Khóa an toàn": "Tích hợp ổ khóa mật mã 3 số",
      "Cổng sạc": "Có cổng ra USB cắm sạc dự phòng",
      "Bảo hành": "12 tháng đường may và dây kéo"
    }
  },
  {
    id: 12,
    name: "Bút Cảm Ứng Đa Năng Cho iPad & Máy Tính Bảng Android",
    category: "accessories",
    categoryName: "Setup bàn học & Hub",
    price: 260000,
    originalPrice: 380000,
    discount: 31,
    rating: 4.7,
    reviewsCount: 84,
    image: "https://images.unsplash.com/photo-1585336261026-6156e792a728?w=600&auto=format&fit=crop&q=80",
    inStock: true,
    stockQuantity: 32,
    badges: ["Ghi chú bài giảng", "Ngòi POM siêu êm"],
    shortDesc: "Cảm ứng chính xác không độ trễ, viết vẽ ghi chép bài giảng trên lớp mượt như bút chì thật, pin dùng 15h.",
    specs: {
      "Ngòi bút": "Đầu ngòi POM 1.5mm chống xước màn hình",
      "Công nghệ": "Chống tì đè tay (Palm Rejection) thông minh",
      "Thời lượng pin": "Dùng liên tục 15 giờ, sạc Type-C nhanh 30 phút",
      "Tương thích": "iPad, Samsung Tab, Xiaomi Pad và điện thoại",
      "Bảo hành": "12 tháng"
    }
  }
];

// 3. Danh sách Voucher khuyến mãi sinh viên (Vouchers)
const VOUCHERS = {
  "SINHVIEN10": {
    code: "SINHVIEN10",
    discountPercent: 10,
    description: "Giảm 10% tổng đơn hàng dành riêng cho sinh viên LHU",
    minOrder: 100000
  },
  "FREESHIP": {
    code: "FREESHIP",
    discountAmount: 25000,
    description: "Miễn phí vận chuyển tận ký túc xá / phòng trọ (Giảm 25.000đ)",
    minOrder: 200000
  },
  "UNITECH50K": {
    code: "UNITECH50K",
    discountAmount: 50000,
    description: "Giảm trực tiếp 50.000đ cho đơn hàng từ 500.000đ",
    minOrder: 500000
  }
};

// 4. Cấu hình hệ thống (System Config)
const APP_CONFIG = {
  storeName: "UniTech - Campus Store",
  schoolName: "Trường Đại học Lạc Hồng (LHU)",
  courseCode: "111101 · Thiết Kế Web",
  shippingFee: 25000,
  freeShippingThreshold: 600000,
  currency: "VNĐ"
};

// Xuất các biến ra window để dùng toàn cục trong trình duyệt
if (typeof window !== "undefined") {
  window.CATEGORIES = CATEGORIES;
  window.PRODUCTS = PRODUCTS;
  window.VOUCHERS = VOUCHERS;
  window.APP_CONFIG = APP_CONFIG;
}
