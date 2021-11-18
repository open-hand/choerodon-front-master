import Api from './Api';

class IamApi extends Api<IamApi> {
  get prefix() {
    return '/iam/choerodon/v1/users';
  }

  // 看手机存不存在(自己的手机校验不成功)
  checkPhoneExitNoSelf(data: object) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/check`,
      data,
      noPrompt: true,
    });
  }
}

const iamApi = new IamApi();
const iamApiConfig = new IamApi(true);
export { iamApi, iamApiConfig };
