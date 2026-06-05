import ApiCall, { baseUrl } from '../config';

const API_PREFIX = '/api/v1';

const normalizeUrl = (url) => {
  if (url.startsWith('/api/')) return url;
  return `${API_PREFIX}${url.startsWith('/') ? url : `/${url}`}`;
};

export const toApiUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

const toAxiosLikeResponse = (result) => {
  if (result.error) {
    const error = new Error(result.message || 'API request failed');
    error.response = {
      data: result.data,
      status: result.status,
    };
    throw error;
  }

  return {
    data: result.data,
    status: result.status,
    headers: result.headers,
  };
};

const request = async (method, url, data, config = {}) => {
  const result = await ApiCall(
    normalizeUrl(url),
    method,
    data,
    config.params,
    {
      headers: config.headers,
      responseType: config.responseType,
      onUploadProgress: config.onUploadProgress,
    }
  );

  return toAxiosLikeResponse(result);
};

const api = {
  defaults: {
    headers: {
      common: {},
    },
  },
  get: (url, config) => request('GET', url, null, config),
  post: (url, data, config) => request('POST', url, data, config),
  put: (url, data, config) => request('PUT', url, data, config),
  delete: (url, config) => request('DELETE', url, null, config),
};

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  refresh: (refreshToken) => api.post('/auth/refresh', null, { params: { refreshToken } }),
  getMe: (token) => api.get('/auth/decode', { headers: { token } }),
};

// ==================== NEWS ENDPOINTS ====================
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

// ==================== SERVICES ENDPOINTS ====================
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// ==================== STATISTICS ENDPOINTS ====================
export const statisticsAPI = {
  getAll: () => api.get('/statistics'),
  getById: (id) => api.get(`/statistics/${id}`),
  create: (data) => api.post('/statistics', data),
  update: (id, data) => api.put(`/statistics/${id}`, data),
  delete: (id) => api.delete(`/statistics/${id}`),
};

// ==================== MEDIA ENDPOINTS ====================
export const mediaAPI = {
  getAll: () => api.get('/media'),
  getGallery: () => api.get('/media'),
  getById: (id) => api.get(`/media/${id}`),
  create: (data) => api.post('/media', data),
  update: (id, data) => api.put(`/media/${id}`, data),
  delete: (id) => api.delete(`/media/${id}`),
};

// ==================== DOCUMENTS ENDPOINTS ====================
export const documentsAPI = {
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  download: (id) => api.post(`/documents/${id}/download`),
  create: (data) => api.post('/documents', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
};

// ==================== UPLOAD ENDPOINTS ====================
export const uploadAPI = {
  uploadSingle: (file, prefix = '/general', onProgress) => {
    const formData = new FormData();
    formData.append('photo', file);

    return api.post('/file/upload', formData, {
      params: { prefix },
      onUploadProgress: onProgress,
    });
  },
  getFileUrl: (id) => toApiUrl(`${API_PREFIX}/file/getFile/${id}`),
};

// Not implemented in the current Java backend yet; kept for existing imports.
export const organizationsAPI = {};
export const carouselAPI = {};
export const leadershipAPI = {};
export const faqAPI = {};
export const contactAPI = {};
export const subscribersAPI = {};
export const receptionAPI = {};
export const onlineReceptionAPI = {};
export const adminAPI = {};

export default api;
