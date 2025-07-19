import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default http;
