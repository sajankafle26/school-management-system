import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryImage {
  id: number;
  url: string;
  caption: string;
}

export interface IGallery {
  id: number;
  title: string;
  images: IGalleryImage[];
}

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
  galleries: IGallery[];
}

const GalleryImageSchema = new Schema<IGalleryImage>({
  id: { type: Number, required: true },
  url: { type: String, required: true },
  caption: { type: String, default: '' },
}, { _id: false });

const GallerySchema = new Schema<IGallery>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  images: [GalleryImageSchema],
}, { _id: false });

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
  galleries: { type: [GallerySchema], default: [] },
}, { timestamps: true });

export default mongoose.models.WebsiteContent || mongoose.model<IWebsiteContent>('WebsiteContent', WebsiteContentSchema);
