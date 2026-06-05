import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  titleRu: {
    type: String
  },
  description: {
    type: String
  },
  descriptionRu: {
    type: String
  },
  category: {
    type: String,
    enum: ['speech', 'music', 'interview', 'announcement', 'other'],
    default: 'other'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  artist: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  plays: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Audio = mongoose.model('Audio', audioSchema);
export default Audio;