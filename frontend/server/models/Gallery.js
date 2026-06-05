import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  titleRu: { type: String },
  category: { type: String, default: 'general' },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  videoUrl: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;