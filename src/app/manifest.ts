import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Inner Margins',
    short_name: 'Inner Margins',
    description: 'A personal space for thoughts, reflections, and the stories we carry within.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4CFCB',
    theme_color: '#C9413C',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
