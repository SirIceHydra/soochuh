import React from 'react';
import { Helmet } from 'react-helmet';
import { BobGoTest } from '../ui/BobGoTest';
import { Navigation } from '../../components/Navigation';

export default function BobGoTestPage() {
  return (
    <div className="min-h-screen bg-primary text-tertiary">
      <Navigation isScrolled={false} />
      <div className="h-28" />
      
      <Helmet>
        <title>BobGo API Test - Oracle Gaming</title>
        <meta name="description" content="Test BobGo shipping API integration" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">BobGo Shipping API Test</h1>
          <p className="text-center text-tertiary/80 mb-8">
            This page allows you to test the BobGo shipping API integration before using it in the checkout process.
          </p>
          
          <BobGoTest />
          
          <div className="mt-8 p-6 bg-primarySupport rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-tertiary/80">
              <li>Click "Test BobGo API" to send a test request to BobGo</li>
              <li>Check the configuration section to verify your API settings</li>
              <li>Review the API response to see available shipping options</li>
              <li>If successful, you can proceed to test the checkout integration</li>
              <li>If there are errors, check your environment variables and API key</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
