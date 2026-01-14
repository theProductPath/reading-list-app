import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
