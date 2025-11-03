// app/api/promo/validate/route.js
import { connectDB } from '@/lib/models/mongodb';
import { PromoCode } from '@/lib/models/PromoCode';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const { code, totalAmount } = await req.json();

    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promoCode) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
    }

    // Check expiry
    if (new Date() > promoCode.expiryDate) {
      return NextResponse.json({ error: 'Promo code expired' }, { status: 400 });
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return NextResponse.json({ error: 'Usage limit exceeded' }, { status: 400 });
    }

    // Check minimum purchase
    if (totalAmount < promoCode.minPurchaseAmount) {
      return NextResponse.json(
        { error: `Minimum purchase amount of ₹${promoCode.minPurchaseAmount} required` },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === 'percentage') {
      discountAmount = (totalAmount * promoCode.discountValue) / 100;
      if (promoCode.maxDiscount && discountAmount > promoCode.maxDiscount) {
        discountAmount = promoCode.maxDiscount;
      }
    } else {
      discountAmount = promoCode.discountValue;
    }

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      discountAmount: Math.round(discountAmount),
      expiryDate: promoCode.expiryDate,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 });
  }
}
