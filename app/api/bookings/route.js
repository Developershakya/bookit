// app/api/bookings/route.js
import { connectDB } from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Experience } from '@/lib/models/Experience';
import { NextResponse } from 'next/server';

function generateRefId() {
  return (
    'HUF' +
    Math.random().toString(36).substr(2, 6).toUpperCase() +
    Math.random().toString(36).substr(2, 2).toUpperCase()
  );
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate experience and slot availability
    const experience = await Experience.findById(body.experienceId);
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // Check slot availability
    const dateData = experience.availableDates.find((d) => d.date === body.date);
    if (!dateData) {
      return NextResponse.json({ error: 'Date not available' }, { status: 400 });
    }

    const slot = dateData.slots.find((s) => s.time === body.time);
    if (!slot || slot.available - slot.booked < body.quantity) {
      return NextResponse.json({ error: 'Slots not available' }, { status: 400 });
    }

    // Update slot booking count
    slot.booked += body.quantity;
    await experience.save();

    // Create booking
    const booking = new Booking({
      fullName: body.fullName,
      email: body.email,
      experienceId: body.experienceId,
      experienceTitle: experience.title,
      date: body.date,
      time: body.time,
      quantity: body.quantity,
      subtotal: body.subtotal,
      taxes: body.taxes,
      promoCode: body.promoCode,
      discountAmount: body.discountAmount,
      total: body.total,
      refId: generateRefId(),
      status: 'confirmed',
    });

    await booking.save();
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
