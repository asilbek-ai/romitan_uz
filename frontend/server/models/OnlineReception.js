import mongoose from 'mongoose';

const onlineReceptionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  passport: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending'
  },
  reply: {
    type: String,
    default: ''
  },
  trackingCode: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Generate tracking code before saving
onlineReceptionSchema.pre('save', async function(next) {
  if (!this.trackingCode) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('OnlineReception').countDocuments();
    this.trackingCode = `JDR-${year}${month}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const OnlineReception = mongoose.model('OnlineReception', onlineReceptionSchema);
export default OnlineReception;