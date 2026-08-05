import React from 'react';
import { Leaf, Truck, HeadphonesIcon } from 'lucide-react';
import { Shield } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Leaf size={18} />
            </div>
            <h3>100% Tự Nhiên</h3>
            <p>Không chất bảo quản, không hóa chất</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Truck size={18} />
            </div>
            <h3>Giao Hàng Nhanh</h3>
            <p>Miễn phí vận chuyển cho đơn từ 50K</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={18} />
            </div>
            <h3>An Toàn & Chất Lượng</h3>
            <p>Đảm bảo nguồn gốc xuất xứ rõ ràng</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <HeadphonesIcon size={18} />
            </div>
            <h3>Hỗ Trợ 24/7</h3>
            <p>Luôn sẵn sàng tư vấn và hỗ trợ</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
