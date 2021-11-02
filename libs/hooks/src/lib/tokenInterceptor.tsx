import { AxiosInstance, AxiosResponse } from 'axios';

export function tokenInterceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.response.use((response: AxiosResponse<any>) => {
    if (response.headers['x-wt-access-token']) {
      if (response.headers['x-wt-access-token'] === 'logout') {
        delete axiosInstance.defaults.headers.common.Authorization; // eslint-disable-line no-param-reassign
      } else {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.headers['x-wt-access-token']}`; // eslint-disable-line no-param-reassign
      }
    }
    return response;
  });
}

export default tokenInterceptor;
