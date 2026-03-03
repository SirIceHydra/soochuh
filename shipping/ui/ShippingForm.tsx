import React, { useState, useEffect } from 'react';
import { Package, Truck, Clock, CheckCircle } from 'lucide-react';
import { useShipping } from '../hooks/useShipping';
import { CartItemWithShipping } from '../types/shipping';
import { formatPrice } from '../../utils/helpers';

interface ShippingFormProps {
  cartItems: CartItemWithShipping[];
  onShippingSelected?: (shippingCost: number, shippingOption: any) => void;
  className?: string;
}

interface AddressForm {
  street_address: string;
  local_area: string;
  city: string;
  zone: string;
  country: string;
  code: string;
  company: string;
}

export function ShippingForm({ cartItems, onShippingSelected, className = '' }: ShippingFormProps) {
  const { 
    shippingRates, 
    fetchShippingRates, 
    selectShippingOption, 
    isAddressValid 
  } = useShipping();
  
  const [address, setAddress] = useState<AddressForm>({
    street_address: '',
    local_area: '',
    city: '',
    zone: 'GP',
    country: 'ZA',
    code: '',
    company: ''
  });

  const [addressErrors, setAddressErrors] = useState<string[]>([]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (addressErrors.length > 0) {
      setAddressErrors([]);
    }
  };

  const handleGetRates = async () => {
    const validation = isAddressValid(address);
    if (!validation.isValid) {
      setAddressErrors(validation.errors);
      return;
    }

    setAddressErrors([]);
    await fetchShippingRates(address, cartItems);
  };

  const handleShippingOptionSelect = (optionId: string) => {
    selectShippingOption(optionId);
    const selectedOption = shippingRates.options.find(opt => opt.id === optionId);
    if (selectedOption && onShippingSelected) {
      onShippingSelected(selectedOption.price, selectedOption);
    }
  };

  // Notify parent when shipping is selected
  useEffect(() => {
    if (shippingRates.selectedOption && onShippingSelected) {
      onShippingSelected(shippingRates.selectedOption.price, shippingRates.selectedOption);
    }
  }, [shippingRates.selectedOption, onShippingSelected]);

  return (
    <div className={`bg-primarySupport shadow-sm p-6 ${className}`}>
      <h3 className="h3" style={{ fontSize: 'var(--fs-5)', marginBottom: 24, color: 'var(--white)' }}>
        <Package className="w-6 h-6 inline-block mr-2" />
        SHIPPING INFORMATION
      </h3>

      {/* Address Form */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="street_address" className="block text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
              Street Address *
            </label>
            <input
              type="text"
              id="street_address"
              name="street_address"
              value={address.street_address}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-tertiary/40 bg-primary text-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="123 Main Street"
            />
          </div>
          <div>
            <label htmlFor="local_area" className="block text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
              Suburb/Area
            </label>
            <input
              type="text"
              id="local_area"
              name="local_area"
              value={address.local_area}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-tertiary/40 bg-primary text-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="Sandton"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-tertiary/40 bg-primary text-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="Johannesburg"
            />
          </div>
          <div>
            <label htmlFor="zone" className="block text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
              Province *
            </label>
            <select
              id="zone"
              name="zone"
              value={address.zone}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-tertiary/40 bg-primary text-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
            >
              <option value="GP">Gauteng</option>
              <option value="WC">Western Cape</option>
              <option value="KZN">KwaZulu-Natal</option>
              <option value="EC">Eastern Cape</option>
              <option value="FS">Free State</option>
              <option value="LP">Limpopo</option>
              <option value="MP">Mpumalanga</option>
              <option value="NC">Northern Cape</option>
              <option value="NW">North West</option>
            </select>
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
              Postal Code *
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={address.code}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-tertiary/40 bg-primary text-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="2196"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-tertiary/40 bg-primary text-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="ZA"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
              Company (Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={address.company}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-tertiary/40 bg-primary text-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
              placeholder="Oracle Gaming"
            />
          </div>
        </div>

        {addressErrors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm font-medium mb-1">Please fix the following errors:</p>
            <ul className="text-red-600 text-sm list-disc list-inside">
              {addressErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleGetRates}
          disabled={shippingRates.loading}
          className="btn btn-primary w-full"
        >
          <Truck className="w-5 h-5 mr-2" />
          {shippingRates.loading ? 'Getting Rates...' : 'Get Shipping Rates'}
        </button>
      </div>

      {/* Shipping Options */}
      {shippingRates.options.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold" style={{ color: 'var(--white)' }}>
            <Clock className="w-5 h-5 inline-block mr-2" />
            Available Shipping Options
          </h4>
          
          {shippingRates.options.map((option) => (
            <div
              key={option.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                option.selected
                  ? 'border-tertiary bg-tertiary/10'
                  : 'border-tertiary/40 hover:border-tertiary/60'
              }`}
              onClick={() => handleShippingOptionSelect(option.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    option.selected 
                      ? 'border-tertiary bg-tertiary' 
                      : 'border-tertiary/40'
                  }`}>
                    {option.selected && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-semibold" style={{ color: 'var(--white)' }}>
                      {option.name}
                    </h5>
                    <p className="text-sm" style={{ color: 'var(--platinum)' }}>
                      {option.description}
                    </p>
                    {option.deliveryTime && (
                      <p className="text-xs" style={{ color: 'var(--platinum)' }}>
                        <Clock className="w-3 h-3 inline-block mr-1" />
                        {option.deliveryTime}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: 'var(--white)' }}>
                    {option.price === 0 ? 'Free' : formatPrice(option.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {shippingRates.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded mt-4">
          <p className="text-red-600 text-sm">{shippingRates.error}</p>
        </div>
      )}
    </div>
  );
}


