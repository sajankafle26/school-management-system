import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsiteContent extends Document {
  schoolName: string;
  logoUrl: string;
  themeColor: string;
  topBar: {
    showTopBar: boolean;
    phone: string;
    email: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
    welcomeTitle: string;
    welcomeMessage: string;
  };
  about: {
    title: string;
    content: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    mapEmbedUrl: string;
  };
}

const WebsiteContentSchema = new Schema<IWebsiteContent>({
  schoolName: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  themeColor: { type: String, default: '#4f46e5' },
  topBar: {
    showTopBar: { type: Boolean, default: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  home: {
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    heroImageUrl: { type: String, default: '' },
    welcomeTitle: { type: String, default: '' },
    welcomeMessage: { type: String, default: '' },
  },
  about: {
    title: { type: String, default: '' },
    content: { type: String, default: '' },
  },
  contact: {
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
  },
}, { timestamps: true });

export default mongoose.models.WebsiteContent || mongoose.model<IWebsiteContent>('WebsiteContent', WebsiteContentSchema);
