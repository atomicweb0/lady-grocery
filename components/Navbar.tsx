'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { ShoppingCart, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LG</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              LadyGrocery
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={`/${locale}`}
              className="text-foreground hover:text-primary transition"
            >
              {t('navigation.home')}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="text-foreground hover:text-primary transition"
            >
              {t('navigation.products')}
            </Link>
            <Link
              href={`/${locale}/track-order`}
              className="text-foreground hover:text-primary transition"
            >
              {t('navigation.trackOrder')}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href={`/${locale}/cart`}>
              <Button variant="outline" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </Link>
            <Link href={`/${locale}/admin/login`}>
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                {t('navigation.adminLogin')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
