import { useState, useCallback } from 'react';
import { bobGoService } from '../services/bobgo';
import { ShippingRates, CartItemWithShipping } from '../types/shipping';

interface UseShippingReturn {
  shippingRates: ShippingRates;
  fetchShippingRates: (
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
  ) => Promise<void>;
  selectShippingOption: (optionId: string) => void;
  clearShippingRates: () => void;
  getSelectedShippingCost: () => number;
  isAddressValid: (address: any) => { isValid: boolean; errors: string[] };
}

export function useShipping(): UseShippingReturn {
  const [shippingRates, setShippingRates] = useState<ShippingRates>({
    options: [],
    loading: false,
    error: null,
    selectedOption: null
  });

  const fetchShippingRates = useCallback(async (
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
  ) => {
    setShippingRates(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Validate address
      const addressValidation = bobGoService.validateDeliveryAddress(deliveryAddress);
      if (!addressValidation.isValid) {
        throw new Error(`Invalid delivery address: ${addressValidation.errors.join(', ')}`);
      }

      // Check if cart has items
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Check free shipping threshold
      const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const freeShippingThreshold = parseFloat(process.env.REACT_APP_FREE_SHIPPING_THRESHOLD || '1000');
      
      if (cartTotal >= freeShippingThreshold) {
        const freeShippingOption = {
          id: 'free_shipping',
          name: 'Free Shipping',
          description: `Free shipping on orders over R${freeShippingThreshold}`,
          price: 0,
          currency: 'ZAR',
          deliveryTime: '3-5 business days',
          selected: true
        };
        
        setShippingRates({
          options: [freeShippingOption],
          loading: false,
          error: null,
          selectedOption: freeShippingOption
        });
        return;
      }

      // Fetch rates from BobGo
      const result = await bobGoService.getCheckoutRates(deliveryAddress, cartItems, declaredValue);

      if (result.success && result.rates.length > 0) {
        setShippingRates({
          options: result.rates,
          loading: false,
          error: null,
          selectedOption: result.rates.find(option => option.selected) || result.rates[0]
        });
      } else {
        // Fallback to default shipping option
        const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const defaultOption = bobGoService.getDefaultShippingOption(cartTotal);
        setShippingRates({
          options: [defaultOption],
          loading: false,
          error: result.error || 'No shipping rates available',
          selectedOption: defaultOption
        });
      }
    } catch (error) {
      console.error('Error fetching shipping rates:', error);
      const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const defaultOption = bobGoService.getDefaultShippingOption(cartTotal);
      
      setShippingRates({
        options: [defaultOption],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch shipping rates',
        selectedOption: defaultOption
      });
    }
  }, []);

  const selectShippingOption = useCallback((optionId: string) => {
    setShippingRates(prev => {
      const updatedOptions = prev.options.map(option => ({
        ...option,
        selected: option.id === optionId
      }));
      
      const selectedOption = updatedOptions.find(option => option.id === optionId) || null;

      return {
        ...prev,
        options: updatedOptions,
        selectedOption
      };
    });
  }, []);

  const clearShippingRates = useCallback(() => {
    setShippingRates({
      options: [],
      loading: false,
      error: null,
      selectedOption: null
    });
  }, []);

  const getSelectedShippingCost = useCallback((): number => {
    return shippingRates.selectedOption?.price || 0;
  }, [shippingRates.selectedOption]);

  const isAddressValid = useCallback((address: any): { isValid: boolean; errors: string[] } => {
    return bobGoService.validateDeliveryAddress(address);
  }, []);

  return {
    shippingRates,
    fetchShippingRates,
    selectShippingOption,
    clearShippingRates,
    getSelectedShippingCost,
    isAddressValid
  };
}
