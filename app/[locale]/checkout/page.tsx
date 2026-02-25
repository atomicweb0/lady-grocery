'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  selectedSize: string
}

export default function CheckoutPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Bangladesh',
  })

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(cartData)

    if (cartData.length === 0) {
      router.push(`/${locale}/products`)
    }
  }, [locale, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = 0
  const total = subtotal + shippingFee

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      toast.error('Please agree to terms and conditions')
      return
    }

    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    setLoading(true)

    try {
      const orderData = {
        ...formData,
        items: cart,
        subtotal,
        shippingFee,
        total,
        paymentMethod: 'cod',
        status: 'pending',
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const { order } = await response.json()

      // Clear cart
      localStorage.removeItem('cart')

      toast.success('Order placed successfully!')

      // Redirect to success page or home
      setTimeout(() => {
        router.push(`/${locale}?orderId=${order.orderId}`)
      }, 1500)
    } catch (error) {
      console.error('[v0] Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            {t('checkout.title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.customerInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">
                        {t('checkout.firstName')}
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">
                        {t('checkout.lastName')}
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('checkout.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">{t('checkout.phone')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880..."
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.address')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">{t('checkout.address')}</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">{t('checkout.city')}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">{t('checkout.state')}</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">
                        {t('checkout.postalCode')}
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">{t('checkout.country')}</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.paymentMethod')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 p-4 border border-primary rounded-lg bg-primary/5">
                    <Checkbox checked disabled />
                    <label className="text-sm font-medium">
                      {t('checkout.cashOnDelivery')}
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Terms & Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) =>
                    setAgreeTerms(checked as boolean)
                  }
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I agree to terms and conditions
                </Label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading || !agreeTerms}
              >
                {loading ? t('common.loading') : t('checkout.placeOrder')}
              </Button>
            </form>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>{t('checkout.orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={`${item._id}-${item.selectedSize}`} className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-semibold">
                            ৳{item.price * item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.selectedSize}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t('cart.subtotal')}
                      </span>
                      <span className="font-semibold">৳{subtotal}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t('checkout.freeShipping')}
                      </span>
                      <span className="font-semibold text-green-600">
                        ৳0
                      </span>
                    </div>

                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">{t('cart.total')}</span>
                      <span className="text-xl font-bold text-primary">
                        ৳{total}
                      </span>
                    </div>
                  </div>

                  <Link href={`/${locale}/cart`}>
                    <Button variant="outline" className="w-full">
                      Edit Cart
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
