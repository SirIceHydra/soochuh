import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import { ShopProvider } from './shop/core/ShopProvider';
import { CartProvider, useCart } from './shop/core/cart/CartContext';
import { Toast } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import Shop from './shop/pages/Shop';
import DetailsPage from './shop/pages/DetailsPage';
import Cart from './shop/pages/Cart';
import Checkout from './shop/pages/Checkout';
import PaymentSuccess from './shop/pages/PaymentSuccess';
import PaymentFailure from './shop/pages/PaymentFailure';
import PostsPage from './posts/pages/PostsPage';
import PostDetailPage from './posts/pages/PostDetailPage';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import Contact from './pages/Contact';
import About from './pages/About';
import { CookiesConsent } from './components/CookiesConsent';

// Toast wrapper component
function ToastWrapper() {
  const { popupOpen, popupMessage, hidePopup } = useCart();
  return <Toast isOpen={popupOpen} message={popupMessage} onClose={hidePopup} />;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ShopProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ToastWrapper />
          <CookiesConsent />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/product/:id" element={<DetailsPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
            <Route path="/blog" element={<PostsPage />} />
            <Route path="/blog/:slug" element={<PostDetailPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/returns-policy" element={<ReturnsPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookies-policy" element={<CookiesPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ShopProvider>
  </React.StrictMode>
);
