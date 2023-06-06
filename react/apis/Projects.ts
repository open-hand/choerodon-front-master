import Api from './Api';

class ProjectsApi extends Api<ProjectsApi> {
  get prefix() {
    return `/cbase/choerodon/v1/projects/${this.projectId}`;
  }

  enableUsersPage(name: any) {
    return this.request({
      url: `${this.prefix}/enableUsers/page`,
      params: {
        user_name: name,
      },
      method: 'get',
    });
  }

  /**
   * 获取项目基本信息
   * @param projectId
   */
  loadBasicInfo(projectId?: string) {
    return this.request({
      url: `/cbase/choerodon/v1/projects/${projectId}/basic_info`,
      method: 'get',
    });
  }

  getProjectInfo(projectId: string) {
    return this.request({
      url: `/cbase/choerodon/v1/projects/${projectId}`,
      method: 'get',
    });
  }

  // 是否开启燕千云第三方配置
  getYcloudSpace(organizationId: string) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${organizationId}/open_app/details_by_type?app_type=yqcloud`,
      method: 'get',
    });
  }

  // 是否绑定燕千云租户
  getYcloudUser() {
    return this.request({
      url: '/iam/choerodon/v1/users/list_organizations_bound_up_with_open_app? open_app_type=yqcloud',
      method: 'get',
    });
  }

  // 获取燕千云知识空间关联列表
  getYcloudList(projectId:string) {
    return this.request({
      url: `/agile/v1/projects/${projectId}/yq_cloud/knowledge/list_space`,
      method: 'get',
    });
  }
}

const projectsApi = new ProjectsApi();
const projectsApiConfig = new ProjectsApi(true);
export { projectsApi, projectsApiConfig };
