import { omit } from 'lodash';
import { get } from '@choerodon/inject';
import Api from './Api';

class OrganizationsApi extends Api<OrganizationsApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/cbase/choerodon/v1/organizations';
  }

  getInviteEnterSystemInfo() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/user/invitation/info`,
      method: 'get',
    });
  }

  postInviteEnterSystemInfo(data:any) {
    return this.request({
      url: `${this.prefix}/${data.orgId}/user/join/team`,
      method: 'post',
      data,
    });
  }

  checkProjectCollaborationCode(code:string) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication/check_code_exist?code=${code}`,
      method: 'get',
    });
  }

  getAllProjectsTableColumns() {
    return this.request({
      url: `/cbase/v1/organizations/${this.orgId}/list_layout/projectView`,
      method: 'get',
    });
  }

  editAllProjectsTableColumns(data:any) {
    return this.request({
      url: `/cbase/v1/organizations/${this.orgId}/list_layout`,
      method: 'post',
      data,
    });
  }

  getClassficationList() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication/tree`,
      method: 'post',
    });
  }

  checkClassficationExistRelation(classficationId:string) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication/${classficationId}/exist_relation`,
      method: 'get',
    });
  }

  classficationMove(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication/move`,
      method: 'post',
      data,
    });
  }

  classficationEnable(classficationId:string) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication/${classficationId}/enable`,
      method: 'put',
    });
  }

  classficationDisable(classficationId:string) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication/${classficationId}/disable`,
      method: 'put',
    });
  }

  createClassfication(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication`,
      method: 'post',
      data,
    });
  }

  modifyClassfication(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication`,
      method: 'put',
      data,
    });
  }

  deleteClassfication(classficationId:string) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/classfication/${classficationId}`,
      method: 'delete',
    });
  }

  checkLoginName(name: string) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/check_login_name`,
      method: 'get',
      params: {
        loginName: name,
      },
    });
  }

  roleList() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/roles`,
      method: 'get',
    });
  }

  batchUpdate(data: any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/users/batch_update`,
      method: 'put',
      data,
    });
  }

  userLabelList() {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/list_user_labels`,
      method: 'get',
    });
  }

  // 第三方配置唯一校验
  thirdPartyAppOnlyVerify(data:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/check_config_create`,
      method: 'post',
      data,
    });
  }

  thirdPartyAppSyncUsers(openAppId: string) {
    return this.request({
      url: `/agile/v1/organizations/${this.orgId}/issue_open_sync/list_assign_users?open_app_id=${openAppId}`,
      method: 'get',
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
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/error-users/${historyId}`,
      method: 'get',
      data,
    });
  }

  thirdPartyAppHistory(openAppId:string) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/histories/${openAppId}`,
      method: 'get',
    });
  }

  thirdPartyAppLatestHistory(openAppId:string, type:string) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/latest_history/${openAppId}?type=${type}`,
      method: 'get',
    });
  }

  thirdPartyAppList() {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/list`,
      method: 'get',
    });
  }

  thirdPartyAppDetail(params:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/details`,
      method: 'get',
      params,
    });
  }

  thirdPartyAppCreate(data:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app`,
      method: 'post',
      data,
    });
  }

  thirdPartyAppEdit(data:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app`,
      method: 'put',
      data,
    });
  }

  thirdPartyAppDisable(params:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/disable`,
      method: 'put',
      params,
    });
  }

  thirdPartyAppEnable(params:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/enable`,
      method: 'put',
      params,
    });
  }

  thirdPartyAppEditSyncSetting(data:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/sync_setting`,
      method: 'put',
      data,
    });
  }

  thirdPartyAppHMSync(params:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/sync_user_and_group`,
      method: 'get',
      params,
    });
  }

  thirdPartyAppSyncBindUser(params:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/sync_bind_user`,
      method: 'get',
      params,
    });
  }

  thirdPartyAppTestConnection(data:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/test_connection`,
      method: 'post',
      data,
    });
  }

  thirdPartyAppTestConnectionYq(data:any) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/check_yqcloud_config`,
      method: 'post',
      data,
    });
  }

  // 项目协作-项目-状态列表
  cooperationProjStatusList(id?:string) {
    return this.request({
      url: `${this.prefix}/${id || this.orgId}/project_status/paging`,
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

  enableUsersPage(name: any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/enableUsers/page`,
      params: {
        user_name: name,
      },
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
      url: `/iam/choerodon/v1/organizations/${orgid}/change_tenant_owner`,
      method: 'put',
      params,
    });
  }

  transferOrgSite(params:any) {
    return this.request({
      url: '/iam/choerodon/v1/organizations/site_change_tenant_owner',
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
      url: `/iam/choerodon/v1/organizations/${organizationId}/user_wizard/list`,
      method: 'get',
    });
  }

  getProjectsIds(userId:any, filerData?:string, onlyEnable = false) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/users/${userId}/projects/paging`,
      method: 'post',
      data: {
        name: filerData,
        enable: onlyEnable,
      },
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
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/generate/link`,
    });
  }

  // choerodon-iam.choerodon-project-user-pro.refreshLink
  refreshLink() {
    return this.request({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/refresh/link`,
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
      url: `${this.prefix}/${this.orgId}/users/${userId}/page_owned_projects?current_project_id=${selectProjectId}`,
    });
  }

  // 查询原所属组织
  loadOrganization(id:string) {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/organizations/bus/pro/${id}`,
    });
  }

  // 查询目标所属组织
  loadTargetOrganization() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/${this.orgId}/tenant/page?`,
    });
  }

  // 修改所属组织
  updateOrganization({ uid, targetId }:any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/${this.orgId}/user/tenant/update?user_id=${uid}&target_tenant_id=${targetId}?`,
    });
  }

  // 项目层查询组织能否钉钉发送
  getDingdingDisable() {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/organizations/${this.orgId}/open_app/is_message_enabled?type=ding_talk`,
    });
  }

  // 获取项目工作组
  getprojWorkGroup(id?:string, excludeUnassigned = false) {
    // ctyun偶尔会跳转到工作台请求agile接口 这里直接屏蔽
    const config = get('configuration.master-global:redirectWorkBench');
    if (config) {
      return undefined;
    }
    return this.request({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${id || this.orgId}/work_bench/work_group/query_tree${
        excludeUnassigned ? '?with_extra_items=false&with_unassigned_group=false' : ''
      }`,
    });
  }

  // 获取项目分类
  getprojClassification(id?:string, withUnassigned?:boolean) {
    return this.request({
      method: 'post',
      url: `/cbase/choerodon/v1/organizations/${id || this.orgId}/classfication/tree${withUnassigned ? '?with_unassigned_classfication=true' : ''}`,
    });
  }

  // 获取项目群
  getprojPrograms(id?:string) {
    return this.request({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${id || this.orgId}/projects/programs`,
    });
  }

  // 获取项目类型
  getprojType(id?:string) {
    return this.request({
      method: 'get',
      url: `/cbase/v1/organizations/${id || this.orgId}/project_categories?search=true`,
    });
  }

  // 项目创建人和更新人
  getprojUsers(id?:string, data = []) {
    return this.request({
      method: 'get',
      url: `/iam/choerodon/v1/organizations/${id || this.orgId}/users/search`,
      data,
    });
  }

  // # 查组织用户，包含置顶功能
  getOrgUsers(data:any, id?:string) {
    return this.request({
      method: 'post',
      url: `/cbase/choerodon/v1/organizations/${id || this.orgId}/users/search`,
      data,
    });
  }

  checkCode(value:String) {
    return this.request({
      method: 'post',
      url: '/iam/choerodon/v1/organizations/check',
      data: JSON.stringify({ tenantNum: value }),
    });
  }

  createOrganization(data:any) {
    return this.request({
      method: 'post',
      url: '/iam/choerodon/v1/organizations',
      data,
    });
  }

  setHealthStatus(data:any) {
    return this.request({
      method: 'put',
      url: `${this.prefix}/${this.orgId}/projects/health/state`,
      data,
    });
  }

  updateOrg({ tenantId, data }:any) { // 修改组织
    return this.request({
      method: 'put',
      url: `/iam/choerodon/v1/organizations/${tenantId}`,
      data,
    });
  }

  getOrgLanguage({ fieldName, orgId }:Record<string, string>) {
    return this.request({
      url: `/iam/choerodon/v1/organizations/${orgId}/tenant_tl?`,
      method: 'get',
      transformResponse: (data) => {
        // eslint-disable-next-line no-useless-catch
        try {
          const jsonData = JSON.parse(data);
          if (jsonData && !jsonData.failed) {
            const tlsRecord = {};
            jsonData.forEach((intlRecord:any) => {
              (tlsRecord as any)[intlRecord.code] = intlRecord.value;
            });
            return [{ [fieldName]: tlsRecord }];
          } if (jsonData && jsonData.failed) {
            throw new Error(jsonData.message);
          }
        } catch (e) {
          // do nothing, use default error deal
          throw e;
        }
        return data;
      },
    });
  }
}

const organizationsApi = new OrganizationsApi();
const organizationsApiConfig = new OrganizationsApi(true);
export { organizationsApi, organizationsApiConfig };
