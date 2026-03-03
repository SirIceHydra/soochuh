import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../shop/core/cart/CartContext';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy | Soochuh - Modern Medical Apparel</title>
        <meta name="description" content="Learn how Soochuh protects your privacy and handles your personal information when you shop for medical apparel." />
      </Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-10 text-purple-600">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
              <p className="text-zinc-700 leading-relaxed">
                <strong className="text-black">Soochuh</strong> is committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make purchases from our medical apparel store.
              </p>
            </div>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Information We Collect</h2>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Personal Information</h3>
              <p className="text-zinc-700 mb-4">When you make a purchase or create an account, we may collect:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Account credentials and preferences</li>
              </ul>

              <h3 className="text-xl font-black uppercase tracking-tight mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-zinc-700 mb-4">We automatically collect certain information when you visit our website:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li>IP address and browser information</li>
                <li>Pages visited and time spent on our site</li>
                <li>Device information and operating system</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">How We Use Your Information</h2>
              <p className="text-zinc-700 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li>Process and fulfill your orders for medical apparel and professional wear</li>
                <li>Provide customer support and respond to your inquiries</li>
                <li>Send order confirmations, shipping updates, and delivery notifications</li>
                <li>Improve our website functionality and user experience</li>
                <li>Send promotional emails about new products and special offers (with your consent)</li>
                <li>Comply with legal obligations and protect against fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Information Sharing</h2>
              <p className="text-zinc-700 mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li><strong>Service Providers:</strong> With trusted third parties who help us operate our business (payment processors, shipping companies, email services)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> When you have given us explicit permission to share your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Data Security</h2>
              <p className="text-zinc-700 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through certified providers</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Cookies and Tracking</h2>
              <p className="text-zinc-700">
                We use cookies and similar technologies to enhance your browsing experience, remember your preferences, 
                and analyze website traffic. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Your Rights</h2>
              <p className="text-zinc-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-zinc-700 ml-4">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
              <p className="text-zinc-700 mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@soochuh.com" className="text-purple-600 hover:text-purple-700">privacy@soochuh.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Children's Privacy</h2>
              <p className="text-zinc-700">
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Third-Party Links</h2>
              <p className="text-zinc-700">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. 
                We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Changes to This Policy</h2>
              <p className="text-zinc-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date below.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black font-display uppercase tracking-tight mb-4">Contact Information</h2>
              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                <p className="text-zinc-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-zinc-700">
                  <p><strong>Soochuh</strong></p>
                  <p>Email: <a href="mailto:privacy@soochuh.com" className="text-purple-600 hover:text-purple-700">privacy@soochuh.com</a></p>
                </div>
              </div>
            </section>

            <div className="border-t border-zinc-200 pt-6 mt-8">
              <p className="text-sm text-zinc-500">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

