import Api from '../../Api';

class CiTemplateJobApi extends Api<CiTemplateJobApi> {
  get orgPrefix() {
    return `/devops/v1/organizations/${this.orgId}/ci_template_job`;
  }

  get sitePrefix() {
    return '/devops/v1/site/0/ci_template_job';
  }

  checkJobName(name: string, id?: any) {
    return this.request({
      url: `${this.sitePrefix}/check_name`,
      method: 'get',
      params: {
        name,
        job_id: id,
      },
    });
  }

  checkName(name: string, id?: any) {
    return this.request({
      url: `${this.orgPrefix}/check_name`,
      method: 'get',
      params: {
        name,
        job_id: id,
      },
    });
  }

  checkStepName(name: string) {
    return this.request({
      url: `${this.orgPrefix}/check/name/unique`,
      method: 'get',
      params: {
        name,
      },
    });
  }
}

const ciTemplateJobApi = new CiTemplateJobApi();
const ciTemplateJobApiConfig = new CiTemplateJobApi(true);
export {
  ciTemplateJobApi,
  ciTemplateJobApiConfig,
};
