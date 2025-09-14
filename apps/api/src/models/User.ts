import mongoose, { Schema } from 'mongoose';

export type Role = 'user' | 'proctor' | 'admin';

const NotificationPrefs = new Schema({
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: true },
  whatsapp: { type: Boolean, default: false },
  push: { type: Boolean, default: false },
  quietHours: {
    start: String,
    end: String,
    tz: String
  }
}, { _id: false });

const UserSchema = new Schema({
  role: { type: String, enum: ['user', 'proctor', 'admin'], default: 'user' },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, index: true },
  phone: String,
  country: String,
  timezone: String,
  passwordHash: { type: String, required: true },
  emailVerifiedAt: Date,
  phoneVerifiedAt: Date,
  stripeCustomerId: String,
  notificationPreferences: { type: NotificationPrefs, default: () => ({}) },
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);

