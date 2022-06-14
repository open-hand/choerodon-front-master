import Api from './Api';

class ProjectsApi extends Api<ProjectsApi> {
  get prefix() {
    return `/iam/choerodon/v1/projects/${this.projectId}`;
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
}

const projectsApi = new ProjectsApi();
const projectsApiConfig = new ProjectsApi(true);
export { projectsApi, projectsApiConfig };
