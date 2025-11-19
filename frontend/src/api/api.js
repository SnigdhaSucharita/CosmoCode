import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createUser = async (username, email) => {
  const response = await api.post('/users', { username, email });
  return response.data;
};

export const searchPhotos = async (query) => {
  const response = await api.get('/photos/search', { params: { query } });
  return response.data;
};

export const savePhoto = async (photoData) => {
  const response = await api.post('/photos', photoData);
  return response.data;
};

export const addTagsToPhoto = async (photoId, tags) => {
  const response = await api.post(`/photos/${photoId}/tags`, { tags });
  return response.data;
};

export const searchPhotosByTag = async (tag, sort = 'DESC', userId = null) => {
  const params = { tag, sort };
  if (userId) params.userId = userId;
  const response = await api.get('/photos/tag/search', { params });
  return response.data;
};

export const getSearchHistory = async (userId) => {
  const response = await api.get('/search-history', { params: { userId } });
  return response.data;
};

export default api;
