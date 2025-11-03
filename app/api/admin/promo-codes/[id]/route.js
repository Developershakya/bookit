// app/api/admin/promo-codes/[id]/route.js
import { connectDB } from '@/lib/mongodb';
import { PromoCode } from '@/lib/models/PromoCode';
import { NextResponse } from 'next/server';

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await connectDB();
    const result = await PromoCode.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json(
      { error: 'Failed to delete promo code' },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await connectDB();
    const body = await req.json();

    const promoCode = await PromoCode.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!promoCode) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    return NextResponse.json(promoCode);
  } catch (error) {
    console.error('Error updating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to update promo code' },
      { status: 500 }
    );
  }
}