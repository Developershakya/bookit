// lib/models/Experience.js
import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  availableDates: [
    {
      date: { type: String, required: true },
      slots: [
        {
          time: { type: String, required: true },
          available: { type: Number, required: true },
          booked: { type: Number, default: 0 },
        },
      ],
    },
  ],
  about: { type: String, required: true },
  includesText: { type: String, default: 'Safety first with gear included' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Experience =
  mongoose.models.Experience || mongoose.model('Experience', experienceSchema);