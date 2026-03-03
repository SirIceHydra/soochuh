import { apiPost, apiPut } from './api';

export async function createOrder(cartItems, customer) {
  const line_items = (cartItems || []).map(i => {
    const item = { 
      product_id: i.productId, 
      quantity: i.quantity, 
      name: i.name, 
      price: String(i.price) 
    };
    
    // ADD VARIATION DATA
    if (i.variationId) {
      item.variation_id = i.variationId;
      
      // ADD VARIATION ATTRIBUTES FOR WOOCOMMERCE
      if (i.variationAttributes) {
        item.variation = i.variationAttributes;
      }
    }
    
    // ADD CUSTOM OPTIONS (dynamic addons keyed by label per Kaizen Customiser API)
    const metaEntries = [];
    if (i.embroideryName) {
      metaEntries.push({ key: 'Name for embroidery', value: i.embroideryName });
    }
    if (i.productAddons && typeof i.productAddons === 'object') {
      for (const [key, value] of Object.entries(i.productAddons)) {
        if (value != null && value !== '') {
          metaEntries.push({ key: String(key), value: String(value) });
        }
      }
    }
    if (metaEntries.length) {
      item.meta_data = metaEntries;
    }
    
    return item;
  });
  const subtotal = (cartItems || []).reduce((s, i) => s + (i.price * i.quantity), 0);
  const shippingTotal = Number(customer.shippingCost || 0);
  
  // Handle different delivery methods with appropriate address data
  const deliveryMethod = customer.deliveryMethod || 'shipping';
  
  // Create billing address (always use customer data)
  const billingAddress = {
    first_name: customer.firstName,
    last_name: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    address_1: customer.address || 'Not provided',
    city: customer.city || 'Not provided',
    postcode: customer.postalCode || '0000',
    country: customer.country || 'South Africa',
    state: customer.province || undefined,
  };
  
  // Create shipping address based on delivery method
  let shippingAddress;
  if (deliveryMethod === 'collect') {
    // Collect from store - use store address
    shippingAddress = {
      first_name: customer.firstName,
      last_name: customer.lastName,
      address_1: 'Store Collection - Soochuh',
      city: 'Store Location',
      postcode: '0000',
      country: 'South Africa',
      state: 'GP',
    };
  } else if (deliveryMethod === 'pudo') {
    // PUDO locker - use customer address or default
    shippingAddress = {
      first_name: customer.firstName,
      last_name: customer.lastName,
      address_1: customer.address || 'PUDO Locker Collection',
      city: customer.city || 'PUDO Location',
      postcode: customer.postalCode || '0000',
      country: customer.country || 'South Africa',
      state: customer.province || 'GP',
    };
  } else {
    // Regular shipping - use customer address
    shippingAddress = {
      first_name: customer.firstName,
      last_name: customer.lastName,
      address_1: customer.address,
      city: customer.city,
      postcode: customer.postalCode,
      country: customer.country,
      state: customer.province || undefined,
    };
  }
  
  const orderData = {
    payment_method: 'payfast',
    payment_method_title: 'PayFast',
    set_paid: false,
    billing: billingAddress,
    shipping: shippingAddress,
    line_items,
    shipping_lines: [{
      method_id: String(customer.shippingMethodId || 'flat_rate'),
      method_title: String(customer.shippingMethodTitle || 'Shipping'),
      total: String(shippingTotal.toFixed(2))
    }],
    total: String((subtotal + shippingTotal).toFixed(2)),
    status: 'pending',
    customer_note: `Order placed via Soochuh frontend - ${deliveryMethod === 'collect' ? 'Store Collection' : deliveryMethod === 'pudo' ? 'PUDO Locker' : 'Shipping'}`,
  };
  const r = await apiPost('/orders', orderData);
  
  // Handle WordPress backend response format
  if (r.success) {
    return {
      id: r.order_id || r.id,
      number: r.order_number || r.number,
      status: r.status || 'pending',
    };
  }
  
  return {
    id: r.id,
    number: r.number,
    status: r.status || 'pending',
  };
}

export async function updateOrderStatus(orderId, status) {
  return await apiPut(`/orders/${orderId}`, { status });
}
