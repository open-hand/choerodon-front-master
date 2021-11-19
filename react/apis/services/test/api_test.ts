import Api from '../../Api';

class ApiTestApi extends Api<ApiTestApi> {
  get prefix() {
    return `/test/v1/projects/${this.projectId}/api_test`;
  }

  /**
   * 客户端执行
   * @param taskId
   * @param data
   */
  clientExecute(taskId: string, data: any) {
    return this.request({
      url: `${this.prefix}/tasks/${taskId}/client_command`,
      method: 'post',
      data,
    })
  }

  /**
   *
   * 查询测试套件记录的列表 - （左侧树）
   * @param {string} apiKitId
   * @return {*}
   * @memberof ApiTestApi
   */
  getKitsRecordTree(apiKitId:string) {
    return this.request({
      url: `${this.prefix}/suite_records/${apiKitId}/task_records`,
      method: 'get',
    });
  }

  /**
   * 查询测试套件记录详情 - （顶部概览）
   * @memberof ApiTestApi
   */
  getKitsRecordOverview(apiKitId:string) {
    return this.request({
      url: `${this.prefix}/suite_records/${apiKitId}/preview`,
      method: 'get',
    });
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

  /**
   * 执行api测试任务
   * @param data
   */
  executeTask(data: any) {
    return this.request({
      url: `${this.prefix}/tasks/execute`,
      method: 'post',
      data,
    });
  }

  getSuitesList() {
    return this.request({
      url: `${this.prefix}/suites/paging`,
      method: 'get',
    });
  }
}

const apiTestApi = new ApiTestApi();
const apiTestApiConfig = new ApiTestApi(true);
export { apiTestApi, apiTestApiConfig };
