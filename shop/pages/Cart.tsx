import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Trash2, ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../core/cart/CartContext';
import { formatPrice } from '../../services/helpers';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Cart() {
  const { cart, updateCartItemById, removeCartItemById, clearCart } = useCart();
  const navigate = useNavigate();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const FREE_SHIPPING_THRESHOLD = 1000;
  const shipping = cart.total >= FREE_SHIPPING_THRESHOLD 
    ? { cost: 0, text: 'Free' } 
    : { cost: 0, text: 'TBD' };
  const total = cart.total + shipping.cost;

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) { 
      removeCartItemById(itemId); 
      return; 
    }
    setUpdatingItemId(itemId);
    try { 
      updateCartItemById(itemId, newQuantity); 
    } finally { 
      setUpdatingItemId(null); 
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Helmet><title>Cart | Soochuh</title></Helmet>
        <Navbar cartCount={0} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
          if (v === 'collection') navigate('/shop');
          else if (typeof v === 'string') navigate(`/${v}`);
        }} />
        <div className="pt-24 sm:pt-32 pb-16 sm:pb-20">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 text-center">
            <ShoppingCart className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h1 className="text-4xl font-black font-display uppercase tracking-tighter mb-4">Your Cart is Empty</h1>
            <p className="text-zinc-500 mb-8">Add some products to get started.</p>
            <Link 
              to="/shop" 
              className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet><title>Cart | Soochuh</title></Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-2xl sm:text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-6 sm:mb-10 text-purple-600">
            Shopping Cart
          </h1>

          <div className="flex flex-col xl:grid xl:grid-cols-3 gap-6 sm:gap-8">
            <div className="xl:col-span-2 space-y-4 order-1">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white border border-zinc-200 p-4 sm:p-6 flex flex-row gap-4 sm:gap-6">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="font-bold text-black mb-2 text-sm sm:text-base break-words">{item.name}</h3>
                    {item.productAddons && Object.keys(item.productAddons).length > 0 && (
                      <p className="text-zinc-500 text-xs mb-2">
                        {Object.entries(item.productAddons).map(([label, value]) => (
                          <span key={label}>
                            {label}: {value.startsWith('http') ? 'Image uploaded' : value}{' '}
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="text-zinc-500 text-xs sm:text-sm mb-4">R{item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <div className="flex items-center border border-zinc-200">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={updatingItemId === item.id}
                          className="p-3 sm:p-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center hover:bg-zinc-100 transition-colors touch-manipulation"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 sm:px-4 py-2 font-bold text-sm sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={updatingItemId === item.id}
                          className="p-3 sm:p-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center hover:bg-zinc-100 transition-colors touch-manipulation"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeCartItemById(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <p className="font-black text-base sm:text-lg">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="xl:col-span-1 order-2">
              <div className="bg-zinc-50 border border-zinc-200 p-6 xl:sticky xl:top-32">
                <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tighter mb-4 sm:mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Subtotal</span>
                    <span className="font-bold">R{cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Shipping</span>
                    <span className="font-bold">{shipping.text}</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-4 flex justify-between">
                    <span className="font-black text-lg">Total</span>
                    <span className="font-black text-lg">R{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors min-h-[48px] touch-manipulation"
                >
                  Proceed to Checkout
                </button>
                {cart.total < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-sm text-zinc-500 mt-4 text-center">
                    Add R{(FREE_SHIPPING_THRESHOLD - cart.total).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
