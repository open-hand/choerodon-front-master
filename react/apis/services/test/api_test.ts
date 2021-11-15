import Api from '../../Api';

class ApiTestApi extends Api<ApiTestApi> {
  get prefix() {
    return `/test/v1/projects/${this.projectId}/api_test`;
  }

  /**
   * api测试套件概览详情
   * @param {string} apiKitId
   * @return {*}
   * @memberof ApiTestApi
   */
  getKitsOverview(apiKitId:string) {
    return this.request({
      url: `${this.prefix}/suites/${apiKitId}/overview`,
      method: 'get',
    });
  }

  /**
   * api测试套件任务详情
   * @param {string} apiKitId
   * @return {*}
   * @memberof ApiTestApi
   */
  getKitsTaskLists(apiKitId:string) {
    return this.request({
      url: `${this.prefix}/suites/${apiKitId}/task_page`,
      method: 'get',
    });
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
    });
  }
}

const apiTestApi = new ApiTestApi();
const apiTestApiConfig = new ApiTestApi(true);
export { apiTestApi, apiTestApiConfig };
