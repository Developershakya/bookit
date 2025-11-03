// app/api/experiences/route.js
import { connectDB } from '@/lib/models/mongodb';
import { Experience } from '@/lib/models/Experience';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ createdAt: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const experience = new Experience({
      title: body.title,
      description: body.description,
      location: body.location,
      imageUrl: body.imageUrl,
      price: body.price,
      availableDates: body.availableDates || [],
      about: body.about,
      includesText: body.includesText,
    });

    await experience.save();
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}