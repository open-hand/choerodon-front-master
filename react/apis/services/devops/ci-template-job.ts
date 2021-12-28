import Api from '../../Api';

class CiTemplateJobApi extends Api<CiTemplateJobApi> {
  get orgPrefix() {
    return `/devops/v1/organizations/${this.orgId}/ci_template_job`;
  }

  checkName(name: string) {
    return this.request({
      url: `${this.orgPrefix}/check_name`,
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
