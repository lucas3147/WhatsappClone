import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NoSsr from '@/components/NoSsr'
import { DropDownOptionsGeneralProvider } from '@/contexts/DropDownContext'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Whatsapp Clone',
  description: 'Meu clone do whatsapp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="bg-greenish-white m-0 font-sans text-black">
        <NoSsr>
          <div className={inter.className}>
            {children}
          </div>
        </NoSsr>
      </body>
    </html>
  )
}
