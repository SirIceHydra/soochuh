import { useState, useCallback } from 'react';
import { generatePayFastPaymentData, submitPayFastPayment } from '../../../services/payfast';
import { createOrder } from '../../../services/orders';
import { validateCheckoutForm } from '../../../services/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../services/constants';

interface UseCheckoutReturn {
  loading: boolean;
  error: string | null;
  orderId: number | null;
  paymentUrl: string | null;
  createOrder: (cartItems: any[], formData: any, deliveryMethod?: string) => Promise<any>;
  processPayment: (orderId: number, orderNumber: string, customerData: any, cartItems?: any[]) => Promise<any>;
  clearError: () => void;
  resetCheckout: () => void;
}

export function useCheckout(): UseCheckoutReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const createOrderHandler = useCallback(async (
    cartItems: any[],
    formData: any,
    deliveryMethod: string = 'shipping'
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    setOrderId(null);
    setPaymentUrl(null);

    try {
      const validation = validateCheckoutForm(formData, deliveryMethod);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors).join(', '));
      }
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const order = await createOrder(cartItems, formData);
      setOrderId(order.id);

      return { success: true, orderId: order.id, orderNumber: order.number, message: SUCCESS_MESSAGES.ORDER_CREATED };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.ORDER_CREATION_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const processPayment = useCallback(async (
    orderId: number,
    orderNumber: string,
    customerData: any,
    cartItems: any[] = []
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const paymentData = generatePayFastPaymentData({
        orderId,
        orderNumber,
        customerName: `${customerData.firstName} ${customerData.lastName}`,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        amount: customerData.total,
        itemName: `Order #${orderNumber}`,
        itemDescription: `Soochuh Order #${orderNumber}`,
      });

      const paymentResponse = await submitPayFastPayment(paymentData);
      if (paymentResponse.success) {
        return {
          success: true,
          orderId,
          paymentId: paymentResponse.paymentId,
          message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
        };
      }
      
      if (paymentResponse.error === 'insufficient_stock') {
        return {
          success: false,
          error: 'insufficient_stock',
          message: paymentResponse.message || 'Items no longer available',
          redirectUrl: '/payment/failure?reason=out_of_stock'
        };
      }
      
      throw new Error(paymentResponse.error || ERROR_MESSAGES.PAYMENT_FAILED);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.PAYMENT_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const resetCheckout = useCallback(() => {
    setLoading(false);
    setError(null);
    setOrderId(null);
    setPaymentUrl(null);
  }, []);

  return { loading, error, orderId, paymentUrl, createOrder: createOrderHandler, processPayment, clearError, resetCheckout };
}
