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

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
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
