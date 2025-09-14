import mongoose, { Schema } from 'mongoose';

const ExamTypeSchema = new Schema({
  slug: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  provider: String,
  durationMinutes: Number,
  prepCategory: String,
  requirements: [String],
  basePrice: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  enabled: { type: Boolean, default: true },
}, { timestamps: true });

export const ExamType = mongoose.model('ExamType', ExamTypeSchema);

