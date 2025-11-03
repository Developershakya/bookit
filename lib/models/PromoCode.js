// lib/models/PromoCode.ts
import mongoose from 'mongoose';
const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true }, // SAVE10 (%), FLAT100 (rupees)
  discountValue: { type: Number, required: true }, // 10 for 10%, 100 for 100 rupees
  maxDiscount: { type: Number }, // Max discount cap for percentage
  minPurchaseAmount: { type: Number, default: 0 }, // Minimum purchase required
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number }, // Total uses allowed
  usageCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const PromoCode =
  mongoose.models.PromoCode || mongoose.model('PromoCode', promoCodeSchema);