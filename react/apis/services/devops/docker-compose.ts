import Api from '../../Api';

class DevopsDockerComposeApi extends Api<DevopsDockerComposeApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/docker_compose`;
  }

  createDockerCompose(data: any) {
    return this.request({
      url: this.prefix,
      method: 'post',
      data,
    });
  }
}

const devopsDockerComposeApi = new DevopsDockerComposeApi();
const devopsDockerComposeApiConfig = new DevopsDockerComposeApi(true);

export {
  devopsDockerComposeApi,
  devopsDockerComposeApiConfig,
};
