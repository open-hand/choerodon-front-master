import Api from '../../Api';

class DevopsAlienApi extends Api<DevopsAlienApi> {
  get prefix() {
    return '/devops';
  }

  getDefaultImage() {
    return this.request({
      url: `${this.prefix}/ci/default_image`,
      method: 'get',
    });
  }
}

const devopsAlienApi = new DevopsAlienApi();
const DevopsAlienApiConfig = new DevopsAlienApi(true);
export { devopsAlienApi, DevopsAlienApiConfig };
