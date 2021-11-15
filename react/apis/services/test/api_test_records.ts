import Api from '../../Api';

class ApiTestRecordsApi extends Api<ApiTestRecordsApi> {
  get prefix() {
    return `/test/v1/projects/${this.projectId}/api-test-records`;
  }

  /**
   *
   * @param {string} apiKitId
   * @return {*}
   * @memberof ApiTestApi
   */
  getKitsExcutionLists(apiKitId:string, params:string) {
    return this.request({
      url: `${this.prefix}/page_by_suite?suite_id=${apiKitId}`,
      method: 'get',
      params,
    });
  }

  getApiTestRecordsLists(taskId:string | number, data:any) {
    return this.request({
      url: `${this.prefix}/page_by_options?taskId=${taskId}`,
      method: 'post',
      params: data,
    });
  }
}

const apiTestRecordsApi = new ApiTestRecordsApi();
const apiTestRecordsApiConfig = new ApiTestRecordsApi(true);
export { apiTestRecordsApi, apiTestRecordsApiConfig };
