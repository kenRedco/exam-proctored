import mongoose, { Schema } from 'mongoose';

const AuditLogSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: 'User' },
  actorRole: String,
  entity: {
    type: { type: String },
    id: String,
  },
  action: String,
  meta: Schema.Types.Mixed,
  at: { type: Date, default: () => new Date() },
}, { timestamps: false });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

