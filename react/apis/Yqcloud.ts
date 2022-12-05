import Api from './Api';

class YqcloudApi extends Api<YqcloudApi> {
  get prefix() {
    return '/cbase/choerodon/v1/yqcloud';
  }

  getSDKSecret(userId: any) {
    return this.request({
      url: `${this.prefix}/word/order/user`,
      method: 'get',
      params: {
        user_id: userId,
      },
    });
  }
}

const yqcloudApi = new YqcloudApi();
const yqcloudApiConfig = new YqcloudApi(true);
export { yqcloudApi, yqcloudApiConfig };
