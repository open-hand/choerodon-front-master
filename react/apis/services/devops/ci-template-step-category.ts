import Api from '../../Api';

class CiTemplateStepCategoryApi extends Api<CiTemplateStepCategoryApi> {
  get orgPrefix() {
    return `/devops/v1/organizations/${this.orgId}/ci_template_step_category`;
  }

  get sitePrefix() {
    return '/devops/v1/site/0/ci_template_step_category';
  }

  getSteps() {
    return this.request({
      url: `${this.orgPrefix}`,
      method: 'get',
    });
  }

  getSiteSteps() {
    return this.request({
      url: `${this.sitePrefix}`,
      method: 'get',
    });
  }
}

const ciTemplateStepCategoryApi = new CiTemplateStepCategoryApi();
const ciTemplateStepCategoryApiConfig = new CiTemplateStepCategoryApi(true);
export {
  ciTemplateStepCategoryApi,
  ciTemplateStepCategoryApiConfig,
};
