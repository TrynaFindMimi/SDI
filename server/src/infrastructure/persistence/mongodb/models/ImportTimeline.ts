import mongoose, { Schema, Document } from 'mongoose';

interface ITimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface IImportTimeline extends Document {
  importId: string;
  events: ITimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed }
});

const ImportTimelineSchema = new Schema({
  importId: { type: String, required: true, unique: true, index: true },
  events: [TimelineEventSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ImportTimelineSchema.index({ 'events.timestamp': -1 });

export const ImportTimelineModel = mongoose.model<IImportTimeline>(
  'ImportTimeline',
  ImportTimelineSchema
);

export { ITimelineEvent, IImportTimeline };
