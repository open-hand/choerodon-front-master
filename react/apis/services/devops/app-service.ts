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
      url: `${this.prefix}/${appServiceId}/git/page_branch_by_options`,
      method: 'post',
      data,
    });
  }
}

const appServiceApi = new AppServiceApi();
const appServiceApiConfig = new AppServiceApi(true);
export { appServiceApi, appServiceApiConfig };
