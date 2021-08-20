import axios from 'axios';
import { getApiHost } from './lib/getHostUrl';
import { tokenInterceptor } from './lib/tokenInterceptor';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: getApiHost(),
});

// Use Token Interceptor
tokenInterceptor(axiosInstance);

export default axiosInstance;
