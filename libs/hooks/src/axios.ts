import { csrfSecretKey } from '@project-lc/shared-types';
import { getApiHost } from '@project-lc/utils';
import axios from 'axios';
import { setTokenInterceptor } from './lib/tokenInterceptor';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: getApiHost(),
  xsrfCookieName: csrfSecretKey,
});

// Use Token Interceptor
setTokenInterceptor(axiosInstance);

export default axiosInstance;
// _csrf=EfgQKQlJ0QJElUtXTlmrlKZP
