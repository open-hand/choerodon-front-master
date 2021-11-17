import Api from './Api';

class OrganizationsApi extends Api<OrganizationsApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/iam/choerodon/v1/organizations';
  }

  getProjectsIds(userId:any, filerData?:string) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/users/${userId}/projects/paging?params=${filerData}`,
      method: 'get',
    });
  }

  editQuickLink(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/quick_links/${data.id}`,
      method: 'put',
      data,
    });
  }

  createQuickLink(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/quick_links`,
      method: 'post',
      data,
    });
  }

  copyInviteLink() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/user_wizard/completed?step=createUser`,
      method: 'get',
    });
  }

  export(res:object) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/hand/export/register/tenant`,
      data: res,
    });
  }

  exportHistory(userid:string) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/hand/upload/${userid}/history`,
    });
  }
}

const organizationsApi = new OrganizationsApi();
const organizationsApiConfig = new OrganizationsApi(true);
export { organizationsApi, organizationsApiConfig };
