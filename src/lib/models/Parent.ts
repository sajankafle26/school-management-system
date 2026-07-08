import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  name: string;
  contact: string;
  email: string;
}

const ParentSchema = new Schema<IParent>({
  name: { type: String, required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Parent || mongoose.model<IParent>('Parent', ParentSchema);
