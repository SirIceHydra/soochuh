import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../shop/core/cart/CartContext';

const ShippingPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Shipping Policy | Soochuh - Modern Medical Apparel</title>
        <meta name="description" content="Learn about Soochuh's shipping methods, delivery times, and policies for medical apparel orders across South Africa." />
      </Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-10 text-purple-600">
            Shipping Policy
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
              <p className="text-zinc-700 leading-relaxed">
                <strong className="text-black">Soochuh</strong> is committed to delivering your medical apparel and professional healthcare wear 
                safely and efficiently across South Africa. This Shipping Policy outlines our delivery methods, timeframes, 
                and procedures to ensure you receive your orders in perfect condition.
              </p>
            </div>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Shipping Methods & Providers</h2>
              <p className="text-zinc-700 mb-4">
                We partner with trusted courier services to deliver your orders nationwide across South Africa.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3">Standard Shipping</h3>
                  <p className="text-zinc-700 mb-2"><strong>Cost:</strong> Calculated at checkout</p>
                  <p className="text-zinc-700 mb-2"><strong>Delivery Time:</strong> 3-5 business days</p>
                  <p className="text-zinc-600 text-sm">Perfect for regular orders and non-urgent purchases.</p>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3">Express Shipping</h3>
                  <p className="text-zinc-700 mb-2"><strong>Cost:</strong> Calculated at checkout</p>
                  <p className="text-zinc-700 mb-2"><strong>Delivery Time:</strong> 1-2 business days</p>
                  <p className="text-zinc-600 text-sm">Ideal for urgent orders and time-sensitive purchases.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Free Shipping</h2>
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-sm">
                <p className="text-zinc-700">
                  <strong className="text-purple-600">Free shipping is available on all orders over R1,000!</strong> 
                  This applies to both Standard and Express shipping methods. 
                  Simply add items to your cart totaling R1,000 or more and select your preferred shipping method at no additional cost.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Delivery Areas</h2>
              <p className="text-zinc-700 mb-4">We deliver nationwide across South Africa, including:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li>All major cities and metropolitan areas</li>
                <li>Suburban and rural areas</li>
                <li>Remote locations (delivery times may vary)</li>
              </ul>
              <p className="text-zinc-700 mt-4"><strong>Note:</strong> We currently do not offer international shipping.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Order Processing</h2>
              <p className="text-zinc-700 mb-4">Once you place your order:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Processing Time:</strong> Orders are processed within 1-2 business days</li>
                <li><strong>Shipping Days:</strong> We ship Monday to Friday (excluding weekends)</li>
                <li><strong>Holiday Periods:</strong> We do not ship during public holidays</li>
                <li><strong>Peak Periods:</strong> During busy periods, processing may take slightly longer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Special Packaging & Protection</h2>
              <p className="text-zinc-700 mb-4">Your medical apparel is protected with:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Quality Packaging:</strong> Specialized packaging to prevent damage and maintain garment quality</li>
                <li><strong>Insured Delivery:</strong> All shipments are fully insured through our courier partner</li>
                <li><strong>Secure Packaging:</strong> Protective wrapping and sturdy boxes</li>
                <li><strong>Professional Care:</strong> Extra protection for premium items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Tracking & Notifications</h2>
              <p className="text-zinc-700 mb-4">Stay informed about your order:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Tracking Numbers:</strong> You'll receive a tracking number once your order ships</li>
                <li><strong>Email Notifications:</strong> Shipping confirmations and delivery updates via email</li>
                <li><strong>SMS Updates:</strong> Real-time delivery notifications via SMS</li>
                <li><strong>Online Tracking:</strong> Track your package through our courier's online system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Damaged or Lost Items</h2>
              <p className="text-zinc-700 mb-4">In the rare event of shipping issues:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Insured Deliveries:</strong> All shipments are covered by courier insurance</li>
                <li><strong>Damage Assessment:</strong> Damaged items will be assessed by our team</li>
                <li><strong>Resolution Options:</strong> We'll provide either a full refund or send a replacement product</li>
                <li><strong>Lost Packages:</strong> Lost items are covered by courier insurance and will be replaced or refunded</li>
              </ul>
              <p className="text-zinc-700 mt-4">
                <strong>Important:</strong> Please inspect your package upon delivery and report any issues immediately.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Contact Information</h2>
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                <p className="text-zinc-700 mb-4">For shipping inquiries or issues, please contact us:</p>
                <div className="space-y-2 text-zinc-700">
                  <p><strong>Email:</strong> <a href="mailto:info@soochuh.com" className="text-purple-600 hover:text-purple-700">info@soochuh.com</a></p>
                  <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Important Notes</h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li>Delivery times are estimates and may vary due to weather, traffic, or other factors</li>
                <li>Someone must be available to receive the package at the delivery address</li>
                <li>If no one is available, the courier will attempt delivery again or leave a collection notice</li>
                <li>We are not responsible for delays caused by incorrect or incomplete address information</li>
                <li>All shipping costs are calculated at checkout and are non-refundable unless the order is cancelled before shipping</li>
              </ul>
            </section>

            <div className="border-t border-zinc-200 pt-6 mt-8">
              <p className="text-sm text-zinc-500">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                This shipping policy is subject to change. Please check back regularly for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;

