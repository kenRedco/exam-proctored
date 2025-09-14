import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  currency: String,
  amountMinor: Number,
  type: { type: String, enum: ['upfront', 'remaining'], required: true },
  provider: { type: String, enum: ['stripe', 'paypal', 'mpesa', 'flutterwave'], required: true },
  externalIds: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['requires_action','processing','succeeded','failed','refunded','void'], default: 'processing' },
  receipts: [{ url: String, issuedAt: Date }],
}, { timestamps: true });

export const Payment = mongoose.model('Payment', PaymentSchema);

