
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import NoSsr from '@/components/NoSsr'
import { DropDownOptionsProvider } from '@/contexts/DropDownOptionsContext'

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
      <body className="bg-gradient-to-r from-[#020024] to-[#00a884] m-0 font-sans text-black">
          <div className={inter.className}>
            {children}
          </div>
      </body>
    </html>
  )
}
