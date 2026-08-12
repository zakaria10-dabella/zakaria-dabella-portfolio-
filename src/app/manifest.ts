import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zakaria Dabella | Full-Stack Developer, Graphic Designer, UI/UX Designer',
    short_name: 'Zakaria Dabella',
    description:
      'Portfolio of Zakaria Dabella — Full-Stack Developer, IT Support Technician, Graphic Designer, and UI/UX Designer based in Casablanca, Morocco.',
    id: '/',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    categories: ['technology', 'business', 'portfolio'],
    lang: 'en',
    icons: [
      {
        src: '/zakaria-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/zakaria-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/zakaria-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
