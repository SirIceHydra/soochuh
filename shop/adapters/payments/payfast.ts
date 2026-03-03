import { PaymentProvider, PaymentStartRequest, PaymentStartResult } from '../../core/ports';
import { generatePayFastPaymentData, submitPayFastPayment } from '../../../services/payfast';

export const PayFastPaymentProvider: PaymentProvider = {
  async startPayment(req: PaymentStartRequest): Promise<PaymentStartResult> {
    const data = generatePayFastPaymentData({
      orderId: req.orderId,
      orderNumber: req.orderNumber,
      customerName: req.customerName,
      customerEmail: req.customerEmail,
      customerPhone: req.customerPhone,
      amount: req.amount,
      itemName: req.itemName,
      itemDescription: req.itemDescription,
    });

    // SECURITY UPDATE: Use WordPress secure endpoint instead of client-side form generation
    // This will call the WordPress backend which handles all PayFast secrets and signature generation
    const result = await submitPayFastPayment(data);

    if (!result.success) {
      throw new Error(result.error || 'Payment initialization failed');
    }

    return {
      method: 'redirect-url',
      url: result.redirectUrl,
      fields: {}, // WordPress handles all form data generation
    };
  },
};


