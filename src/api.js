import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (username, password) => {
  try {
    const response = await api.post('/api/token/', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountDetails = async () => {
  try {
    const response = await api.get('/api/rmon/account-details/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResourcesPerRegion = async () => {
  try {
    const response = await api.get('/api/region/resource-per-region/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;