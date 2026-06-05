import ActivityLog from '../models/ActivityLog.js';

export const logActivity = (action, entity, entityId = null, details = {}) => {
  return async (req, res, next) => {
    // Store original send function to capture response
    const originalSend = res.json;
    res.json = function(data) {
      // Only log if request was successful (status 2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const log = new ActivityLog({
          adminId: req.admin?._id,
          adminName: req.admin?.fullName || req.admin?.username,
          action,
          entity,
          entityId: entityId || data?.id || data?._id,
          details: { ...details, body: req.body, params: req.params, query: req.query },
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.headers['user-agent']
        });
        log.save().catch(err => console.error('Log save error:', err));
      }
      originalSend.call(this, data);
    };
    next();
  };
};

// Middleware to log all CRUD operations automatically
export const autoLog = (entity) => {
  return (req, res, next) => {
    const actionMap = {
      'POST': 'create',
      'PUT': 'update',
      'PATCH': 'update',
      'DELETE': 'delete',
      'GET': 'view'
    };
    const action = actionMap[req.method] || 'view';
    req._logAction = action;
    req._logEntity = entity;
    req._logDetails = { method: req.method, url: req.originalUrl };
    next();
  };
};