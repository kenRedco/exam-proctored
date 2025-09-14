import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
  from: { type: String, enum: ['user','proctor','admin','bot'], required: true },
  text: String,
  attachments: [{ key: String, name: String, type: String }],
  readBy: [String],
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Message = mongoose.model('Message', MessageSchema);

