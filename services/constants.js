// Constants for Soochuh e-commerce

export const DEFAULTS = {
  COUNTRY: 'ZA',
  CURRENCY: 'ZAR',
  PAYMENT_METHOD: 'payfast',
  CART_STORAGE_KEY: 'soochuh-cart',
  PAGE: 1,
  PER_PAGE: 12,
};

export const ERROR_MESSAGES = {
  API_ERROR: 'API request failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  ORDER_CREATION_FAILED: 'Failed to create order. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  PRODUCT_OUT_OF_STOCK: 'This product is currently out of stock.',
  CART_EMPTY: 'Your cart is empty.',
};

export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully.',
  PAYMENT_SUCCESS: 'Payment completed successfully.',
};
