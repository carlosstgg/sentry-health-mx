import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // PWA será manejado via next-pwa en versión futura
  // Por ahora configuramos los headers de seguridad
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
