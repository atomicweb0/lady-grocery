'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  _id: string
  name: string
  namebn: string
  description: string
  descriptionbn: string
  price: number
  images: string[]
  sizes: Array<{ size: string; stock: number }>
  category: string
  categorybn: string
  color: string
  colorbn: string
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0].size)
          }
        }
      } catch (error) {
        console.error('[v0] Error fetching product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params])

  const addToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const cartItem = {
      ...product,
      selectedSize,
      quantity,
    }

    const existingItem = cart.find(
      (item: any) =>
        item._id === product?._id && item.selectedSize === selectedSize
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Product added to cart!')
  }

  const displayName = locale === 'bn' ? 'namebn' : 'name'
  const displayDesc = locale === 'bn' ? 'descriptionbn' : 'description'

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

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">{t('errors.productNotFound')}</p>
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
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <Card>
                <CardContent className="p-0">
                  <div className="bg-muted h-96 flex items-center justify-center">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product[displayName as keyof Product] as string}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">👠</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product[displayName as keyof Product]}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ৳{product.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t('products.inStock')}
                </span>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product[displayDesc as keyof Product]}
              </p>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('common.size')}
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes && product.sizes.map((size) => (
                      <SelectItem key={size.size} value={size.size}>
                        {size.size} (Stock: {size.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('common.quantity')}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border border-border rounded px-3 py-2 hover:bg-muted"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="border border-border rounded px-3 py-2 hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 mb-4"
                onClick={addToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('products.addToCart')}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
