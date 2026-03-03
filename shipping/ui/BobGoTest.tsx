import React, { useState } from 'react';
import { bobGoService } from '../services/bobgo';
import { CartItemWithShipping } from '../types/shipping';
// import { formatPrice } from '../../utils/helpers';

// Helper function for formatting price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price);
};

/**
 * Test component for BobGo shipping integration
 * This can be used to test the API integration before using it in checkout
 */
export function BobGoTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testBobGoAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test data - sample cart items
      const testItems: CartItemWithShipping[] = [
        {
          id: '1',
          productId: 1,
          name: 'Whey Protein - Chocolate',
          price: 299.99,
          quantity: 2,
          image: '',
          stockStatus: 'instock',
          weight_kg: 0.5,
          length_cm: 20,
          width_cm: 15,
          height_cm: 10
        }
      ];

      // Test delivery address
      const testAddress = {
        street_address: '123 Test Street',
        local_area: 'Sandton',
        city: 'Johannesburg',
        zone: 'GP',
        country: 'ZA',
        code: '2196',
        company: 'Test Company'
      };


      const response = await bobGoService.getCheckoutRates(testAddress, testItems, 599.98);
      
      setResult(response);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('BobGo API Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">BobGo API Test</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Configuration:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(bobGoService.getConfig(), null, 2)}
        </pre>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={testBobGoAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test BobGo API'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">API Response:</h3>
          
          <div className="bg-gray-100 p-3 rounded">
            <p><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</p>
            {result.message && <p><strong>Message:</strong> {result.message}</p>}
            {result.error && <p><strong>Error:</strong> {result.error}</p>}
          </div>

          {result.rates && result.rates.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Available Shipping Options:</h4>
              <div className="space-y-2">
                {result.rates.map((rate: any, index: number) => (
                  <div key={index} className="border border-gray-200 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{rate.name}</p>
                        <p className="text-sm text-gray-600">{rate.description}</p>
                        {rate.deliveryTime && (
                          <p className="text-xs text-gray-500">Delivery: {rate.deliveryTime}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {rate.price === 0 ? 'Free' : formatPrice(rate.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <details className="bg-gray-50 p-3 rounded">
            <summary className="cursor-pointer font-medium">Raw Response</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
