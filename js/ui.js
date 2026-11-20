/**
 * ============================================================================
 * MODULE 2: UI (js/ui.js)
 * Học phần: 111101 - Thiết Kế Web · Đại học Lạc Hồng (LHU)
 * Tuần 13: PBL Milestone 1 - Sprint 1 (Planning & Core UI)
 * Thử thách 1 (Dynamic Render) & Thử thách 3 (Clean Code):
 * Chuyên trách toàn bộ thao tác DOM, tạo giao diện động, Modals và Toasts
 * ============================================================================
 */

const UI = {
  /**
   * Định dạng số tiền sang định dạng tiền tệ Việt Nam (VNĐ)
   * @param {number} amount
   * @returns {string}
   */
  formatCurrency(amount) {
    if (typeof amount !== "number" || isNaN(amount)) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
  },

  /**
   * Tạo chuỗi HTML hiển thị sao đánh giá (Rating)
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
   * THỬ THÁCH 1 (DYNAMIC RENDERING):
   * Render danh sách sản phẩm động 100% từ mảng Object vào container
   * @param {Array} products - Mảng các sản phẩm
   * @param {HTMLElement} container - Phần tử DOM chứa thẻ sản phẩm
   */
  renderProducts(products, container) {
    if (!container) return;

    if (!products || products.length === 0) {
      this.renderEmptyState(container);
      return;
    }

    const cardsHtml = products.map((product) => {
      const badgesHtml = (product.badges || [])
        .map((badge, idx) => {
          const badgeClass = idx === 0 ? "badge-primary" : "badge-secondary";
          return `<span class="product-badge ${badgeClass}">${badge}</span>`;
        })
        .join("");

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-card-top">
            <div class="product-badge-group">
              ${badgesHtml}
              <span class="product-badge badge-discount">-${product.discount}%</span>
            </div>
            <div class="product-image-wrap" onclick="App.handleQuickView(${product.id})">
              <img 
                src="${product.image}" 
                alt="${product.name}" 
                class="product-image"
                loading="lazy"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';"
              />
              <button type="button" class="btn-quick-preview" title="Xem nhanh thông số">
                <i class="bi bi-eye"></i> Xem nhanh
              </button>
            </div>
          </div>

          <div class="product-card-body">
            <span class="product-category">${product.categoryName}</span>
            <h3 class="product-title" onclick="App.handleQuickView(${product.id})" title="${product.name}">
              ${product.name}
            </h3>

            <div class="product-rating">
              <div class="stars">${this.renderStarRating(product.rating)}</div>
              <span class="rating-text">${product.rating}</span>
              <span class="reviews-count">(${product.reviewsCount})</span>
            </div>

            <p class="product-desc-short">${product.shortDesc}</p>

            <div class="product-card-footer">
              <div class="product-pricing">
                <span class="product-price-current">${this.formatCurrency(product.price)}</span>
                <span class="product-price-original">${this.formatCurrency(product.originalPrice)}</span>
              </div>
              <button 
                type="button" 
                class="btn-add-cart" 
                onclick="App.addToCart(${product.id})"
                title="Thêm vào giỏ hàng"
              >
                <i class="bi bi-cart-plus"></i>
                <span class="btn-text">Thêm</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    container.innerHTML = cardsHtml;
  },

  /**
   * Hiển thị trạng thái rỗng khi tìm kiếm hoặc lọc không có kết quả
   * @param {HTMLElement} container
   * @param {string} query
   */
  renderEmptyState(container, query = "") {
    if (!container) return;
    container.innerHTML = `
      <div class="empty-state-box">
        <div class="empty-icon-wrap">
          <i class="bi bi-search"></i>
        </div>
        <h3 class="empty-title">Không tìm thấy sản phẩm phù hợp</h3>
        <p class="empty-desc">
          ${query ? `Không có thiết bị nào khớp với từ khóa "<strong>${query}</strong>".` : "Không có sản phẩm nào thuộc bộ lọc bạn đã chọn."}
        </p>
        <button type="button" class="btn-reset-filter" onclick="App.resetFilters()">
          <i class="bi bi-arrow-counterclockwise"></i> Đặt lại bộ lọc
        </button>
      </div>
    `;
  },

  /**
   * Cập nhật số lượng huy hiệu trên icon Giỏ hàng (Real-time badge bounce)
   * @param {Array} cart
   */
  updateCartBadge(cart) {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;

    const totalQty = (cart || []).reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalQty;
    badge.classList.remove("badge-bounce");
    void badge.offsetWidth; // Force reflow trigger CSS animation
    badge.classList.add("badge-bounce");
  },

  /**
   * Cập nhật số lượng sản phẩm đang hiển thị
   * @param {number} current
   * @param {number} total
   */
  updateProductCount(current, total) {
    const el = document.getElementById("product-count-display");
    if (el) {
      el.innerHTML = `Hiển thị <strong>${current}</strong> / <strong>${total}</strong> sản phẩm`;
    }
  },

  /**
   * Render các mục bên trong Giỏ hàng Drawer
   * @param {Array} cart
   * @param {Object} appliedVoucher
   */
  renderCartDrawer(cart, appliedVoucher = null) {
    const cartItemsContainer = document.getElementById("cart-drawer-items");
    const cartFooter = document.getElementById("cart-drawer-footer");
    const cartEmpty = document.getElementById("cart-drawer-empty");

    if (!cartItemsContainer || !cartFooter || !cartEmpty) return;

    if (!cart || cart.length === 0) {
      cartItemsContainer.innerHTML = "";
      cartItemsContainer.style.display = "none";
      cartFooter.style.display = "none";
      cartEmpty.style.display = "flex";
      return;
    }

    cartEmpty.style.display = "none";
    cartItemsContainer.style.display = "block";
    cartFooter.style.display = "block";

    // 1. Render từng sản phẩm
    const itemsHtml = cart.map((item) => {
      const itemSubtotal = item.price * item.quantity;
      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-price-row">
              <span class="cart-item-unit-price">${this.formatCurrency(item.price)}</span>
              <span class="cart-item-subtotal">${this.formatCurrency(itemSubtotal)}</span>
            </div>
            <div class="cart-item-actions">
              <div class="quantity-stepper">
                <button type="button" class="btn-step" onclick="App.updateCartQuantity(${item.id}, ${item.quantity - 1})" aria-label="Giảm">-</button>
                <span class="qty-number">${item.quantity}</span>
                <button type="button" class="btn-step" onclick="App.updateCartQuantity(${item.id}, ${item.quantity + 1})" aria-label="Tăng">+</button>
              </div>
              <button type="button" class="btn-remove-item" onclick="App.removeFromCart(${item.id})" title="Xóa món này">
                <i class="bi bi-trash3"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    cartItemsContainer.innerHTML = itemsHtml;

    // 2. Tính toán tài chính
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;

    if (appliedVoucher) {
      if (appliedVoucher.discountPercent) {
        discount = Math.round((subtotal * appliedVoucher.discountPercent) / 100);
      } else if (appliedVoucher.discountAmount) {
        discount = appliedVoucher.discountAmount;
      }
    }

    const shipping = subtotal >= APP_CONFIG.freeShippingThreshold || appliedVoucher?.code === "FREESHIP" ? 0 : APP_CONFIG.shippingFee;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    // Cập nhật DOM tóm tắt thanh toán
    const subtotalEl = document.getElementById("cart-subtotal");
    const discountEl = document.getElementById("cart-discount");
    const shippingEl = document.getElementById("cart-shipping");
    const totalEl = document.getElementById("cart-final-total");
    const discountRow = document.getElementById("cart-discount-row");

    if (subtotalEl) subtotalEl.textContent = this.formatCurrency(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? "Miễn phí (0 VNĐ)" : this.formatCurrency(shipping);
    if (totalEl) totalEl.textContent = this.formatCurrency(finalTotal);

    if (discountRow) {
      if (discount > 0) {
        discountRow.style.display = "flex";
        if (discountEl) discountEl.textContent = `-${this.formatCurrency(discount)}`;
      } else {
        discountRow.style.display = "none";
      }
    }
  },

  /**
   * Mở Modal Quick View xem chi tiết sản phẩm
   * @param {Object} product
   */
  openProductModal(product) {
    const modal = document.getElementById("product-detail-modal");
    const content = document.getElementById("product-modal-content");
    if (!modal || !content || !product) return;

    const specsRows = Object.entries(product.specs || {})
      .map(([key, val]) => `
        <tr>
          <td class="spec-label">${key}</td>
          <td class="spec-value">${val}</td>
        </tr>
      `)
      .join("");

    content.innerHTML = `
      <div class="modal-product-layout">
        <div class="modal-product-left">
          <div class="modal-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="modal-main-img" />
            <span class="modal-discount-pill">Tiết kiệm ${product.discount}%</span>
          </div>
          <div class="modal-guarantee-box">
            <div class="guarantee-item">
              <i class="bi bi-shield-check text-primary"></i>
              <span>Chính hãng 100% sinh viên</span>
            </div>
            <div class="guarantee-item">
              <i class="bi bi-arrow-repeat text-success"></i>
              <span>Lỗi 1 đổi 1 trong 30 ngày</span>
            </div>
            <div class="guarantee-item">
              <i class="bi bi-truck text-info"></i>
              <span>Giao tận phòng KTX Đại học Lạc Hồng</span>
            </div>
          </div>
        </div>

        <div class="modal-product-right">
          <span class="modal-category">${product.categoryName}</span>
          <h2 class="modal-product-title">${product.name}</h2>

          <div class="modal-product-rating">
            <div class="stars">${this.renderStarRating(product.rating)}</div>
            <span class="rating-score">${product.rating} / 5.0</span>
            <span class="reviews-count">(${product.reviewsCount} sinh viên đã mua & đánh giá)</span>
          </div>

          <div class="modal-product-price-box">
            <span class="modal-current-price">${this.formatCurrency(product.price)}</span>
            <span class="modal-original-price">${this.formatCurrency(product.originalPrice)}</span>
            <span class="modal-save-amount">Tiết kiệm ${this.formatCurrency(product.originalPrice - product.price)}</span>
          </div>

          <div class="modal-stock-status ${product.inStock ? 'in-stock' : 'out-stock'}">
            <i class="bi ${product.inStock ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
            <span>${product.inStock ? `Còn hàng trong kho (${product.stockQuantity} sản phẩm sẵn sàng giao)` : 'Tạm hết hàng'}</span>
          </div>

          <p class="modal-description">${product.shortDesc}</p>

          <div class="modal-specs-section">
            <h4 class="specs-heading"><i class="bi bi-cpu"></i> Thông số kỹ thuật chi tiết:</h4>
            <table class="specs-table">
              <tbody>
                ${specsRows}
              </tbody>
            </table>
          </div>

          <div class="modal-cta-group">
            <div class="modal-qty-control">
              <label for="modal-input-qty">Số lượng:</label>
              <div class="quantity-stepper">
                <button type="button" class="btn-step" onclick="App.adjustModalQty(-1)">-</button>
                <input type="number" id="modal-input-qty" value="1" min="1" max="${product.stockQuantity}" readonly />
                <button type="button" class="btn-step" onclick="App.adjustModalQty(1)">+</button>
              </div>
            </div>
            <button 
              type="button" 
              class="btn-modal-add-cart"
              onclick="App.addFromModalToCart(${product.id})"
            >
              <i class="bi bi-cart-plus"></i> Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  /**
   * Đóng Modal Quick View
   */
  closeProductModal() {
    const modal = document.getElementById("product-detail-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  /**
   * Mở/Đóng Cart Drawer
   */
  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-drawer-overlay");
    if (drawer && overlay) {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  /**
   * Mở Modal Checkout Đặt hàng
   */
  openCheckoutModal(cart, appliedVoucher) {
    this.closeCartDrawer();
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    // Render tóm tắt danh sách sản phẩm trong form checkout
    const checkoutSummaryList = document.getElementById("checkout-summary-list");
    const checkoutTotalAmount = document.getElementById("checkout-total-amount");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.discountPercent) discount = Math.round((subtotal * appliedVoucher.discountPercent) / 100);
      else if (appliedVoucher.discountAmount) discount = appliedVoucher.discountAmount;
    }
    const shipping = subtotal >= APP_CONFIG.freeShippingThreshold || appliedVoucher?.code === "FREESHIP" ? 0 : APP_CONFIG.shippingFee;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    if (checkoutSummaryList) {
      checkoutSummaryList.innerHTML = cart.map(item => `
        <div class="checkout-sum-item">
          <span class="sum-name">${item.name} <strong>x${item.quantity}</strong></span>
          <span class="sum-price">${this.formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join("");
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
   * Hiển thị Modal hóa đơn đặt hàng thành công
   * @param {Object} orderData
   */
  showOrderSuccessModal(orderData) {
    this.closeCheckoutModal();
    const modal = document.getElementById("success-modal");
    const content = document.getElementById("success-modal-content");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="success-box">
        <div class="success-icon-wrap">
          <i class="bi bi-check2-circle"></i>
        </div>
        <h2 class="success-title">Đặt Hàng Thành Công!</h2>
        <p class="success-subtitle">Cảm ơn bạn sinh viên <strong>${orderData.fullName}</strong> đã đồng hành cùng UniTech!</p>
        
        <div class="receipt-card">
          <div class="receipt-header">
            <span>Mã đơn hàng: <strong>#${orderData.orderId}</strong></span>
            <span>Thời gian: ${orderData.orderDate}</span>
          </div>
          <div class="receipt-body">
            <div class="receipt-row">
              <span class="lbl">Họ tên sinh viên:</span>
              <span class="val">${orderData.fullName} (MSSV: ${orderData.studentId})</span>
            </div>
            <div class="receipt-row">
              <span class="lbl">Số điện thoại:</span>
              <span class="val">${orderData.phone}</span>
            </div>
            <div class="receipt-row">
              <span class="lbl">Địa chỉ nhận hàng:</span>
              <span class="val">${orderData.address}</span>
            </div>
            <div class="receipt-row">
              <span class="lbl">Phương thức:</span>
              <span class="val">${orderData.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR Sinh Viên'}</span>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-row highlight">
              <span class="lbl">Tổng tiền thanh toán:</span>
              <span class="val text-primary fs-5">${this.formatCurrency(orderData.finalTotal)}</span>
            </div>
          </div>
        </div>

        <p class="delivery-notice">
          <i class="bi bi-info-circle"></i> Đơn hàng sẽ được nhân viên UniTech giao hỏa tốc đến phòng trọ/KTX Đại học Lạc Hồng trong vòng 2-4 giờ học.
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
   * Cập nhật trạng thái validation thời gian thực cho một ô input
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
      feedbackEl.innerHTML = `<i class="bi bi-check-circle-fill"></i> Hợp lệ`;
    } else {
      formGroup.classList.remove("is-valid");
      formGroup.classList.add("has-error");
      feedbackEl.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${errorMsg}`;
    }
  },

  /**
   * Hiển thị Toast thông báo trạng thái
   * @param {string} title
   * @param {string} message
   * @param {string} type - "success" | "warning" | "info" | "error"
   */
  showToast(title, message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const icons = {
      success: "bi-check-circle-fill",
      warning: "bi-exclamation-triangle-fill",
      info: "bi-info-circle-fill",
      error: "bi-x-octagon-fill"
    };

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="bi ${icons[type] || 'bi-info-circle-fill'}"></i>
      </div>
      <div class="toast-content">
        <h4 class="toast-title">${title}</h4>
        <p class="toast-message">${message}</p>
      </div>
      <button type="button" class="toast-close" onclick="this.parentElement.remove()" aria-label="Đóng">&times;</button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Tự động gỡ bỏ sau 3.5 giây
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, 3500);
  }
};

// Đăng ký UI toàn cục
if (typeof window !== "undefined") {
  window.UI = UI;
}
