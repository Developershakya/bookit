
// lib/models/Booking.ts
import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
  experienceTitle: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  taxes: { type: Number, required: true },
  promoCode: { type: String },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  refId: { type: String, unique: true },
  status: { type: String, enum: ['confirmed', 'failed'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
});

export const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

