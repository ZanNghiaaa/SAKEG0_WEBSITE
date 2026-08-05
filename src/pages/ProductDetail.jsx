import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../controllers/ProductController';
import { useCart } from '../context/CartContext';
import '../assets/css/product-detail.css';
import { Home, CheckCircle2, Info, FileText, Leaf, Truck, Package, Minus, Plus, Zap, RefreshCw, HeadphonesIcon } from 'lucide-react';
import { Gift, Shield, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        // Ensure products are loaded from API
        const { fetchProductsFromAPI } = await import('../controllers/ProductController');
        await fetchProductsFromAPI();
        
        const foundProduct = getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
    
    // Add class to body for breadcrumb styling
    document.body.classList.add('product-detail-page');
    
    return () => {
      document.body.classList.remove('product-detail-page');
    };
  }, [id, navigate]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Add product with selected quantity
    const productWithQuantity = { ...product, quantity };
    
    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setNotification(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleBuyNow = () => {
    // Add product with selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'chip':
        return { name: 'Chip Sa Kê', color: '#FFB74D', icon: 'cookie-bite' };
      case 'mochi':
        return { name: 'Bánh Mochi', color: '#AB47BC', icon: 'cookie' };
      case 'powder':
        return { name: 'Bột Sa Kê', color: '#66BB6A', icon: 'mortar-pestle' };
      default:
        return { name: 'Sa Kê', color: '#7CB342', icon: 'leaf' };
    }
  };

  if (loading || !product) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(product.category);

  // Hardcode combo images as requested by user
  let displayImage = product.image;
  if (product.name === 'DOUBLE CHILL') displayImage = '/assets/images/Combo_2chill.png';
  else if (product.name === 'COUPLE CHILL') displayImage = '/assets/images/combo_2chill.jpg';
  else if (product.name === 'CHILL MỘT MÌNH') displayImage = '/assets/images/combo_1chilll.png';
  else if (product.name === 'ÍCH KỶ') displayImage = '/assets/images/combo_ichki.jpg';
  else if (product.name === 'SAKE PARTY') displayImage = '/assets/images/combo_PT.jpg';
  else if (product.name === 'Combo Sa Kê Đa Dạng') displayImage = '/assets/images/combo_PT.jpg';

  // Mock multiple images for product
  const productImages = [
    displayImage,
    displayImage,
    displayImage,
    displayImage
  ];

  return (
    <main>
      {/* Breadcrumb */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <Home size={18} /> Trang chủ
            </a>
            <span className="separator">/</span>
            <a href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>
              Sản phẩm
            </a>
            <span className="separator">/</span>
            <span className="current">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Notification */}
      {notification && (
        <div className="notification-popup">
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* Product Detail */}
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="main-image">
                <img src={productImages[selectedImage]} alt={product.name} />
                {product.isTrial && (
                  <div className="trial-badge-large">
                    <Gift size={18} />
                    <span>Dùng Thử</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info-detail">
              <div className="category-badge" style={{ background: categoryInfo.color }}>
                <i className={`fas fa-${categoryInfo.icon}`}></i>
                {categoryInfo.name}
              </div>

              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <span className="rating-text">5.0 (128 đánh giá)</span>
                <span className="divider">|</span>
                <span className="sold-text">Đã bán: 1,234</span>
              </div>

              <div className="price-section">
                <div className="current-price">
                  {product.price.toLocaleString('vi-VN')}đ
                </div>
                {product.isTrial && (
                  <div className="price-note">
                    <Info size={18} />
                    Giá ưu đãi cho gói dùng thử
                  </div>
                )}
              </div>

              <div className="product-description">
                <h3>
                  <FileText size={18} />
                  Mô tả sản phẩm
                </h3>
                <p>{product.description}</p>
              </div>

              <div className="product-features">
                <h3>
                  <CheckCircle2 size={18} />
                  Đặc điểm nổi bật
                </h3>
                <ul>
                  <li>
                    <Leaf size={18} />
                    100% nguyên liệu tự nhiên từ trái sa kê Việt Nam
                  </li>
                  <li>
                    <Shield size={18} />
                    Đảm bảo an toàn vệ sinh thực phẩm
                  </li>
                  <li>
                    <i className="fas fa-award"></i>
                    Chất lượng cao, đã được kiểm nghiệm
                  </li>
                  <li>
                    <Truck size={18} />
                    Giao hàng nhanh chóng toàn quốc
                  </li>
                </ul>
              </div>

              <div className="stock-info">
                <Package size={18} />
                <span>Còn lại: <strong>{product.stock}</strong> sản phẩm</span>
              </div>

              <div className="quantity-selector">
                <label>Số lượng:</label>
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                  <ShoppingCart size={18} />
                  Thêm vào giỏ hàng
                </button>
                <button className="btn-buy-now" onClick={handleBuyNow}>
                  <Zap size={18} />
                  Mua ngay
                </button>
              </div>

              <div className="product-guarantee">
                <div className="guarantee-item">
                  <RefreshCw size={18} />
                  <div>
                    <strong>Đổi trả miễn phí</strong>
                    <span>Trong 7 ngày</span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <Truck size={18} />
                  <div>
                    <strong>Miễn phí vận chuyển</strong>
                    <span>Đơn từ 200.000đ</span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <HeadphonesIcon size={18} />
                  <div>
                    <strong>Hỗ trợ 24/7</strong>
                    <span>Tư vấn nhiệt tình</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="tabs-wrapper">
            <div className="tab-content">
              <div className="tab-panel active">
                <h2>
                  <Info size={18} />
                  Thông tin chi tiết
                </h2>
                <div className="detail-table">
                  <div className="detail-row">
                    <span className="label">Danh mục:</span>
                    <span className="value">{categoryInfo.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Xuất xứ:</span>
                    <span className="value">Việt Nam</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Thương hiệu:</span>
                    <span className="value">Sakego</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Hạn sử dụng:</span>
                    <span className="value">12 tháng</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Bảo quản:</span>
                    <span className="value">Nơi khô ráo, thoáng mát</span>
                  </div>
                </div>

                <h3>Mô tả chi tiết</h3>
                <p>
                  {product.name} là sản phẩm được chế biến từ trái sa kê (chôm chôm) tươi ngon, 
                  chọn lọc kỹ lưỡng từ các vùng trồng sa kê nổi tiếng tại Việt Nam. 
                  Quy trình sản xuất hiện đại, đảm bảo giữ nguyên hương vị tự nhiên 
                  và giá trị dinh dưỡng của trái sa kê.
                </p>
                <p>
                  Sản phẩm không chứa chất bảo quản, phẩm màu hay hương liệu tổng hợp. 
                  An toàn tuyệt đối cho sức khỏe người tiêu dùng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
