import mongoose, { Schema } from 'mongoose';

const WebhookEventSchema = new Schema({
  provider: String,
  eventType: String,
  externalId: String,
  payload: Schema.Types.Mixed,
  processedAt: Date,
  status: { type: String, default: 'received' },
}, { timestamps: true });

export const WebhookEvent = mongoose.model('WebhookEvent', WebhookEventSchema);

