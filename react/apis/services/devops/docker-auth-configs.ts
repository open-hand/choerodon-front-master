import Api from '../../Api';

class DevopsDockerAuthConfigsApi extends Api<DevopsDockerAuthConfigsApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/docker_auth_configs`;
  }

  getConfigs(id: any) {
    return this.request({
      url: this.prefix,
      method: 'get',
      params: {
        pipeline_id: id,
      },
    });
  }
}

const devopsDockerAuthConfigsApi = new DevopsDockerAuthConfigsApi();
const devopsDockerAuthConfigsApiConfig = new DevopsDockerAuthConfigsApi(true);

export {
  devopsDockerAuthConfigsApi,
  devopsDockerAuthConfigsApiConfig,
};
