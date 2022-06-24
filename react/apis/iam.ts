import Api from './Api';

class IamApi extends Api<IamApi> {
  get prefix() {
    return '/iam/choerodon/v1';
  }

  // 个人信息平台层 查询个人信息所在的组织能否钉钉发送
  getSiteDingdingDisable() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/users/ding_talk`,
    });
  }
}

const iamApi = new IamApi();
const iamApiConfig = new IamApi(true);
export { iamApi, iamApiConfig };
