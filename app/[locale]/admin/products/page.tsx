'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  _id: string
  name: string
  namebn: string
  price: number
  category: string
  images: string[]
}

export default function AdminProductsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      const response = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id))
        toast.success('Product deleted successfully')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('[v0] Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <AdminHeader />

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {t('admin.products')}
            </h2>
            <Link href={`/${locale}/admin/products/new`}>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.addProduct')}
              </Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-muted-foreground">{t('common.loading')}</p>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                {t('common.noProducts')}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <Card key={product._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-xl">👠</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.namebn}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sm">
                            {t('common.price')}: ৳{product.price}
                          </span>
                          <span className="text-sm">
                            {t('common.category')}: {product.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/${locale}/admin/products/${product._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
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
