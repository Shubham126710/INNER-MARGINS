import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Inner Margins',
    short_name: 'Inner Margins',
    description: 'A personal space for thoughts, reflections, and the stories we carry within.',
    start_url: '/',
    display: 'standalone',
    background_color: '#E6DFF1',
    theme_color: '#7A6C9D',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
