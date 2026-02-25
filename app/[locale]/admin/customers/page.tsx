'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Customer {
  _id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  totalOrders: number
  totalSpent: number
  createdAt: string
}

export default function AdminCustomersPage() {
  const t = useTranslations()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      const response = await fetch('/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching customers:', error)
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <AdminHeader />

        <div className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            {t('admin.customers')}
          </h2>

          {loading ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : customers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No customers yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <Card key={customer._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {customer.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {customer.phone}
                        </p>
                      </div>

                      <div className="flex gap-4 text-right">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Orders
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {customer.totalOrders}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Spent
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            ৳{customer.totalSpent}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Joined
                          </p>
                          <p className="text-sm font-semibold">
                            {new Date(customer.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
