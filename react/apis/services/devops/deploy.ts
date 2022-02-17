import Api from '../../Api';

class DevopsDeployApi extends Api<DevopsDeployApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/deploy`;
  }

  deployDocker(data: any) {
    return this.request({
      url: `${this.prefix}/docker`,
      method: 'post',
      data,
    });
  }
}

const devopsDeployApi = new DevopsDeployApi();
const devopsDeployApiConfig = new DevopsDeployApi(true);

export {
  devopsDeployApi,
  devopsDeployApiConfig,
};
