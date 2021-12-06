import Api from './Api';

class AllApi extends Api<AllApi> {
  get prefix() {
    return '/iam/choerodon/v1/all';
  }

  getAllUser(data: object) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/users`,
      params: data,
    });
  }
}

const allApi = new AllApi();
const allApiConfig = new AllApi(true);
export { allApi, allApiConfig };
