import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'multipart/form-data',  // Changed for file uploads
  },
});

// Document API endpoints
export const DocumentAPI = {
  upload: (formData) => api.post('documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',  // Ensure proper headers for upload
    },
  }),
  search: (query, fileType) => api.get('search/', {
    params: {
      q: query,
      type: fileType
    }
  }),
  list: () => api.get('documents/'),
};

export default api;