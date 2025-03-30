// services/api.js
import axios from "axios";

const API_BASE_URL = "https://g-typer-api-5f9465ba7dda.herokuapp.com/";
const apiKey = process.env.REACT_APP_VALID_API_KEYS || "default-api-key";

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
  saveDeviceInfo: (deviceData) =>
    api.post("/api/device/newUserDevice", deviceData),
};
