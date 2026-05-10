// API Configuration
// Switch between local and production by changing the base URL or using env variables

const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction 
  ? 'https://task-manager-kmh2.onrender.com/api' 
  : 'http://localhost:5000/api';
export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
  },
  PROJECTS: {
    BASE: `${API_BASE_URL}/projects`,
    ACTIVITY: `${API_BASE_URL}/projects/activity`,
    STATS: {
      MONTHLY: `${API_BASE_URL}/projects/stats/monthly`,
      PERFORMANCE: `${API_BASE_URL}/projects/stats/performance`,
      SUMMARY: `${API_BASE_URL}/projects/stats/summary`,
    }
  },
  MEMBERS: {
    BASE: `${API_BASE_URL}/members`,
    ME: `${API_BASE_URL}/members/me`,
  }
};
