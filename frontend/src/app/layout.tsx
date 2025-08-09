import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar, SidebarLayout } from '@/components/ui/sidebar'
import { MobileNav, MobileNavSpacer } from '@/components/mobile/MobileNav'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/lib/contexts/theme-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Price Tracker',
  description: 'Mobile-first inventory price tracking system',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Price Tracker" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="price-tracker-theme"
        >
          <div className="min-h-screen bg-background transition-colors">
            {/* Desktop Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <SidebarLayout>
              <main className="min-h-screen">
                {children}
                {/* Mobile Navigation Spacer */}
                <MobileNavSpacer />
              </main>
            </SidebarLayout>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}