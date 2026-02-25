'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function AdminHeader() {
  const t = useTranslations()
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('adminEmail')
    if (email) setAdminEmail(email)
  }, [])

  return (
    <header className="bg-white border-b border-border px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-foreground">
        {t('admin.dashboard')}
      </h1>
      <div className="text-sm text-muted-foreground">
        {t('admin.email')}: <span className="font-semibold">{adminEmail}</span>
      </div>
    </header>
  )
}
