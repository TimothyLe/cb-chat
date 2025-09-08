import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ContextBuddy Chat',
  description: 'The chat module for the ContextBuddy app',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
