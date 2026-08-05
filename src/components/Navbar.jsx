import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCurrentUser, logoutUser, isAdmin } from '../controllers/UserController';
import { UserCircle, ChevronDown, User, ShoppingCart, LogOut, Menu, CupSoda, Grid, Search, X, Home, Info, TrendingUp, Package, Mail, List } from 'lucide-react';
import { Cookie, Coffee } from 'lucide-react';

const Navbar = () => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCombinedMenu, setShowCombinedMenu] = useState(false);
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close category menu when clicking outside
    const handleClickOutside = (e) => {
      if (showCategoryMenu && !e.target.closest('.navbar-left')) {
        setShowCategoryMenu(false);
      }
      if (showUserMenu && !e.target.closest('.user-menu-wrapper')) {
        setShowUserMenu(false);
      }
      if (showMobileMenu && !e.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
      if (showCombinedMenu && !e.target.closest('.combined-menu-wrapper')) {
        setShowCombinedMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryMenu, showUserMenu, showMobileMenu, showCombinedMenu]);

  useEffect(() => {
    // Check for logged in user on mount
    const user = getCurrentUser();
    setCurrentUser(user);

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = (e) => {
      if (e.key === 'Sakego_current_user' || e.key === null) {
        const updatedUser = getCurrentUser();
        setCurrentUser(updatedUser);
      }
    };

    // Custom event for same-window updates
    const handleAuthChange = () => {
      const updatedUser = getCurrentUser();
      setCurrentUser(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logoutUser();
      setCurrentUser(null);
      setShowUserMenu(false);
      navigate('/');
    }
  };

  const toggleCategoryMenu = () => {
    setShowCategoryMenu(!showCategoryMenu);
  };

  const handleFilterCategory = (category) => {
    setShowCategoryMenu(false);
    navigate(`/products?category=${category}`);
  };

  return (
    <>
      {/* Top Header */}
      <div className="top-header">
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img src="/assets/images/logo_end.png" alt="Sakego Logo" />
            </Link>
          </div>
          <div className="header-actions">
            <div className="auth-links">
              {currentUser ? (
                <div className="user-menu-wrapper">
                  <button 
                    className="user-menu-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <img 
                      src="/assets/images/AVATAR.png" 
                      alt="Avatar"
                      className="user-avatar"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'inline-block';
                      }}
                    />
                    <UserCircle size={18} className="user-avatar-fallback" />
                    <span className="user-name">{currentUser.fullname}</span>
                    <ChevronDown size={18} />
                  </button>
                  {showUserMenu && (
                    <div className="user-dropdown">
                      {isAdmin() && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)}>
                          <i className="fas fa-tachometer-alt"></i> Admin Panel
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                        <User size={18} /> Trang cá nhân
                      </Link>
                      <Link to="/cart" onClick={() => setShowUserMenu(false)}>
                        <ShoppingCart size={18} /> Giỏ hàng
                      </Link>
                      <button onClick={handleLogout}>
                        <LogOut size={18} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <User size={18} /> Đăng nhập
                  </Link>
                  <Link to="/register">
                    <i className="fas fa-user-plus"></i> Đăng ký
                  </Link>
                </>
              )}
            </div>
            <Link to="/cart" className="cart-link">
              <ShoppingCart size={18} />
              <span className="cart-count">{getItemCount()}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-navbar">
        <div className="container">
          <div className="navbar-left">
            <button className="category-menu-btn" onClick={toggleCategoryMenu}>
              <Menu size={18} /> DANH MỤC SẢN PHẨM
            </button>
            {showCategoryMenu && (
              <div 
                className="category-backdrop" 
                onClick={() => setShowCategoryMenu(false)}
              ></div>
            )}
            <div className={`category-dropdown ${showCategoryMenu ? 'active' : ''}`}>
              <ul>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('mochi'); }}>
                    <Cookie size={18} /> Bánh Mochi Sa Kê
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('tea'); }}>
                    <Coffee size={18} /> Trà Sa Kê
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('rice-milk'); }}>
                    <CupSoda size={18} /> Sữa Gạo Sa Kê
                  </a>
                </li>
                <li>
                  <Link to="/products">
                    <Grid size={18} /> Xem tất cả
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Mobile Nav Tools (Search + Menu) */}
          <div className="mobile-nav-tools">
            <div className="mobile-search-bar">
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/products?search=${encodeURIComponent(e.target.value.trim())}`);
                  }
                }}
              />
              <button onClick={(e) => {
                const input = e.currentTarget.previousElementSibling;
                if (input && input.value.trim()) {
                  navigate(`/products?search=${encodeURIComponent(input.value.trim())}`);
                }
              }}>
                <Search size={18} />
              </button>
            </div>
            
            <div className="combined-menu-wrapper">
              <button 
                className="combined-menu-btn"
                onClick={() => setShowCombinedMenu(!showCombinedMenu)}
              >
                <Menu size={18} />
              </button>
            {showCombinedMenu && (
              <>
                <div 
                  className="combined-menu-backdrop" 
                  onClick={() => setShowCombinedMenu(false)}
                ></div>
                <div className="combined-menu-dropdown">
                  <div className="combined-menu-header">
                    <img src="/assets/images/logo.png" alt="Logo" />
                    <span>Sakego</span>
                    <button onClick={() => setShowCombinedMenu(false)}>
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="menu-section">
                    <h3><i className="fas fa-compass"></i> Điều hướng</h3>
                    <ul>
                      <li><Link to="/" onClick={() => setShowCombinedMenu(false)}><Home size={18} /> Trang chủ</Link></li>
                      <li><Link to="/about" onClick={() => setShowCombinedMenu(false)}><Info size={18} /> Giới thiệu</Link></li>
                      <li><Link to="/thuc-trang" onClick={() => setShowCombinedMenu(false)}><TrendingUp size={18} /> Thực trạng</Link></li>
                      <li><Link to="/products" onClick={() => setShowCombinedMenu(false)}><Package size={18} /> Sản phẩm</Link></li>
                      <li><Link to="/contact" onClick={() => setShowCombinedMenu(false)}><Mail size={18} /> Liên hệ</Link></li>
                      <li><Link to="/ar" onClick={() => setShowCombinedMenu(false)}><i className="fas fa-cube"></i> Công nghệ AR</Link></li>
                    </ul>
                  </div>

                  <div className="menu-section">
                    <h3><List size={18} /> Danh mục sản phẩm</h3>
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('tea'); setShowCombinedMenu(false); }}><Coffee size={18} /> Trà Sa Kê</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('rice-milk'); setShowCombinedMenu(false); }}><CupSoda size={18} /> Sữa Gạo Sa Kê</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); handleFilterCategory('mochi'); setShowCombinedMenu(false); }}><Cookie size={18} /> Bánh Mochi Sa Kê</a></li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <ul className="nav-menu desktop-only">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Trang chủ</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>Giới thiệu</Link></li>
            <li><Link to="/thuc-trang" className={location.pathname === '/thuc-trang' || location.pathname === '/sustainability' ? 'active' : ''}>Thực trạng</Link></li>
            <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Sản phẩm</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Liên hệ</Link></li>
            <li><Link to="/ar" className={location.pathname === '/ar' ? 'active' : ''}>Công nghệ AR</Link></li>
          </ul>

          <div className="search-box">
            <input 
              type="text" 
              placeholder="Nhập từ khóa tìm kiếm" 
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/products?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
            <button type="button" onClick={(e) => {
              const input = e.currentTarget.previousElementSibling;
              if (input && input.value.trim()) {
                navigate(`/products?search=${encodeURIComponent(input.value.trim())}`);
              }
            }}>
              <Search size={18} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
