import axios from 'axios';
import { getApiHost } from '@project-lc/utils';
import { setTokenInterceptor } from './lib/tokenInterceptor';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: getApiHost(),
});

// Use Token Interceptor
setTokenInterceptor(axiosInstance);

export default axiosInstance;
