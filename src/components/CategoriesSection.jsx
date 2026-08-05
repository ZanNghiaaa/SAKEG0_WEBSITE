import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProductsFromAPI } from '../controllers/ProductController';
import { useTilt } from '../hooks/useTilt';

const CategoryCard = ({ category, icon, title, desc, count, onClick }) => {
  const tiltRef = useTilt({ max: 15, speed: 400, scale: 1.05, maxGlare: 0.3 });
  
  return (
    <div className="category-card" onClick={() => onClick(category)} ref={tiltRef}>
      <div className="category-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="category-count">{count} sản phẩm</div>
    </div>
  );
};

const CategoriesSection = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({
    tea: 0,
    'rice-milk': 0,
    mochi: 0,
    combo: 0
  });

  useEffect(() => {
    const loadCounts = async () => {
      const products = await fetchProductsFromAPI();
      const counts = {
        tea: products.filter(p => p.category === 'tea').length,
        'rice-milk': products.filter(p => p.category === 'rice-milk').length,
        mochi: products.filter(p => p.category === 'mochi').length,
        combo: products.filter(p => p.category === 'combo').length
      };
      setCategoryCounts(counts);
    };
    loadCounts();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">📦 Danh mục</span>
          <h2>Khám Phá Sản Phẩm</h2>
          <p>Đa dạng sản phẩm từ sa kê cho mọi nhu cầu</p>
        </div>
        <div className="categories-grid">
          <CategoryCard 
            category="tea" 
            icon="fas fa-mug-hot" 
            title="Trà Sa Kê" 
            desc="Thơm ngon, giàu dưỡng chất" 
            count={categoryCounts.tea} 
            onClick={handleCategoryClick} 
          />
          <CategoryCard 
            category="rice-milk" 
            icon="fas fa-glass-whiskey" 
            title="Sữa Gạo Sa Kê" 
            desc="Dinh dưỡng, dễ tiêu hóa" 
            count={categoryCounts['rice-milk']} 
            onClick={handleCategoryClick} 
          />
          <CategoryCard 
            category="mochi" 
            icon="fas fa-cookie" 
            title="Bánh Mochi Sa Kê" 
            desc="Mềm mại, nhiều vị" 
            count={categoryCounts.mochi} 
            onClick={handleCategoryClick} 
          />
          <CategoryCard 
            category="combo" 
            icon="fas fa-gift" 
            title="Combo Sa Kê" 
            desc="Tiết kiệm, đa dạng" 
            count={categoryCounts.combo} 
            onClick={handleCategoryClick} 
          />
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
