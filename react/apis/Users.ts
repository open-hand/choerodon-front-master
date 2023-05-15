import Api from './Api';

class UsersApi extends Api<UsersApi> {
  get prefix() {
    return '/cbase/choerodon/v1/users';
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

  // 获取企微 appid、agengid
  getEnterpriseWechatInfo(id:any) {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/relevance/open_app_config?organization_id=${id}`,
    });
  }

  // 获取第三方应用可以绑定的组织

  openAppGetCanBindOrgs(type:string) {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/users/list_tenants_with_open_app?open_app_type=${type}`,
    });
  }

  // 获取第三方应用已经绑定的组织
  openAppGetBindOrgs(type:string) {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/users/list_organizations_bound_up_with_open_app?open_app_type=${type}`,
    });
  }

  yqcloudCheckPhoneExist(phone:string, orgId:string) {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/users/check_yqcloud_email_or_phone_exist?verify_type=PHONE&phone=${phone}&organization_id=${orgId}`,
    });
  }

  yqcloudCheckEmailExist(email:string, orgId:string) {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/users/check_yqcloud_email_or_phone_exist?verify_type=EMAIL&email=${email}&organization_id=${orgId}`,
    });
  }

  yqcloudBind(data:any) {
    return this.request({
      method: 'post',
      url: '/iam/choerodon/v1/users/bind_yqcloud',
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

  yqcloudUnBind(orgId:string) {
    return this.request({
      method: 'post',
      url: `/iam/choerodon/v1/users/unbind_yqcloud?organization_id=${orgId}`,
    });
  }

  // 燕千云绑定获取验证码

   yqcloudBindGetCaptchaByEmail = (email:string, params:any) => this.request({
     method: 'post',
     url: '/iam/choerodon/v1/users/get_yqcloud_verify_code',
     data: {
       verifyType: 'EMAIL',
       email,
       ...params,
     },
   })

   yqcloudBindGetCaptchaByPhone=(phone:string, params:any) => this.request({
     method: 'post',
     url: '/iam/choerodon/v1/users/get_yqcloud_verify_code',
     data: {
       verifyType: 'PHONE',
       phone,
       ...params,
     },
   })

   /**
   *  获取用户个人信息
   * @return {*}
   * @memberof UsersApi
   */
   getUserInfo() {
     return this.request({
       url: '/iam/choerodon/v1/users/self',
       method: 'get',
     });
   }
}

const usersApi = new UsersApi();
const usersApiConfig = new UsersApi(true);
export { usersApi, usersApiConfig };
