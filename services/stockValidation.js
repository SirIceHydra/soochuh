// All from .env
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL ?? '';
const API_VERSION = import.meta.env.VITE_WORDPRESS_API_VERSION ?? '';
const API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY ?? '';

/**
 * Validate stock levels before payment processing
 */
export async function validateStockBeforePayment(cartItems) {
  try {
    const lineItems = cartItems.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
      ...(item.variationId && {
        variation_id: item.variationId,
        variation: item.variationAttributes || {}
      })
    }));

    const response = await fetch(`${WORDPRESS_URL}/wp-json/${API_VERSION}/validate-stock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        line_items: lineItems
      }),
    });

    if (!response.ok) {
      throw new Error(`Stock validation API error: ${response.status}`);
    }

    const result = await response.json();

    // Return validation result
    return {
      success: result.success,
      valid: result.valid,
      error: result.error,
      message: result.message,
      redirectUrl: result.redirect_url,
      validationResults: result.validation_results
    };

  } catch (error) {
    console.error('Error validating stock:', error);
    return {
      success: false,
      valid: false,
      error: 'validation_failed',
      message: 'Unable to validate stock levels. Please try again.',
    };
  }
}
