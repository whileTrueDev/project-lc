import axios from 'axios';
// import { getApiHost } from './getHostUrl';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3000',
});

export default axiosInstance;
