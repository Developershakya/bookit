// app/api/admin/promo-codes/route.js
import { connectDB } from '@/lib/models/mongodb';
import { PromoCode } from '@/lib/models/PromoCode';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    return NextResponse.json(promoCodes);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const existingCode = await PromoCode.findOne({ code: body.code.toUpperCase() });
    if (existingCode) {
      return NextResponse.json(
        { error: 'Promo code already exists' },
        { status: 400 }
      );
    }

    const promoCode = new PromoCode({
      code: body.code.toUpperCase(),
      discountType: body.discountType,
      discountValue: body.discountValue,
      maxDiscount: body.maxDiscount,
      minPurchaseAmount: body.minPurchaseAmount || 0,
      expiryDate: new Date(body.expiryDate),
      usageLimit: body.usageLimit,
      isActive: true,
    });

    await promoCode.save();
    return NextResponse.json(promoCode, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
