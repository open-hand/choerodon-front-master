import Api from '../../Api';

class DevopsHostsApi extends Api<DevopsHostsApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/hosts`;
  }

  getHosts() {
    return this.request({
      url: `${this.prefix}/page_by_option`,
      method: 'post',
    });
  }
}

const devopsHostsApi = new DevopsHostsApi();
const devopsHostsApiConfig = new DevopsHostsApi(true);

export {
  devopsHostsApi,
  devopsHostsApiConfig,
};
