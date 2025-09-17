import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.BASE_URL, // Your Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is crucial for cookies
});


export default axiosInstance;