import axios from 'axios';
import { getApiHost } from './getHostUrl';

export const cancelToken = axios.CancelToken;
export const { isCancel } = axios;
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: getApiHost(),
});

export default axiosInstance;
