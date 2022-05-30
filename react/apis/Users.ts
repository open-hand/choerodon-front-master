import Api from './Api';

class UsersApi extends Api<UsersApi> {
  get prefix() {
    return '/iam/choerodon/v1/users';
  }

  // 看手机存不存在(自己的手机校验不成功)
  checkPhoneExitNoSelf(email:string) {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/organizations/${this.orgId}/users/check/email`,
      params: {
        email,
      },
      noPrompt: true,
    });
  }

  yqcloudBind(data:any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/bind_yqcloud`,
      data,
    });
  }

  //
  yqcloudBindStatus(data:any) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/yqcloud_bind_status`,
      data,
    });
  }

  yqcloudUnBind(data:any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/unbind_yqcloud`,
      data,
    });
  }

  // 燕千云绑定获取验证码

   yqcloudBindGetCaptchaByEmail = (email:string) => this.request({
     method: 'post',
     url: `${this.prefix}/get_yqcloud_verify_code`,
     data: {
       verifyType: 'EMAIL',
       email,
     },
   })

   yqcloudBindGetCaptchaByPhone=(phone:string) => this.request({
     method: 'post',
     url: `${this.prefix}/get_yqcloud_verify_code`,
     data: {
       verifyType: 'PHONE',
       phone,
     },
   })

   /**
   *  获取用户个人信息
   * @return {*}
   * @memberof UsersApi
   */
   getUserInfo() {
     return this.request({
       url: `${this.prefix}/self`,
       method: 'get',
     });
   }
}

const usersApi = new UsersApi();
const usersApiConfig = new UsersApi(true);
export { usersApi, usersApiConfig };
