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

  editDockerCompose(id: any, data: any) {
    return this.request({
      url: `${this.prefix}/${id}`,
      method: 'put',
      data,
    });
  }

  restartDockerCompose(id: any) {
    return this.request({
      url: `${this.prefix}/${id}/restart`,
      method: 'put',
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

  startContainer(id: any, instanceId: any) {
    return this.request({
      url: `${this.prefix}/${id}/containers/${instanceId}/start`,
      method: 'put',
    });
  }

  removeContainer(id: any, instanceId: any) {
    return this.request({
      url: `${this.prefix}/${id}/containers/${instanceId}/remove`,
      method: 'put',
    });
  }

  getValuesRecordsList(id: any) {
    return this.request({
      url: `${this.prefix}/${id}/value_records`,
      method: 'get',
    });
  }

  restartContainer(id: any, instanceId: any) {
    return this.request({
      url: `${this.prefix}/${id}/containers/${instanceId}/restart`,
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
