# LadyGrocery Setup Guide

## Step 1: Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Go to Database → Connect
4. Choose "Driver" (Node.js)
5. Copy the connection string
6. Replace `<password>` with your database password
7. Add to `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

## Step 2: Setup Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (name it "LadyGrocery")
3. Enable Email/Password authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
4. Go to Project Settings (gear icon)
5. Go to "Service accounts" tab
6. Copy all the Firebase config values

Add these to `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx
```

## Step 3: Create Firebase Admin User

1. In Firebase Console, go to Authentication → Users
2. Click "Add user"
3. Enter email: `admin@example.com`
4. Enter password: `password123`
5. Click Create

You can now login to the admin dashboard with these credentials!

## Step 4: Setup Cloudinary (for image uploads)

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Go to Dashboard
4. Copy your "Cloud Name"
5. Go to Settings → Upload
6. Create an "Unsigned" upload preset (name it: `ladygrocery`)
7. Go to Account → API Keys
8. Copy your API Key

Add these to `.env.local`:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
NEXT_PUBLIC_CLOUDINARY_API_KEY=xxxxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ladygrocery
```

## Step 5: Run the Application

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Application

### Customer Features
1. Go to `/en` (English) or `/bn` (Bengali)
2. Browse products (empty at first)
3. Try adding products to cart
4. Complete checkout

### Admin Features
1. Go to `/en/admin/login`
2. Login with:
   - Email: `admin@example.com`
   - Password: `password123`
3. Add new products:
   - Fill in English & Bengali names
   - Set price and sizes
   - Upload images from Cloudinary
4. View orders and customers

## Step 7: Add Sample Products

1. Login to admin dashboard
2. Go to "Products" section
3. Click "Add Product"
4. Fill in the form:
   - Name (English & Bengali)
   - Price (in Bangladeshi Taka)
   - Description
   - Sizes and stock
   - Upload images

5. Click "Create Product"

## Environment Variables Checklist

Make sure you have these in `.env.local`:

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase sender ID
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `NEXT_PUBLIC_CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset

## Troubleshooting

### "Cannot connect to MongoDB"
- Check connection string in `.env.local`
- Make sure your IP is whitelisted in MongoDB Atlas
- Verify database credentials

### "Firebase configuration is invalid"
- Check all Firebase keys are correctly copied
- Make sure keys have no extra spaces
- Regenerate keys from Firebase Console if needed

### "Image upload not working"
- Check Cloudinary upload preset exists
- Verify upload preset is set to "Unsigned"
- Check API key and cloud name

### Admin login not working
- Make sure user exists in Firebase Authentication
- Check email and password are correct
- Try resetting password in Firebase Console

## Next Steps

1. **Customize Branding**
   - Update logo in Navbar component
   - Change colors in `globals.css`
   - Update company info in Footer

2. **Add More Translations**
   - Edit `messages/en.json` and `messages/bn.json`
   - Add new translation keys as needed

3. **Setup Payment**
   - Currently uses COD (Cash on Delivery)
   - To add Stripe: Install Stripe SDK and create payment routes

4. **Deploy to Production**
   - Use Vercel for easy Next.js deployment
   - Add all environment variables to Vercel project settings
   - Set up custom domain if desired

## Support

If you have questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
