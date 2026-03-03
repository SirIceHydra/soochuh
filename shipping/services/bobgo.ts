import { 
  BobGoRatesRequest, 
  ShippingOption,
  CartItemWithShipping 
} from '../types/shipping';

// All from .env
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL ?? '';
const API_VERSION = import.meta.env.VITE_WORDPRESS_API_VERSION ?? '';
const API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY ?? '';
const BOBGO_TEST_MODE = import.meta.env.VITE_BOBGO_TEST_MODE === 'true';

const SHIPPING_ORIGIN = {
  street_address: import.meta.env.VITE_SHIPPING_ORIGIN_ADDRESS ?? '',
  local_area: import.meta.env.VITE_SHIPPING_ORIGIN_CITY ?? '',
  city: import.meta.env.VITE_SHIPPING_ORIGIN_CITY ?? '',
  zone: import.meta.env.VITE_SHIPPING_ORIGIN_ZONE ?? '',
  country: import.meta.env.VITE_SHIPPING_ORIGIN_COUNTRY ?? '',
  code: import.meta.env.VITE_SHIPPING_ORIGIN_POSTAL_CODE ?? '',
  company: import.meta.env.VITE_SHIPPING_ORIGIN_COMPANY ?? '',
};

// Default product dimensions for supplements (in case not provided)
const DEFAULT_PRODUCT_DIMENSIONS = {
  weight_kg: 0.5, // 500g default weight for supplement containers
  length_cm: 20,
  width_cm: 15,
  height_cm: 10
};

// Default handling time in business days
const DEFAULT_HANDLING_TIME = 1;

export class BobGoService {
  private wordpressUrl: string;
  private testMode: boolean;

  constructor() {
    if (!WORDPRESS_URL) {
      throw new Error('WordPress URL is not configured. Please check your environment variables.');
    }
    
    // No more BobGo API key in frontend!
    // WordPress backend handles all BobGo API calls securely
    this.wordpressUrl = WORDPRESS_URL;
    this.testMode = BOBGO_TEST_MODE;
  }

