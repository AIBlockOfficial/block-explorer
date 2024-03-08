"use client"
import Navbar from '@/app/ui/nav/navbar'
import '@/app/styles/globals.css'
import { inter } from '@/app/styles/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" id='html'> {/** Id is used for auto scroll feature */}
      <body className={`${inter.className} antialiased overflow-y-auto overflow-x-hidden`}> 
        <Navbar />
        <main className="flex h-auto min-h-[calc(100vh-64px)] overflow-y-hidden flex-col p-6 border overflow-x-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
