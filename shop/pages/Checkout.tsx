import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useCart } from '../core/cart/CartContext';
import { useCheckout } from '../core/hooks/useCheckout';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Truck, Zap, Store } from 'lucide-react';

const DELIVERY_OPTIONS = [
  { id: 'standard', method: 'shipping' as const, methodId: 'flat_rate', methodTitle: 'Standard Delivery', cost: 75, label: 'Standard', description: '2–4 business days', icon: Truck },
  { id: 'express', method: 'shipping' as const, methodId: 'flat_rate', methodTitle: 'Express Delivery', cost: 120, label: 'Express', description: '1–2 business days', icon: Zap },
  { id: 'collect', method: 'collect' as const, methodId: 'local_pickup', methodTitle: 'Collect from Store', cost: 0, label: 'Collect from Store', description: 'Pick up at our store', icon: Store },
];

const SA_PROVINCES = [
  { value: '', label: 'Select province' },
  { value: 'EC', label: 'Eastern Cape' },
  { value: 'FS', label: 'Free State' },
  { value: 'GP', label: 'Gauteng' },
  { value: 'KZN', label: 'KwaZulu-Natal' },
  { value: 'LP', label: 'Limpopo' },
  { value: 'MP', label: 'Mpumalanga' },
  { value: 'NC', label: 'Northern Cape' },
  { value: 'NW', label: 'North West' },
  { value: 'WC', label: 'Western Cape' },
];

