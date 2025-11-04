import axios from 'axios';
import { getCurrentUser, logActivity, logout } from './auth';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user) {
      config.headers.Authorization = `Bearer ${user.sessionId}`;
    }
    
    // Log API calls for sensitive operations
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      logActivity('API_CALL', {
        method: config.method,
        url: config.url,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status, data } = error.response || {};
    
    // Handle different error scenarios
    if (status === 401) {
      logActivity('API_AUTH_FAILED', { 
        url: error.config?.url,
        message: 'Authentication failed'
      });
      logout();
    } else if (status === 403) {
      logActivity('API_ACCESS_DENIED', { 
        url: error.config?.url,
        message: 'Insufficient permissions'
      });
      alert('Access denied: You do not have permission for this action.');
    } else if (status === 429) {
      logActivity('API_RATE_LIMIT', { 
        url: error.config?.url,
        message: 'Rate limit exceeded'
      });
      alert('Rate limit exceeded. Please wait before making more requests.');
    } else if (status >= 500) {
      logActivity('API_SERVER_ERROR', { 
        url: error.config?.url,
        status,
        message: 'Server error occurred'
      });
    }
    
    return Promise.reject(error);
  }
);

// Rate limiting implementation
const rateLimitMap = new Map();

const checkRateLimit = (endpoint, userId, limit = 10, windowMs = 60000) => {
  const key = `${userId}:${endpoint}`;
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, []);
  }
  
  const requests = rateLimitMap.get(key).filter(time => time > windowStart);
  rateLimitMap.set(key, requests);
  
  if (requests.length >= limit) {
    logActivity('RATE_LIMIT_EXCEEDED', {
      userId,
      endpoint,
      attempts: requests.length
    });
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((requests[0] + windowMs - now) / 1000)} seconds.`);
  }
  
  requests.push(now);
  return true;
};

// Enhanced API methods with security features
export const secureApi = {
  async get(endpoint, params = {}) {
    const user = getCurrentUser();
    if (user) {
      checkRateLimit(endpoint, user.id, 30, 60000); // 30 requests per minute for GET
    }
    
    const response = await api.get(endpoint, { params });
    return response.data;
  },
  
  async post(endpoint, data = {}) {
    const user = getCurrentUser();
    if (user) {
      checkRateLimit(endpoint, user.id, 10, 60000); // 10 requests per minute for POST
    }
    
    const response = await api.post(endpoint, data);
    return response.data;
  },
  
  async put(endpoint, data = {}) {
    const user = getCurrentUser();
    if (user) {
      checkRateLimit(endpoint, user.id, 10, 60000); // 10 requests per minute for PUT
    }
    
    const response = await api.put(endpoint, data);
    return response.data;
  },
  
  async delete(endpoint) {
    const user = getCurrentUser();
    if (user) {
      checkRateLimit(endpoint, user.id, 5, 60000); // 5 requests per minute for DELETE
    }
    
    const response = await api.delete(endpoint);
    return response.data;
  }
};

// Mock API functions for development
export const mockApi = {
  async simulateApiCall(action, data = {}, delay = 1000) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = getCurrentUser();
        logActivity('MOCK_API_CALL', {
          action,
          data,
          userId: user?.id
        });
        
        resolve({
          success: true,
          message: `${action} completed successfully`,
          data: {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            ...data
          }
        });
      }, delay);
    });
  }
};

export default api;
