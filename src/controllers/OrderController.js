import { getProductById } from './ProductController';

// Local storage key
const ORDERS_KEY = 'sakefruit_orders';

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',           // Chờ xác nhận
  CONFIRMED: 'confirmed',       // Đã xác nhận
  PREPARING: 'preparing',       // Đang chuẩn bị
  DELIVERING: 'delivering',     // Đang giao
  COMPLETED: 'completed',       // Hoàn thành
  CANCELLED: 'cancelled'        // Đã hủy
};

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PREPARING]: 'Đang chuẩn bị',
  [ORDER_STATUS.DELIVERING]: 'Đang giao hàng',
  [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

// Can Tho districts
export const CAN_THO_DISTRICTS = [
  'Ninh Kiều',
  'Bình Thủy',
  'Cái Răng',
  'Ô Môn',
  'Thốt Nốt',
  'Phong Điền',
  'Cờ Đỏ',
  'Vĩnh Thạnh',
  'Thới Lai'
];

// Initial mock orders to seed the system
const defaultOrders = [
  {
    id: 'ORD1718223301234',
    _id: 'ORD1718223301234',
    userId: 2, // customer 1 (user01)
    customerInfo: {
      fullname: 'Nguyễn Văn A',
      email: 'user01@gmail.com',
      phone: '0123456789',
      address: '123 Đường 3/2, Ninh Kiều',
      district: 'Ninh Kiều',
      ward: 'Xuân Khánh',
      notes: 'Giao hàng giờ hành chính'
    },
    items: [
      {
        id: 'prod_1',
        productId: 'prod_1',
        name: 'Trà lá sa kê',
        price: 10000,
        quantity: 2,
        image: '/assets/images/Trà sake.png',
        category: 'tea'
      },
      {
        id: 'prod_6',
        productId: 'prod_6',
        name: 'Bánh mochi dâu',
        price: 20000,
        quantity: 1,
        image: '/assets/images/banhmochi.jpg',
        category: 'mochi'
      }
    ],
    totalAmount: 40000,
    paymentMethod: 'cod',
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        note: 'Đơn hàng được tạo thành công'
      }
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'ORD1718223305678',
    _id: 'ORD1718223305678',
    userId: 2,
    customerInfo: {
      fullname: 'Nguyễn Văn A',
      email: 'user01@gmail.com',
      phone: '0123456789',
      address: '123 Đường 3/2, Ninh Kiều',
      district: 'Ninh Kiều',
      ward: 'Xuân Khánh',
      notes: ''
    },
    items: [
      {
        id: 'prod_2',
        productId: 'prod_2',
        name: 'Sữa gạo sa kê nguyên bản',
        price: 15000,
        quantity: 3,
        image: '/assets/images/suagao.png',
        category: 'rice-milk'
      }
    ],
    totalAmount: 45000,
    paymentMethod: 'cod',
    status: 'completed',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        note: 'Đơn hàng được tạo thành công'
      },
      {
        status: 'completed',
        timestamp: new Date(Date.now() - 80000000).toISOString(),
        note: 'Giao hàng thành công'
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Initialize orders in localStorage if empty
const getStoredOrders = () => {
  let stored = localStorage.getItem(ORDERS_KEY);
  let needsReset = false;
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.some(order => order.items.some(item => item.name === 'Trà Sa Kê Ô Long Cao Cấp'))) {
      needsReset = true;
    }
  }

  if (!stored || needsReset) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
    stored = JSON.stringify(defaultOrders);
  }
  return JSON.parse(stored);
};

