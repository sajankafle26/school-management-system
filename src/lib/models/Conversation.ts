import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  subject: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  date: string;
  isRead: boolean;
  academicYear: string;
}

const ConversationSchema = new Schema<IConversation>({
  subject: { type: String, default: '' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  academicYear: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
