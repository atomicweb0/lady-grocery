import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  namebn: string
  description: string
  descriptionbn: string
  price: number
  sizes: Array<{
    size: string
    stock: number
  }>
  images: string[]
  category: string
  categorybn: string
  color: string
  colorbn: string
  rating: number
  reviews: Array<{
    userId: string
    rating: number
    comment: string
    createdAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    namebn: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionbn: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: [
      {
        size: String,
        stock: Number,
      },
    ],
    images: [String],
    category: {
      type: String,
      required: true,
    },
    categorybn: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    colorbn: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        userId: String,
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
