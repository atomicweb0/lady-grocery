# LadyGrocery - Women's Shoe Store

A modern, multi-language e-commerce platform for selling women's shoes with a complete admin dashboard.

## Features

### Customer Features
- **Product Browsing**: View products with detailed information
- **Multi-Language Support**: English and Bengali interface
- **Shopping Cart**: Add/remove products with quantity management
- **Guest Checkout**: Simple checkout process with Cash on Delivery (COD)
- **Order Tracking**: Track orders using Order ID + Phone Number
- **Free Shipping**: No shipping fees on all orders

### Admin Features
- **Firebase Authentication**: Secure admin login
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order statuses
- **Customer Management**: Track customer information and purchase history
- **Multi-Language Product Support**: Add products in English and Bengali

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: Firebase Auth (Admin)
- **Image Hosting**: Cloudinary
- **Localization**: next-intl (English & Bengali)
- **Styling**: Tailwind CSS with custom red theme

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- Firebase project
- Cloudinary account

### Installation

1. **Clone and Install Dependencies**
```bash
npm install
# or
pnpm install
```

2. **Setup Environment Variables**
Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Firebase (Get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary (Get from Cloudinary Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

3. **Create Firebase Admin User**
- Go to Firebase Console → Authentication
- Create a new user with email and password
- Use these credentials to login on the admin panel

4. **Run Development Server**
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── [locale]/                      # Locale-based routing (en/bn)
│   ├── page.tsx                  # Home page
│   ├── products/                 # Product listing & details
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout form
│   ├── track-order/              # Order tracking
│   └── admin/                    # Admin dashboard
│       ├── login/                # Admin login page
│       ├── dashboard/            # Dashboard home
│       ├── products/             # Product management
│       ├── orders/               # Order management
│       └── customers/            # Customer management
├── api/                          # API routes
│   ├── products/                 # Product endpoints
│   ├── orders/                   # Order endpoints
│   ├── customers/                # Customer endpoints
│   └── admin/                    # Admin endpoints
components/                       # Reusable components
lib/                             # Utilities
├── mongodb.ts                   # MongoDB connection
├── firebase.ts                  # Firebase config
├── cloudinary.ts                # Cloudinary utilities
models/                          # Database schemas
├── Product.ts
├── Order.ts
└── Customer.ts
messages/                        # Translation files
├── en.json                      # English translations
└── bn.json                      # Bengali translations
```

## Key Routes

### Customer Routes
- `/en` - Home page (English)
- `/bn` - Home page (Bengali)
- `/en/products` - Product listing
- `/en/products/[id]` - Product details
- `/en/cart` - Shopping cart
- `/en/checkout` - Checkout form
- `/en/track-order` - Order tracking

### Admin Routes
- `/en/admin/login` - Admin login
- `/en/admin/dashboard` - Dashboard overview
- `/en/admin/products` - Product management
- `/en/admin/products/new` - Add new product
- `/en/admin/products/[id]` - Edit product
- `/en/admin/orders` - Order management
- `/en/admin/customers` - Customer management

## Database Models

### Product
```typescript
{
  name: string,              // English name
  namebn: string,           // Bengali name
  description: string,      // English description
  descriptionbn: string,    // Bengali description
  price: number,
  category: string,
  categorybn: string,
  color: string,
  colorbn: string,
  sizes: [{ size: string, stock: number }],
  images: string[],         // Cloudinary URLs
  rating: number,
  reviews: [{ userId, rating, comment }]
}
```

### Order
```typescript
{
  orderId: string,          // Unique order ID
  firstName: string,
  lastName: string,
  email: string,
  phone: string,            // Used for tracking
  address: string,
  city: string,
  state: string,
  postalCode: string,
  country: string,
  items: [{ productId, productName, quantity, price, size }],
  subtotal: number,
  shippingFee: number,     // Always 0
  total: number,
  paymentMethod: string,   // "cod"
  status: string,          // pending, processing, shipped, delivered, cancelled
}
```

### Customer
```typescript
{
  email: string,
  phone: string,
  firstName: string,
  lastName: string,
  totalOrders: number,
  totalSpent: number,
  addresses: [{ type, address, city, state, postalCode, country }]
}
```

## Admin Login

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `password123`

## Deployment

### Using Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Using Other Platforms
1. Set environment variables in your hosting platform
2. Run `npm run build`
3. Deploy the `.next` folder

## Multi-Language Support

The site automatically detects the language from the URL:
- `/en/*` - English version
- `/bn/*` - Bengali version

Users can switch languages using the language selector in the navbar.

## Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Ensure IP whitelist includes your server IP
- Verify database credentials

### Firebase Issues
- Ensure Firebase config is correct
- Check that admin user exists in Firebase Authentication
- Verify CORS settings if needed

### Cloudinary Upload Issues
- Check upload preset exists and is unrestricted
- Verify API key and cloud name
- Check file size limits

## Performance Optimization

- Images are optimized via Cloudinary
- Next.js Image component for lazy loading
- Client-side cart management with localStorage
- Efficient database queries with MongoDB indexing

## Security Notes

- Admin routes are protected by Firebase authentication
- Customer orders are tracked by phone + order ID (no customer accounts needed)
- Use environment variables for sensitive data
- HTTPS is recommended for production

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
