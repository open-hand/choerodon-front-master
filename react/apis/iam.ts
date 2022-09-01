import Api from './Api';

class IamApi extends Api<IamApi> {
  get prefix() {
    return '/iam/choerodon/v1';
  }

  completeRegisterInfo(data:any) {
    return this.request({
      url: `${this.prefix}/new_registers/supplement_info`,
      method: 'post',
      data,
    });
  }

  getIfCompleteRegisterInfo(userID:string) {
    return this.request({
      url: `${this.prefix}/new_registers/check/supplement_info?userId=${userID}`,
      method: 'get',
    });
  }

  // 个人信息平台层 查询个人信息所在的组织能否钉钉发送
  getSiteDingdingDisable() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/users/ding_talk`,
    });
  }

  // 个人信息平台层 审批提交接口
  postSiteApproval({ id, data }:any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/registers/approval/${id}`,
      data: JSON.stringify(data),
    });
  }

  // 获取健康状态列表
  getHealthStates(orgId:string) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/${orgId}/health-states`,
    });
  }
}

const iamApi = new IamApi();
const iamApiConfig = new IamApi(true);
export { iamApi, iamApiConfig };
