import Navbar from '@/app/ui/nav/navbar'

import '@/app/styles/globals.css'
import { inter } from '@/app/styles/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="flex h-[calc(100vh-64px)] overflow-auto flex-col p-6 border">
          {children}
        </main>
      </body>
    </html>
  )
}
