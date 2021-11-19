import Api from './Api';

class UsersApi extends Api<UsersApi> {
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

const usersApi = new UsersApi();
const usersApiConfig = new UsersApi(true);
export { usersApi, usersApiConfig };
