'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { useRouter, useParams } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

interface ProductForm {
  _id?: string
  name: string
  namebn: string
  description: string
  descriptionbn: string
  price: number
  category: string
  categorybn: string
  color: string
  colorbn: string
  sizes: Array<{ size: string; stock: number }>
  images: string[]
}

export default function EditProductPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<ProductForm>({
    name: '',
    namebn: '',
    description: '',
    descriptionbn: '',
    price: 0,
    category: '',
    categorybn: '',
    color: '',
    colorbn: '',
    sizes: [{ size: '', stock: 0 }],
    images: [],
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const data = await response.json()
          setForm(data)
        } else {
          toast.error('Product not found')
          router.push(`/${locale}/admin/products`)
        }
      } catch (error) {
        console.error('[v0] Error fetching product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId, locale, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ProductForm
  ) => {
    const value = e.target.value
    setForm((prev) => ({
      ...prev,
      [field]: field === 'price' ? Number(value) : value,
    }))
  }

  const handleSizeChange = (
    index: number,
    field: 'size' | 'stock',
    value: string | number
  ) => {
    const newSizes = [...form.sizes]
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'stock' ? Number(value) : value,
    }
    setForm((prev) => ({
      ...prev,
      sizes: newSizes,
    }))
  }

  const addSize = () => {
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: 0 }],
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)

    try {
      const newImageUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const url = await uploadImageToCloudinary(file)
        newImageUrls.push(url)
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
      }))

      toast.success(`${newImageUrls.length} image(s) uploaded`)
    } catch (error) {
      console.error('[v0] Error uploading images:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.namebn || !form.price) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem('adminToken')

      const response = await fetch(`/api/products/${form._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      toast.success('Product updated successfully!')
      router.push(`/${locale}/admin/products`)
    } catch (error) {
      console.error('[v0] Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1">
          <AdminHeader />
          <div className="p-8">
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <AdminHeader />

        <div className="p-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name (English)</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="namebn">Product Name (Bengali)</Label>
                  <Input
                    id="namebn"
                    value={form.namebn}
                    onChange={(e) => handleInputChange(e, 'namebn')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => handleInputChange(e, 'price')}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Description (English)</Label>
                  <textarea
                    id="description"
                    className="w-full border border-input rounded-md px-3 py-2"
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleInputChange(e, 'description')}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionbn">Description (Bengali)</Label>
                  <textarea
                    id="descriptionbn"
                    className="w-full border border-input rounded-md px-3 py-2"
                    rows={4}
                    value={form.descriptionbn}
                    onChange={(e) => handleInputChange(e, 'descriptionbn')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category & Color */}
            <Card>
              <CardHeader>
                <CardTitle>Category & Color</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category (English)</Label>
                    <Input
                      id="category"
                      value={form.category}
                      onChange={(e) => handleInputChange(e, 'category')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="categorybn">Category (Bengali)</Label>
                    <Input
                      id="categorybn"
                      value={form.categorybn}
                      onChange={(e) => handleInputChange(e, 'categorybn')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Color (English)</Label>
                    <Input
                      id="color"
                      value={form.color}
                      onChange={(e) => handleInputChange(e, 'color')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="colorbn">Color (Bengali)</Label>
                    <Input
                      id="colorbn"
                      value={form.colorbn}
                      onChange={(e) => handleInputChange(e, 'colorbn')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sizes */}
            <Card>
              <CardHeader>
                <CardTitle>Sizes & Stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Size</Label>
                      <Input
                        value={size.size}
                        onChange={(e) =>
                          handleSizeChange(index, 'size', e.target.value)
                        }
                        placeholder="e.g., 5, 6, 7"
                      />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={size.stock}
                        onChange={(e) =>
                          handleSizeChange(index, 'stock', e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSize}
                  className="w-full"
                >
                  Add Size
                </Button>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </div>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {form.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={saving || uploading}
            >
              {saving ? 'Saving...' : 'Update Product'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
