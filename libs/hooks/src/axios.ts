import axios from 'axios';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000',
});

axiosInstance.interceptors.response.use((response) => {
  if (response.headers['x-access-token']) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.headers['x-access-token']}`;
  }
  return response;
});

export default axiosInstance;
