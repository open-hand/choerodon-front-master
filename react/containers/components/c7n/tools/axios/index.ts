import choerodonAxios from './axios';

const uiAxiosInstance = choerodonAxios({
  type: 'ui',
});

const c7nAxios = choerodonAxios({
  type: 'default',
});

export {
  uiAxiosInstance,
};

export default c7nAxios;
