import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Customer from '@/models/Customer'

// Generate unique order ID
function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `LG-${timestamp}-${random}`
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const orderId = searchParams.get('orderId')

    let query: any = {}
    if (phone && orderId) {
      query.phone = phone
      query.orderId = orderId
    }

    const orders = await Order.find(query).sort({ createdAt: -1 })

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error('[v0] Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const orderId = generateOrderId()

    // Create order
    const order = new Order({
      ...body,
      orderId,
      shippingFee: 0, // Free shipping
    })
    await order.save()

    // Update or create customer
    const customer = await Customer.findOneAndUpdate(
      { phone: body.phone },
      {
        phone: body.phone,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        totalOrders: { $inc: 1 },
        totalSpent: { $inc: body.total },
      },
      { new: true, upsert: true }
    )

    return NextResponse.json(
      { order, customer },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
