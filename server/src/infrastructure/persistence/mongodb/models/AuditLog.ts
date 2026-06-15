import mongoose, { Schema, Document } from 'mongoose';

interface IAuditLog extends Document {
  importId: string;
  entity: string;
  entityId: string;
  action: string;
  changes: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  userId: string;
  userName: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema({
  importId: { type: String, required: true, index: true },
  entity: { type: String, required: true },
  entityId: { type: String, required: true },
  action: { type: String, required: true },
  changes: {
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed }
  },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });

export const AuditLogModel = mongoose.model<IAuditLog>(
  'AuditLog',
  AuditLogSchema
);

export { IAuditLog };
