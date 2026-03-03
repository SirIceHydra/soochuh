export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  tailWindClass: string; // For dynamic border/text colors
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  salePrice?: number; // New property for sale logic
  description: string;
  category: 'tops' | 'pants' | 'outerwear' | 'kits';
  colors: ColorVariant[];
  image: string;
  hoverImage: string; // New property for hover effect
  rating: number;
  reviews: number;
  features: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  selectedColor: ColorVariant;
  selectedSize: string;
  quantity: number;
  cartId: string; // Unique ID for the cart entry
}

export type ViewState = 'home' | 'product_detail' | 'collection';

export interface AiSuggestion {
  text: string;
  suggestedColorId?: string;
}