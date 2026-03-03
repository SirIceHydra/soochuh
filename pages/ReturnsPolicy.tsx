import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../shop/core/cart/CartContext';

const ReturnsPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Returns Policy | Soochuh - Modern Medical Apparel</title>
        <meta name="description" content="Learn about Soochuh's returns and refund policy for medical apparel. Easy returns within 14 days of delivery." />
      </Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-10 text-purple-600">
            Returns Policy
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
              <p className="text-zinc-700 leading-relaxed">
                <strong className="text-black">Soochuh</strong> wants you to be completely satisfied with your purchase. 
                This Returns Policy outlines our procedures for returns, exchanges, and refunds to ensure 
                a smooth and fair process for all our customers.
              </p>
            </div>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Return Timeframes</h2>
              <p className="text-zinc-700 mb-4">
                We offer a <strong>14-day return window</strong> from the date of delivery for most items.
              </p>
              
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Different Timeframes by Product Type</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Medical Scrubs:</strong> 14 days from delivery</li>
                <li><strong>Medical Apparel:</strong> 14 days from delivery</li>
                <li><strong>Accessories:</strong> 14 days from delivery</li>
                <li><strong>Custom/Personalized Items:</strong> Non-refundable (see special conditions below)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Return Conditions</h2>
              <p className="text-zinc-700 mb-4">To be eligible for a return, items must meet the following conditions:</p>
              
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Acceptable Returns</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Unworn Items:</strong> All items must be unworn and in original condition</li>
                <li><strong>Original Condition:</strong> Items must be in the same condition as when delivered</li>
                <li><strong>Original Packaging:</strong> All original packaging, tags, and accessories must be included</li>
                <li><strong>Proof of Purchase:</strong> Original receipt or order confirmation required</li>
              </ul>

              <h3 className="text-xl font-black uppercase tracking-tight mb-3 mt-6">Items That Cannot Be Returned</h3>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Worn Items:</strong> Items that have been worn, washed, or used cannot be returned</li>
                <li><strong>Personalized Items:</strong> Custom or personalized products are non-returnable</li>
                <li><strong>Sale/Clearance Items:</strong> Items purchased during special sales may have different return policies</li>
                <li><strong>Underwear & Intimate Apparel:</strong> For hygiene reasons, these items cannot be returned</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Return Process</h2>
              <p className="text-zinc-700 mb-4">To initiate a return, please follow these steps:</p>
              
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Step 1: Contact Us</h3>
              <p className="text-zinc-700 mb-4">Before sending any items back, you must contact us first:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Email:</strong> <a href="mailto:info@soochuh.com" className="text-purple-600 hover:text-purple-700">info@soochuh.com</a></li>
                <li>Include your order number and reason for return</li>
              </ul>

              <h3 className="text-xl font-black uppercase tracking-tight mb-3 mt-6">Step 2: Return Authorization</h3>
              <p className="text-zinc-700 mb-4">We will provide you with:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Return Authorization Number:</strong> Required for processing your return</li>
                <li><strong>Return Instructions:</strong> Specific packaging and shipping requirements</li>
                <li><strong>Return Label:</strong> Pre-paid return shipping label (when applicable)</li>
              </ul>

              <h3 className="text-xl font-black uppercase tracking-tight mb-3 mt-6">Step 3: Package & Ship</h3>
              <p className="text-zinc-700">Package your items securely and ship using the provided return label or instructions.</p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Return Shipping Costs</h2>
              <p className="text-zinc-700 mb-4">Return shipping costs depend on the reason for return:</p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                  <h4 className="text-lg font-black uppercase tracking-tight mb-3">Damaged/Defective Items</h4>
                  <p className="text-zinc-700 mb-2"><strong>Cost:</strong> Free return shipping</p>
                  <p className="text-zinc-700 mb-2"><strong>Process:</strong> We provide return label</p>
                  <p className="text-zinc-600 text-sm">Items damaged during shipping or defective upon arrival.</p>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                  <h4 className="text-lg font-black uppercase tracking-tight mb-3">Unwanted Items</h4>
                  <p className="text-zinc-700 mb-2"><strong>Cost:</strong> Customer pays return shipping</p>
                  <p className="text-zinc-700 mb-2"><strong>Process:</strong> Customer arranges return shipping</p>
                  <p className="text-zinc-600 text-sm">Items returned due to change of mind or incorrect order.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Refund Processing</h2>
              <p className="text-zinc-700 mb-4">Once we receive your returned items:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Inspection Period:</strong> Items are inspected within 2-3 business days</li>
                <li><strong>Processing Time:</strong> Refunds are processed within 7 business days</li>
                <li><strong>Refund Method:</strong> Refunds are issued to the original payment method</li>
                <li><strong>Store Credit Option:</strong> We can also provide store credit if preferred</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Exchanges</h2>
              <p className="text-zinc-700 mb-4">We offer exchanges for:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Size Exchanges:</strong> Apparel in different sizes</li>
                <li><strong>Color Variations:</strong> Same item in different colors (if available)</li>
                <li><strong>Similar Items:</strong> Items of equal or greater value</li>
              </ul>
              <p className="text-zinc-700 mt-4">
                <strong>Note:</strong> Exchanges are subject to availability. If the desired item is not available, 
                we will process a refund instead.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Damaged or Defective Items</h2>
              <p className="text-zinc-700 mb-4">If you receive damaged or defective items:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Immediate Contact:</strong> Contact us within 48 hours of delivery</li>
                <li><strong>Photo Documentation:</strong> Provide photos of the damage or defect</li>
                <li><strong>Free Return:</strong> We provide return shipping label at no cost</li>
                <li><strong>Quick Resolution:</strong> Priority processing for damaged items</li>
                <li><strong>Replacement or Refund:</strong> Your choice of replacement or full refund</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Contact Information</h2>
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                <p className="text-zinc-700 mb-4">For all return inquiries, please contact us:</p>
                <div className="space-y-2 text-zinc-700">
                  <p><strong>Email:</strong> <a href="mailto:info@soochuh.com" className="text-purple-600 hover:text-purple-700">info@soochuh.com</a></p>
                  <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
                  <p><strong>Response Time:</strong> We respond to return inquiries within 24 hours</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Important Notes</h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li>Returns without prior authorization will not be accepted</li>
                <li>Items must be returned within the specified timeframe</li>
                <li>We reserve the right to refuse returns that don't meet our conditions</li>
                <li>Refunds may take 1-2 billing cycles to appear on your statement</li>
                <li>Store credit never expires and can be used for future purchases</li>
                <li>This policy applies to purchases made directly from Soochuh</li>
              </ul>
            </section>

            <div className="border-t border-zinc-200 pt-6 mt-8">
              <p className="text-sm text-zinc-500">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                This returns policy is subject to change. Please check back regularly for updates.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReturnsPolicy;

