import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in environment variables')
}

let cachedConnection = global.mongooseConnection

async function connectDB() {
  if (cachedConnection) {
    console.log('[v0] Using cached MongoDB connection')
    return cachedConnection
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      dbName: 'ladygrocery',
    })

    cachedConnection = connection
    console.log('[v0] MongoDB connected successfully')
    return connection
  } catch (error) {
    console.error('[v0] MongoDB connection failed:', error)
    throw error
  }
}

// Define global type for cached connection
declare global {
  var mongooseConnection: typeof mongoose
}

export default connectDB
