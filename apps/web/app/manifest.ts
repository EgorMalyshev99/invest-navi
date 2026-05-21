import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ИнвестНавигатор',
    short_name: 'ИнвестНави',
    description:
      'AI-платформа для частных инвесторов на российском рынке — понимание активов, рисков и осознанных решений',
    start_url: '/',
    display: 'standalone',
    background_color: '#080B12',
    theme_color: '#080B12',
    icons: [
      {
        src: '/favicons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
