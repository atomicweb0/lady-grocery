'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ShoppingCart, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  _id: string
  name: string
  namebn: string
  price: number
  images: string[]
  category: string
  categorybn: string
  color: string
  colorbn: string
  stock?: number
}

export default function ProductsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching products:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: any) => item._id === product._id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        ...product,
        quantity: 1,
        selectedSize: '',
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Product added to cart!')
  }

  const displayName = locale === 'bn' ? 'namebn' : 'name'

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('products.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('products.description')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-96">
              <p className="text-muted-foreground">{t('common.loading')}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center min-h-96">
              <p className="text-muted-foreground text-lg">
                {t('common.noProducts')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card
                  key={product._id}
                  className="hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Image Placeholder */}
                    <div className="bg-muted h-48 flex items-center justify-center">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product[displayName as keyof Product] as string}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl">👠</div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {product[displayName as keyof Product]}
                      </h3>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">
                          ৳{product.price}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {t('products.addToCart')}
                        </Button>
                        <Link href={`/${locale}/products/${product._id}`}>
                          <Button
                            variant="outline"
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t('products.viewDetails')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
