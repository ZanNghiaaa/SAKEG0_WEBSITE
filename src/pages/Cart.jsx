import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ShoppingBag, Minus, Plus, Trash2, Receipt, CheckCircle2, Lock, ArrowLeft, Truck, RefreshCw } from 'lucide-react';
import { Gift, Shield } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity));
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      clearCart();
    }
  };

  const handleRemoveItem = (item) => {
    if (window.confirm(`Xóa "${item.name}" khỏi giỏ hàng?`)) {
      removeFromCart(item.id);
    }
  };

  const getDisplayImage = (item) => {
    let displayImage = item.image;
    if (item.name === 'DOUBLE CHILL') displayImage = '/assets/images/Combo_2chill.png';
    else if (item.name === 'COUPLE CHILL') displayImage = '/assets/images/combo_2chill.jpg';
    else if (item.name === 'CHILL MỘT MÌNH') displayImage = '/assets/images/combo_1chilll.png';
    else if (item.name === 'ÍCH KỶ') displayImage = '/assets/images/combo_ichki.jpg';
    else if (item.name === 'SAKE PARTY') displayImage = '/assets/images/combo_PT.jpg';
    else if (item.name === 'Combo Sa Kê Đa Dạng') displayImage = '/assets/images/combo_PT.jpg';
    return displayImage;
  };

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingCart size={18} />
            </div>
            <h2>Giỏ Hàng Trống</h2>
            <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <p className="text-muted">Khám phá các sản phẩm Sa Ô Kê tuyệt vời của chúng tôi ngay!</p>
            <Link to="/products" className="btn btn-primary">
              <ShoppingBag size={18} /> Khám Phá Sản Phẩm
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>
            <ShoppingCart size={18} /> Giỏ Hàng Của Bạn
          </h1>
          <p className="cart-count">{cartItems.length} sản phẩm</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="card">
              <div className="card-body">
                {cartItems.map((item, index) => (
                  <div key={item.id} className={`cart-item ${index !== cartItems.length - 1 ? 'cart-item-border' : ''}`}>
                    <div className="cart-item-image">
                      <img src={getDisplayImage(item)} alt={item.name} />
                      {item.isTrial && (
                        <span className="item-trial-badge">
                          <Gift size={18} /> Trial
                        </span>
                      )}
                    </div>

                    <div className="cart-item-info">
                      <h5>{item.name}</h5>
                      <p className="text-muted">{item.description}</p>
                      <div className="item-price-mobile">
                        <span className="price-label">Đơn giá:</span>
                        <strong>{item.price.toLocaleString('vi-VN')}đ</strong>
                      </div>
                    </div>

                    <div className="cart-item-price">
                      <span className="price-label">Đơn giá</span>
                      <strong>{item.price.toLocaleString('vi-VN')}đ</strong>
                    </div>

                    <div className="cart-item-quantity">
                      <span className="quantity-label">Số lượng</span>
                      <div className="quantity-controls">
                        <button
                          className="qty-btn qty-minus"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={18} />
                        </button>
                        <input
                          type="number"
                          className="qty-input"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          min="1"
                        />
                        <button
                          className="qty-btn qty-plus"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      <span className="total-label">Thành tiền</span>
                      <strong className="item-total-price">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </strong>
                    </div>

                    <div className="cart-item-actions">
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveItem(item)}
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear All Button */}
                <div className="cart-actions">
                  <button className="btn-clear-all" onClick={handleClearCart}>
                    <Trash2 size={18} /> Xóa Tất Cả
                  </button>
                </div>
              </div>
            </div>

            {/* Promotion Banner - Bottom Left */}
            <div className="promotion-banner-top">
              <Gift size={18} />
              <div className="promotion-content">
                <strong>Ưu đãi đặc biệt!</strong>
                <p>Miễn phí ship cho đơn từ 200.000đ</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary-section">
            <div className="card summary-card">
              <div className="card-header">
                <h5>
                  <Receipt size={18} /> Tóm Tắt Đơn Hàng
                </h5>
              </div>
              <div className="card-body">
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <strong>{getTotal().toLocaleString('vi-VN')}đ</strong>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <strong className="text-success">
                      <CheckCircle2 size={18} /> Miễn phí
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span>Giảm giá:</span>
                    <strong className="text-muted">0đ</strong>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row summary-total">
                    <h5>Tổng cộng:</h5>
                    <h5 className="total-amount">{getTotal().toLocaleString('vi-VN')}đ</h5>
                  </div>
                </div>

                <div className="summary-actions">
                  <Link to="/checkout" className="btn btn-checkout">
                    <Lock size={18} /> Thanh Toán Ngay
                  </Link>
                  <Link to="/products" className="btn btn-continue">
                    <ArrowLeft size={18} /> Tiếp Tục Mua Sắm
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-item">
                    <Shield size={18} />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="trust-item">
                    <Truck size={18} />
                    <span>Giao hàng nhanh</span>
                  </div>
                  <div className="trust-item">
                    <RefreshCw size={18} />
                    <span>Đổi trả 7 ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
