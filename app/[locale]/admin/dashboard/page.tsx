'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users } from 'lucide-react'

export default function AdminDashboard() {
  const t = useTranslations()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) return

        const response = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <AdminHeader />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">
                  {t('admin.totalProducts')}
                </CardTitle>
                <Package className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.totalProducts}
                </div>
              </CardContent>
            </Card>

            {/* Total Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">
                  {t('admin.totalOrders')}
                </CardTitle>
                <ShoppingCart className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.totalOrders}
                </div>
              </CardContent>
            </Card>

            {/* Total Customers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">
                  {t('admin.totalCustomers')}
                </CardTitle>
                <Users className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stats.totalCustomers}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Welcome to LadyGrocery Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use the navigation menu to manage products, orders, and customers. You can add, edit, or delete products from the Products section. Track and update order statuses from the Orders section.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
