import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, DM_Mono } from 'next/font/google';
import { SITE } from '@/data/site';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

const DESCRIPTION =
  'One local for the whole of Dubrovnik: airport transfers, the Old Town before the cruise ships, private boat days around the Elaphiti islands, sea caves and snorkelling, and the sunset. Message Ivio directly.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'Ivio Bilić — One local. Your entire Dubrovnik.',
  description: DESCRIPTION,
  keywords: [
    'Dubrovnik private boat tour', 'Elaphiti islands', 'Blue Cave Koločep',
    'Dubrovnik Old Town guide', 'Dubrovnik airport transfer', 'Cavtat boat tour',
    'snorkelling Dubrovnik',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    title: 'Ivio Bilić — One local. Your entire Dubrovnik.',
    description: DESCRIPTION,
    siteName: SITE.name,
    images: [{ url: '/media/hero-islet-gold-1600.webp', width: 1600, height: 1200 }],
  },
  twitter: { card: 'summary_large_image' },
  // Staging deploy. Ivio has not yet approved the site or the use of his
  // graduation photograph, so it stays out of search until he has. Delete this
  // one line to go live.
  robots: { index: false, follow: false },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#0a2733',
  width: 'device-width',
  initialScale: 1,
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'TravelAgency'],
  name: SITE.name,
  description: DESCRIPTION,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  sameAs: [SITE.instagram],
  image: `${SITE.url}/media/hero-islet-gold-1600.webp`,
  address: { '@type': 'PostalAddress', addressLocality: 'Dubrovnik', addressCountry: 'HR' },
  areaServed: SITE.areas.map((name) => ({ '@type': 'Place', name })),
  knowsLanguage: ['en', 'hr'],
  makesOffer: [
    'Private boat tours to the Elaphiti islands',
    'Sea caves and snorkelling trips',
    'Guided Old Town walking tours',
    'Airport transfers and private driving',
    'Sunset cruises',
  ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The root is deliberately mutated before hydration (data-js, plus the
  // active-hour attribute the day bar writes), so React must not diff it.
  return (
    <html
      lang="en"
      data-hour="paper"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <head>
        {/* Set before first paint so revealed content never flashes in. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-js','')" }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
