import mongoose, { Schema } from 'mongoose';

const MeetingSchema = new Schema({
  provider: { type: String, enum: ['zoom', 'gmeet', 'jitsi', 'other'], default: 'other' },
  url: String,
  passcode: String,
}, { _id: false });

const ChecklistSchema = new Schema({
  idVerified: { type: Boolean, default: false },
  roomScanOk: { type: Boolean, default: false },
  techCheckOk: { type: Boolean, default: false },
  notes: String,
}, { _id: false });

const PricingSchema = new Schema({
  currency: String,
  totalMinor: Number,
  upfrontMinor: Number,
  remainingMinor: Number,
  discountsMinor: { type: Number, default: 0 },
}, { _id: false });

const HistorySchema = new Schema({
  at: { type: Date, default: () => new Date() },
  action: String,
  by: String,
  note: String,
}, { _id: false });

const AttachmentSchema = new Schema({
  key: String,
  name: String,
  type: String,
}, { _id: false });

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  examTypeId: { type: Schema.Types.ObjectId, ref: 'ExamType', index: true },
  preferredStartAt: { type: Date, required: true },
  timezone: String,
  country: String,
  language: String,
  status: { type: String, enum: ['pending','approved','scheduled','in_progress','completed','cancelled','no_show','disputed'], default: 'pending' },
  assignedProctorId: { type: Schema.Types.ObjectId, ref: 'User' },
  meeting: { type: MeetingSchema },
  checklist: { type: ChecklistSchema },
  pricing: { type: PricingSchema, required: true },
  payment: {
    upfrontPaymentId: String,
    remainingPaymentId: String,
    remainingDueAt: Date,
  },
  history: [HistorySchema],
  attachments: [AttachmentSchema],
}, { timestamps: true });

export const Booking = mongoose.model('Booking', BookingSchema);