// Create new order (Local Storage)
export const createOrder = async (orderData) => {
  try {
    const orders = getStoredOrders();
    
    // Resolve current user info
    const currentUserStr = localStorage.getItem('sakefruit_current_user');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    const userId = currentUser ? currentUser.id : 'guest';

    // Resolve details from ProductController
    const resolvedItems = orderData.items.map(item => {
      const prod = getProductById(item.id || item.productId);
      return {
        id: item.id || item.productId,
        productId: item.id || item.productId,
        name: prod ? prod.name : item.name || 'Sản phẩm',
        price: prod ? prod.price : item.price || 0,
        quantity: item.quantity,
        image: prod ? prod.image : item.image || '',
        category: prod ? prod.category : item.category || ''
      };
    });

    const totalAmount = resolvedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'ORD' + Date.now();

    const newOrder = {
      id: orderId,
      _id: orderId,
      userId: userId,
      customerInfo: {
        fullname: orderData.fullname,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        district: orderData.district,
        ward: orderData.ward,
        notes: orderData.notes || ''
      },
      items: resolvedItems,
      totalAmount: totalAmount,
      paymentMethod: orderData.paymentMethod || 'cod',
      status: ORDER_STATUS.PENDING,
      statusHistory: [{
        status: ORDER_STATUS.PENDING,
        timestamp: new Date().toISOString(),
        note: 'Đơn hàng được tạo thành công'
      }],
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Dispatch custom event to notify components/tabs about new orders
    window.dispatchEvent(new Event('newNotification'));

    return newOrder;
  } catch (error) {
    console.error('Error creating order locally:', error);
    throw error;
  }
};

// Get user's orders
export const getOrdersByUserId = async () => {
  try {
    const currentUserStr = localStorage.getItem('sakefruit_current_user');
    if (!currentUserStr) {
      return [];
    }
    const currentUser = JSON.parse(currentUserStr);
    const userId = currentUser.id;

    const orders = getStoredOrders();
    // Filter matching user ID (both string/number checks)
    return orders.filter(order => order.userId.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching orders locally:', error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const orders = getStoredOrders();
    const order = orders.find(o => o.id.toString() === orderId.toString() || o._id.toString() === orderId.toString());
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng!');
    }
    return order;
  } catch (error) {
    console.error('Error fetching order locally:', error);
    throw error;
  }
};

// Get all orders (Admin only)
export const getAllOrders = async () => {
  try {
    const orders = getStoredOrders();
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching all orders locally:', error);
    return [];
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (orderId, newStatus, note = '') => {
  try {
    const orders = getStoredOrders();
    const idx = orders.findIndex(o => o.id.toString() === orderId.toString() || o._id.toString() === orderId.toString());
    if (idx === -1) {
      throw new Error('Đơn hàng không tồn tại!');
    }

    const currentOrder = orders[idx];
    currentOrder.status = newStatus;
    
    if (!currentOrder.statusHistory) {
      currentOrder.statusHistory = [];
    }

    currentOrder.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Cập nhật trạng thái sang ${ORDER_STATUS_TEXT[newStatus]}`
    });

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return currentOrder;
  } catch (error) {
    console.error('Error updating order status locally:', error);
    throw error;
  }
};

// Helper functions for statistics (work with local storage data)
export const getOrdersStatistics = async () => {
  try {
    const orders = await getAllOrders();
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === ORDER_STATUS.PENDING).length,
      confirmed: orders.filter(o => o.status === ORDER_STATUS.CONFIRMED).length,
      preparing: orders.filter(o => o.status === ORDER_STATUS.PREPARING).length,
      delivering: orders.filter(o => o.status === ORDER_STATUS.DELIVERING).length,
      completed: orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length,
      cancelled: orders.filter(o => o.status === ORDER_STATUS.CANCELLED).length,
      totalRevenue: orders
        .filter(o => o.status === ORDER_STATUS.COMPLETED)
        .reduce((sum, order) => sum + order.totalAmount, 0)
    };
  } catch (error) {
    console.error('Error getting statistics locally:', error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      delivering: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0
    };
  }
};

export const getTodayOrders = async () => {
  try {
    const orders = await getAllOrders();
    const today = new Date().toISOString().split('T')[0];
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === today;
    });
  } catch (error) {
    console.error('Error getting today orders locally:', error);
    return [];
  }
};

export const getOrdersByStatus = async (status) => {
  try {
    const orders = await getAllOrders();
    return orders.filter(order => order.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting orders by status locally:', error);
    return [];
  }
};
