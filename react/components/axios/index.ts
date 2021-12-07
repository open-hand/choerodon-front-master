import choerodonAxios from './axios';
import { AXIOS_TYPE_DEFAULT, AXIOS_TYPE_UI } from './CONSTANTS';

export interface C7NAxiosRequestConfig {
  noPrompt?: boolean
  useCache?:boolean
  enabledCancelRoute?:boolean,
  cancelCacheKey?: string,
  showAllRepsonseConfigData?:boolean
  application?: 'default' | 'ui',
}

declare module 'axios' {
  interface AxiosRequestConfig extends C7NAxiosRequestConfig{}
}

const uiAxiosInstance = choerodonAxios({
  type: AXIOS_TYPE_UI,
});

const c7nAxios = choerodonAxios({
  type: AXIOS_TYPE_DEFAULT,
});

export {
  uiAxiosInstance,
};

export default c7nAxios;
