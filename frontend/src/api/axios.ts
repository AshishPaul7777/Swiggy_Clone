import axios from "axios"

const apiBaseUrl =
  import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") ??
  "http://localhost:5000/api"

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
})
