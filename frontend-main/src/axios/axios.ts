import axios from "axios"
const BASE_URL = import.meta.env.VITE_BASE_URL;
const LOCAL_URL = import.meta.env.VITE_BASE_URL_LOCAL;

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json","Accept":"*/*" },
});