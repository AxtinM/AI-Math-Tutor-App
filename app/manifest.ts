import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'مساعد الرياضيات - Math Tutor',
    short_name: 'Math Tutor',
    description: 'معلم الرياضيات الذكي للأطفال العرب',
    id: '/',
    start_url: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait',
    categories: ['education', 'kids', 'mathematics'],
    screenshots: [
      {
        src: '/images/screenshots/screen1.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Math Tutor Dashboard'
      },
      {
        src: '/images/screenshots/screen2.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Interactive Math Example'
      },
      {
        src: '/images/screenshots/mobile1.png',
        sizes: '720x1280',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile Math Interface'
      },
      {
        src: '/images/screenshots/mobile2.png',
        sizes: '720x1280',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile Problem Solving'
      }
    ],
    icons: [
      {
        src: '/images/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/images/icons/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/images/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/images/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/images/icons/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    shortcuts: [
      {
        name: 'New Chat',
        url: '/',
        description: 'Start a new math tutoring session',
        icons: [{ src: '/images/icons/shortcut-chat.png', sizes: '96x96', type: 'image/png' }]
      }
    ],
    lang: 'ar',
    dir: 'rtl',
    prefer_related_applications: false
  }
}
