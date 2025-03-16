import axios from 'axios';
import { useStore } from '../store/useStore';

// Create an Axios instance or use the default axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Your API base URL
});

// Axios Response Interceptor to handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    // If the request is successful, return the response as is
    return response;
  },
  (error) => {

    // Check if the response status is 401
    if (error.response && error.response.status === 401) {
      const { clearAuth } = useStore.getState();
      clearAuth();
    }

    // Return the error to the calling code
    return Promise.reject(error);
  }
);



export default axiosInstance;
