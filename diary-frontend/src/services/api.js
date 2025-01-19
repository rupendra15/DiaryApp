import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',  // Your backend base URL
});

export default api;
