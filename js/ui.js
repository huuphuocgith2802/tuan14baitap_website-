/**
 * ============================================================================
 * MODULE 2: UI CONTROLLER (js/ui.js)
 * Học phần: 111101 - Thiết Kế Web · Đại học Lạc Hồng (LHU)
 * Tuần 14: PBL Milestone 2 - Sprint 2 (Logic Thông Minh & Kiểm Thử - Final Push)
 * Tiêu chí DoD & Clean Code: Chuyên trách 100% thao tác DOM, Render động, Modals, Toasts
 * ============================================================================
 */

const UI = {
  /**
   * Định dạng số tiền sang chuẩn Việt Nam Đồng (VNĐ)
   * @param {number} amount
   * @returns {string}
   */
  formatCurrency(amount) {
    if (typeof amount !== "number" || isNaN(amount)) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
  },

  /**
   * Tạo chuỗi HTML hiển thị số sao đánh giá (Rating)
   * @param {number} rating
   * @returns {string}
   */
  renderStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHtml = "";

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHtml += `<i class="bi bi-star-fill text-warning"></i>`;
      } else if (i === fullStars + 1 && hasHalfStar) {
        starsHtml += `<i class="bi bi-star-half text-warning"></i>`;
      } else {
        starsHtml += `<i class="bi bi-star text-muted"></i>`;
      }
    }
    return starsHtml;
  },

  /**
   * THỬ THÁCH DYNAMIC RENDERING:
   * Render danh sách sản phẩm động 100% từ mảng Object / JSON vào container
   * @param {Array} products - Mảng các sản phẩm
   * @param {HTMLElement} container - Phần tử DOM chứa thẻ sản phẩm
   * @param {Array} wishlist - Mảng ID các sản phẩm yêu thích
   */
  renderProducts(products, container, wishlist = []) {
    if (!container) return;

    if (!products || products.length === 0) {
      this.renderEmptyState(container);
      return;
    }

    const cardsHtml = products
      .map((product) => {
        const isWishlisted = wishlist.includes(product.id);
        const badgesHtml = (product.badges || [])
          .map((badge, idx) => {
            const badgeClass =
              idx === 0
                ? "badge-sale"
                : badge.includes("LHU")
                ? "badge-lhu"
                : "badge-hot";
            return `<span class="product-badge ${badgeClass}">${badge}</span>`;
          })
          .join("");

        return `
        <article class="product-card" data-id="${product.id}" data-category="${product.category}">
          <div class="card-media-wrapper">
            <!-- Nút Thả tim yêu thích (Wishlist) -->
            <button 
              type="button" 
              class="btn-card-wishlist ${isWishlisted ? "active" : ""}" 
              onclick="App.handleToggleWishlist(${product.id}, event)"
              aria-label="Thêm vào yêu thích"
              title="${isWishlisted ? "Bỏ yêu thích" : "Lưu vào yêu thích"}"
            >
              <i class="bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}"></i>
            </button>

            <div class="product-badges-wrap">
              ${badgesHtml}
            </div>

            <div class="product-image-wrap" onclick="App.handleQuickView(${product.id})">
              <img 
                src="${product.image}" 
                alt="${product.name}" 
                class="product-img" 
                loading="lazy"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';"
              />
            </div>

            <button 
              type="button" 
              class="btn-quick-view" 
              onclick="App.handleQuickView(${product.id})" 
              aria-label="Xem nhanh thông số chi tiết"
            >
              <i class="bi bi-eye-fill"></i> Xem nhanh
            </button>
          </div>

          <div class="product-body">
            <span class="product-category-tag">${product.categoryName}</span>
            <h3 class="product-title" onclick="App.handleQuickView(${product.id})" title="${product.name}">
              ${product.name}
            </h3>

            <div class="product-rating-row">
              <div class="stars-wrap">
                ${this.renderStarRating(product.rating)}
              </div>
              <span class="rating-value">${product.rating.toFixed(1)}</span>
              <span class="reviews-count">(${product.reviewsCount} review sinh viên)</span>
            </div>

            <div class="product-pricing">
              <div class="current-price">${this.formatCurrency(product.price)}</div>
              ${
                product.originalPrice > product.price
                  ? `
                <div class="price-discount-wrap">
                  <span class="original-price">${this.formatCurrency(product.originalPrice)}</span>
                  <span class="discount-pill">-${product.discount}%</span>
                </div>
              `
                  : ""
              }
            </div>

            <div class="product-card-footer">
              <span class="stock-status ${product.inStock ? "in-stock" : "out-of-stock"}">
                <i class="bi ${product.inStock ? "bi-check-circle-fill text-success" : "bi-x-circle-fill text-danger"}"></i>
                ${product.inStock ? `Còn ${product.stockQuantity || 10} suất trợ giá` : "Tạm hết hàng"}
              </span>

              <button 
                type="button" 
                class="btn-add-cart" 
                onclick="App.addToCart(${product.id}, 1)" 
                ${!product.inStock ? "disabled" : ""}
                title="Thêm vào giỏ hàng"
              >
                <i class="bi bi-cart-plus-fill"></i>
                <span>Thêm</span>
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join("");

    container.innerHTML = cardsHtml;
  },

  /**
   * Hiển thị trạng thái rỗng khi không tìm thấy sản phẩm
   * @param {HTMLElement} container
   */
  renderEmptyState(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="empty-product-state">
        <div class="empty-state-icon">
          <i class="bi bi-search-heart"></i>
        </div>
        <h3 class="empty-title">Không tìm thấy thiết bị nào phù hợp!</h3>
        <p class="empty-desc">
          Rất tiếc, không có sản phẩm nào khớp với từ khóa hoặc điều kiện lọc hiện tại của bạn.
        </p>
        <div class="empty-keywords-hint">
          <span>Gợi ý từ khóa hot:</span>
          <button type="button" class="keyword-pill" onclick="App.handleQuickSearch('chuột silent')">Chuột silent</button>
          <button type="button" class="keyword-pill" onclick="App.handleQuickSearch('phím cơ')">Phím cơ</button>
          <button type="button" class="keyword-pill" onclick="App.handleQuickSearch('sạc GaN')">Sạc GaN 65W</button>
          <button type="button" class="keyword-pill" onclick="App.handleQuickSearch('tai nghe')">Tai nghe ANC</button>
          <button type="button" class="keyword-pill" onclick="App.handleQuickSearch('casio')">Casio FX-880</button>
        </div>
        <button type="button" class="btn btn-primary btn-reset-search" onclick="App.resetFilters()">
          <i class="bi bi-arrow-counterclockwise"></i> Xem tất cả 16+ thiết bị
        </button>
      </div>
    `;
  },

  /**
   * Render các chip hiển thị bộ lọc đang kích hoạt
   * @param {Object} filters
   */
  renderActiveFilterChips(filters) {
    const container = document.getElementById("active-filter-chips");
    if (!container) return;

    const chips = [];

    // Chip từ khóa tìm kiếm
    if (filters.searchQuery) {
      chips.push({
        id: "search",
        label: `Từ khóa: "${filters.searchQuery}"`,
        onRemove: "App.clearSearchQuery()"
      });
    }

    // Chip khoảng giá
    if (filters.currentPriceRange !== "all") {
      const priceLabels = {
        "under-300": "Dưới 300.000 VNĐ",
        "300-700": "300.000đ - 700.000 VNĐ",
        "above-700": "Trên 700.000 VNĐ"
      };
      chips.push({
        id: "price",
        label: `Mức giá: ${priceLabels[filters.currentPriceRange] || filters.currentPriceRange}`,
        onRemove: "App.setPriceFilter('all')"
      });
    }

    // Chip ưu đãi / badge
    if (filters.currentBadge !== "all") {
      const badgeLabels = {
        "lhu-support": "Trợ giá LHU",
        "flash-sale": "Flash Sale",
        "best-seller": "Bán chạy"
      };
      chips.push({
        id: "badge",
        label: `Ưu đãi: ${badgeLabels[filters.currentBadge] || filters.currentBadge}`,
        onRemove: "App.setBadgeFilter('all')"
      });
    }

    // Chip danh mục
    if (filters.currentCategory !== "all") {
      const catObj = (window.CATEGORIES || []).find((c) => c.id === filters.currentCategory);
      if (catObj) {
        chips.push({
          id: "category",
          label: `Danh mục: ${catObj.name}`,
          onRemove: "App.setCategory('all')"
        });
      }
    }

    if (chips.length === 0) {
      container.style.display = "none";
      container.innerHTML = "";
      return;
    }

    container.style.display = "flex";
    container.innerHTML = `
      <span class="filter-group-label"><i class="bi bi-funnel-fill text-primary"></i> Đang lọc:</span>
      ${chips
        .map(
          (c) => `
        <span class="filter-chip">
          ${c.label}
          <button type="button" class="filter-chip-remove" onclick="${c.onRemove}" title="Xóa điều kiện này">&times;</button>
        </span>
      `
        )
        .join("")}
      <button type="button" class="btn-reset-filters" onclick="App.resetFilters()">
        <i class="bi bi-x-circle"></i> Xóa tất cả
      </button>
    `;
  },

  /**
   * Cập nhật thông số số lượng sản phẩm hiển thị trên Toolbar
   * @param {number} count
   * @param {number} total
   */
  updateProductCount(count, total) {
    const el = document.getElementById("product-count-display");
    if (!el) return;

    if (count === total) {
      el.innerHTML = `Hiển thị toàn bộ <strong>${total}</strong> thiết bị công nghệ sinh viên`;
    } else {
      el.innerHTML = `Tìm thấy <strong>${count}</strong> / ${total} thiết bị phù hợp`;
    }
  },

  /**
   * Mở Modal Quick View xem chi tiết thông số kỹ thuật sản phẩm
   * @param {Object} product
   * @param {boolean} isWishlisted
   */
  openProductModal(product, isWishlisted = false) {
    const modal = document.getElementById("product-detail-modal");
    const content = document.getElementById("product-modal-content");
    if (!modal || !content || !product) return;

    // Sinh HTML bảng thông số kỹ thuật
    const specsHtml = Object.entries(product.specs || {})
      .map(
        ([key, val]) => `
      <div class="spec-row">
        <span class="spec-key">${key}</span>
        <span class="spec-val">${val}</span>
      </div>
    `
      )
      .join("");

    const badgesHtml = (product.badges || [])
      .map((b) => `<span class="product-badge badge-sale">${b}</span>`)
      .join(" ");

    content.innerHTML = `
      <div class="modal-product-layout">
        <div class="modal-product-visual">
          <div class="modal-img-wrapper">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="modal-main-img" 
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';"
            />
          </div>
          <div class="modal-student-tag">
            <i class="bi bi-mortarboard-fill"></i> Đặc quyền sinh viên Đại học Lạc Hồng
          </div>
        </div>

        <div class="modal-product-info">
          <div class="modal-badges">${badgesHtml}</div>
          <span class="modal-cat-name">${product.categoryName}</span>
          <h2 class="modal-title" id="modal-product-title">${product.name}</h2>

          <div class="modal-rating-row">
            <div class="stars-wrap">${this.renderStarRating(product.rating)}</div>
            <span class="rating-num"><strong>${product.rating.toFixed(1)}</strong> / 5.0</span>
            <span class="rating-count">(${product.reviewsCount} sinh viên LHU đã mua & đánh giá tốt)</span>
          </div>

          <div class="modal-pricing-box">
            <span class="modal-current-price">${this.formatCurrency(product.price)}</span>
            ${
              product.originalPrice > product.price
                ? `
              <span class="modal-original-price">${this.formatCurrency(product.originalPrice)}</span>
              <span class="modal-discount-pill">Tiết kiệm ${product.discount}%</span>
            `
                : ""
            }
          </div>

          <p class="modal-short-desc">${product.shortDesc}</p>

          <div class="modal-specs-section">
            <h4 class="specs-title"><i class="bi bi-cpu"></i> Thông số kỹ thuật chi tiết:</h4>
            <div class="specs-table">${specsHtml}</div>
          </div>

          <div class="modal-cta-group">
            <div class="modal-qty-control">
              <button type="button" class="btn-qty" onclick="App.adjustModalQty(-1)" aria-label="Giảm số lượng">&minus;</button>
              <input type="number" id="modal-input-qty" value="1" min="1" max="${product.stockQuantity || 10}" readonly />
              <button type="button" class="btn-qty" onclick="App.adjustModalQty(1)" aria-label="Tăng số lượng">&plus;</button>
            </div>

            <button 
              type="button" 
              class="btn-modal-add-cart" 
              onclick="App.addFromModalToCart(${product.id})"
              ${!product.inStock ? "disabled" : ""}
            >
              <i class="bi bi-cart-check-fill"></i>
              <span>${product.inStock ? "Thêm vào giỏ hàng ngay" : "Tạm hết hàng"}</span>
            </button>

            <button 
              type="button" 
              class="btn-modal-wishlist ${isWishlisted ? "active" : ""}" 
              onclick="App.handleToggleWishlist(${product.id}, event)"
              title="Lưu yêu thích"
            >
              <i class="bi ${isWishlisted ? "bi-heart-fill text-danger" : "bi-heart"}"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  /**
   * Mở / Đóng Drawer Giỏ Hàng
   */
  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  /**
   * Render toàn bộ giỏ hàng bên trong Cart Drawer
   * @param {Array} cart
   * @param {Object|null} appliedVoucher
   */
  renderCartDrawer(cart, appliedVoucher = null) {
    const itemsContainer = document.getElementById("cart-drawer-items");
    const emptyState = document.getElementById("cart-drawer-empty");
    const footer = document.getElementById("cart-drawer-footer");
    const subtotalEl = document.getElementById("cart-subtotal");
    const discountRow = document.getElementById("cart-discount-row");
    const discountEl = document.getElementById("cart-discount");
    const shippingEl = document.getElementById("cart-shipping");
    const finalTotalEl = document.getElementById("cart-final-total");

    if (!itemsContainer || !emptyState || !footer) return;

    if (!cart || cart.length === 0) {
      itemsContainer.innerHTML = "";
      emptyState.style.display = "flex";
      footer.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    footer.style.display = "block";

    // 1. Render danh sách sản phẩm trong giỏ
    itemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item-card" data-id="${item.id}">
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="cart-item-img" 
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';"
        />
        <div class="cart-item-details">
          <h4 class="cart-item-title" title="${item.name}">${item.name}</h4>
          <span class="cart-item-category">${item.categoryName}</span>
          <div class="cart-item-price">${this.formatCurrency(item.price)}</div>
          
          <div class="cart-item-controls">
            <div class="cart-qty-box">
              <button type="button" class="btn-cart-qty" onclick="App.updateCartQuantity(${item.id}, ${item.quantity - 1})" aria-label="Giảm">&minus;</button>
              <span class="cart-qty-num">${item.quantity}</span>
              <button type="button" class="btn-cart-qty" onclick="App.updateCartQuantity(${item.id}, ${item.quantity + 1})" aria-label="Tăng">&plus;</button>
            </div>
            <button type="button" class="btn-remove-item" onclick="App.removeFromCart(${item.id})" title="Xóa khỏi giỏ">
              <i class="bi bi-trash3"></i> Xóa
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // 2. Tính toán tài chính giỏ hàng
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;

    if (appliedVoucher) {
      if (appliedVoucher.discountPercent) {
        discount = Math.round((subtotal * appliedVoucher.discountPercent) / 100);
      } else if (appliedVoucher.discountAmount) {
        discount = appliedVoucher.discountAmount;
      }
    }

    const shipping =
      subtotal >= APP_CONFIG.freeShippingThreshold || appliedVoucher?.code === "FREESHIP"
        ? 0
        : APP_CONFIG.shippingFee;

    const finalTotal = Math.max(0, subtotal - discount + shipping);

    if (subtotalEl) subtotalEl.textContent = this.formatCurrency(subtotal);

    if (discountRow && discountEl) {
      if (discount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-${this.formatCurrency(discount)}`;
      } else {
        discountRow.style.display = "none";
      }
    }

    if (shippingEl) {
      shippingEl.textContent = shipping === 0 ? "MIỄN PHÍ (KTX LHU)" : this.formatCurrency(shipping);
      if (shipping === 0) shippingEl.classList.add("text-success");
      else shippingEl.classList.remove("text-success");
    }

    if (finalTotalEl) finalTotalEl.textContent = this.formatCurrency(finalTotal);
  },

  /**
   * Cập nhật số lượng trên Badge Giỏ hàng
   * @param {Array} cart
   */
  updateCartBadge(cart) {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const totalCount = (cart || []).reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalCount;

    badge.classList.remove("bounce");
    void badge.offsetWidth;
    badge.classList.add("bounce");
  },

  /**
   * MỞ / ĐÓNG DRAWER SẢN PHẨM YÊU THÍCH (WISHLIST)
   */
  openWishlistDrawer() {
    const drawer = document.getElementById("wishlist-drawer");
    const overlay = document.getElementById("wishlist-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  },

  closeWishlistDrawer() {
    const drawer = document.getElementById("wishlist-drawer");
    const overlay = document.getElementById("wishlist-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  /**
   * Render danh sách sản phẩm yêu thích (Wishlist Drawer)
   * @param {Array} wishlistIds
   * @param {Array} allProducts
   */
  renderWishlistDrawer(wishlistIds = [], allProducts = []) {
    const container = document.getElementById("wishlist-drawer-items");
    const emptyState = document.getElementById("wishlist-drawer-empty");
    if (!container || !emptyState) return;

    const favoriteProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

    if (favoriteProducts.length === 0) {
      container.innerHTML = "";
      emptyState.style.display = "flex";
      return;
    }

    emptyState.style.display = "none";
    container.innerHTML = favoriteProducts
      .map(
        (p) => `
      <div class="wishlist-item-card" data-id="${p.id}">
        <img 
          src="${p.image}" 
          alt="${p.name}" 
          class="wishlist-item-img"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';"
        />
        <div class="wishlist-item-info">
          <h4 class="wishlist-item-title" title="${p.name}">${p.name}</h4>
          <span class="wishlist-item-price">${this.formatCurrency(p.price)}</span>
        </div>
        <div class="wishlist-item-actions">
          <button type="button" class="btn-wishlist-addcart" onclick="App.addToCart(${p.id}, 1)" title="Thêm vào giỏ">
            <i class="bi bi-cart-plus"></i>
          </button>
          <button type="button" class="btn-wishlist-remove" onclick="App.handleToggleWishlist(${p.id}, event)" title="Bỏ yêu thích">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `
      )
      .join("");
  },

  /**
   * Cập nhật badge số lượng yêu thích trên header
   * @param {Array} wishlistIds
   */
  updateWishlistBadge(wishlistIds = []) {
    const badge = document.getElementById("wishlist-badge");
    if (!badge) return;
    badge.textContent = wishlistIds.length;
    badge.style.display = wishlistIds.length > 0 ? "flex" : "none";
  },

  /**
   * Mở Modal Form Đặt Hàng Checkout
   * @param {Array} cart
   * @param {Object|null} appliedVoucher
   */
  openCheckoutModal(cart, appliedVoucher = null) {
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    const checkoutSummaryList = document.getElementById("checkout-summary-list");
    const checkoutTotalAmount = document.getElementById("checkout-total-amount");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.discountPercent)
        discount = Math.round((subtotal * appliedVoucher.discountPercent) / 100);
      else if (appliedVoucher.discountAmount) discount = appliedVoucher.discountAmount;
    }
    const shipping =
      subtotal >= APP_CONFIG.freeShippingThreshold || appliedVoucher?.code === "FREESHIP"
        ? 0
        : APP_CONFIG.shippingFee;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    if (checkoutSummaryList) {
      checkoutSummaryList.innerHTML = cart
        .map(
          (item) => `
        <div class="checkout-sum-item">
          <span class="sum-name">${item.name} <strong>x${item.quantity}</strong></span>
          <span class="sum-price">${this.formatCurrency(item.price * item.quantity)}</span>
        </div>
      `
        )
        .join("");
    }

    if (checkoutTotalAmount) {
      checkoutTotalAmount.textContent = this.formatCurrency(finalTotal);
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  /**
   * Hiển thị Modal hóa đơn điện tử đặt hàng thành công
   * @param {Object} orderData
   */
  showOrderSuccessModal(orderData) {
    this.closeCheckoutModal();
    const modal = document.getElementById("success-modal");
    const content = document.getElementById("success-modal-content");
    if (!modal || !content) return;

    const pickupPointsMap = {
      "ktx-cs1": "Ký túc xá Cơ sở 1 LHU (Huỳnh Văn Nghệ)",
      "ktx-cs2": "Ký túc xá Cơ sở 2 LHU (Bửu Long)",
      "cs5-buulong": "Cơ sở 5 LHU (Trung tâm CNTT)",
      "tro-bienhoa": "Giao tận phòng trọ Biên Hòa"
    };

    content.innerHTML = `
      <div class="success-box">
        <div class="success-icon-wrap">
          <i class="bi bi-check2-circle"></i>
        </div>
        <h2 class="success-title">Đặt Hàng Trợ Giá Thành Công!</h2>
        <p class="success-subtitle">Chúc mừng bạn sinh viên <strong>${orderData.fullName}</strong> đã hoàn tất đơn hàng!</p>
        
        <div class="receipt-card">
          <div class="receipt-header">
            <span>Mã vận đơn điện tử: <strong>#${orderData.orderId}</strong></span>
            <span>Thời gian: ${orderData.orderDate}</span>
          </div>
          <div class="receipt-body">
            <div class="receipt-row">
              <span class="lbl">Họ tên sinh viên:</span>
              <span class="val">${orderData.fullName} (MSSV: <strong>${orderData.studentId}</strong>)</span>
            </div>
            <div class="receipt-row">
              <span class="lbl">Số điện thoại:</span>
              <span class="val">${orderData.phone}</span>
            </div>
            <div class="receipt-row">
              <span class="lbl">Email xác nhận:</span>
              <span class="val">${orderData.email}</span>
            </div>
            <div class="receipt-row">
              <span class="lbl">Điểm nhận hàng:</span>
              <span class="val">${pickupPointsMap[orderData.pickupPoint] || orderData.pickupPoint}</span>
            </div>
            <div class="receipt-row">
              <span class="lbl">Địa chỉ chi tiết / Phòng:</span>
              <span class="val">${orderData.address}</span>
            </div>
            <div class="receipt-row">
              <span class="lbl">Phương thức:</span>
              <span class="val">${orderData.paymentMethod === "cod" ? "Thanh toán tiền mặt khi nhận hàng (COD)" : "Chuyển khoản VietQR Sinh Viên"}</span>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-row highlight">
              <span class="lbl">Tổng tiền thanh toán:</span>
              <span class="val text-primary fs-5">${this.formatCurrency(orderData.finalTotal)}</span>
            </div>
          </div>
        </div>

        <p class="delivery-notice">
          <i class="bi bi-info-circle"></i> Đơn hàng đã được lưu trữ trong LocalStorage (<code>unitech_orders</code>). Nhân viên UniTech sẽ liên lạc giao hỏa tốc đến KTX/Trọ LHU trong vòng 2-4 giờ học.
        </p>

        <button type="button" class="btn-continue-shopping" onclick="UI.closeOrderSuccessModal()">
          <i class="bi bi-bag-check"></i> Tiếp tục xem sản phẩm
        </button>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  closeOrderSuccessModal() {
    const modal = document.getElementById("success-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  /**
   * MỞ / ĐÓNG AGILE & DOD INSPECTOR MODAL
   */
  openInspectorModal() {
    const modal = document.getElementById("inspector-modal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeInspectorModal() {
    const modal = document.getElementById("inspector-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  /**
   * Cập nhật trạng thái Validation thời gian thực cho một input
   * @param {HTMLElement} inputEl
   * @param {boolean} isValid
   * @param {string} errorMsg
   */
  setFieldValidationStatus(inputEl, isValid, errorMsg = "") {
    if (!inputEl) return;
    const formGroup = inputEl.closest(".form-group");
    if (!formGroup) return;

    let feedbackEl = formGroup.querySelector(".validation-feedback");
    if (!feedbackEl) {
      feedbackEl = document.createElement("div");
      feedbackEl.className = "validation-feedback";
      formGroup.appendChild(feedbackEl);
    }

    if (isValid) {
      formGroup.classList.remove("has-error");
      formGroup.classList.add("is-valid");
      feedbackEl.textContent = "";
      feedbackEl.style.display = "none";
    } else {
      formGroup.classList.remove("is-valid");
      formGroup.classList.add("has-error");
      feedbackEl.textContent = errorMsg;
      feedbackEl.style.display = "block";
    }
  },

  /**
   * Đổi giao diện Dark Mode / Light Mode
   * @param {string} theme ('dark' | 'light')
   */
  toggleTheme(theme) {
    const htmlEl = document.documentElement;
    const iconEl = document.getElementById("theme-toggle-icon");
    htmlEl.setAttribute("data-theme", theme);

    if (iconEl) {
      if (theme === "dark") {
        iconEl.className = "bi bi-sun-fill text-warning";
      } else {
        iconEl.className = "bi bi-moon-stars-fill";
      }
    }
  },

  /**
   * Hiển thị thông báo Toast Notification với thanh tiến trình tự biến mất
   * @param {string} title
   * @param {string} message
   * @param {string} type ('success' | 'warning' | 'error' | 'info')
   * @param {number} duration
   */
  showToast(title, message, type = "info", duration = 3500) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const icons = {
      success: "bi-check-circle-fill",
      warning: "bi-exclamation-triangle-fill",
      error: "bi-x-circle-fill",
      info: "bi-info-circle-fill"
    };

    const toastEl = document.createElement("div");
    toastEl.className = `toast-item toast-${type}`;
    toastEl.innerHTML = `
      <div class="toast-icon">
        <i class="bi ${icons[type] || icons.info}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="toast-close" aria-label="Đóng">&times;</button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toastEl);

    const closeToast = () => {
      toastEl.classList.add("fade-out");
      setTimeout(() => {
        if (toastEl.parentNode === container) {
          container.removeChild(toastEl);
        }
      }, 250);
    };

    const closeBtn = toastEl.querySelector(".toast-close");
    if (closeBtn) closeBtn.onclick = closeToast;

    setTimeout(closeToast, duration);
  }
};

// Gắn UI vào window để sử dụng toàn cục
window.UI = UI;
