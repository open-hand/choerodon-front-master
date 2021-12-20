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
}

const devopsOrganizationsApi = new DevopsOrganizationsApi();
const devopsOrganizationsApiConfig = new DevopsOrganizationsApi(true);
export { devopsOrganizationsApi, devopsOrganizationsApiConfig };
