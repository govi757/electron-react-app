// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000', // Replace with your API base URL
});

export default api;
