import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, ColorVariant } from '../types';
import { ArrowLeft, ChevronDown, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { SIZES } from '../constants';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, color: ColorVariant, size: string) => void;
  onBack?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack }) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'fit' | 'care'>('desc');

  // Simulate a color change visually
  const imageFilter = selectedColor.id === 'navy' ? '' : 
                      selectedColor.id === 'black' ? 'grayscale(100%) contrast(120%)' :
                      selectedColor.id === 'burgundy' ? 'hue-rotate(320deg) saturate(80%)' :
                      selectedColor.id === 'olive' ? 'hue-rotate(60deg) sepia(20%)' :
                      selectedColor.id === 'ceil' ? 'hue-rotate(180deg) brightness(110%)' : '';

  const currentPrice = product.salePrice || product.price;

  return (
    <div className="pt-24 sm:pt-32 pb-12 sm:pb-20 min-h-screen bg-white animate-fade-in bg-noise">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        <button 
          onClick={() => navigate('/shop')}
          className="flex items-center text-xs font-bold tracking-widest text-zinc-500 hover:text-black mb-8 transition-colors uppercase group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>

        {/* Mobile: Title at top, Desktop: Hidden (will show in sidebar) */}
        <div className="lg:hidden mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-black font-display uppercase tracking-tight leading-none mb-3">{product.name}</h1>
          <p className="text-zinc-500 font-medium text-base sm:text-lg">{product.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
          {/* Image Gallery - Left side on desktop, appears after title on mobile */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-32">
               <div className="aspect-[3/4] bg-gray-100 w-full overflow-hidden group rounded-sm shadow-sm">
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ filter: imageFilter, transition: 'filter 0.5s ease' }}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
               </div>
               <div className="aspect-[3/4] bg-gray-100 w-full overflow-hidden group rounded-sm shadow-sm">
                  <img 
                    src={product.hoverImage} 
                    alt="Detail" 
                    style={{ filter: imageFilter, transition: 'filter 0.5s ease' }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                  />
               </div>
               <div className="col-span-2 aspect-[16/9] bg-gray-100 overflow-hidden group rounded-sm shadow-sm relative">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070"
                    alt="Fabric Detail"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full">
                      <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-purple-500"></span> FIONx™ Tech
                      </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Product Info Sidebar - Right side on desktop ONLY */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="lg:sticky lg:top-32">
              {/* Desktop: Title and Price */}
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-black font-display uppercase tracking-tight leading-none">{product.name}</h1>
                <div className="flex flex-col items-end">
                     {product.salePrice ? (
                       <div className="flex flex-col items-end">
                         <span className="text-xl font-bold text-white bg-red-500 px-2 py-1 transform -rotate-2 shadow-md">R{product.salePrice}</span>
                         <span className="text-sm text-zinc-400 line-through mt-1">R{product.price}</span>
                       </div>
                     ) : (
                       <span className="text-xl font-bold text-black bg-gray-100 px-2 py-1 transform -rotate-2 border border-black/5 shadow-sm">R{product.price}</span>
                     )}
                </div>
              </div>
              <p className="text-zinc-500 font-medium mb-8 text-lg">{product.subtitle}</p>

              {/* Color Selection */}
              <div className="mb-6">
                <span className="text-xs font-black text-black mb-3 block uppercase tracking-widest">
                    Color: <span className="text-purple-600 font-bold">{selectedColor.name}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor.id === color.id ? 'border-purple-600 p-1 scale-110' : 'border-transparent hover:scale-110'
                        }`}
                    >
                        <div className={`w-full h-full rounded-full ${color.tailWindClass} shadow-inner border border-black/10`}></div>
                    </button>
                    ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black text-black uppercase tracking-widest">
                        Size: {selectedSize && <span className="text-purple-600">{selectedSize}</span>}
                      </span>
                      <button className="text-xs text-purple-600 underline decoration-purple-400 underline-offset-2 hover:text-purple-800 font-bold">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                      <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2.5 text-xs font-bold border transition-all uppercase rounded-sm min-w-[3rem] ${
                          selectedSize === size 
                          ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(147,51,234,1)]' 
                          : 'bg-white text-black border-zinc-200 hover:border-purple-600 hover:shadow-md'
                          }`}
                      >
                          {size}
                      </button>
                      ))}
                  </div>
                  {!selectedSize && <p className="text-red-600 text-[10px] font-bold uppercase mt-2 flex items-center gap-1"><span className="animate-pulse">●</span> Please select a size</p>}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => selectedSize && onAddToCart(product, selectedColor, selectedSize)}
                disabled={!selectedSize}
                className="w-full bg-black text-white py-5 font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-6 active:scale-[0.99] relative overflow-hidden group"
              >
                  <span className="relative z-10">{selectedSize ? `Add to Bag - R${currentPrice}` : 'Select Size'}</span>
                  <div className="absolute inset-0 bg-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0 opacity-100"></div>
              </button>

              {/* Info Tabs/Accordion */}
              <div className="border-t border-zinc-200">
                   {/* Description Tab */}
                   <div className="border-b border-zinc-200">
                       <button 
                        onClick={() => setActiveTab(activeTab === 'desc' ? 'desc' : 'desc')}
                        className="w-full py-4 flex justify-between items-center font-bold text-sm uppercase tracking-widest hover:text-purple-600 transition-colors"
                       >
                           Description
                           <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'desc' ? 'rotate-180' : ''}`} />
                       </button>
                       {activeTab === 'desc' && (
                           <div className="pb-6 text-sm text-zinc-600 leading-relaxed animate-fade-in">
                               <p className="mb-4">{product.description}</p>
                               <div className="flex flex-wrap gap-2">
                                   {product.features.map((feat, i) => (
                                       <span key={i} className="text-[10px] font-bold uppercase bg-purple-50 px-2 py-1 text-purple-800 border border-purple-100">{feat}</span>
                                   ))}
                               </div>
                           </div>
                       )}
                   </div>

                   {/* Shipping Tab */}
                   <div className="border-b border-zinc-200">
                       <button className="w-full py-4 flex justify-between items-center font-bold text-sm uppercase tracking-widest text-zinc-400 cursor-not-allowed">
                           Fit & Sizing
                           <ChevronDown className="w-4 h-4" />
                       </button>
                   </div>
                   
                   {/* Benefits */}
                   <div className="grid grid-cols-3 gap-4 py-6">
                        <div className="flex flex-col items-center text-center gap-2 group">
                            <div className="p-3 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-colors">
                                <ShieldCheck className="w-5 h-5 text-zinc-400 group-hover:text-purple-600" />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black">Antimicrobial</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 group">
                             <div className="p-3 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-colors">
                                <Truck className="w-5 h-5 text-zinc-400 group-hover:text-purple-600" />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black">Free Shipping</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 group">
                             <div className="p-3 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-colors">
                                <RefreshCw className="w-5 h-5 text-zinc-400 group-hover:text-purple-600" />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black">Free Returns</span>
                        </div>
                   </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile ONLY: Price, Color, Size, Cart, Description - Full Width Below Images */}
        <div className="lg:hidden mt-6">
          {/* Mobile: Price Section */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-white bg-red-500 px-4 py-2 transform -rotate-2 shadow-md">R{product.salePrice}</span>
                  <span className="text-lg text-zinc-400 line-through">R{product.price}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-black bg-gray-100 px-4 py-2 transform -rotate-2 border border-black/5 shadow-sm">R{product.price}</span>
              )}
            </div>
          </div>

          {/* Mobile: Color Selection */}
          <div className="mb-6">
            <span className="text-xs font-black text-black mb-3 block uppercase tracking-widest">
                Color: <span className="text-purple-600 font-bold">{selectedColor.name}</span>
            </span>
            <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedColor.id === color.id ? 'border-purple-600 p-1 scale-110' : 'border-transparent hover:scale-110'
                    }`}
                >
                    <div className={`w-full h-full rounded-full ${color.tailWindClass} shadow-inner border border-black/10`}></div>
                </button>
                ))}
            </div>
          </div>

          {/* Mobile: Size Selection */}
          <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black text-black uppercase tracking-widest">
                    Size: {selectedSize && <span className="text-purple-600">{selectedSize}</span>}
                  </span>
                  <button className="text-xs text-purple-600 underline decoration-purple-400 underline-offset-2 hover:text-purple-800 font-bold">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                  <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 text-xs font-bold border transition-all uppercase rounded-sm min-w-[3rem] ${
                      selectedSize === size 
                      ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(147,51,234,1)]' 
                      : 'bg-white text-black border-zinc-200 hover:border-purple-600 hover:shadow-md'
                      }`}
                  >
                      {size}
                  </button>
                  ))}
              </div>
              {!selectedSize && <p className="text-red-600 text-[10px] font-bold uppercase mt-2 flex items-center gap-1"><span className="animate-pulse">●</span> Please select a size</p>}
          </div>

          {/* Mobile: Add to Cart Button */}
          <button
            onClick={() => selectedSize && onAddToCart(product, selectedColor, selectedSize)}
            disabled={!selectedSize}
            className="w-full bg-black text-white py-5 font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-6 active:scale-[0.99] relative overflow-hidden group"
          >
              <span className="relative z-10">{selectedSize ? `Add to Bag - R${currentPrice}` : 'Select Size'}</span>
              <div className="absolute inset-0 bg-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0 opacity-100"></div>
          </button>

          {/* Mobile: Info Tabs/Accordion */}
          <div className="border-t border-zinc-200">
               {/* Description Tab */}
               <div className="border-b border-zinc-200">
                   <button 
                    onClick={() => setActiveTab(activeTab === 'desc' ? 'desc' : 'desc')}
                    className="w-full py-4 flex justify-between items-center font-bold text-sm uppercase tracking-widest hover:text-purple-600 transition-colors"
                   >
                       Description
                       <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'desc' ? 'rotate-180' : ''}`} />
                   </button>
                   {activeTab === 'desc' && (
                       <div className="pb-6 text-sm text-zinc-600 leading-relaxed animate-fade-in">
                           <p className="mb-4">{product.description}</p>
                           <div className="flex flex-wrap gap-2">
                               {product.features.map((feat, i) => (
                                   <span key={i} className="text-[10px] font-bold uppercase bg-purple-50 px-2 py-1 text-purple-800 border border-purple-100">{feat}</span>
                               ))}
                           </div>
                       </div>
                   )}
               </div>

               {/* Shipping Tab */}
               <div className="border-b border-zinc-200">
                   <button className="w-full py-4 flex justify-between items-center font-bold text-sm uppercase tracking-widest text-zinc-400 cursor-not-allowed">
                       Fit & Sizing
                       <ChevronDown className="w-4 h-4" />
                   </button>
               </div>
               
               {/* Benefits */}
               <div className="grid grid-cols-3 gap-4 py-6">
                    <div className="flex flex-col items-center text-center gap-2 group">
                        <div className="p-3 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-colors">
                            <ShieldCheck className="w-5 h-5 text-zinc-400 group-hover:text-purple-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black">Antimicrobial</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 group">
                         <div className="p-3 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-colors">
                            <Truck className="w-5 h-5 text-zinc-400 group-hover:text-purple-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black">Free Shipping</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 group">
                         <div className="p-3 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-colors">
                            <RefreshCw className="w-5 h-5 text-zinc-400 group-hover:text-purple-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black">Free Returns</span>
                    </div>
               </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;