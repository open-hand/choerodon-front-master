import Api from '../../Api';

class RequestChartApi extends Api<RequestChartApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/overview`;
  }

  // 获取合并请求列表
  getRequestList() {
    return this.request({
      url: `${this.prefix}/merge_request_to_be_checked`,
      method: 'get',
    });
  }
}
const requestChartApi = new RequestChartApi();
const requestChartApiConfig = new RequestChartApi(true);
export { requestChartApi, requestChartApiConfig };
