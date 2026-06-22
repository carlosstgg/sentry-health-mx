import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // El comportamiento offline-first se implementa con un service worker
  // manual (public/sw.js) en vez de next-pwa, para no agregar una
  // dependencia pesada (regla 3 de .cursorrules).
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },
}

export default nextConfig
