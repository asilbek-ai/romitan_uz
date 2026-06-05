import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'upload', 'login', 'logout', 'view']
  },
  entity: {
    type: String,
    required: true,
    enum: ['news', 'service', 'statistic', 'organization', 'gallery', 'carousel', 'leadership', 'document', 'faq', 'user', 'reception', 'online_reception']
  },
  entityId: {
    type: String
  },
  details: {
    type: Object,
    default: {}
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, { timestamps: true });

// Index for faster queries
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ adminId: 1 });
activityLogSchema.index({ entity: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;