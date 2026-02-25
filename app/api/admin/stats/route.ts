import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import Order from '@/models/Order'
import Customer from '@/models/Customer'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalCustomers = await Customer.countDocuments()

    return NextResponse.json(
      {
        totalProducts,
        totalOrders,
        totalCustomers,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
