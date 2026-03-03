import axios from 'axios';

// WordPress/WooCommerce API – all from .env
const WORDPRESS_URL = import.meta.env.VITE_WORDPRESS_URL ?? '';
const API_VERSION = import.meta.env.VITE_WORDPRESS_API_VERSION ?? '';
const API_KEY = import.meta.env.VITE_WORDPRESS_API_KEY ?? '';

if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    WORDPRESS_URL: WORDPRESS_URL || 'NOT SET',
    API_VERSION: API_VERSION || 'NOT SET',
    fullURL: WORDPRESS_URL && API_VERSION ? `${WORDPRESS_URL}/wp-json/${API_VERSION}` : 'MISSING'
  });
}

export const apiClient = axios.create({
  baseURL: `${WORDPRESS_URL}/wp-json/${API_VERSION}`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

// Request interceptor - Add user ID header if available (fallback for auth)
apiClient.interceptors.request.use((config) => {
  // Add user ID header if user is stored in localStorage (fallback for cross-domain auth)
  try {
    const storedUser = localStorage.getItem('soochuh_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.id) {
        config.headers['X-User-ID'] = user.id.toString();
      }
    }
  } catch (err) {
    // Ignore errors parsing user data
  }
  
  return config;
});

export async function apiGet(url, params = {}) { 
  try {
    const response = await apiClient.get(url, { params });
    // Check if response is HTML (error page)
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE')) {
      throw new Error(`API returned HTML instead of JSON. Check WORDPRESS_URL (current: ${WORDPRESS_URL || 'NOT SET'}) and API endpoint: ${url}`);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(`API Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      // Request made but no response
      throw new Error(`No response from API. Check WORDPRESS_URL (current: ${WORDPRESS_URL || 'NOT SET'})`);
    } else {
      // Error setting up request
      throw error;
    }
  }
}

export async function apiGetWithHeaders(url, params = {}) {
  try {
    const response = await apiClient.get(url, { params });
    // Check if response is HTML (error page)
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE')) {
      throw new Error(`API returned HTML instead of JSON. Check WORDPRESS_URL (current: ${WORDPRESS_URL || 'NOT SET'}) and API endpoint: ${url}`);
    }
    return { data: response.data, headers: response.headers };
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(`API Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      // Request made but no response
      throw new Error(`No response from API. Check WORDPRESS_URL (current: ${WORDPRESS_URL || 'NOT SET'})`);
    } else {
      // Error setting up request
      throw error;
    }
  }
}

export async function apiPost(url, data, params = {}) { 
  return (await apiClient.post(url, data, { params })).data; 
}

export async function apiPut(url, data, params = {}) { 
  return (await apiClient.put(url, data, { params })).data; 
}
