import Api from '../../Api';

class ApiTestApi extends Api<ApiTestApi> {
  get prefix() {
    return `/test/v1/projects/${this.projectId}/api_test`;
  }

  getConfigList() {
    return this.request({
      url: `${this.prefix}/config/list `,
      method: 'get',
    });
  }

  getCreateApiKitsTree() {
    return this.request({
      url: `${this.prefix}/suites`,
      method: 'get',
    })
  }
}

const apiTestApi = new ApiTestApi();
const apiTestApiConfig = new ApiTestApi(true);
export { apiTestApi, apiTestApiConfig };
