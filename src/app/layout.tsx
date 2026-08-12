import type { Metadata, Viewport } from 'next';
import { Instrument_Serif } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { headers } from 'next/headers';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zakaria-dabella.dev';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Zakaria Dabella — Full-Stack Developer, IT Support Technician & UI/UX Designer',
    template: '%s | Zakaria Dabella',
  },
  description:
    'Portfolio of Zakaria Dabella, a Casablanca-based full-stack developer, IT support technician, and graphic/UI-UX designer building responsive web apps, brand identities, and practical technical solutions.',
  keywords: [
    'Zakaria Dabella',
    'Zakaria Dabella portfolio',
    'full-stack developer Casablanca',
    'IT support technician Morocco',
    'graphic designer Casablanca',
    'UI UX designer Morocco',
    'Laravel developer',
    'React developer',
    'Next.js developer',
    'PHP developer',
    'MySQL developer',
    'Figma designer',
    'Adobe Photoshop designer',
    'IT support Windows',
    'network diagnostics',
    'Na9l Pro',
    'car rental booking web app',
    'restaurant QR menu',
  ],
  authors: [{ name: 'Zakaria Dabella', url: BASE_URL }],
  creator: 'Zakaria Dabella',
  publisher: 'Zakaria Dabella',
  icons: {
    icon: [
      { url: '/zakaria-logo.png', sizes: 'any', type: 'image/png' },
    ],
    shortcut: '/zakaria-logo.png',
    apple: '/zakaria-logo.png',
  },
  openGraph: {
    type: 'profile',
    firstName: 'Zakaria',
    lastName: 'Dabella',
    username: 'zakaria10-dabella',
    url: BASE_URL,
    siteName: 'Zakaria Dabella Portfolio',
    title: 'Zakaria Dabella — Full-Stack Developer, IT Support Technician & UI/UX Designer',
    description:
      'Casablanca-based technology and design professional combining web development, IT support, and graphic/UI-UX design.',
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Zakaria Dabella portfolio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakaria Dabella — Full-Stack Developer, IT Support Technician & UI/UX Designer',
    description:
      'Full-stack development, IT support, graphic design, and UI/UX portfolio based in Casablanca, Morocco.',
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
      'en-MA': BASE_URL,
      'fr-MA': BASE_URL,
      'ar-MA': BASE_URL,
      'x-default': BASE_URL,
    },
  },
  category: 'technology',
  appleWebApp: {
    capable: true,
    title: 'Zakaria Dabella',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'theme-color': '#0A0A0A',
    'msapplication-TileColor': '#0A0A0A',
    'application-name': 'Zakaria Dabella Portfolio',
    'geo.region': 'MA-CAS',
    'geo.placename': 'Casablanca, Morocco',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
};

const personSchema = {
  '@type': 'Person',
  '@id': `${BASE_URL}/#person`,
  name: 'Zakaria Dabella',
  givenName: 'Zakaria',
  familyName: 'Dabella',
  url: BASE_URL,
  image: `${BASE_URL}/zakaria-about.jpeg`,
  jobTitle: ['Full-Stack Developer', 'IT Support Technician', 'Graphic & UI/UX Designer'],
  description:
    'Zakaria Dabella is a versatile Technology & Design Professional based in Casablanca, Morocco, combining full-stack web development, IT infrastructure support, and visual UI/UX design.',
  email: 'zakariaadabella@gmail.com',
  telephone: '+212705805992',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Casablanca',
    addressCountry: 'MA',
  },
  knowsAbout: [
    'HTML5', 'CSS3', 'JavaScript', 'PHP', 'Laravel', 'React.js', 'Next.js',
    'Java', 'MySQL', 'REST APIs', 'Git', 'GitHub', 'Figma', 'Adobe Photoshop',
    'Adobe Illustrator', 'Adobe XD', 'UI/UX Design', 'Windows Administration',
    'Network Diagnostics', 'Office 365', 'Prompt Engineering',
  ],
  knowsLanguage: ['Arabic', 'English', 'French'],
  sameAs: [
    'https://github.com/zakaria10-dabella',
    'https://www.linkedin.com/in/zakaria-dabella',
  ],
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'Zakaria Dabella Portfolio',
  author: { '@id': `${BASE_URL}/#person` },
  inLanguage: 'en',
};

const projectItemListSchema = {
  '@type': 'ItemList',
  '@id': `${BASE_URL}/#projects-list`,
  name: 'Featured Projects by Zakaria Dabella',
  itemListElement: [
    { '@type': 'ListItem', position: 1, item: { '@type': 'CreativeWork', name: 'Na9l Pro Logistics Platform' } },
    { '@type': 'ListItem', position: 2, item: { '@type': 'CreativeWork', name: 'Car Rental Booking Web App' } },
    { '@type': 'ListItem', position: 3, item: { '@type': 'CreativeWork', name: 'Brand Identity & Digital Ad Campaigns' } },
    { '@type': 'ListItem', position: 4, item: { '@type': 'CreativeWork', name: 'Restaurant Interactive QR Menu' } },
  ],
};

const schemaGraph = {
  '@context': 'https://schema.org',
  '@graph': [personSchema, websiteSchema, projectItemListSchema],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en" className={instrumentSerif.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
