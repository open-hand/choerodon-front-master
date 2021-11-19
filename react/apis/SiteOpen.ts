import Api from './Api';

class SiteOpenApi extends Api<SiteOpenApi> {
  get prefix() {
    return '/iam/choerodon/v1/site/open';
  }

  getCaptcha = (email: string) => this.request({
    method: 'get',
    url: `${this.prefix}/send_captcha`,
    params: {
      email,
    },
  })

  getIfBindOpenPlatform() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/check_bind_user`,
    });
  }

  createUser(data:any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/create_user`,
      data,
    });
  }

  bindUser(data:any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/bind_user`,
      params: data,
    });
  }

  removeBind(data:any) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/remove_bind`,
      params: data,
    });
  }
}

const siteOpenApi = new SiteOpenApi();
const siteOpenApiConifg = new SiteOpenApi(true);
export { siteOpenApi, siteOpenApiConifg };
