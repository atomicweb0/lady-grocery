'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface CartItem {
  _id: string
  name: string
  namebn: string
  price: number
  quantity: number
  selectedSize: string
  images: string[]
}

export default function CartPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(cartData)
    setLoading(false)
  }, [])

  const removeFromCart = (productId: string, size: string) => {
    const updatedCart = cart.filter(
      (item) => !(item._id === productId && item.selectedSize === size)
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    toast.success('Product removed from cart')
  }

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId, size)
      return
    }

    const updatedCart = cart.map((item) =>
      item._id === productId && item.selectedSize === size
        ? { ...item, quantity }
        : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = 0 // Free shipping
  const total = subtotal + shippingFee

  const displayName = locale === 'bn' ? 'namebn' : 'name'

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            {t('cart.title')}
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-6">
                {t('cart.empty')}
              </p>
              <Link href={`/${locale}/products`}>
                <Button className="bg-primary hover:bg-primary/90">
                  {t('cart.continueShopping')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <Card key={`${item._id}-${item.selectedSize}`}>
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                          {item.images && item.images[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item[displayName as keyof CartItem] as string}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-2xl">👠</span>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">
                            {item[displayName as keyof CartItem]}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {t('common.size')}: {item.selectedSize}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            ৳{item.price}
                          </p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col items-end gap-4">
                          <div className="flex items-center gap-2 border border-border rounded">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.selectedSize,
                                  item.quantity - 1
                                )
                              }
                              className="px-2 py-1 hover:bg-muted"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  item.selectedSize,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 py-1 hover:bg-muted"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeFromCart(item._id, item.selectedSize)
                            }
                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <p className="text-sm font-semibold">
                            Subtotal: ৳{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>{t('cart.orderSummary')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <div className="border-t pt-4 flex justify-between">
                      <span className="font-semibold text-foreground">
                        {t('cart.total')}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ৳{total}
                      </span>
                    </div>

                    <Link href={`/${locale}/checkout`}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        {t('cart.checkout')}
                      </Button>
                    </Link>

                    <Link href={`/${locale}/products`}>
                      <Button variant="outline" className="w-full">
                        {t('cart.continueShopping')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
