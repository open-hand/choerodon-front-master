import Api from '../../Api';

class ProjectProductLibApi extends Api<ProjectProductLibApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}`;
  }

  getHlemList() {
    return this.request({
      url: `${this.prefix}/helm_config/list`,
      method: 'get',
    });
  }
}

const projectProductLibApi = new ProjectProductLibApi();
const projectProductLibApiConfig = new ProjectProductLibApi(true);
export { projectProductLibApi, projectProductLibApiConfig };
