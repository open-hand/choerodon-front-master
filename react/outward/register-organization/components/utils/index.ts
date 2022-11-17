// eslint-disable-next-line no-underscore-dangle
const { API_HOST } = (window as any)._env_;

const toLoginAddress = (paramsStr?:string) => {
  window.location.href = `${API_HOST}/oauth/choerodon/login${paramsStr || ''}`;
};

export { toLoginAddress };
