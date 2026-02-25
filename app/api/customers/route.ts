import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const customers = await Customer.find().sort({ createdAt: -1 })

    return NextResponse.json(customers, { status: 200 })
  } catch (error) {
    console.error('[v0] Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const customer = new Customer(body)
    await customer.save()

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
