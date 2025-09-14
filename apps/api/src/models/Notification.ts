import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  channel: { type: String, enum: ['email','sms','whatsapp','inapp','push'] },
  templateKey: String,
  payload: Schema.Types.Mixed,
  status: { type: String, enum: ['queued','sent','failed'], default: 'queued' },
  error: String,
  sentAt: Date,
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);

