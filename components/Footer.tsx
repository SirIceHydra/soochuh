import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import soochuhLogo from '../assets/logos/SOOCHA LOGO 2.svg';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { useCategories } from '../shop/core/hooks/useCategories';
import { findKitsCategory } from '../shop/core/utils/kitsCategory';

const Footer: React.FC = () => {
  const { categories, fetchCategories } = useCategories();
  const kitsCategory = findKitsCategory(categories);
  const kitsHref = kitsCategory ? `/shop?category=${kitsCategory.slug}` : '/shop';

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  return (
    <footer className="bg-zinc-950 text-white pt-12 md:pt-24 pb-8 md:pb-12 border-t border-zinc-900">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-8 md:mb-20">
        {/* Main Content - Stacked on Mobile, Inline on Desktop */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-16">
          {/* Brand Section */}
          <div className="md:max-w-md">
            <Link to="/" className="inline-block mb-8">
              <img src={soochuhLogo} alt="Soochuh" className="h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Revolutionizing medical apparel. We create technical designs for technical professionals. 
              Engineered for comfort, durability, and performance.
            </p>
            <h4 className="font-bold mt-8 mb-2 tracking-widest text-xs uppercase text-zinc-500">Contact</h4>
            <p className="text-zinc-500 text-sm font-medium">
              208A Main Rd, Diep River, Cape Town, 7800
            </p>
            <a href="tel:0645346882" className="text-zinc-500 text-sm font-medium hover:text-purple-400 transition-colors block mt-1">
              0645346882
            </a>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
               <input type="email" placeholder="Enter your email" className="bg-zinc-900 border-none text-white px-4 sm:px-6 py-3 w-full sm:max-w-xs focus:ring-1 focus:ring-purple-600" />
               <button className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-purple-600 hover:text-white transition-colors whitespace-nowrap">Join</button>
            </div>
          </div>
          
          {/* Shop and Support Columns - Side by Side */}
          <div className="grid grid-cols-2 gap-8 md:gap-16">
            <div>
              <h4 className="font-bold mb-8 tracking-widest text-xs uppercase text-zinc-500">Shop</h4>
              <ul className="space-y-4 text-white font-bold text-sm">
                <li>
                  <Link to="/shop" className="hover:text-purple-400 transition-colors">Women</Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-purple-400 transition-colors">Men</Link>
                </li>
                <li>
                  <Link to={kitsHref} className="hover:text-purple-400 transition-colors">Kits</Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-purple-400 transition-colors">Lab Coats</Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-purple-400 transition-colors">New Arrivals</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 tracking-widest text-xs uppercase text-zinc-500">Support</h4>
              <ul className="space-y-4 text-white font-bold text-sm">
                <li>
                  <Link to="/returns-policy" className="hover:text-purple-400 transition-colors">Returns & Exchanges</Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-purple-400 transition-colors">Shipping Info</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-purple-400 transition-colors">Shop</Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-purple-400 transition-colors">Blog</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
        <div className="flex gap-8">
          <a href="https://www.instagram.com/soochuh_/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
            <Instagram className="w-5 h-5 text-white hover:text-purple-400 cursor-pointer transition-colors" />
          </a>
          <a href="https://web.facebook.com/Soochuh" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
            <Facebook className="w-5 h-5 text-white hover:text-purple-400 cursor-pointer transition-colors" />
          </a>
          <a href="https://www.tiktok.com/@soochuh" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok">
            <SiTiktok className="w-5 h-5 text-white hover:text-purple-400 cursor-pointer transition-colors" />
          </a>
          <a href="https://www.linkedin.com/company/soochuh/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn">
            <Linkedin className="w-5 h-5 text-white hover:text-purple-400 cursor-pointer transition-colors" />
          </a>
        </div>
        <div className="flex gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <Link to="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link to="/cookies-policy" className="hover:text-purple-400 transition-colors">Cookies Policy</Link>
            <Link to="/shipping-policy" className="hover:text-purple-400 transition-colors">Shipping Policy</Link>
            <Link to="/returns-policy" className="hover:text-purple-400 transition-colors">Returns Policy</Link>
        </div>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          © 2024 Soochuh.
        </p>
      </div>
    </footer>
  );
};

export default Footer;