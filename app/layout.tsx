import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ 
  subsets: ['latin'] 
 })

export const metadata: Metadata = {
  title: 'AuthNext App',
  description: 'Create An Authentication app using nextjs14+',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
    <html lang="en">
      <body className={inter.className}>
        <Toaster  />
        {children}
        </body>
    </html>
    </SessionProvider>
  )
}
