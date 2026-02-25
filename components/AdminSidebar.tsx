'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminSidebar() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      label: t('admin.dashboard'),
      icon: LayoutDashboard,
      href: `/${locale}/admin/dashboard`,
    },
    {
      label: t('admin.products'),
      icon: Package,
      href: `/${locale}/admin/products`,
    },
    {
      label: t('admin.orders'),
      icon: ShoppingCart,
      href: `/${locale}/admin/orders`,
    },
    {
      label: t('admin.customers'),
      icon: Users,
      href: `/${locale}/admin/customers`,
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push(`/${locale}/admin/login`)
  }

  return (
    <aside className="w-64 bg-white border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href={`/${locale}/admin/dashboard`} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">LG</span>
          </div>
          <span className="font-bold text-foreground">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  isActive ? 'bg-primary hover:bg-primary/90' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-border">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          {t('admin.logout')}
        </Button>
      </div>
    </aside>
  )
}
