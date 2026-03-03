import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Package, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShippingForm } from '../ui/ShippingForm';
import { CartItemWithShipping } from '../types/shipping';
import { formatPrice } from '../../utils/helpers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mock cart data for demonstration
const mockCartItems: CartItemWithShipping[] = [
  {
    id: '1',
    productId: 1,
    name: 'Pokemon Booster Pack',
    price: 299.99,
    quantity: 2,
    image: '/images/pokeproduct.png',
    stockStatus: 'instock',
    weight_kg: 0.1,
    length_cm: 15,
    width_cm: 10,
    height_cm: 2
  },
  {
    id: '2',
    productId: 2,
    name: 'Magic: The Gathering Booster',
    price: 199.99,
    quantity: 1,
    image: '/images/mtgproduct.png',
    stockStatus: 'instock',
    weight_kg: 0.1,
    length_cm: 15,
    width_cm: 10,
    height_cm: 2
  }
];

export default function ShippingPage() {
  const [selectedShipping, setSelectedShipping] = useState<{
    cost: number;
    option: any;
  } | null>(null);

  const handleShippingSelected = (cost: number, option: any) => {
    setSelectedShipping({ cost, option });
  };

  const cartTotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = cartTotal + (selectedShipping?.cost || 0);

  return (
    <div className="min-h-screen bg-primary text-tertiary">
      <Header />
      <div className="h-20" />
      
      <Helmet>
        <title>Shipping - Oracle Gaming</title>
        <meta name="description" content="Calculate shipping costs for your order" />
      </Helmet>
      
      <section className="gallery-carousel" style={{ paddingTop: '120px', paddingBottom: '30px' }}>
        <div className="container">
          <h2 className="h2 section-title" style={{ color: 'var(--white)' }}>
            <Package className="w-8 h-8 inline-block mr-3" />
            SHIPPING CALCULATOR
          </h2>
          
          <div className="flex items-center justify-between mb-8">
            <Link to="/cart" className="flex items-center gap-2" style={{ color: 'var(--white)' }}>
              <ArrowLeft className="w-5 h-5" /> Back to Cart
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-1">
              <ShippingForm
                cartItems={mockCartItems}
                onShippingSelected={handleShippingSelected}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-primarySupport shadow-sm p-6 sticky top-4">
                <h3 className="h3" style={{ fontSize: 'var(--fs-5)', marginBottom: 24, color: 'var(--white)' }}>
                  <Truck className="w-6 h-6 inline-block mr-2" />
                  ORDER SUMMARY
                </h3>
                
                <div className="space-y-4 mb-6">
                  {mockCartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img 
                        src={item.image || '/placeholder-product.jpg'} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium" style={{ color: 'var(--white)' }}>
                          {item.name}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--platinum)' }}>
                          Qty: {item.quantity}
                        </p>
                        {item.weight_kg && (
                          <p className="text-xs" style={{ color: 'var(--platinum)' }}>
                            Weight: {item.weight_kg * item.quantity}kg
                          </p>
                        )}
                      </div>
                      <p className="font-medium" style={{ color: 'var(--white)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/20 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--platinum)' }}>Subtotal</span>
                    <span className="font-medium" style={{ color: 'var(--white)' }}>
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--platinum)' }}>Shipping</span>
                    <span className="font-medium" style={{ color: 'var(--white)' }}>
                      {selectedShipping ? formatPrice(selectedShipping.cost) : 'TBD'}
                    </span>
                  </div>
                  
                  {selectedShipping && (
                    <div className="text-sm" style={{ color: 'var(--platinum)' }}>
                      <p>{selectedShipping.option.name}</p>
                      {selectedShipping.option.deliveryTime && (
                        <p className="text-xs">Delivery: {selectedShipping.option.deliveryTime}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="border-t border-black/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold" style={{ color: 'var(--white)' }}>
                        Total
                      </span>
                      <span className="text-lg font-semibold" style={{ color: 'var(--white)' }}>
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedShipping && (
                  <div className="mt-6">
                    <Link 
                      to="/checkout" 
                      className="btn btn-primary w-full text-center"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

