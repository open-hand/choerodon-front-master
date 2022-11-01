import Api from '../../Api';

class CiTemplateStepApi extends Api<CiTemplateStepApi> {
  get sitePrefix() {
    return '/devops/v1/site/0/ci_template_step';
  }

  get orgPrefix() {
    return `/devops/v1/organizations/${this.orgId}/ci_template_step`;
  }

  get proPrefix() {
    return `/devops/v1/project/${this.projectId}/ci_template_step`;
  }

  checkStepName(name: string, id?: any) {
    return this.request({
      url: `${this.sitePrefix}/check/name/unique`,
      method: 'get',
      params: {
        name,
        template_step_id: id,
      },
    });
  }

  checkOrgStepName(name: string, id?: any) {
    return this.request({
      url: `${this.orgPrefix}/check/name/unique`,
      method: 'get',
      params: {
        name,
        template_step_id: id,
      },
    });
  }

  checkProjectStepName(name: any, id: any) {
    return this.request({
      url: `${this.proPrefix}/check/name/unique`,
      method: 'get',
      params: {
        name,
        template_step_id: id,
      },
    });
  }

  getSiteSteps() {
    return this.request({
      url: `${this.sitePrefix}/list/with/category`,
      method: 'get',
    });
  }

  getOrgSteps() {
    return this.request({
      url: `${this.orgPrefix}/list/with/category`,
      method: 'get',
    });
  }
}

const ciTemplateStepApi = new CiTemplateStepApi();
const ciTemplateStepApiConfig = new CiTemplateStepApi(true);
export {
  ciTemplateStepApi,
  ciTemplateStepApiConfig,
};
