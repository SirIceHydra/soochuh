import React from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../core/cart/CartContext';
import { useNavigate } from 'react-router-dom';
import { updateOrderStatus } from '../../services/orders';

export default function PaymentSuccess() {
  const { clearCart, cart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  React.useEffect(() => {
    const orderIdParam = searchParams.get('order') || searchParams.get('order_id') || searchParams.get('custom_str1');
    const orderId = orderIdParam ? parseInt(orderIdParam, 10) : NaN;
    if (!isNaN(orderId) && orderId > 0) {
      updateOrderStatus(orderId, 'processing').catch(() => {});
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet><title>Payment Success | Soochuh</title></Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-10 text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter mb-4">
            Payment Successful
          </h1>
          <p className="text-zinc-600 mb-8 text-lg">
            Thank you for your order! We've received your payment and will process your order shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
