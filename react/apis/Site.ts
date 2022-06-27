import Api from './Api';

class SiteApi extends Api<SiteApi> {
  get prefix() {
    return '/iam/choerodon/v1/site';
  }

  getFeedBack() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/feedback`,
    });
  }
}

const siteApi = new SiteApi();
const siteApiConifg = new SiteApi(true);
export { siteApi, siteApiConifg };
