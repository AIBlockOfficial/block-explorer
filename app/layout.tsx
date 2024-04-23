"use client"
import Navbar from '@/app/ui/nav/navbar'
import Footer from './ui/nav/footer'
import '@/app/styles/globals.css'
import { inter } from '@/app/styles/fonts'
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
       <body className={`${inter.className} antialiased overflow-y-auto overflow-x-hidden`}>
        <Navbar />
        <main className="flex h-auto min-h-[calc(100vh-64px)] overflow-y-hidden flex-col p-6 border overflow-x-auto">
          {children}
        </main>
        <Footer />
        <Script src="/__ENV.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}
