import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="group cursor-pointer flex flex-col gap-4"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-sm">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-purple-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-black text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
              Best Seller
            </span>
          )}
          {product.salePrice && (
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg animate-pulse">
              Sale
            </span>
          )}
        </div>

        {/* Image Swap on Hover */}
        <img 
          src={product.image} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 group-hover:opacity-0"
        />
        <img 
          src={product.hoverImage || product.image} 
          alt={`${product.name} alt`}
          className="absolute inset-0 w-full h-full object-cover z-0 scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button className="w-full bg-white/90 backdrop-blur text-black py-3 font-bold text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl">
            <Plus className="w-4 h-4" /> Quick Add
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-black text-base leading-tight font-display uppercase tracking-tight group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex flex-col items-end">
             {product.salePrice ? (
                <>
                    <span className="font-bold text-red-600 text-sm">R{product.salePrice}</span>
                    <span className="font-medium text-gray-400 text-xs line-through">R{product.price}</span>
                </>
             ) : (
                <span className="font-bold text-black text-sm bg-gray-100 px-2 py-0.5 rounded-sm">R{product.price}</span>
             )}
          </div>
        </div>
        <p className="text-zinc-500 text-xs font-medium tracking-wide uppercase">{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;