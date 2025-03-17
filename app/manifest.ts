import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'مساعد الرياضيات - Math Tutor',
    short_name: 'Math Tutor',
    description: 'معلم الرياضيات الذكي للأطفال العرب',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait',
    icons: [
      {
        src: '/images/math_tutor_ico.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
