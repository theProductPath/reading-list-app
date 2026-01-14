import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Reading List',
  description: 'Manage your reading list with book covers, reviews, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}
