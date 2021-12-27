import Api from '../../Api';

class DevopsOrganizationsApi extends Api<DevopsOrganizationsApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/devops/v1/organizations';
  }

  //  组织层流水线模板
  getOrgPinelineTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_pipeline`,
      method: 'get',
      params,
    });
  }

  getOrgPinelineTemplateById(id:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_pipeline/${id}`,
      method: 'get',
    });
  }

  createOrgPinelineTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_pipeline`,
      method: 'post',
      data,
    });
  }

  enableOrgPinelineTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_pipeline/enable`,
      method: 'put',
      params,
    });
  }

  invalidOrgPinelineTemplate(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_pipeline/invalid`,
      method: 'put',
      params,
    });
  }

  getOrgPinelineCategory(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_category`,
      method: 'get',
      params,
    });
  }

  getOrgPinelineVariableById(tempId: any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_variable/ci_pipeline_template/${tempId}`,
      method: 'get',
    });
  }

  checkOrgPinelineName(params: any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_pipeline/check/name/unique`,
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

  getOrgTasksTemplateListByGroupId(id:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_job`,
      method: 'get',
      params: {
        ci_template_job_group_id: id,
      },
    });
  }

  getOrgTasksTemplateGroup() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_job_group`,
      method: 'get',
    });
  }

  getOrgTasksTemplateGroupList() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_job_group/list`,
      method: 'get',
    });
  }

  getOrgTasksTemplateList() {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_job/list`,
      method: 'get',
    });
  }

  createOrgTasksTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_job`,
      method: 'post',
      data,
    });
  }

  getOrgTasksCategory(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_job_group`,
      method: 'get',
      params,
    });
  }

  deleteOrgTasksTemplate(temId:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_job/${temId}`,
      method: 'delete',
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

  createOrgStepsTemplate(data:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_step`,
      method: 'post',
      data,
    });
  }

  getOrgStepsCategory(params:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_step_category`,
      method: 'get',
      params,
    });
  }

  deleteOrgStepsTemplate(temId:any) {
    return this.request({
      url: `${this.prefix}/${this.orgId}/ci_template_step/${temId}`,
      method: 'delete',
    });
  }
}

const devopsOrganizationsApi = new DevopsOrganizationsApi();
const devopsOrganizationsApiConfig = new DevopsOrganizationsApi(true);
export { devopsOrganizationsApi, devopsOrganizationsApiConfig };
