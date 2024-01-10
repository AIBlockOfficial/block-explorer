"use client"
import Navbar from '@/app/ui/nav/navbar'

import '@/app/styles/globals.css'
import { inter } from '@/app/styles/fonts'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased overflow-auto`}>
        <Navbar />
        <main className="flex h-auto min-h-[calc(100vh-64px)] overflow-hidden flex-col p-6 border">
          {children}
        </main>
      </body>
    </html>
  )
}
