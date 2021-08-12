import axios from 'axios';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'localhost:3000',
});

export default axiosInstance;
