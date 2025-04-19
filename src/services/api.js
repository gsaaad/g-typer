// services/api.js
import axios from "axios";

const API_BASE_URL = "https://g-typer-api-5f9465ba7dda.herokuapp.com/";

// For GitHub Pages, environment variables need to be prefixed with REACT_APP_ and
// must be included during the build process
const apiKey = process.env.REACT_APP_VALID_API_KEYS;

if (!apiKey) {
  console.error('API key is not set. API calls may fail.');
}

// Add request interceptor for debugging
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  },
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      baseURL: config.baseURL,
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      }
    });
    return Promise.reject(error);
  }
);

// Score-related API functions
export const scoreService = {
  getTopScores: async () => {
    try {
      return await api.get("/api/scores/topScores");
    } catch (error) {
      console.error('Failed to get top scores:', error);
      throw error;
    }
  },
  saveScore: async (scoreData) => {
    try {
      return await api.post("/api/scores/newScore", scoreData);
    } catch (error) {
      console.error('Failed to save score:', error);
      throw error;
    }
  },
};
