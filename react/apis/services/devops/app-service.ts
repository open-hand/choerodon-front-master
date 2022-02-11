import Api from '../../Api';

class AppServiceApi extends Api<AppServiceApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/app_service`;
  }

  // 获取应用流水线创建时候的下拉列表应用
  getAppListsService(data:{
    param: [],
    searchParam: {
      name:string
    }
  }) {
    return this.request({
      url: `${this.prefix}/page_app_services_without_ci`,
      method: 'post',
      data,
    });
  }

  // 获取分支
  getBrachs(appServiceId:string, data:{
    param: [],
    searchParam: {
      branchName:string
    }
  }) {
    return this.request({
      url: `${this.prefix}/${appServiceId}/git/page_branch_basic_info_by_options`,
      method: 'post',
      data,
    });
  }

  // 获取应用服务-创建网络应用服务名称下拉列表
  getAppServiceList(envId:string) {
    return this.request({
      url: `${this.prefix}/list_all?env_id=${envId}`,
      method: 'get',
    });
  }

  // 获取项目概览待审核合并请求应用服务名称下拉列表
  getRequestChartAppService(data?:{
    params: [],
  }) {
    return this.request({
      url: `${this.prefix}/page_internal_by_options`,
      method: 'post',
      data,
    });
  }
}
const appServiceApi = new AppServiceApi();
const appServiceApiConfig = new AppServiceApi(true);
export { appServiceApi, appServiceApiConfig };
