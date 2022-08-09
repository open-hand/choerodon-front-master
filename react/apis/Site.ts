import Api from './Api';

class SiteApi extends Api<SiteApi> {
  get prefix() {
    return '/iam/choerodon/v1/site';
  }

  getFeedBack(tenantId: any) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/feed_back`,
      params: {
        tenant_id: tenantId,
      },
    });
  }

  putFeedBack(data: any) {
    return this.request({
      method: 'put',
      url: `${this.prefix}/feed_back`,
      data,
    });
  }

  postFeedBack(data: any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/feed_back`,
      data,
    });
  }
}

const siteApi = new SiteApi();
const siteApiConifg = new SiteApi(true);
export { siteApi, siteApiConifg };
