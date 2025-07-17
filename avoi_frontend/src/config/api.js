// API Configuration
const API_BASE_URL = 'https://dyh6i3c9evn3.manus.space';

export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: API_BASE_URL,
  
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
  RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/api/products/${id}`,
  CATEGORIES: `${API_BASE_URL}/api/products/categories`,
  
  // Cart endpoints
  CART: `${API_BASE_URL}/api/cart/`,
  CART_ADD: `${API_BASE_URL}/api/cart/add`,
  CART_UPDATE: (itemId) => `${API_BASE_URL}/api/cart/update/${itemId}`,
  CART_REMOVE: (itemId) => `${API_BASE_URL}/api/cart/remove/${itemId}`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/api/orders/`,
  ORDER_CREATE: `${API_BASE_URL}/api/orders/create`,
  ORDER_DETAIL: (id) => `${API_BASE_URL}/api/orders/${id}`,
};

export default API_BASE_URL;

