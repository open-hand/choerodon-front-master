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

  getProjectsIds(userId:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/users/${userId}/projects/paging`,
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
}

const organizationsApi = new OrganizationsApi();
const organizationsApiConfig = new OrganizationsApi(true);
export { organizationsApi, organizationsApiConfig };