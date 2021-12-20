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

  //  组织层流水线模板
  getOrgPinelineTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_pipeline`,
      method: 'get',
      params,
    });
  }

  //  组织层任务模板
  getOrgTasksTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_job/page`,
      method: 'get',
      params,
    });
  }

  //  组织层步骤模板
  getOrgStepsTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_step`,
      method: 'get',
      params,
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
