// Local Storage Keys
const PRODUCTS_KEY = 'sakefruit_products';

// Product cache
let productsCache = null;

// Default mock products with local image URLs
const defaultProducts = [
  // TRÀ LÁ SA KÊ
  {
    id: 'prod_1',
    name: 'Trà lá sa kê',
    price: 10000,
    image: '/assets/images/hero_tea.jpg',
    description: 'Trà thơm mát, thanh lọc cơ thể từ lá sa kê nguyên chất.',
    category: 'tea',
    stock: 100,
    isTrial: false,
    isReadyToEat: false,
    isCombo: false,
    originalPrice: null,
    discount: null,
    comboItems: [],
    isBestSeller: false
  },

  // SỮA GẠO SA KÊ
  {
    id: 'prod_2',
    name: 'Sữa gạo sa kê',
    price: 15000,
    image: '/assets/images/suagao.jpg',
    description: 'Sữa gạo sa kê nguyên vị, thơm ngon béo ngậy tự nhiên. Chai 300ml',
    category: 'rice-milk',
    stock: 150,
    isTrial: false,
    isReadyToEat: true,
    isCombo: false,
    originalPrice: null,
    discount: null,
    comboItems: [],
    isBestSeller: false
  },
  {
    id: 'prod_3',
    name: 'Sữa gạo sa kê vị lá dứa',
    price: 15000,
    image: '/assets/images/Lá dứa đã fix.png',
    description: 'Sữa gạo sa kê hương vị lá dứa thơm thanh mát, béo dịu. Chai 300ml',
    category: 'rice-milk',
    stock: 120,
    isTrial: false,
    isReadyToEat: true,
    isCombo: false,
    originalPrice: null,
    discount: null,
    comboItems: [],
    isBestSeller: false
  },
  {
    id: 'prod_4',
    name: 'Sữa gạo sa kê vị bắp',
    price: 15000,
    image: '/assets/images/combo_2chill.jpg',
    description: 'Sữa gạo sa kê vị bắp ngọt thanh, đậm đà dinh dưỡng. Chai 300ml',
    category: 'rice-milk',
    stock: 120,
    isTrial: false,
    isReadyToEat: true,
    isCombo: false,
    originalPrice: null,
    discount: null,
    comboItems: [],
    isBestSeller: false
  },

  // BÁNH MOCHI
  {
    id: 'prod_5',
    name: 'Bánh mochi việt quất',
    price: 20000,
    image: '/assets/images/Sake_mochi.jpg',
    description: 'Bánh mochi nhân việt quất chua ngọt, vỏ bánh mềm dẻo.',
    category: 'mochi',
    stock: 100,
    isTrial: false,
    isReadyToEat: true,
    isCombo: false,
    originalPrice: null,
    discount: null,
    comboItems: [],
    isBestSeller: false
  },
  {
    id: 'prod_6',
    name: 'Bánh mochi dâu',
    price: 20000,
    image: '/assets/images/Sake_mochi.jpg',
    description: 'Bánh mochi nhân dâu tươi ngon ngọt ngào, dẻo mịn thơm hương.',
    category: 'mochi',
    stock: 100,
    isTrial: false,
    isReadyToEat: true,
    isCombo: false,
    originalPrice: null,
    discount: null,
    comboItems: [],
    isBestSeller: false
  },
  {
    id: 'prod_7',
    name: 'Combo 4 bánh mochi',
    price: 72000,
    image: '/assets/images/mochi.jpg',
    description: 'Combo 4 bánh mochi tự chọn vị thơm ngon và tiết kiệm hơn.',
    category: 'mochi',
    stock: 50,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    originalPrice: 80000,
    discount: 10,
    comboItems: [],
    isBestSeller: false
  },

  // COMBO ƯU ĐÃI
  {
    id: 'prod_8',
    name: 'CHILL MỘT MÌNH',
    price: 32000,
    image: '/assets/images/combo_1chilll.png',
    description: 'Nhẹ nhàng - dành riêng cho bạn. Bao gồm: 1 Sữa gạo sa kê + 1 Mochi (tự chọn vị: Lá dứa - Bắp - Nguyên bản).',
    category: 'combo',
    stock: 80,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    originalPrice: 35000,
    discount: 8.6,
    comboItems: ['prod_2', 'prod_6'],
    isBestSeller: false
  },
  {
    id: 'prod_9',
    name: 'ÍCH KỶ',
    price: 28000,
    image: '/assets/images/combo_ichki.jpg',
    description: 'Ngon quá... không muốn chia. Bao gồm: 1 Trà lá sa kê + 1 Mochi (tự chọn vị).',
    category: 'combo',
    stock: 80,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    originalPrice: 30000,
    discount: 6.7,
    comboItems: ['prod_1', 'prod_5'],
    isBestSeller: false
  },
  {
    id: 'prod_10',
    name: 'DOUBLE CHILL',
    price: 63000,
    image: '/assets/images/combo_2chill.jpg',
    description: 'Bao gồm: 2 Sữa gạo sa kê + 2 Mochi (tự chọn vị: Lá dứa - Bắp - Nguyên bản). Thích hợp cho nhóm bạn hoặc cặp đôi.',
    category: 'combo',
    stock: 60,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    originalPrice: 70000,
    discount: 10,
    comboItems: ['prod_2', 'prod_3', 'prod_5', 'prod_6'],
    isBestSeller: true
  },
  {
    id: 'prod_11',
    name: 'COUPLE CHILL',
    price: 54000,
    image: '/assets/images/Combo_2chill.png',
    description: 'Bao gồm: 2 Trà lá sa kê + 2 Mochi (tự chọn vị). Thích hợp cho các cặp đôi cùng thưởng thức.',
    category: 'combo',
    stock: 60,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    originalPrice: 60000,
    discount: 10,
    comboItems: ['prod_1', 'prod_1', 'prod_5', 'prod_6'],
    isBestSeller: false
  },
  {
    id: 'prod_12',
    name: 'SAKE PARTY',
    price: 85000,
    image: '/assets/images/combo_PT.jpg',
    description: 'Bữa tiệc Sa Kê đầy đủ hương vị. Bao gồm: 1 Sữa gạo sa kê + 1 Trà lá sa kê + 4 Mochi (tự chọn vị: Lá dứa - Bắp - Nguyên bản).',
    category: 'combo',
    stock: 40,
    isTrial: false,
    isReadyToEat: true,
    isCombo: true,
    originalPrice: 97000,
    discount: 12.4,
    comboItems: ['prod_2', 'prod_1', 'prod_5', 'prod_5', 'prod_6', 'prod_6'],
    isBestSeller: true
  }
];

