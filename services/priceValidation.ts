import { apiPost } from './api';
import { PriceValidationResponse, PriceValidation } from '../types/product';
import { CartItem } from '../types/cart';

/**
 * Validates cart item prices against current WooCommerce prices
 * Prevents customers from paying stale/outdated prices
 */
export const validateCartPrices = async (cartItems: CartItem[]): Promise<PriceValidationResponse> => {
  try {
    // Prepare cart items for validation
    const itemsForValidation = cartItems.map(item => ({
      product_id: item.productId,
      variation_id: item.variationId || 0,
      price: item.price
    }));

    const response = await apiPost('/products/validate-prices', itemsForValidation);
    
    if (response.success) {
      return response;
    } else {
      throw new Error('Price validation failed');
    }
  } catch (error) {
    console.error('Error validating prices:', error);
    throw error;
  }
};

/**
 * Checks if any prices have changed and returns the changes
 */
export const getPriceChanges = (validations: PriceValidation[]): {
  hasChanges: boolean;
  changes: PriceValidation[];
  totalDifference: number;
} => {
  const changes = validations.filter(v => v.priceChanged);
  const totalDifference = changes.reduce((sum, change) => sum + change.priceDifference, 0);

  return {
    hasChanges: changes.length > 0,
    changes,
    totalDifference
  };
};

/**
 * Formats price change information for user display
 */
export const formatPriceChangeMessage = (changes: PriceValidation[]): string => {
  if (changes.length === 0) {
    return '';
  }

  const totalDifference = changes.reduce((sum, change) => sum + change.priceDifference, 0);
  const isIncrease = totalDifference > 0;
  const absDifference = Math.abs(totalDifference);

  if (changes.length === 1) {
    const change = changes[0];
    return `The price of "${change.productId}" has ${isIncrease ? 'increased' : 'decreased'} by R${absDifference.toFixed(2)}.`;
  } else {
    return `${changes.length} items have had price changes. Total ${isIncrease ? 'increase' : 'decrease'}: R${absDifference.toFixed(2)}.`;
  }
};

/**
 * Creates a user-friendly notification for price changes
 */
export const createPriceChangeNotification = (changes: PriceValidation[]): {
  type: 'info' | 'warning';
  title: string;
  message: string;
  details?: string[];
} => {
  const totalDifference = changes.reduce((sum, change) => sum + change.priceDifference, 0);
  const isIncrease = totalDifference > 0;
  const absDifference = Math.abs(totalDifference);

  const details = changes.map(change => {
    const diff = Math.abs(change.priceDifference);
    const direction = change.priceDifference > 0 ? 'increased' : 'decreased';
    return `Product ${change.productId}: ${direction} by R${diff.toFixed(2)}`;
  });

  return {
    type: isIncrease ? 'warning' : 'info',
    title: isIncrease ? 'Price Updates' : 'Price Reductions',
    message: isIncrease 
      ? `Some items in your cart have increased in price. Total increase: R${absDifference.toFixed(2)}.`
      : `Great news! Some items in your cart have decreased in price. Total savings: R${absDifference.toFixed(2)}.`,
    details
  };
};

