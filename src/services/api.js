// services/api.js
import axios from "axios";

const API_BASE_URL = "https://g-typer-api-5f9465ba7dda.herokuapp.com/";

// For GitHub Pages, environment variables need to be prefixed with REACT_APP_ and
// must be included during the build process
const apiKey =
  process.env.REACT_APP_VALID_API_KEYS ||
  (process.env.NODE_ENV === "production"
    ? "__RUNTIME_INJECTED_API_KEY__"
    : undefined);

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
