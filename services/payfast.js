// PayFast – all from .env
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL ?? '';
const API_VERSION = import.meta.env.VITE_WORDPRESS_API_VERSION ?? '';
const API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY ?? '';

/**
 * Generate PayFast payment data for checkout
 * This is now a simple data formatter - NO SECRETS OR SIGNATURE GENERATION
 * All security is handled by WordPress backend
 */
export function generatePayFastPaymentData({ orderId, orderNumber, customerName, customerEmail, customerPhone, amount, itemName, itemDescription }) {
  // Split customer name properly
  const nameParts = (customerName || '').trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Create payment data WITHOUT merchant credentials or signature
  // WordPress backend will add these securely
  const paymentData = {
    name_first: firstName,
    name_last: lastName,
    email_address: customerEmail,
    cell_number: customerPhone && customerPhone.trim() ? customerPhone.trim() : undefined,
    amount: Number(amount || 0).toFixed(2),
    item_name: itemName,
    item_description: itemDescription || itemName,
    custom_str1: String(orderId),
    custom_str2: String(orderNumber),
    custom_str3: 'Soochuh',
    return_url: import.meta.env.VITE_PAYFAST_RETURN_URL ?? '',
    cancel_url: import.meta.env.VITE_PAYFAST_CANCEL_URL ?? '',
  };
  
  return paymentData;
}

/**
 * Submit PayFast payment via WordPress secure endpoint
 * WordPress backend handles all secrets and signature generation
 */
export async function submitPayFastPayment(paymentData) {
  try {
    // Call WordPress endpoint to generate PayFast payment data with signature
    const response = await fetch(`${WORDPRESS_URL}/wp-json/${API_VERSION}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        customer_name: paymentData.name_first + ' ' + (paymentData.name_last || ''),
        customer_email: paymentData.email_address,
        customer_phone: paymentData.cell_number,
        amount: paymentData.amount,
        item_name: paymentData.item_name,
        item_description: paymentData.item_description || paymentData.item_name,
        order_id: paymentData.custom_str1,
        order_number: paymentData.custom_str2,
        return_url: paymentData.return_url,
        cancel_url: paymentData.cancel_url,
      }),
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const result = await response.json();
    if (import.meta.env.DEV) {
      const fd = result?.form_data ?? result?.formData ?? result?.fields ?? result?.data ?? null;
      const purl = result?.payment_url ?? result?.url ?? result?.process_url ?? null;
      console.log('PayFast create response', { status: response.status, payment_url: purl, has_form_html: typeof result?.form_html === 'string', field_keys: fd ? Object.keys(fd) : null, raw: result });
    }

    // Handle stock validation responses
    if (!result.success) {
      if (result.error === 'insufficient_stock') {
        window.location.href = result.redirect_url || '/payment/failure?reason=out_of_stock';
        return {
          success: false,
          error: 'insufficient_stock',
          message: result.message || 'Items no longer available'
        };
      }
      throw new Error(result.error || 'Failed to create payment');
    }

    const paymentUrl = result.payment_url || result.url || result.process_url;
    const formData = result.form_data || result.formData || result.fields || result.data;
    const formHtml = typeof result.form_html === 'string' ? result.form_html : null;
    if (!paymentUrl) {
      throw new Error('Missing payment URL from backend');
    }
    if ((!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) && !formHtml) {
      if (import.meta.env.DEV) {
        console.error('PayFast: missing form data', result);
      }
      throw new Error('Missing PayFast form data from backend');
    }
    const requiredKeys = [
      'merchant_id',
      'merchant_key',
      'amount',
      'item_name',
      'name_first',
      'email_address',
      'signature'
    ];
    if (formData) {
      const missing = requiredKeys.filter(k => !formData[k] || String(formData[k]).trim().length === 0);
      if (missing.length > 0 && !formHtml) {
        if (import.meta.env.DEV) {
          console.error('PayFast: missing required keys', missing, formData);
        }
        throw new Error('PayFast form incomplete from backend');
      }
    }
    let normalizedUrl = paymentUrl;
    try {
      const u = new URL(paymentUrl);
      const isPayfastDomain = /\.payfast\.co\.za$/.test(u.hostname);
      if (isPayfastDomain && !u.pathname.includes('/eng/process')) {
        u.pathname = '/eng/process';
        normalizedUrl = u.toString();
      }
    } catch {}
    const offscreenStyle = 'position:fixed;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;opacity:0;';
    if (formHtml) {
      const container = document.createElement('div');
      container.setAttribute('style', offscreenStyle);
      container.innerHTML = formHtml;
      document.body.appendChild(container);
      const form = container.querySelector('form');
      if (!form) throw new Error('Missing form element in backend HTML');
      form.action = normalizedUrl;
      form.method = 'POST';
      form.setAttribute('style', offscreenStyle);
      form.submit();
    } else {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = normalizedUrl;
      form.setAttribute('style', offscreenStyle);
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        const v = String(value);
        if (v.length === 0) return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = v;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    }
    
    return {
      success: true,
      paymentId: result.payment_id,
      redirectUrl: normalizedUrl,
    };
  } catch (error) {
    console.error('PayFast payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment submission failed',
    };
  }
}
