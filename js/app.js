/**
 * ============================================================================
 * MODULE 3: APP CONTROLLER (js/app.js)
 * Học phần: 111101 - Thiết Kế Web · Đại học Lạc Hồng (LHU)
 * Tuần 14: PBL Milestone 2 - Sprint 2 (Logic Thông Minh & Kiểm Thử - Final Push)
 * Tiêu chí DoD & Clean Code:
 * 1. Debounce Real-time Live Search
 * 2. Bộ lọc kết hợp đa tiêu chí (Multi-filter)
 * 3. Real-time Form Validation (Regex chuẩn VN & MSSV LHU)
 * 4. Quản lý Dark/Light Mode & Wishlist lưu LocalStorage
 * 5. Zero Console Error & Xử lý bất đồng bộ mượt mà
 * ============================================================================
 */

const App = {
  // Trạng thái ứng dụng (Application State)
  state: {
    products: [],
    filteredProducts: [],
    cart: [],
    wishlist: [],
    currentCategory: "all",
    currentPriceRange: "all",
    currentBadge: "all",
    searchQuery: "",
    sortBy: "default",
    appliedVoucher: null,
    activeQuickViewId: null,
    theme: "light",
    orders: []
  },

  /**
   * Hàm Debounce tối ưu hiệu năng: Hoãn thực thi hàm cho đến khi người dùng ngừng gõ phím
   * @param {Function} func
   * @param {number} wait (milliseconds)
   * @returns {Function}
   */
  debounce(func, wait = 250) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  /**
   * Khởi chạy ứng dụng khi DOM sẵn sàng
   */
  async init() {
    console.log("🚀 [UniTech App] Khởi động Sprint 2: Logic Thông Minh & Kiểm Thử (LHU)...");

    // 1. Khôi phục theme và wishlist từ LocalStorage
    this.loadThemeFromStorage();
    this.loadWishlistFromStorage();
    this.loadCartFromStorage();

    // 2. Nạp dữ liệu bất đồng bộ từ DataLoader (JSON fetch + Fallback Object)
    try {
      this.state.products = await window.DataLoader.fetchProducts();
    } catch (e) {
      console.warn("[App] DataLoader gặp lỗi, sử dụng PRODUCTS dự phòng:", e);
      this.state.products = [...(window.PRODUCTS || [])];
    }
    this.state.filteredProducts = [...this.state.products];

    // 3. Khởi tạo DOM & Bộ lắng nghe sự kiện
    this.setupEventListeners();

    // 4. Render lần đầu tiên
    this.applyFiltersAndRender();
    UI.updateCartBadge(this.state.cart);
    UI.renderCartDrawer(this.state.cart, this.state.appliedVoucher);
    UI.updateWishlistBadge(this.state.wishlist);

    console.log("✅ [UniTech App] Hệ thống đã sẵn sàng phục vụ sinh viên LHU!");
  },

  /**
   * Thiết lập tất cả các Event Listeners trên giao diện
   */
  setupEventListeners() {
    // 1. TÌM KIẾM THỜI GIAN THỰC VỚI THUẬT TOÁN DEBOUNCE (250ms)
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("btn-clear-search");

    const debouncedSearch = this.debounce((query) => {
      this.state.searchQuery = query;
      this.applyFiltersAndRender();
    }, 250);

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const val = e.target.value.trim().toLowerCase();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = val ? "block" : "none";
        }
        debouncedSearch(val);
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        this.clearSearchQuery();
      });
    }

    // 2. BỘ LỌC DANH MỤC CHÍNH (Category Tabs)
    const categoryTabsContainer = document.getElementById("category-tabs-container");
    if (categoryTabsContainer) {
      categoryTabsContainer.addEventListener("click", (e) => {
        const targetBtn = e.target.closest(".cat-tab-btn");
        if (!targetBtn) return;

        categoryTabsContainer
          .querySelectorAll(".cat-tab-btn")
          .forEach((btn) => btn.classList.remove("active"));
        targetBtn.classList.add("active");

        this.state.currentCategory = targetBtn.dataset.category || "all";
        this.applyFiltersAndRender();
      });
    }

    // 3. BỘ LỌC KHOẢNG GIÁ (Price Range Pills)
    const priceFilterContainer = document.getElementById("price-filter-container");
    if (priceFilterContainer) {
      priceFilterContainer.addEventListener("click", (e) => {
        const pill = e.target.closest(".filter-pill");
        if (!pill) return;

        priceFilterContainer
          .querySelectorAll(".filter-pill")
          .forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        this.state.currentPriceRange = pill.dataset.price || "all";
        this.applyFiltersAndRender();
      });
    }

    // 4. BỘ LỌC THEO BADGE ƯU ĐÃI (Badge Pills)
    const badgeFilterContainer = document.getElementById("badge-filter-container");
    if (badgeFilterContainer) {
      badgeFilterContainer.addEventListener("click", (e) => {
        const pill = e.target.closest(".filter-pill");
        if (!pill) return;

        badgeFilterContainer
          .querySelectorAll(".filter-pill")
          .forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        this.state.currentBadge = pill.dataset.badge || "all";
        this.applyFiltersAndRender();
      });
    }

    // 5. NÚT ĐẶT LẠI TOÀN BỘ BỘ LỌC
    const btnResetAll = document.getElementById("btn-reset-all-filters");
    if (btnResetAll) {
      btnResetAll.addEventListener("click", () => this.resetFilters());
    }

    // 6. SẮP XẾP SẢN PHẨM (Sort Dropdown)
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // 7. ĐỔI THEME DARK / LIGHT MODE
    const btnThemeToggle = document.getElementById("btn-theme-toggle");
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // 8. MỞ / ĐÓNG CART DRAWER
    const btnOpenCart = document.getElementById("btn-open-cart");
    const btnCloseCart = document.getElementById("btn-close-cart");
    const cartOverlay = document.getElementById("cart-drawer-overlay");

    if (btnOpenCart) btnOpenCart.addEventListener("click", () => UI.openCartDrawer());
    if (btnCloseCart) btnCloseCart.addEventListener("click", () => UI.closeCartDrawer());
    if (cartOverlay) cartOverlay.addEventListener("click", () => UI.closeCartDrawer());

    // 9. MỞ / ĐÓNG WISHLIST DRAWER
    const btnOpenWishlist = document.getElementById("btn-open-wishlist");
    const btnCloseWishlist = document.getElementById("btn-close-wishlist");
    const wishlistOverlay = document.getElementById("wishlist-drawer-overlay");

    if (btnOpenWishlist)
      btnOpenWishlist.addEventListener("click", () => {
        UI.renderWishlistDrawer(this.state.wishlist, this.state.products);
        UI.openWishlistDrawer();
      });
    if (btnCloseWishlist)
      btnCloseWishlist.addEventListener("click", () => UI.closeWishlistDrawer());
    if (wishlistOverlay)
      wishlistOverlay.addEventListener("click", () => UI.closeWishlistDrawer());

    // 10. MỞ / ĐÓNG AGILE & DOD INSPECTOR MODAL
    const btnOpenInspector = document.getElementById("btn-open-inspector");
    const btnCloseInspector = document.getElementById("btn-close-inspector");
    const inspectorModal = document.getElementById("inspector-modal");

    if (btnOpenInspector)
      btnOpenInspector.addEventListener("click", () => UI.openInspectorModal());
    if (btnCloseInspector)
      btnCloseInspector.addEventListener("click", () => UI.closeInspectorModal());
    if (inspectorModal) {
      inspectorModal.addEventListener("click", (e) => {
        if (e.target === inspectorModal) UI.closeInspectorModal();
      });
    }

    // Xử lý chuyển tab trong Inspector Modal
    const inspectorTabsNav = document.querySelector(".inspector-tabs-nav");
    if (inspectorTabsNav) {
      inspectorTabsNav.addEventListener("click", (e) => {
        const tabBtn = e.target.closest(".inspector-tab-btn");
        if (!tabBtn) return;

        const targetTab = tabBtn.dataset.tab;
        inspectorTabsNav
          .querySelectorAll(".inspector-tab-btn")
          .forEach((btn) => btn.classList.remove("active"));
        tabBtn.classList.add("active");

        const modalBody = document.querySelector(".inspector-tab-body");
        if (modalBody) {
          modalBody.querySelectorAll(".inspector-tab-pane").forEach((pane) => {
            if (pane.id === `tab-pane-${targetTab}`) {
              pane.style.display = "block";
              pane.classList.add("active");
            } else {
              pane.style.display = "none";
              pane.classList.remove("active");
            }
          });
        }
      });
    }

    // 11. ĐÓNG MODAL QUICK VIEW
    const btnCloseModal = document.getElementById("btn-close-modal");
    const modalBackdrop = document.getElementById("product-detail-modal");
    if (btnCloseModal)
      btnCloseModal.addEventListener("click", () => UI.closeProductModal());
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) UI.closeProductModal();
      });
    }

    // 12. ÁP DỤNG MÃ VOUCHER TRONG CART DRAWER
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

    // 13. MỞ MODAL CHECKOUT
    const btnProceedCheckout = document.getElementById("btn-proceed-checkout");
    if (btnProceedCheckout) {
      btnProceedCheckout.addEventListener("click", () => {
        if (this.state.cart.length === 0) {
          UI.showToast(
            "Giỏ hàng trống",
            "Vui lòng chọn ít nhất 1 sản phẩm trước khi thanh toán!",
            "warning"
          );
          return;
        }
        UI.closeCartDrawer();
        UI.openCheckoutModal(this.state.cart, this.state.appliedVoucher);
        this.setupCheckoutValidation();
      });
    }

    // 14. ĐÓNG MODAL CHECKOUT
    const btnCloseCheckout = document.getElementById("btn-close-checkout");
    const btnCancelCheckout = document.getElementById("btn-cancel-checkout");
    const checkoutModal = document.getElementById("checkout-modal");
    if (btnCloseCheckout)
      btnCloseCheckout.addEventListener("click", () => UI.closeCheckoutModal());
    if (btnCancelCheckout)
      btnCancelCheckout.addEventListener("click", () => UI.closeCheckoutModal());
    if (checkoutModal) {
      checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) UI.closeCheckoutModal();
      });
    }

    // 15. PHÍM TẮT ESCAPE ĐỂ ĐÓNG MỌI CỬA SỔ
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        UI.closeProductModal();
        UI.closeCartDrawer();
        UI.closeWishlistDrawer();
        UI.closeCheckoutModal();
        UI.closeOrderSuccessModal();
        UI.closeInspectorModal();
      }
    });
  },

  /**
   * BỘ LỌC KẾT HỢP ĐA TIÊU CHÍ (MULTI-FILTER COMBINED LOGIC)
   * Lọc kết hợp: Danh mục + Khoảng giá + Badge ưu đãi + Từ khóa tìm kiếm + Sắp xếp
   */
  applyFiltersAndRender() {
    let result = [...this.state.products];

    // 1. Lọc theo Danh mục
    if (this.state.currentCategory !== "all") {
      result = result.filter((p) => p.category === this.state.currentCategory);
    }

    // 2. Lọc theo Khoảng giá
    if (this.state.currentPriceRange !== "all") {
      switch (this.state.currentPriceRange) {
        case "under-300":
          result = result.filter((p) => p.price < 300000);
          break;
        case "300-700":
          result = result.filter((p) => p.price >= 300000 && p.price <= 700000);
          break;
        case "above-700":
          result = result.filter((p) => p.price > 700000);
          break;
      }
    }

    // 3. Lọc theo Badge ưu đãi
    if (this.state.currentBadge !== "all") {
      switch (this.state.currentBadge) {
        case "lhu-support":
          result = result.filter((p) =>
            (p.badges || []).some((b) => b.includes("LHU") || b.includes("Trợ giá"))
          );
          break;
        case "flash-sale":
          result = result.filter((p) =>
            (p.badges || []).some((b) => b.includes("Flash") || b.includes("Hot"))
          );
          break;
        case "best-seller":
          result = result.filter((p) =>
            (p.badges || []).some((b) => b.includes("Bán chạy") || b.includes("Best"))
          );
          break;
      }
    }

    // 4. Lọc theo Từ khóa Search (Debounced query)
    if (this.state.searchQuery) {
      const q = this.state.searchQuery.toLowerCase();
      result = result.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inCategory = (p.categoryName || "").toLowerCase().includes(q);
        const inDesc = (p.shortDesc || "").toLowerCase().includes(q);
        const inSpecs = Object.values(p.specs || {}).some((val) =>
          val.toLowerCase().includes(q)
        );
        return inName || inCategory || inDesc || inSpecs;
      });
    }

    // 5. Sắp xếp kết quả
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
        result.sort((a, b) => a.id - b.id);
        break;
    }

    this.state.filteredProducts = result;

    // 6. Kích hoạt Render ra màn hình
    const gridContainer = document.getElementById("product-grid");
    UI.renderProducts(result, gridContainer, this.state.wishlist);
    UI.updateProductCount(result.length, this.state.products.length);
    UI.renderActiveFilterChips({
      currentCategory: this.state.currentCategory,
      currentPriceRange: this.state.currentPriceRange,
      currentBadge: this.state.currentBadge,
      searchQuery: this.state.searchQuery
    });
  },

  /**
   * Đặt lại tất cả các điều kiện lọc về mặc định
   */
  resetFilters() {
    this.state.currentCategory = "all";
    this.state.currentPriceRange = "all";
    this.state.currentBadge = "all";
    this.state.searchQuery = "";
    this.state.sortBy = "default";

    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("btn-clear-search");
    const sortSelect = document.getElementById("sort-select");
    const categoryTabs = document.querySelectorAll(".cat-tab-btn");
    const pricePills = document.querySelectorAll("#price-filter-container .filter-pill");
    const badgePills = document.querySelectorAll("#badge-filter-container .filter-pill");

    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.style.display = "none";
    if (sortSelect) sortSelect.value = "default";

    categoryTabs.forEach((btn) => {
      if (btn.dataset.category === "all") btn.classList.add("active");
      else btn.classList.remove("active");
    });

    pricePills.forEach((p) => {
      if (p.dataset.price === "all") p.classList.add("active");
      else p.classList.remove("active");
    });

    badgePills.forEach((p) => {
      if (p.dataset.badge === "all") p.classList.add("active");
      else p.classList.remove("active");
    });

    this.applyFiltersAndRender();
    UI.showToast("Đã đặt lại bộ lọc", "Đang hiển thị toàn bộ 16+ thiết bị công nghệ!", "info");
  },

  clearSearchQuery() {
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("btn-clear-search");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    if (clearSearchBtn) clearSearchBtn.style.display = "none";
    this.state.searchQuery = "";
    this.applyFiltersAndRender();
  },

  setCategory(category) {
    this.state.currentCategory = category;
    const categoryTabs = document.querySelectorAll(".cat-tab-btn");
    categoryTabs.forEach((btn) => {
      if (btn.dataset.category === category) btn.classList.add("active");
      else btn.classList.remove("active");
    });
    this.applyFiltersAndRender();
  },

  setPriceFilter(priceRange) {
    this.state.currentPriceRange = priceRange;
    const pricePills = document.querySelectorAll("#price-filter-container .filter-pill");
    pricePills.forEach((p) => {
      if (p.dataset.price === priceRange) p.classList.add("active");
      else p.classList.remove("active");
    });
    this.applyFiltersAndRender();
  },

  setBadgeFilter(badge) {
    this.state.currentBadge = badge;
    const badgePills = document.querySelectorAll("#badge-filter-container .filter-pill");
    badgePills.forEach((p) => {
      if (p.dataset.badge === badge) p.classList.add("active");
      else p.classList.remove("active");
    });
    this.applyFiltersAndRender();
  },

  handleQuickSearch(keyword) {
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("btn-clear-search");
    if (searchInput) {
      searchInput.value = keyword;
      if (clearSearchBtn) clearSearchBtn.style.display = "block";
    }
    this.state.searchQuery = keyword.toLowerCase();
    this.applyFiltersAndRender();
  },

  /**
   * Xem nhanh sản phẩm (Quick View Modal)
   * @param {number} productId
   */
  handleQuickView(productId) {
    const product = this.state.products.find((p) => p.id === productId);
    if (!product) return;

    this.state.activeQuickViewId = productId;
    const isWishlisted = this.state.wishlist.includes(productId);
    UI.openProductModal(product, isWishlisted);
  },

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
      UI.showToast("Hết hàng", "Sản phẩm này tạm thời hết hàng trợ giá!", "warning");
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
      `Đã thêm ${quantity}x <strong>${product.name}</strong> vào giỏ hàng.`,
      "success"
    );
  },

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

  removeFromCart(productId) {
    const item = this.state.cart.find((i) => i.id === productId);
    this.state.cart = this.state.cart.filter((i) => i.id !== productId);

    this.saveCartToStorage();
    UI.updateCartBadge(this.state.cart);
    UI.renderCartDrawer(this.state.cart, this.state.appliedVoucher);

    if (item) {
      UI.showToast("Đã xóa món đồ", `Đã xóa <strong>${item.name}</strong> khỏi giỏ hàng.`, "info");
    }
  },

  /**
   * ÁP DỤNG MÃ VOUCHER SINH VIÊN LHU
   * @param {string} code
   */
  handleApplyVoucher(code) {
    if (!code) {
      UI.showToast("Lỗi Voucher", "Vui lòng nhập mã giảm giá sinh viên!", "warning");
      return;
    }

    const voucher = window.VOUCHERS?.[code];
    if (!voucher) {
      UI.showToast(
        "Mã không hợp lệ",
        `Mã "<strong>${code}</strong>" không tồn tại! Gợi ý: <strong>SINHVIEN10</strong>, <strong>FREESHIP</strong>`,
        "error"
      );
      return;
    }

    const subtotal = this.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < (voucher.minOrder || 0)) {
      UI.showToast(
        "Chưa đủ điều kiện",
        `Mã này yêu cầu đơn hàng từ ${UI.formatCurrency(voucher.minOrder)}. Đơn hiện tại: ${UI.formatCurrency(subtotal)}.`,
        "warning"
      );
      return;
    }

    this.state.appliedVoucher = voucher;
    UI.renderCartDrawer(this.state.cart, this.state.appliedVoucher);
    UI.showToast("Áp dụng thành công!", `🎉 ${voucher.description}`, "success");
  },

  /**
   * QUẢN LÝ SẢN PHẨM YÊU THÍCH (WISHLIST)
   * @param {number} productId
   * @param {Event} event
   */
  handleToggleWishlist(productId, event) {
    if (event) event.stopPropagation();

    const index = this.state.wishlist.indexOf(productId);
    const product = this.state.products.find((p) => p.id === productId);

    if (index > -1) {
      this.state.wishlist.splice(index, 1);
      UI.showToast("Đã bỏ yêu thích", `Đã bỏ <strong>${product?.name || "thiết bị"}</strong> khỏi danh sách.`, "info");
    } else {
      this.state.wishlist.push(productId);
      UI.showToast("Đã lưu yêu thích", `Đã thêm <strong>${product?.name || "thiết bị"}</strong> vào mục yêu thích! ❤️`, "success");
    }

    this.saveWishlistToStorage();
    UI.updateWishlistBadge(this.state.wishlist);
    this.applyFiltersAndRender();
    UI.renderWishlistDrawer(this.state.wishlist, this.state.products);
  },

  /**
   * QUẢN LÝ THEME DARK / LIGHT MODE
   */
  toggleTheme() {
    const nextTheme = this.state.theme === "light" ? "dark" : "light";
    this.state.theme = nextTheme;
    UI.toggleTheme(nextTheme);
    localStorage.setItem("unitech_theme", nextTheme);
    UI.showToast(
      "Đổi giao diện",
      `Đã chuyển sang chế độ <strong>${nextTheme === "dark" ? "Ban Đêm (Dark Mode)" : "Ban Ngày (Light Mode)"}</strong>.`,
      "info"
    );
  },

  loadThemeFromStorage() {
    const savedTheme = localStorage.getItem("unitech_theme") || "light";
    this.state.theme = savedTheme;
    UI.toggleTheme(savedTheme);
  },

  loadWishlistFromStorage() {
    try {
      const data = localStorage.getItem("unitech_wishlist");
      this.state.wishlist = data ? JSON.parse(data) : [];
    } catch {
      this.state.wishlist = [];
    }
  },

  saveWishlistToStorage() {
    try {
      localStorage.setItem("unitech_wishlist", JSON.stringify(this.state.wishlist));
    } catch (e) {
      console.warn("[Storage] Không thể lưu wishlist:", e);
    }
  },

  loadCartFromStorage() {
    try {
      const data = localStorage.getItem("unitech_cart");
      this.state.cart = data ? JSON.parse(data) : [];
    } catch {
      this.state.cart = [];
    }
  },

  saveCartToStorage() {
    try {
      localStorage.setItem("unitech_cart", JSON.stringify(this.state.cart));
    } catch (e) {
      console.warn("[Storage] Không thể lưu cart:", e);
    }
  },

  /**
   * REAL-TIME FORM VALIDATION THỜI GIAN THỰC CHO FORM ĐẶT HÀNG
   * Kiểm tra Regex trực tiếp khi người dùng gõ từng ký tự (input, blur)
   */
  setupCheckoutValidation() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    const inputName = document.getElementById("order-fullname");
    const inputStudentId = document.getElementById("order-studentid");
    const inputPhone = document.getElementById("order-phone");
    const inputEmail = document.getElementById("order-email");
    const selectPickup = document.getElementById("order-pickup-point");
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

        case "order-studentid": {
          const val = inputStudentId.value.trim();
          // Regex MSSV: 6-12 chữ số hoặc định dạng sinh viên LHU (125000xxx)
          if (!val) {
            errorMsg = "Vui lòng nhập Mã số sinh viên (MSSV)!";
          } else if (!/^[0-9]{6,12}$/.test(val)) {
            errorMsg = "MSSV Đại học Lạc Hồng phải là dãy 6-12 chữ số (VD: 125000155)!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(inputStudentId, isValid, errorMsg);
          break;
        }

        case "order-phone": {
          const val = inputPhone.value.trim();
          // Regex số điện thoại Việt Nam chuẩn 10 số (03, 05, 07, 08, 09)
          const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
          if (!val) {
            errorMsg = "Vui lòng nhập số điện thoại liên lạc!";
          } else if (!phoneRegex.test(val)) {
            errorMsg = "Số điện thoại không hợp lệ (cần 10 chữ số, VD: 0987654321)!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(inputPhone, isValid, errorMsg);
          break;
        }

        case "order-email": {
          const val = inputEmail.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!val) {
            errorMsg = "Vui lòng nhập email nhận hóa đơn điện tử!";
          } else if (!emailRegex.test(val)) {
            errorMsg = "Địa chỉ email không đúng định dạng (VD: 125000155@lachong.edu.vn)!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(inputEmail, isValid, errorMsg);
          break;
        }

        case "order-pickup-point": {
          const val = selectPickup.value;
          if (!val) {
            errorMsg = "Vui lòng chọn điểm nhận hàng thuận tiện tại LHU!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(selectPickup, isValid, errorMsg);
          break;
        }

        case "order-address": {
          const val = inputAddress.value.trim();
          if (!val) {
            errorMsg = "Vui lòng nhập địa chỉ / số phòng nhận hàng chi tiết!";
          } else if (val.length < 5) {
            errorMsg = "Vui lòng nhập địa chỉ cụ thể hơn (tối thiểu 5 ký tự)!";
          } else {
            isValid = true;
          }
          UI.setFieldValidationStatus(inputAddress, isValid, errorMsg);
          break;
        }
      }

      // Kiểm tra trạng thái toàn form để kích hoạt nút Submit
      const isFormValid =
        inputName.value.trim().length >= 3 &&
        /^[a-zA-ZÀ-ỹ\s]+$/.test(inputName.value.trim()) &&
        /^[0-9]{6,12}$/.test(inputStudentId.value.trim()) &&
        /^(0[3|5|7|8|9])[0-9]{8}$/.test(inputPhone.value.trim()) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail.value.trim()) &&
        selectPickup.value !== "" &&
        inputAddress.value.trim().length >= 5;

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

    // Gắn sự kiện kiểm tra realtime khi gõ (input, change) và khi rời khỏi ô (blur)
    [inputName, inputStudentId, inputPhone, inputEmail, selectPickup, inputAddress].forEach(
      (input) => {
        if (input) {
          input.addEventListener("input", () => validateField(input.id));
          input.addEventListener("change", () => validateField(input.id));
          input.addEventListener("blur", () => validateField(input.id));
        }
      }
    );

    // Xử lý nộp đơn hàng (Submit Form)
    form.onsubmit = (e) => {
      e.preventDefault();

      const v1 = validateField("order-fullname");
      const v2 = validateField("order-studentid");
      const v3 = validateField("order-phone");
      const v4 = validateField("order-email");
      const v5 = validateField("order-pickup-point");
      const v6 = validateField("order-address");

      if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
        UI.showToast(
          "Chưa hoàn tất",
          "Vui lòng điền đúng và đủ tất cả thông tin để giao hàng!",
          "error"
        );
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
      const shipping =
        subtotal >= APP_CONFIG.freeShippingThreshold || this.state.appliedVoucher?.code === "FREESHIP"
          ? 0
          : APP_CONFIG.shippingFee;
      const finalTotal = Math.max(0, subtotal - discount + shipping);

      const paymentMethod =
        form.querySelector('input[name="payment_method"]:checked')?.value || "cod";

      const orderData = {
        orderId: "LHU-" + Math.floor(100000 + Math.random() * 900000),
        orderDate: new Date().toLocaleString("vi-VN"),
        fullName: inputName.value.trim(),
        studentId: inputStudentId.value.trim(),
        phone: inputPhone.value.trim(),
        email: inputEmail.value.trim(),
        pickupPoint: selectPickup.value,
        address: inputAddress.value.trim(),
        paymentMethod: paymentMethod,
        items: [...this.state.cart],
        finalTotal: finalTotal
      };

      // Lưu đơn hàng vào LocalStorage
      try {
        const orderHistory = JSON.parse(localStorage.getItem("unitech_orders") || "[]");
        orderHistory.unshift(orderData);
        localStorage.setItem("unitech_orders", JSON.stringify(orderHistory));
      } catch (err) {
        console.warn("[Storage] Không thể lưu lịch sử đơn hàng:", err);
      }

      // Hoàn tất: Reset giỏ hàng và hiển thị hóa đơn thành công
      this.state.cart = [];
      this.state.appliedVoucher = null;
      this.saveCartToStorage();
      UI.updateCartBadge(this.state.cart);
      UI.renderCartDrawer(this.state.cart, null);

      form.reset();
      [inputName, inputStudentId, inputPhone, inputEmail, selectPickup, inputAddress].forEach(
        (input) => {
          const group = input.closest(".form-group");
          if (group) group.classList.remove("is-valid", "has-error");
        }
      );

      UI.showOrderSuccessModal(orderData);
      UI.showToast("Đặt hàng thành công!", "UniTech đã tiếp nhận đơn hàng trợ giá LHU của bạn.", "success");
    };
  }
};

// Gắn App vào window và tự động khởi chạy khi DOM sẵn sàng
window.App = App;
document.addEventListener("DOMContentLoaded", () => App.init());
