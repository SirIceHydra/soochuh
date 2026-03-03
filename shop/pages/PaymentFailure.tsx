import React from 'react';
import { Helmet } from 'react-helmet';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../core/cart/CartContext';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  const navigate = useNavigate();
  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-white">
      <Helmet><title>Payment Failed | Soochuh</title></Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-10 text-center">
          <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter mb-4">
            Payment Failed
          </h1>
          <p className="text-zinc-600 mb-8 text-lg">
            {reason === 'out_of_stock' 
              ? 'Unfortunately, some items in your order are no longer available. Please try again with different items.'
              : 'Your payment could not be processed. Please try again or contact support if the problem persists.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cart"
              className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
            <Link
              to="/shop"
              className="bg-zinc-100 text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
