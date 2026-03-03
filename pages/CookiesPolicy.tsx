import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Cookie, Shield, Eye, Database, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../shop/core/cart/CartContext';

const CookiesPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Cookies Policy | Soochuh - Modern Medical Apparel</title>
        <meta name="description" content="Learn about how Soochuh uses cookies to enhance your browsing experience." />
      </Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-purple-600 flex items-center justify-center bg-purple-50">
                <Cookie className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-4 text-purple-600">
              Cookies Policy
            </h1>
            <p className="text-zinc-500 text-lg">
              Understanding how we use cookies to improve your shopping experience
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Cookie className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-black font-display uppercase tracking-tight">What Are Cookies?</h2>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                <p className="text-zinc-700 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They help us provide you with a better browsing experience by remembering your preferences and understanding 
                  how you use our site.
                </p>
                <p className="text-zinc-700">
                  At Soochuh, we use cookies responsibly and in compliance with GDPR regulations to enhance your 
                  shopping experience while protecting your privacy.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-black font-display uppercase tracking-tight">Types of Cookies We Use</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-purple-600">Essential Cookies</h3>
                  <p className="text-zinc-700 mb-3">
                    These cookies are necessary for the website to function properly. They enable basic functions like 
                    page navigation, access to secure areas, and shopping cart functionality.
                  </p>
                  <ul className="text-zinc-600 text-sm space-y-1 list-disc list-inside ml-2">
                    <li>Shopping cart and checkout process</li>
                    <li>User authentication</li>
                    <li>Security features</li>
                    <li>Cookie consent preferences</li>
                  </ul>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-purple-600">Analytics Cookies</h3>
                  <p className="text-zinc-700 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting 
                    information anonymously.
                  </p>
                  <ul className="text-zinc-600 text-sm space-y-1 list-disc list-inside ml-2">
                    <li>Page views and user behavior</li>
                    <li>Popular products and features</li>
                    <li>Website performance metrics</li>
                    <li>Error tracking and debugging</li>
                  </ul>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-purple-600">Functional Cookies</h3>
                  <p className="text-zinc-700 mb-3">
                    These cookies enable enhanced functionality and personalization, such as remembering your 
                    preferences and providing improved features.
                  </p>
                  <ul className="text-zinc-600 text-sm space-y-1 list-disc list-inside ml-2">
                    <li>Language and region preferences</li>
                    <li>Recently viewed products</li>
                    <li>Wishlist and favorites</li>
                    <li>Customized content</li>
                  </ul>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-purple-600">Marketing Cookies</h3>
                  <p className="text-zinc-700 mb-3">
                    These cookies are used to deliver advertisements that are more relevant to you and your interests.
                  </p>
                  <ul className="text-zinc-600 text-sm space-y-1 list-disc list-inside ml-2">
                    <li>Personalized product recommendations</li>
                    <li>Social media integration</li>
                    <li>Targeted advertising</li>
                    <li>Campaign effectiveness tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-black font-display uppercase tracking-tight">Your Rights & Choices</h2>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                <p className="text-zinc-700 mb-4">
                  You have full control over your cookie preferences. You can:
                </p>
                <ul className="text-zinc-700 space-y-2 list-disc list-inside ml-4">
                  <li><strong>Accept All:</strong> Allow all cookies for the best browsing experience</li>
                  <li><strong>Decline All:</strong> Reject non-essential cookies (some features may not work)</li>
                  <li><strong>Manage Preferences:</strong> Choose which types of cookies to allow</li>
                  <li><strong>Withdraw Consent:</strong> Change your mind at any time</li>
                  <li><strong>Delete Cookies:</strong> Clear existing cookies from your browser</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-black font-display uppercase tracking-tight">Third-Party Services</h2>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                <p className="text-zinc-700 mb-4">
                  We work with trusted third-party services that may set their own cookies:
                </p>
                <ul className="text-zinc-700 space-y-2 list-disc list-inside ml-4">
                  <li><strong>PayFast:</strong> Secure payment processing</li>
                  <li><strong>Google Analytics:</strong> Website analytics and insights</li>
                  <li><strong>Social Media:</strong> Facebook, Instagram integration</li>
                  <li><strong>WooCommerce:</strong> E-commerce functionality</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-black font-display uppercase tracking-tight">Questions or Concerns?</h2>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                <p className="text-zinc-700 mb-4">
                  If you have any questions about our use of cookies or this policy, please don't hesitate to contact us:
                </p>
                <div className="text-zinc-700 space-y-2">
                  <p>📧 Email: <a href="mailto:info@soochuh.com" className="text-purple-600 hover:text-purple-700">info@soochuh.com</a></p>
                </div>
              </div>
            </section>

            <div className="border-t border-zinc-200 pt-6 text-center">
              <p className="text-sm text-zinc-500">
                This cookies policy was last updated on {new Date().toLocaleDateString('en-ZA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiesPolicy;

