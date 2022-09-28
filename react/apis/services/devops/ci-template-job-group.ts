import Api from '../../Api';

class CiTemplateJobGroupApi extends Api<CiTemplateJobGroupApi> {
  get orgPrefix() {
    return `/devops/v1/organizations/${this.orgId}/ci_template_job_group`;
  }

  get projectPrefix() {
    return `/devops/v1/project/${this.projectId}/ci_template_job_group`;
  }

  get sitePrefix() {
    return '/devops/v1/site/0/ci_template_job_group';
  }

  getList() {
    return this.request({
      url: `${this.orgPrefix}/list`,
      method: 'get',
    });
  }

  getProjectList() {
    return this.request({
      url: `${this.projectPrefix}/list`,
      method: 'get',
    });
  }

  getSiteList() {
    return this.request({
      url: `${this.sitePrefix}/list`,
      method: 'get',
    });
  }
}

const ciTemplateJobGroupApi = new CiTemplateJobGroupApi();
const ciTemplateJobGroupApiConfig = new CiTemplateJobGroupApi(true);
export {
  ciTemplateJobGroupApi,
  ciTemplateJobGroupApiConfig,
};
