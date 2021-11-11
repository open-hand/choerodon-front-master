import Api from './Api';

class RegistersInvitationApi extends Api<RegistersInvitationApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/iam/choerodon/v1/registers_invitation';
  }

  batchInvite() {
    return this.request({
      url: `${this.prefix}/batch_invitations`,
      method: 'get',
    });
  }

  checkUserEmail(userEmail:string) {
    return this.request({
      url: `${this.prefix}/check_user_email?email=${userEmail}`,
      method: 'get',
    });
  }

  checkUserPhone(userPhone:string) {
    return this.request({
      url: `${this.prefix}/check_user_phone?phone=${userPhone}`,
      method: 'get',
    });
  }
}

const registersInvitationApi = new RegistersInvitationApi();
const registersInvitationApConfig = new RegistersInvitationApi(true);
export { registersInvitationApi, registersInvitationApConfig };
