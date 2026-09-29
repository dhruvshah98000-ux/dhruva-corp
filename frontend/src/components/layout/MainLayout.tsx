import React from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
  noFooter?: boolean
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, noFooter = false }) => {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  )
}
