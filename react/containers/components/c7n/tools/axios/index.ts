import axiosIntance from './axios';

const uiAxiosInstance = axiosIntance;
uiAxiosInstance.defaults.application = 'ui';

export {
  uiAxiosInstance,
};

export default axiosIntance;
