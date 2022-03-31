import { omit } from 'lodash';
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

  thirdPartyAppSyncUsers(openAppId: string) {
    return this.request({
      url: `/agile/v1/organizations/${this.orgId}/issue_open_sync/list_assign_users`,
      method: 'get',
      params: {
        open_app_id: openAppId,
      },
    });
  }

  thirdPartyAppSyncRetry(recordIds: Array<string>, type: string) {
    return this.request({
      url: `/agile/v1/organizations/${this.orgId}/issue_open_sync/batch_retry`,
      method: 'post',
      params: {
        open_app_type: type,
      },
      data: [...recordIds],
    });
  }

  thirdPartyAppErrorUsers(historyId:string, data?:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/error-users/${historyId}`,
      method: 'get',
      data,
    });
  }

  thirdPartyAppHistory(openAppId:string) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/histories/${openAppId}`,
      method: 'get',
    });
  }

  thirdPartyAppLatestHistory(openAppId:string) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/latest_history/${openAppId}`,
      method: 'get',
    });
  }

  thirdPartyAppList() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/list`,
      method: 'get',
    });
  }

  thirdPartyAppDetail(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/details`,
      method: 'get',
      params,
    });
  }

  thirdPartyAppCreate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app`,
      method: 'post',
      data,
    });
  }

  thirdPartyAppEdit(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app`,
      method: 'put',
      data,
    });
  }

  thirdPartyAppDisable(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/disable`,
      method: 'put',
      params,
    });
  }

  thirdPartyAppEnable(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/enable`,
      method: 'put',
      params,
    });
  }

  thirdPartyAppEditSyncSetting(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/sync_setting`,
      method: 'put',
      data,
    });
  }

  thirdPartyAppHMSync(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/sync_user`,
      method: 'get',
      params,
    });
  }

  thirdPartyAppTestConnection(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/open_app/test_connection`,
      method: 'post',
      data,
    });
  }

  // 项目协作-项目-状态列表
  cooperationProjStatusList() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/project_status/paging`,
      method: 'get',
    });
  }

  // 项目协作-项目-状态创建
  cooperationProjStatusCreate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/project_status`,
      method: 'post',
      data,
    });
  }

  // 项目协作-项目-状态编辑
  cooperationProjStatusEdit(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/project_status`,
      method: 'put',
      data,
    });
  }

  // 项目协作-项目-状态删除
  cooperationProjStatusDelete(id:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/project_status?project_status_id=${id}`,
      method: 'delete',
    });
  }

  // 项目协作-项目-状态删除校验
  cooperationProjStatusDeleteCheck(id:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/project_status/check_delete?project_status_id=${id}`,
      method: 'get',
    });
  }

  // 项目协作-项目-状态名称校验
  cooperationProjStatusNameCheck(id:string, name:string, process:string) {
    let url = id ? `${this.prefix}/${this.orgId}/project_status/check_name?project_status_id=${id}&name=${name}` : `${this.prefix}/${this.orgId}/project_status/check_name?name=${name}`;
    url += `&process=${process}`;
    return this.request({
      url,
      method: 'get',
    });
  }

  // 项目协作-项目-状态停用
  cooperationProjStatusDisable(id:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/project_status/disable?project_status_id=${id}`,
      method: 'put',
    });
  }

  // 项目协作-项目-状态启用
  cooperationProjStatusEnable(id:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/project_status/enable?project_status_id=${id}`,
      method: 'put',
    });
  }

  // 移交组织所有者
  transferOrg(orgid:string, params:any) {
    return this.request({
      url: `${this.prefix}/${orgid}/change_tenant_owner`,
      method: 'put',
      params,
    });
  }

  transferOrgSite(params:any) {
    return this.request({
      url: `${this.prefix}/site_change_tenant_owner`,
      method: 'put',
      params,
    });
  }

  transferOrgNotify(orgid:string, params: any) {
    return this.request({
      url: `${this.prefix}/${orgid}/change_tenant_owner_message`,
      method: 'get',
      params,
    });
  }

  getUserWizardList(organizationId:string) {
    return this.request({
      url: `${this.prefix}/${organizationId}/user_wizard/list`,
      method: 'get',
    });
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

  export(postData:any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/hand/export/register/tenant`,
      data: omit(postData, 'user_id'),
      params: {
        user_id: postData.user_id,
      },
    });
  }

  exportHistory(userid:string) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/hand/upload/${userid}/history`,
    });
  }

  getLink() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/${this.orgId}/generate/link`,
    });
  }

  // choerodon-iam.choerodon-project-user-pro.refreshLink
  refreshLink() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/${this.orgId}/refresh/link`,
    });
  }

  invitation() {
    return this.request({
      method: 'post',
      url: `${this.prefix}/${this.orgId}/invitation`,
    });
  }

  emailSuffix() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/${this.orgId}/email_suffix`,
    });
  }

  loadProjectData(userId:string, selectProjectId:string) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/${this.orgId}/users/${userId}/projects/paging?enabled=true${selectProjectId ? `&project_id=${selectProjectId}` : ''}`,
    });
  }
}

const organizationsApi = new OrganizationsApi();
const organizationsApiConfig = new OrganizationsApi(true);
export { organizationsApi, organizationsApiConfig };
