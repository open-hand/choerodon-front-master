import Api from '../../Api';

class CiTemplateStepApi extends Api<CiTemplateStepApi> {
  get sitePrefix() {
    return '/devops/v1/site/0/ci_template_step';
  }

  get orgPrefix() {
    return `/devops/v1/organizations/${this.orgId}/ci_template_step`;
  }

  checkStepName(name: string) {
    return this.request({
      url: `${this.sitePrefix}/check/name/unique`,
      method: 'get',
      params: {
        name,
      },
    });
  }

  getSiteSteps() {
    return this.request({
      url: `${this.sitePrefix}`,
      method: 'get',
    });
  }

  getOrgSteps() {
    return this.request({
      url: `${this.orgPrefix}`,
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
