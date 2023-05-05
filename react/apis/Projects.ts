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
}

const projectsApi = new ProjectsApi();
const projectsApiConfig = new ProjectsApi(true);
export { projectsApi, projectsApiConfig };
