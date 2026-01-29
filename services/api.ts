import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Configure this based on your environment
// Uses environment variables for flexibility
const getApiUrl = () => {
  // Check for explicit environment variable first
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Development: Local server
  // Default to localhost for development
  return 'http://192.168.100.2:5000/api';
};

export const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fix for Axios baseURL issue: 
// If URL starts with / and baseURL ends without /, axios hits the root instead of appending.
api.interceptors.request.use(
  async (config) => {
    // Ensure URL has the /api prefix if it's missing and it's a relative path
    if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
      // If baseURL already ends with /api, we just need to handle the leading slash of the URL
      const hasApiInBase = config.baseURL?.endsWith('/api') || config.baseURL?.endsWith('/api/');

      if (!hasApiInBase) {
        config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
      } else {
        // If /api is in base, just make sure we don't have a double slash or overwrite
        // Axios handles 'host/api' + '/path' as 'host/path'
        // So we strip the leading slash from the URL if base has /api
        if (config.url.startsWith('/')) {
          config.url = config.url.substring(1);
        }
      }
    }

    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  }
);

export const fetchInvestorProperties = async () => {
  const response = await api.get('/investor-properties');
  return response.data.properties;
};

export default api;
