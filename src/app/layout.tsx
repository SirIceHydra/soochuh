import '@/src/styles/globals.css';
import ThemeRegistry from '@/src/theme/ThemRegistery';
import AuthProvider from '../context/authContext';
import { Providers } from './providers';

export const metadata = {
  title: 'Soocha Scrubs - Premium Medical Scrubs for Healthcare Professionals',
  description: 'Shop high-quality, comfortable medical scrubs designed for healthcare professionals. Professional scrubs, lab coats, and medical uniforms with free shipping over R1,350.',
  keywords: 'medical scrubs, healthcare uniforms, professional scrubs, lab coats, medical clothing, healthcare apparel, scrub tops, scrub pants, medical uniforms',
  authors: [{ name: 'Soocha Scrubs' }],
  creator: 'Soocha Scrubs',
  publisher: 'Soocha Scrubs',
  robots: 'index, follow',
  metadataBase: new URL('https://soochascrubs.com'),
  openGraph: {
    title: 'Soocha Scrubs - Premium Medical Scrubs',
    description: 'High-quality medical scrubs for healthcare professionals. Comfortable, durable, and professional medical uniforms.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Soocha Scrubs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soocha Scrubs - Premium Medical Scrubs',
    description: 'High-quality medical scrubs for healthcare professionals.',
    creator: '@soochascrubs',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6B7280',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AuthProvider>
        <html lang="en">
          <head>
            <link rel="icon" href="/favicon.png" type="image/png" />
            <link rel="apple-touch-icon" href="/favicon.png" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Soocha Scrubs" />
          </head>
          <body>
            <ThemeRegistry>{children}</ThemeRegistry>
          </body>
        </html>
      </AuthProvider>
    </Providers>
  );
}
