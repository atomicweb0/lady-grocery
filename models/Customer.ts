import mongoose, { Schema, Document } from 'mongoose'

export interface ICustomer extends Document {
  email: string
  phone: string
  firstName: string
  lastName: string
  addresses: Array<{
    type: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }>
  totalOrders: number
  totalSpent: number
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    email: {
      type: String,
      required: true,
      sparse: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    addresses: [
      {
        type: String,
        address: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    ],
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Customer ||
  mongoose.model<ICustomer>('Customer', CustomerSchema)
