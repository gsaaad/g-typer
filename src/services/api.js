// services/api.js
import axios from "axios";

const API_BASE_URL = "https://g-typer-api-5f9465ba7dda.herokuapp.com/";

// For GitHub Pages, environment variables need to be prefixed with REACT_APP_ and
// must be included during the build process
const apiKey = process.env.REACT_APP_VALID_API_KEYS;

if (!apiKey) {
  console.error('API key is not set. API calls may fail.');
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  },
});

// Score-related API functions
export const scoreService = {
  getTopScores: () => api.get("/api/scores/topScores"),
  saveScore: (scoreData) => api.post("/api/scores/newScore", scoreData),
};
