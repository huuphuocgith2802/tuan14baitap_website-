/**
 * ============================================================================
 * MODULE 3: APP CONTROLLER (js/app.js)
 * Học phần: 111101 - Thiết Kế Web · Đại học Lạc Hồng (LHU)
 * Tuần 13: PBL Milestone 1 - Sprint 1 (Planning & Core UI)
 * Thử thách 2 (Real-time UX) & Thử thách 3 (Clean Code):
 * Điều phối toàn bộ sự kiện, tìm kiếm realtime, quản lý giỏ hàng và validation
 * ============================================================================
 */

const App = {
  // Trạng thái ứng dụng (Application State)
  state: {
    products: [],
    filteredProducts: [],
    cart: [],
    currentCategory: "all",
    searchQuery: "",
    sortBy: "default",
    appliedVoucher: null,
    activeQuickViewId: null
  },

  /**
   * Khởi chạy ứng dụng khi DOM sẵn sàng
   */
  init() {
    console.log("🚀 [UniTech App] Khởi động ứng dụng Sprint 1 (Agile/Scrum)...");

    // 1. Tải dữ liệu ban đầu từ data.js
    this.state.products = [...(window.PRODUCTS || [])];
    this.state.filteredProducts = [...this.state.products];

    // 2. Khôi phục giỏ hàng từ LocalStorage
    this.loadCartFromStorage();

    // 3. Khởi tạo DOM & Bộ lắng nghe sự kiện
    this.setupEventListeners();

    // 4. Render lần đầu tiên (Dynamic Render Challenge)
    this.applyFiltersAndRender();
    UI.updateCartBadge(this.state.cart);
    UI.renderCartDrawer(this.state.cart, this.state.appliedVoucher);

    console.log("✅ [UniTech App] Sẵn sàng phục vụ sinh viên!");
  },

  /**
   * Thiết lập tất cả các Event Listeners trên trang
   */
  setupEventListeners() {
    // 1. THỬ THÁCH 2: TÌM KIẾM THỜI GIAN THỰC (REAL-TIME SEARCH)
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("btn-clear-search");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.state.searchQuery = e.target.value.trim().toLowerCase();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = this.state.searchQuery ? "block" : "none";
        }
        this.applyFiltersAndRender();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
        this.state.searchQuery = "";
        clearSearchBtn.style.display = "none";
        this.applyFiltersAndRender();
      });
    }

    // 2. Lọc theo tab danh mục
    const categoryTabsContainer = document.getElementById("category-tabs-container");
    if (categoryTabsContainer) {
      categoryTabsContainer.addEventListener("click", (e) => {
        const targetBtn = e.target.closest(".cat-tab-btn");
        if (!targetBtn) return;

        // Bỏ active cũ, gán active mới
        categoryTabsContainer.querySelectorAll(".cat-tab-btn").forEach((btn) => btn.classList.remove("active"));
        targetBtn.classList.add("active");

        this.state.currentCategory = targetBtn.dataset.category || "all";
        this.applyFiltersAndRender();
      });
    }

    // 3. Sắp xếp sản phẩm (Sort Dropdown)
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // 4. Mở/đóng Cart Drawer
    const btnOpenCart = document.getElementById("btn-open-cart");
    const btnCloseCart = document.getElementById("btn-close-cart");
    const cartOverlay = document.getElementById("cart-drawer-overlay");

    if (btnOpenCart) btnOpenCart.addEventListener("click", () => UI.openCartDrawer());
    if (btnCloseCart) btnCloseCart.addEventListener("click", () => UI.closeCartDrawer());
    if (cartOverlay) cartOverlay.addEventListener("click", () => UI.closeCartDrawer());

    // 5. Đóng Modal Quick View
    const btnCloseModal = document.getElementById("btn-close-modal");
    const modalBackdrop = document.getElementById("product-detail-modal");
    if (btnCloseModal) btnCloseModal.addEventListener("click", () => UI.closeProductModal());
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) UI.closeProductModal();
      });
    }

    // 6. Áp dụng mã Voucher trong Cart Drawer
    const btnApplyVoucher = document.getElementById("btn-apply-voucher");
    const voucherInput = document.getElementById("voucher-input");
    if (btnApplyVoucher && voucherInput) {
      btnApplyVoucher.addEventListener("click", () => {
        this.handleApplyVoucher(voucherInput.value.trim().toUpperCase());
      });
      voucherInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.handleApplyVoucher(voucherInput.value.trim().toUpperCase());
        }
      });
    }

    // 7. Mở Modal Checkout từ Giỏ hàng
    const btnProceedCheckout = document.getElementById("btn-proceed-checkout");
    if (btnProceedCheckout) {
      btnProceedCheckout.addEventListener("click", () => {
        if (this.state.cart.length === 0) {
          UI.showToast("Giỏ hàng trống", "Vui lòng chọn ít nhất 1 sản phẩm trước khi thanh toán!", "warning");
          return;
        }
        UI.openCheckoutModal(this.state.cart, this.state.appliedVoucher);
        this.setupCheckoutValidation();
      });
    }

    // 8. Đóng Checkout Modal
    const btnCloseCheckout = document.getElementById("btn-close-checkout");
    const checkoutModal = document.getElementById("checkout-modal");
    if (btnCloseCheckout) btnCloseCheckout.addEventListener("click", () => UI.closeCheckoutModal());
    if (checkoutModal) {
      checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) UI.closeCheckoutModal();
      });
    }

    // 9. Phím tắt Escape để đóng mọi modal đang mở
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        UI.closeProductModal();
        UI.closeCartDrawer();
        UI.closeCheckoutModal();
        UI.closeOrderSuccessModal();
      }
    });
  },

  /**
   * Lọc và Sắp xếp danh sách sản phẩm, sau đó kích hoạt Render
   */
  applyFiltersAndRender() {
    let result = [...this.state.products];

    // 1. Lọc theo Danh mục
    if (this.state.currentCategory !== "all") {
      result = result.filter((p) => p.category === this.state.currentCategory);
    }

    // 2. Lọc theo Từ khóa Search (Real-time)
    if (this.state.searchQuery) {
      const q = this.state.searchQuery;
      result = result.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inCategory = p.categoryName.toLowerCase().includes(q);
        const inDesc = p.shortDesc.toLowerCase().includes(q);
        const inSpecs = Object.values(p.specs || {}).some((val) =>
          val.toLowerCase().includes(q)
        );
        return inName || inCategory || inDesc || inSpecs;
      });
    }

    // 3. Sắp xếp theo Dropdown
    switch (this.state.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "discount-desc":
        result.sort((a, b) => b.discount - a.discount);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        break;
      default:
        // Mặc định: Giữ nguyên thứ tự ID
        result.sort((a, b) => a.id - b.id);
        break;
    }

    this.state.filteredProducts = result;

    // 4. Render ra màn hình
    const gridContainer = document.getElementById("product-grid");
    UI.renderProducts(result, gridContainer);
    UI.updateProductCount(result.length, this.state.products.length);
  },

  /**
   * Đặt lại bộ lọc (Reset)
   */
  resetFilters() {
    this.state.currentCategory = "all";
    this.state.searchQuery = "";
    this.state.sortBy = "default";

    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("btn-clear-search");
    const sortSelect = document.getElementById("sort-select");
    const categoryTabsContainer = document.getElementById("category-tabs-container");

    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.style.display = "none";
    if (sortSelect) sortSelect.value = "default";

    if (categoryTabsContainer) {
      categoryTabsContainer.querySelectorAll(".cat-tab-btn").forEach((btn) => {
        if (btn.dataset.category === "all") btn.classList.add("active");
        else btn.classList.remove("active");
      });
    }

    this.applyFiltersAndRender();
    UI.showToast("Đã đặt lại", "Đã hiển thị lại toàn bộ sản phẩm công nghệ!", "info");
  },

  /**
   * Xem nhanh sản phẩm (Quick View Modal)
   * @param {number} productId
   */
  handleQuickView(productId) {
    const product = this.state.products.find((p) => p.id === productId);
    if (!product) return;

    this.state.activeQuickViewId = productId;
    UI.openProductModal(product);
  },

  /**
   * Tăng giảm số lượng trong Modal Quick View
   * @param {number} delta
   */
  adjustModalQty(delta) {
    const qtyInput = document.getElementById("modal-input-qty");
    if (!qtyInput) return;

    let currentVal = parseInt(qtyInput.value, 10) || 1;
    const minVal = parseInt(qtyInput.min, 10) || 1;
    const maxVal = parseInt(qtyInput.max, 10) || 99;

    let nextVal = currentVal + delta;
    if (nextVal < minVal) nextVal = minVal;
    if (nextVal > maxVal) nextVal = maxVal;

    qtyInput.value = nextVal;
  },

  /**
   * Thêm sản phẩm từ Modal Quick View vào giỏ hàng
   * @param {number} productId
   */
  addFromModalToCart(productId) {
    const qtyInput = document.getElementById("modal-input-qty");
    const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
    this.addToCart(productId, qty);
    UI.closeProductModal();
  },

  /**
   * THÊM SẢN PHẨM VÀO GIỎ HÀNG
   * @param {number} productId
   * @param {number} quantity
   */
  addToCart(productId, quantity = 1) {
    const product = this.state.products.find((p) => p.id === productId);
    if (!product) return;

    if (!product.inStock) {
      UI.showToast("Hết hàng", "Sản phẩm này tạm thời hết hàng, vui lòng quay lại sau!", "warning");
      return;
    }

    const existingIndex = this.state.cart.findIndex((item) => item.id === productId);

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity += quantity;
    } else {
      this.state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryName: product.categoryName,
        quantity: quantity
      });
    }

    this.saveCartToStorage();
    UI.updateCartBadge(this.state.cart);
    UI.renderCartDrawer(this.state.cart, this.state.appliedVoucher);

    UI.showToast(
      "Đã thêm vào giỏ!",
      `Đã thêm ${quantity} x <strong>${product.name}</strong> vào giỏ hàng.`,
      "success"
    );
  },

  /**
   * Cập nhật số lượng sản phẩm trong Giỏ hàng
   * @param {number} productId
   * @param {number} newQty
   */
  updateCartQuantity(productId, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.state.cart.find((i) => i.id === productId);
    if (item) {
      item.quantity = newQty;
      this.saveCartToStorage();
      UI.updateCartBadge(this.state.cart);
      UI.renderCartDrawer(this.state.cart, this.state.appliedVoucher);
    }
  },

  /**
   * Xóa một sản phẩm khỏi giỏ hàng
   * @param {number} productId
   */
  removeFromCart(productId) {
    const item = this.state.cart.find((i) => i.id === productId);
    this.state.cart = this.state.cart.filter((i) => i.id !== productId);

    this.saveCartToStorage();
    UI.updateCartBadge(this.state.cart);
    UI.renderCartDrawer(this.state.cart, this.state.appliedVoucher);

    if (item) {
      UI.showToast("Đã xóa", `Đã xóa <strong>${item.name}</strong> khỏi giỏ hàng.`, "info");
    }
  },

  /**
   * Xử lý áp dụng mã Voucher
   * @param {string} code
   */
  handleApplyVoucher(code) {
    if (!code) {
      UI.showToast("Lỗi Voucher", "Vui lòng nhập mã giảm giá sinh viên!", "warning");
      return;
    }

    const voucher = window.VOUCHERS?.[code];
    if (!voucher) {
      UI.showToast("Mã không tồn tại", `Mã "<strong>${code}</strong>" không hợp lệ hoặc đã hết hạn! Thử nhập: <strong>SINHVIEN10</strong>`, "error");
      return;
    }

    const subtotal = this.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < (voucher.minOrder || 0)) {
      UI.showToast(
        "Chưa đủ điều kiện",
        `Mã này chỉ áp dụng cho đơn từ ${UI.formatCurrency(voucher.minOrder)}. Đơn của bạn hiện tại là ${UI.formatCurrency(subtotal)}.`,
        "warning"
      );
      return;
    }

    this.state.appliedVoucher = voucher;
    UI.renderCartDrawer(this.state.cart, this.state.appliedVoucher);
    UI.showToast("Áp dụng thành công!", `🎉 ${voucher.description}`, "success");
  },

  /**
   * THỬ THÁCH 2: REAL-TIME FORM VALIDATION CHO FORM ĐẶT HÀNG
   * Kiểm tra trực tiếp khi người dùng gõ từng ký tự (input, blur events)
   */
  setupCheckoutValidation() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    const inputName = document.getElementById("order-fullname");
    const inputPhone = document.getElementById("order-phone");
    const inputStudentId = document.getElementById("order-studentid");
    const inputAddress = document.getElementById("order-address");
    const btnSubmit = document.getElementById("btn-submit-order");

    const validateField = (fieldId) => {
      let isValid = false;
      let errorMsg = "";

      switch (fieldId) {
        case "order-fullname": {
          const val = inputName.value.trim();
          if (!val) {
            errorMsg = "Vui lòng nhập họ và tên của bạn!";
          } else if (val.length < 3) {
            errorMsg = "Họ tên quá ngắn (tối thiểu 3 ký tự)!";
          } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(val)) {
            errorMsg = "Họ tên chỉ được chứa chữ cái và khoảng trắng!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(inputName, isValid, errorMsg);
          break;
        }

        case "order-phone": {
          const val = inputPhone.value.trim();
          // Regex số điện thoại Việt Nam chuẩn 10 số (03, 05, 07, 08, 09)
          const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
          if (!val) {
            errorMsg = "Vui lòng nhập số điện thoại liên lạc!";
          } else if (!phoneRegex.test(val)) {
            errorMsg = "Số điện thoại không hợp lệ (cần 10 chữ số, ví dụ: 0987654321)!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(inputPhone, isValid, errorMsg);
          break;
        }

        case "order-studentid": {
          const val = inputStudentId.value.trim();
          if (!val) {
            errorMsg = "Vui lòng nhập Mã số sinh viên (MSSV)!";
          } else if (val.length < 6 || val.length > 15) {
            errorMsg = "MSSV hợp lệ thường có từ 6 đến 15 ký tự!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(inputStudentId, isValid, errorMsg);
          break;
        }

        case "order-address": {
          const val = inputAddress.value.trim();
          if (!val) {
            errorMsg = "Vui lòng nhập địa chỉ nhận hàng (Phòng trọ / KTX LHU)!";
          } else if (val.length < 6) {
            errorMsg = "Vui lòng nhập địa chỉ cụ thể hơn (tối thiểu 6 ký tự)!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(inputAddress, isValid, errorMsg);
          break;
        }
      }

      // Kiểm tra trạng thái toàn form để bật/tắt nút Submit
      const isFormValid =
        inputName.value.trim().length >= 3 &&
        /^[a-zA-ZÀ-ỹ\s]+$/.test(inputName.value.trim()) &&
        /^(0[3|5|7|8|9])[0-9]{8}$/.test(inputPhone.value.trim()) &&
        inputStudentId.value.trim().length >= 6 &&
        inputAddress.value.trim().length >= 6;

      if (btnSubmit) {
        btnSubmit.disabled = !isFormValid;
        if (isFormValid) {
          btnSubmit.classList.add("btn-ready");
        } else {
          btnSubmit.classList.remove("btn-ready");
        }
      }

      return isValid;
    };

    // Gắn sự kiện kiểm tra realtime khi gõ (input) và khi rời khỏi ô (blur)
    [inputName, inputPhone, inputStudentId, inputAddress].forEach((input) => {
      if (input) {
        input.addEventListener("input", () => validateField(input.id));
        input.addEventListener("blur", () => validateField(input.id));
      }
    });

    // Xử lý nộp đơn hàng (Submit Form)
    form.onsubmit = (e) => {
      e.preventDefault();

      const v1 = validateField("order-fullname");
      const v2 = validateField("order-phone");
      const v3 = validateField("order-studentid");
      const v4 = validateField("order-address");

      if (!v1 || !v2 || !v3 || !v4) {
        UI.showToast("Chưa hoàn tất", "Vui lòng điền đúng và đủ tất cả thông tin để giao hàng!", "error");
        return;
      }

      // Tính tổng tiền đơn hàng
      const subtotal = this.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let discount = 0;
      if (this.state.appliedVoucher) {
        if (this.state.appliedVoucher.discountPercent) {
          discount = Math.round((subtotal * this.state.appliedVoucher.discountPercent) / 100);
        } else if (this.state.appliedVoucher.discountAmount) {
          discount = this.state.appliedVoucher.discountAmount;
        }
      }
      const shipping = subtotal >= APP_CONFIG.freeShippingThreshold || this.state.appliedVoucher?.code === "FREESHIP" ? 0 : APP_CONFIG.shippingFee;
      const finalTotal = Math.max(0, subtotal - discount + shipping);

      const paymentMethod = form.querySelector('input[name="payment_method"]:checked')?.value || "cod";

      const orderData = {
        orderId: "LHU-" + Math.floor(100000 + Math.random() * 900000),
        orderDate: new Date().toLocaleString("vi-VN"),
        fullName: inputName.value.trim(),
        phone: inputPhone.value.trim(),
        studentId: inputStudentId.value.trim(),
        address: inputAddress.value.trim(),
        paymentMethod: paymentMethod,
        items: [...this.state.cart],
        finalTotal: finalTotal
      };

      // Hoàn tất đơn hàng: Reset giỏ hàng và hiển thị hóa đơn thành công
      this.state.cart = [];
      this.state.appliedVoucher = null;
      this.saveCartToStorage();
      UI.updateCartBadge(this.state.cart);
      UI.renderCartDrawer(this.state.cart, null);

      form.reset();
      [inputName, inputPhone, inputStudentId, inputAddress].forEach((input) => {
        const group = input.closest(".form-group");
        if (group) group.classList.remove("is-valid", "has-error");
      });

      UI.showOrderSuccessModal(orderData);
      UI.showToast("Đặt hàng thành công!", "Đơn hàng của bạn đã được ghi nhận trên hệ thống UniTech.", "success");
    };
  },

  /**
   * Lưu giỏ hàng vào LocalStorage
   */
  saveCartToStorage() {
    try {
      localStorage.setItem("unitech_student_cart", JSON.stringify(this.state.cart));
    } catch (e) {
      console.warn("Không thể lưu giỏ hàng vào localStorage:", e);
    }
  },

  /**
   * Tải giỏ hàng từ LocalStorage
   */
  loadCartFromStorage() {
    try {
      const saved = localStorage.getItem("unitech_student_cart");
      if (saved) {
        this.state.cart = JSON.parse(saved) || [];
      }
    } catch (e) {
      console.warn("Không thể khôi phục giỏ hàng:", e);
      this.state.cart = [];
    }
  }
};

// Đăng ký App toàn cục
if (typeof window !== "undefined") {
  window.App = App;
  document.addEventListener("DOMContentLoaded", () => App.init());
}
