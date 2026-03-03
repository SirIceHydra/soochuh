// Shop – all from .env
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL ?? '';
const API_VERSION = import.meta.env.VITE_WORDPRESS_API_VERSION ?? '';

export type ShopPaymentProviderName = 'payfast' | 'mock' | 'paygate';

export interface ShopConfig {
  paymentProvider: ShopPaymentProviderName;
  currency: string;
  wooCommerce: {
    baseUrl: string;
    apiVersion: string;
    productsPerPage: number;
  };
  payfast: {
    returnUrl: string;
    cancelUrl: string;
    notifyUrl: string;
    testMode: boolean;
  };
}

export const ShopConfigFromExisting = (): ShopConfig => {
  return {
    paymentProvider: 'payfast',
    currency: 'ZAR',
    wooCommerce: {
      baseUrl: WORDPRESS_URL,
      apiVersion: API_VERSION,
      productsPerPage: 12,
    },
    payfast: {
      returnUrl: import.meta.env.VITE_PAYFAST_RETURN_URL ?? '',
      cancelUrl: import.meta.env.VITE_PAYFAST_CANCEL_URL ?? '',
      notifyUrl: import.meta.env.VITE_PAYFAST_NOTIFY_URL ?? '',
      testMode: import.meta.env.VITE_PAYFAST_TEST_MODE === 'true',
    },
  };
};
