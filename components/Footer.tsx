'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LG</span>
              </div>
              <span className="font-bold text-foreground">LadyGrocery</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.about')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('common.view')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t('navigation.products')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/track-order`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t('navigation.trackOrder')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:support@ladygrocery.com"
                  className="text-muted-foreground hover:text-primary"
                >
                  support@ladygrocery.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="text-muted-foreground hover:text-primary"
                >
                  +880 1234 567 890
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} LadyGrocery. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
