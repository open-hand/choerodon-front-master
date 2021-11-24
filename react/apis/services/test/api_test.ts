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
   * 获取套件详情
   * @param id
   */
  getKitsDetail(id: string) {
    return this.request({
      url: `${this.prefix}/suites/${id}`,
      method: 'get',
    })
  }

  /**
   * 套件创建并执行接口
   * @param data
   */
  kitsClientExecute(data: any) {
    return this.request({
      url: `${this.prefix}/suites/create_and_client_execute`,
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
   * 创建api测试套件
   */
  createKits(data: any) {
    return this.request({
      url: `${this.prefix}/suites`,
      method: 'post',
      data,
    })
  }

  /**
   * 套件名称的唯一性校验
   * @param name
   * @param id
   */
  uniqueKitsName(name: string, id?: string) {
    return this.request({
      url: `${this.prefix}/suites/check/name_unique`,
      method: 'get',
      params: {
        name,
        id,
      }
    })
  }

  /**
   * 创建并执行api套件
   * @param data
   */
  createAndExecuteKits(data: any) {
    return this.request({
      url: `${this.prefix}/suites/create_and_execute`,
      method: 'post',
      data,
    })
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
   * 套件执行
   */
  executeKits(id: string) {
    return this.request({
      url: `${this.prefix}/suites/${id}/execute`,
      method: 'post',
    })
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

  getTasksByFolder(params?: any, data?: any) {
    return this.request({
      url: `${this.prefix}/tasks/paging_by_folder`,
      method: 'get',
      params,
      data,
    })
  }
}

const apiTestApi = new ApiTestApi();
const apiTestApiConfig = new ApiTestApi(true);
export { apiTestApi, apiTestApiConfig };