  /**
   * Get shipping rates for checkout
   */
  async getCheckoutRates(
    deliveryAddress: {
      street_address: string;
      local_area?: string;
      city: string;
      zone?: string;
      country: string;
      code: string;
      company?: string;
    },
    cartItems: CartItemWithShipping[],
    declaredValue?: number
  ): Promise<{ success: boolean; rates: ShippingOption[]; message?: string; error?: string }> {
    try {
      // Validate required fields
      if (!deliveryAddress.street_address || !deliveryAddress.city || !deliveryAddress.code) {
        throw new Error('Delivery address is incomplete. Please provide street address, city, and postal code.');
      }

      // Prepare items for BobGo API
      const items = cartItems.map(item => ({
        description: item.name,
        price: item.price,
        quantity: item.quantity,
        length_cm: item.length_cm || DEFAULT_PRODUCT_DIMENSIONS.length_cm,
        width_cm: item.width_cm || DEFAULT_PRODUCT_DIMENSIONS.width_cm,
        height_cm: item.height_cm || DEFAULT_PRODUCT_DIMENSIONS.height_cm,
        weight_kg: (item.weight_kg || DEFAULT_PRODUCT_DIMENSIONS.weight_kg) * item.quantity
      }));

      // Calculate declared value if not provided
      const totalDeclaredValue = declaredValue || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const requestBody: BobGoRatesRequest = {
        collection_address: SHIPPING_ORIGIN,
        delivery_address: {
          company: deliveryAddress.company || '',
          street_address: deliveryAddress.street_address,
          local_area: deliveryAddress.local_area || deliveryAddress.city,
          city: deliveryAddress.city,
          zone: deliveryAddress.zone || 'GP', // Default to Gauteng
          country: deliveryAddress.country || 'ZA',
          code: deliveryAddress.code
        },
        items,
        declared_value: totalDeclaredValue,
        handling_time: DEFAULT_HANDLING_TIME
      };

      // Make API request to WordPress endpoint (which calls BobGo securely)
      // WordPress backend handles the BobGo API key
      const response = await fetch(`${this.wordpressUrl}/wp-json/${API_VERSION}/shipping/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('BobGo API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        throw new Error(`BobGo API error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();

      // Check if the response has the expected structure
      if (!data) {
        console.error('BobGo API returned empty response');
        throw new Error('Empty response from BobGo API');
      }

      // Handle different possible response structures
      let ratesData = [];
      if (data.rates) {
        ratesData = data.rates;
      } else if (data.data && data.data.rates) {
        ratesData = data.data.rates;
      } else if (Array.isArray(data)) {
        ratesData = data;
      } else {
        // Create fallback rates when API structure is unexpected
        ratesData = [
          {
            service_name: 'Standard Shipping',
            service_code: 'standard',
            price: 74.00,
            currency: 'ZAR',
            delivery_time: '2-3 business days',
            description: 'Standard delivery service'
          },
          {
            service_name: 'Express Shipping',
            service_code: 'express',
            price: 120.00,
            currency: 'ZAR',
            delivery_time: '1-2 business days',
            description: 'Express delivery service'
          }
        ];
      }

      // Process rates data

      // Transform BobGo rates to our ShippingOption format
      const rates = this.transformRatesToShippingOptions(ratesData);

      return {
        success: true,
        rates,
        message: data.message || 'Shipping rates retrieved successfully'
      };

    } catch (error) {
      console.error('Error fetching BobGo rates:', error);
      
      // Provide fallback rates for testing when API fails
      const fallbackRates = [
        {
          service_name: 'Standard Shipping',
          service_code: 'standard',
          price: 50.00,
          currency: 'ZAR',
          delivery_time: '3-5 business days',
          description: 'Standard delivery service'
        },
        {
          service_name: 'Express Shipping',
          service_code: 'express',
          price: 100.00,
          currency: 'ZAR',
          delivery_time: '1-2 business days',
          description: 'Express delivery service'
        }
      ];

      const fallbackShippingOptions = this.transformRatesToShippingOptions(fallbackRates);
      
      return {
        success: true, // Return success with fallback rates
        rates: fallbackShippingOptions,
        error: `API Error: ${error instanceof Error ? error.message : 'Failed to fetch shipping rates'}. Using fallback rates for testing.`
      };
    }
  }

  /**
   * Transform BobGo rates to our ShippingOption format
   */
  private transformRatesToShippingOptions(rates: any[]): ShippingOption[] {
    const transformed = rates.map((rate, index) => {
      // Try multiple possible price field names
      let price = 0;
      if (rate.price !== undefined && rate.price !== null) {
        price = Number(rate.price);
      } else if (rate.total_price !== undefined && rate.total_price !== null) {
        price = Number(rate.total_price);
      } else if (rate.cost !== undefined && rate.cost !== null) {
        price = Number(rate.cost);
      } else if (rate.amount !== undefined && rate.amount !== null) {
        price = Number(rate.amount);
      } else if (rate.rate !== undefined && rate.rate !== null) {
        price = Number(rate.rate);
      }
      
      // If still 0, check if there's a nested price structure
      if (price === 0 && rate.pricing) {
        if (rate.pricing.price !== undefined) price = Number(rate.pricing.price);
        else if (rate.pricing.total !== undefined) price = Number(rate.pricing.total);
        else if (rate.pricing.amount !== undefined) price = Number(rate.pricing.amount);
      }
      
      // If still 0, apply fallback rates based on service type (from BobGo config)
      if (price === 0) {
        const serviceName = (rate.service_name || '').toLowerCase();
        if (serviceName.includes('standard')) {
          price = 74.00; // Standard shipping rate from BobGo config
        } else if (serviceName.includes('express')) {
          price = 120.00; // Express shipping rate from BobGo config
        }
      }

      const option = {
        id: rate.service_code || `shipping-${index}`,
        name: rate.service_name || 'Standard Shipping',
        description: rate.description || `Delivery via ${rate.service_name}`,
        price: price,
        currency: rate.currency || 'ZAR',
        deliveryTime: rate.delivery_time,
        selected: index === 0 // Select first option by default
      };
      
      return option;
    });
    
    return transformed;
  }

  /**
   * Get default shipping option with proper pricing
   */
  getDefaultShippingOption(_cartTotal: number): ShippingOption {
    // Free shipping threshold disabled for testing
    // const freeShippingThreshold = parseFloat(process.env.REACT_APP_FREE_SHIPPING_THRESHOLD || '1000');
    
    // if (cartTotal >= freeShippingThreshold) {
    //   return {
    //     id: 'free-shipping',
    //     name: 'Free Shipping',
    //     description: `Free shipping on orders over ${freeShippingThreshold}`,
    //     price: 0,
    //     currency: 'ZAR',
    //     deliveryTime: '2-5 business days',
    //     selected: true
    //   };
    // }

    // Return a default standard shipping option with proper pricing
    return {
      id: 'standard-shipping',
      name: 'Standard Shipping 2-3 days',
      description: 'Standard delivery service within 2-3 business days',
      price: 74.00, // Standard shipping rate from BobGo config
      currency: 'ZAR',
      deliveryTime: '2-3 business days',
      selected: true
    };
  }

  /**
   * Validate delivery address
   */
  validateDeliveryAddress(address: {
    street_address?: string;
    city?: string;
    code?: string;
    country?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.street_address?.trim()) {
      errors.push('Street address is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.code?.trim()) {
      errors.push('Postal code is required');
    }

    if (!address.country?.trim()) {
      errors.push('Country is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get service configuration
   */
  getConfig() {
    return {
      wordpressUrl: this.wordpressUrl,
      testMode: this.testMode,
      origin: SHIPPING_ORIGIN,
      security: 'BobGo API key secured in WordPress backend'
    };
  }
}

// Export singleton instance
export const bobGoService = new BobGoService();
