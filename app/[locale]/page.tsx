import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  const t = useTranslations()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-white to-red-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  LadyGrocery
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {t('products.description')}
                </p>
                <Link href="/en/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    {t('navigation.products')}
                  </Button>
                </Link>
              </div>
              <div className="bg-primary/10 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👠</div>
                  <p className="text-muted-foreground">
                    Beautiful shoes await you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Why Choose LadyGrocery?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-border">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Premium Quality
                </h3>
                <p className="text-muted-foreground">
                  Carefully curated collection of high-quality shoes
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border border-border">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Free Shipping
                </h3>
                <p className="text-muted-foreground">
                  Enjoy free shipping on all orders, no minimum purchase
                </p>
              </div>
              <div className="text-center p-6 rounded-lg border border-border">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Easy Checkout
                </h3>
                <p className="text-muted-foreground">
                  Simple payment process with Cash on Delivery option
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect Shoes?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Browse our collection and find styles that match your personality
            </p>
            <Link href="/en/products">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white hover:bg-gray-100"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