export default function Checkout() {
  const { cart } = useCart();
  const { loading, error, createOrder, processPayment } = useCheckout();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'processing'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'South Africa',
    province: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedDelivery, setSelectedDelivery] = useState<typeof DELIVERY_OPTIONS[0] | null>(null);

  const postcodeEntered = (formData.postalCode || '').trim().length >= 4;
  const FREE_SHIPPING_THRESHOLD = Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD ?? 0);
  const freeShipping = cart.total >= FREE_SHIPPING_THRESHOLD;
  const baseShipping = selectedDelivery?.cost ?? 0;
  const shipping = selectedDelivery?.method === 'shipping' && freeShipping ? 0 : baseShipping;
  const total = cart.total + shipping;
  const options = (() => {
    if (!freeShipping) return DELIVERY_OPTIONS;
    const standard = { ...DELIVERY_OPTIONS.find(o => o.id === 'standard')!, cost: 0, methodTitle: 'Free Shipping' };
    const collect = DELIVERY_OPTIONS.find(o => o.id === 'collect')!;
    return [standard, collect];
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'Required';
    if (!formData.lastName.trim()) errors.lastName = 'Required';
    if (!formData.email.trim()) errors.email = 'Required';
    if (!formData.phone.trim()) errors.phone = 'Required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Required';

    if (selectedDelivery?.method === 'shipping') {
      if (!formData.address.trim()) errors.address = 'Required';
      if (!formData.city.trim()) errors.city = 'Required';
      if (!formData.province.trim()) errors.province = 'Required';
    }

    if (!selectedDelivery) errors.delivery = 'Please select a delivery option';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setStep('processing');
    const orderResult = await createOrder(
      cart.items,
      {
        ...formData,
        total,
        shippingCost: selectedDelivery!.method === 'shipping' && freeShipping ? 0 : selectedDelivery!.cost,
        deliveryMethod: selectedDelivery!.method,
        shippingMethodId: selectedDelivery!.methodId,
        shippingMethodTitle: selectedDelivery!.method === 'shipping' && freeShipping ? 'Free Shipping' : selectedDelivery!.methodTitle,
      },
      selectedDelivery!.method
    );

    if (orderResult.success && orderResult.orderId && orderResult.orderNumber) {
      const paymentResult = await processPayment(
        orderResult.orderId,
        orderResult.orderNumber,
        { ...formData, total }
      );

      if (!paymentResult.success) {
        navigate('/payment/failure');
      }
    } else {
      navigate('/payment/failure');
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet><title>Checkout | Soochuh</title></Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-2xl sm:text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6 sm:mb-10 text-purple-600">
            Checkout
          </h1>

          {step === 'processing' ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-zinc-500 font-bold uppercase tracking-widest">Processing your order...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col xl:grid xl:grid-cols-3 gap-6 sm:gap-8">
              <div className="xl:col-span-2 space-y-6 order-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tighter mb-4">Contact &amp; Address</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest mb-2">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base touch-manipulation"
                      />
                      {formErrors.firstName && <p className="text-red-600 text-xs mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base touch-manipulation"
                      />
                      {formErrors.lastName && <p className="text-red-600 text-xs mt-1">{formErrors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base touch-manipulation"
                      />
                      {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest mb-2">Phone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base touch-manipulation"
                      />
                      {formErrors.phone && <p className="text-red-600 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold uppercase tracking-widest mb-2">Address {selectedDelivery?.method === 'shipping' ? '*' : ''}</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder={selectedDelivery?.method === 'collect' ? 'Not required for store collection' : ''}
                        className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base touch-manipulation"
                      />
                      {formErrors.address && <p className="text-red-600 text-xs mt-1">{formErrors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest mb-2">City {selectedDelivery?.method === 'shipping' ? '*' : ''}</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder={selectedDelivery?.method === 'collect' ? 'Not required for store collection' : ''}
                        className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base touch-manipulation"
                      />
                      {formErrors.city && <p className="text-red-600 text-xs mt-1">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest mb-2">Postal Code *</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => {
                          setFormData({ ...formData, postalCode: e.target.value });
                          setSelectedDelivery(null);
                        }}
                        placeholder="e.g. 2000"
                        className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base touch-manipulation"
                      />
                      {formErrors.postalCode && <p className="text-red-600 text-xs mt-1">{formErrors.postalCode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-widest mb-2">Province {selectedDelivery?.method === 'shipping' ? '*' : ''}</label>
                      <select
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white text-base touch-manipulation min-h-[48px]"
                      >
                        {SA_PROVINCES.map((p) => (
                          <option key={p.value || 'empty'} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                      {formErrors.province && <p className="text-red-600 text-xs mt-1">{formErrors.province}</p>}
                    </div>
                  </div>
                </div>

                {/* Delivery options — shown after postcode is entered */}
                <div className="bg-zinc-50 border border-zinc-200 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tighter mb-4">Delivery</h2>
                  {postcodeEntered ? (
                    <div className="space-y-3">
                      <p className="text-sm font-bold uppercase tracking-widest text-zinc-600">Choose delivery method</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {options.map((opt) => {
                          const Icon = opt.icon;
                          const isSelected = selectedDelivery?.id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedDelivery(opt)}
                              className={`p-4 min-h-[80px] border-2 text-left transition-colors rounded-sm flex flex-col gap-1 touch-manipulation ${
                                isSelected
                                  ? 'border-purple-600 bg-purple-50'
                                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
                              }`}
                            >
                              <Icon className="w-5 h-5 text-purple-600" />
                              <span className="font-bold uppercase tracking-tight">{opt.label}</span>
                              <span className="text-xs text-zinc-500">{opt.description}</span>
                              <span className="font-black text-sm mt-1">
                                {opt.cost === 0 ? 'Free' : `R${opt.cost.toFixed(2)}`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {formErrors.delivery && <p className="text-red-600 text-xs mt-1">{formErrors.delivery}</p>}
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-sm">Enter your postal code above to see delivery options.</p>
                  )}
                </div>
              </div>

              <div className="xl:col-span-1 order-2">
                <div className="bg-zinc-50 border border-zinc-200 p-6 sm:p-8 xl:sticky xl:top-32 rounded-sm">
                  <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tighter mb-6 sm:mb-8">Order Summary</h2>
                  <div className="space-y-5 mb-8">
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-zinc-600 text-sm">Subtotal</span>
                      <span className="font-bold tabular-nums">R{cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-zinc-600 text-sm">Delivery</span>
                      <span className="font-bold text-right tabular-nums min-w-[10ch]">
                        {selectedDelivery
                          ? (selectedDelivery.method === 'collect'
                            ? 'Collect from Store'
                            : (shipping === 0 ? 'Free' : `R${shipping.toFixed(2)}`))
                          : postcodeEntered
                          ? 'Select an option'
                          : 'Enter postcode'}
                      </span>
                    </div>
                    <div className="border-t border-zinc-200 pt-5 mt-6 flex justify-between items-baseline gap-4">
                      <span className="font-black text-lg">Total</span>
                      <span className="font-black text-lg tabular-nums">R{total.toFixed(2)}</span>
                    </div>
                  </div>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors disabled:opacity-50 rounded-sm min-h-[48px] touch-manipulation"
                  >
                    {loading ? 'Processing...' : 'Complete Order'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
