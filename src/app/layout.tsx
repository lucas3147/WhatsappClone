import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import NoSsr from '@/components/NoSsr'
import { ActiveChatProvider } from '@/contexts/ActiveChatContext'
import { GeneralOptionsProvider } from '@/contexts/generalOptionsContext'

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
          <ActiveChatProvider>
            <GeneralOptionsProvider>
              <div className={inter.className}>
                {children}
              </div>
            </GeneralOptionsProvider>
          </ActiveChatProvider>
        </NoSsr>
      </body>
    </html>
  )
}
