import choerodonAxios from './axios';
import { AXIOS_TYPE_DEFAULT, AXIOS_TYPE_UI } from './CONSTANTS';

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
