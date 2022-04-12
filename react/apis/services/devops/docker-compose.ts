import Api from '../../Api';

class DevopsDockerComposeApi extends Api<DevopsDockerComposeApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/docker_composes`;
  }

  createDockerCompose(data: any) {
    return this.request({
      url: this.prefix,
      method: 'post',
      data,
    });
  }

  getContainerList(id: any) {
    return this.request({
      url: `${this.prefix}/${id}/containers`,
      method: 'get',
    });
  }

  stopContainer(id: any, instanceId: any) {
    return this.request({
      url: `${this.prefix}/${id}/containers/${instanceId}/stop`,
      method: 'put',
    });
  }
}

const devopsDockerComposeApi = new DevopsDockerComposeApi();
const devopsDockerComposeApiConfig = new DevopsDockerComposeApi(true);

export {
  devopsDockerComposeApi,
  devopsDockerComposeApiConfig,
};
