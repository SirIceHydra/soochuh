import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-black font-serif">YOUR BAG ({items.reduce((a, b) => a + b.quantity, 0)})</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-medium">Your bag is empty.</p>
              <button onClick={onClose} className="mt-4 text-slate-900 underline font-bold">Start Shopping</button>
            </div>
          ) : (
            items.map((item) => {
              const price = item.salePrice || item.price;
              return (
                <div key={item.cartId} className="flex gap-4 animate-fade-in">
                  <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                        <button onClick={() => onRemove(item.cartId)} className="text-slate-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
                      <p className="text-xs text-slate-500 mt-2 capitalize">
                        {item.selectedColor.name} / {item.selectedSize}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-slate-200 rounded-md">
                        <button 
                          onClick={() => onUpdateQuantity(item.cartId, -1)}
                          className="p-1 px-2 hover:bg-slate-50 text-slate-600 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.cartId, 1)}
                          className="p-1 px-2 hover:bg-slate-50 text-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="font-bold text-sm">R{(price * item.quantity).toFixed(2)}</span>
                         {item.salePrice && (
                           <span className="text-[10px] text-gray-400 line-through">R{(item.price * item.quantity).toFixed(2)}</span>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-slate-600">Subtotal</span>
              <span className="font-bold text-lg">R{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-400 mb-4 text-center">Shipping and taxes calculated at checkout.</p>
            <button className="w-full bg-slate-900 text-white py-4 rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg">
              CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;