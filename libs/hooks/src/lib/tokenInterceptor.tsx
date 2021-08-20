import { AxiosInstance, AxiosResponse } from 'axios';

export function tokenInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use((response: AxiosResponse<any>) => {
    if (response.headers['x-access-token']) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.headers['x-access-token']}`; // eslint-disable-line no-param-reassign
    }
    return response;
  });
}

export default tokenInterceptor;
