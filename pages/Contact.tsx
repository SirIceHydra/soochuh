import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../shop/core/cart/CartContext';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      setSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Contact Us | Soochuh - Modern Medical Apparel</title>
        <meta name="description" content="Get in touch with Soochuh for medical apparel inquiries, customer support, and wholesale orders." />
      </Helmet>
      <Navbar cartCount={cart.itemCount} onOpenCart={() => navigate('/cart')} onNavigate={(v) => {
        if (v === 'collection') navigate('/shop');
        else if (typeof v === 'string') navigate(`/${v}`);
      }} />
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
          <h1 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter mb-4 text-purple-600 text-center">
            Contact Us
          </h1>
          <p className="text-zinc-500 text-center mb-12 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll reply as soon as possible.
          </p>

          <div className="space-y-12">
            {/* Contact Information - First */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-widest text-sm mb-1">Email</h3>
                      <a href="mailto:info@soochuh.com" className="text-zinc-600 hover:text-purple-600 transition-colors">
                        info@soochuh.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-widest text-sm mb-1">Phone</h3>
                      <a href="tel:0645346882" className="text-zinc-600 hover:text-purple-600 transition-colors">
                        064 534 6882
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-widest text-sm mb-1">Address</h3>
                      <p className="text-zinc-600">
                        208A Main Rd, Diep River, Cape Town, 7800
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-sm">
                <h3 className="font-bold uppercase tracking-widest text-sm mb-3">Business Hours</h3>
                <div className="space-y-2 text-zinc-600 text-sm">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 1:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form - Second */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold uppercase tracking-widest mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold uppercase tracking-widest mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold uppercase tracking-widest mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    className="w-full px-4 py-3 border border-zinc-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-sm text-sm">
                    Message sent successfully! We'll get back to you as soon as possible.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-sm text-sm">
                    There was an error sending your message. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