// Helper to save products to localStorage and update cache
const saveToStorage = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  // Lưu thêm bản snapshot của code defaultProducts để phát hiện khi có thay đổi trong code
  localStorage.setItem('sakefruit_default_snapshot', JSON.stringify(defaultProducts));
  productsCache = products;
};

// Fetch products from localStorage (acting as API)
export const fetchProductsFromAPI = async () => {
  try {
    let stored = localStorage.getItem(PRODUCTS_KEY);
    let snapshot = localStorage.getItem('sakefruit_default_snapshot');

    // Tự động cập nhật lại nếu bạn sửa code defaultProducts và bấm Ctrl+S
    let needsReset = false;
    if (snapshot !== JSON.stringify(defaultProducts)) {
      needsReset = true;
    }

    if (!stored || needsReset) {
      saveToStorage(defaultProducts);
      stored = JSON.stringify(defaultProducts);
    }
    productsCache = JSON.parse(stored);
    return productsCache;
  } catch (error) {
    console.error('Error fetching products:', error);
    return defaultProducts;
  }
};

// Initialize products
export const initializeProducts = async () => {
  await fetchProductsFromAPI();
};

// Get all products
export const getAllProducts = () => {
  if (!productsCache) {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    productsCache = stored ? JSON.parse(stored) : defaultProducts;
  }
  return productsCache;
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const products = getAllProducts();
    const newProduct = {
      ...productData,
      id: 'prod_' + Date.now()
    };
    products.push(newProduct);
    saveToStorage(products);
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, updates) => {
  try {
    const products = getAllProducts();
    const idx = products.findIndex(p => p.id.toString() === id.toString());
    if (idx === -1) {
      throw new Error('Không tìm thấy sản phẩm!');
    }
    products[idx] = {
      ...products[idx],
      ...updates,
      id // Keep original ID
    };
    saveToStorage(products);
    return products[idx];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const products = getAllProducts();
    const filtered = products.filter(p => p.id.toString() !== id.toString());
    saveToStorage(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = (category) => {
  const allProducts = getAllProducts();
  if (category === 'all' || !category) {
    return allProducts;
  }
  return allProducts.filter(p => p.category === category);
};

// Get product by ID
export const getProductById = (id) => {
  const products = getAllProducts();
  return products.find(p => p.id.toString() === id.toString());
};

// Search products
export const searchProducts = (searchTerm) => {
  const products = getAllProducts();
  const term = searchTerm.toLowerCase().trim();
  return products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
};

// Get product categories with counts
export const getProductCategories = () => {
  const products = getAllProducts();
  const categories = {
    all: { name: 'Tất cả', count: products.length },
    tea: { name: 'Trà Sa Kê', count: 0 },
    'rice-milk': { name: 'Sữa Gạo Sa Kê', count: 0 },
    mochi: { name: 'Bánh Mochi Sa Kê', count: 0 },
    combo: { name: 'Combo Sa Kê', count: 0 }
  };

  products.forEach(p => {
    if (categories[p.category]) {
      categories[p.category].count++;
    }
  });

  return categories;
};

// Initialize on module load
(async () => {
  await initializeProducts();
})();
