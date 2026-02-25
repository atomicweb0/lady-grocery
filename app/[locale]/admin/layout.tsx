'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken')

    // Don't redirect if on login page
    if (!token && !pathname.includes('/admin/login')) {
      router.push('/en/admin/login')
    }
  }, [router, pathname])

  return <>{children}</>
}
