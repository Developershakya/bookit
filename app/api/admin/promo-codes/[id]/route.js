// app/api/admin/promo-codes/[id]/route.js
import { connectDB } from '@/lib/models/mongodb';
import { PromoCode } from '@/lib/models/PromoCode';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await PromoCode.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Promo code deleted' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();

    const promoCode = await PromoCode.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!promoCode) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    return NextResponse.json(promoCode);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to update promo code' }, { status: 500 });
  }
}