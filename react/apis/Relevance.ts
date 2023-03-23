import Api from './Api';

class RelevanceApi extends Api<RelevanceApi> {
  get prefix() {
    return '/cbase/choerodon/v1/relevance';
  }

  getCaptcha = (phone: string) => this.request({
    method: 'get',
    url: '/iam/choerodon/v1/relevance/send_captcha',
    params: {
      param: phone,
    },
  })

  checkBindStatus(params:any) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/user_bind_status`,
      params,
    });
  }

  unbindUser(params:any) {
    return this.request({
      method: 'get',
      url: '/iam/choerodon/v1/relevance/unbind_user',
      params,
    });
  }

  bindUser(params:any) {
    return this.request({
      method: 'get',
      url: '/iam/choerodon/v1/relevance/bind_user',
      params,
    });
  }

  checkOpenApp(params:any) {
    return this.request({
      method: 'get',
      url: '/iam/choerodon/v1/relevance/check_open_app',
      params,
    });
  }
}

const relevanceApi = new RelevanceApi();
const relevanceApiConifg = new RelevanceApi(true);
export { relevanceApi, relevanceApiConifg };
