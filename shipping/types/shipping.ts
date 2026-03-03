// TypeScript interfaces for BobGo shipping integration

export interface BobGoAddress {
  company?: string;
  street_address: string;
  local_area: string;
  city: string;
  zone: string;
  country: string;
  code: string;
  lat?: number;
  lng?: number;
}

export interface BobGoItem {
  description: string;
  price: number;
  quantity: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg: number;
}

export interface BobGoRatesRequest {
  collection_address: BobGoAddress;
  delivery_address: BobGoAddress;
  items: BobGoItem[];
  declared_value: number;
  handling_time: number;
}

export interface BobGoRate {
  service_name: string;
  service_code: string;
  price: number;
  currency: string;
  delivery_time?: string;
  description?: string;
}

export interface BobGoRatesResponse {
  success: boolean;
  rates: BobGoRate[];
  error?: string;
  message?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  deliveryTime?: string;
  selected: boolean;
}

export interface ShippingRates {
  options: ShippingOption[];
  loading: boolean;
  error: string | null;
  selectedOption: ShippingOption | null;
}

import { CartItem, Cart } from '../../types/cart';

// Cart item extended with shipping dimensions
export interface CartItemWithShipping extends CartItem {
  weight_kg?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  // Ensure all CartItem properties are available
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stockStatus: string;
}

// Updated cart interface with shipping
export interface CartWithShipping extends Cart {
  shipping: ShippingRates;
  subtotal: number;
  shippingCost: number;
  totalWithShipping: number;
}
