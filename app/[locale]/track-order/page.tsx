'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Truck, Home } from 'lucide-react'
import { toast } from 'sonner'

interface Order {
  _id: string
  orderId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  items: Array<{ productName: string; quantity: number; size: string }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export default function TrackOrderPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered']
  const statusLabels: Record<string, string> = {
    pending: t('trackOrder.pending'),
    processing: t('trackOrder.processing'),
    shipped: t('trackOrder.shipped'),
    delivered: t('trackOrder.delivered'),
    cancelled: t('trackOrder.cancelled'),
  }

  const statusIcons: Record<string, any> = {
    pending: Clock,
    processing: Clock,
    shipped: Truck,
    delivered: Home,
  }

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    setOrder(null)

    try {
      const response = await fetch(
        `/api/orders?phone=${phone}&orderId=${orderId}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }

      const data = await response.json()

      if (data.length === 0) {
        toast.error(t('trackOrder.orderNotFound'))
      } else {
        setOrder(data[0])
        toast.success('Order found!')
      }
    } catch (error) {
      console.error('[v0] Error tracking order:', error)
      toast.error(t('errors.serverError'))
    } finally {
      setLoading(false)
    }
  }

  const getStatusIndex = (status: string) => {
    const index = statusSteps.indexOf(status)
    return index !== -1 ? index : 0
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('trackOrder.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('trackOrder.description')}
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orderId">
                      {t('trackOrder.orderId')}
                    </Label>
                    <Input
                      id="orderId"
                      placeholder="e.g., LG-ABC123-DEF456"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {t('trackOrder.phoneNumber')}
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+880..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? t('common.loading') : t('trackOrder.track')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Details */}
          {searched && order ? (
            <div className="space-y-6">
              {/* Order Header */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Order {order.orderId}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge
                    className={`text-lg px-4 py-2 ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {statusLabels[order.status]}
                  </Badge>
                </CardHeader>
              </Card>

              {/* Status Timeline */}
              {order.status !== 'cancelled' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('trackOrder.orderStatus')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statusSteps.map((status, index) => {
                        const isCompleted = getStatusIndex(order.status) >= index
                        const isCurrent = order.status === status
                        const Icon = statusIcons[status]

                        return (
                          <div key={status} className="flex items-center gap-4">
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                isCompleted
                                  ? 'bg-primary text-white'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <Icon className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-semibold ${
                                  isCurrent ? 'text-foreground' : ''
                                }`}
                              >
                                {statusLabels[status]}
                              </p>
                              {isCurrent && (
                                <p className="text-sm text-muted-foreground">
                                  Current status
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center pb-3 border-b last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Customer Name:
                    </span>
                    <span className="font-semibold">
                      {order.firstName} {order.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-semibold">{order.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-semibold">{order.phone}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-bold text-primary">
                      ৳{order.total}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : searched ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  {t('trackOrder.orderNotFound')}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  )
}
