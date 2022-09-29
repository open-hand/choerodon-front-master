import Api from '../../Api';

class TemplateStepsApi extends Api<TemplateStepsApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/template_steps`;
  }

  get templatePrefix() {
    return `/devops/v1/project/${this.projectId}/ci_template_step/list/with/category`;
  }

  // eslint-disable-next-line camelcase
  getTemplateSteps(template_job_id: any) {
    return this.request({
      url: `${this.prefix}`,
      params: {
        template_job_id,
      },
    });
  }

  getTemplateStepsWithoutPipeline() {
    return this.request({
      url: `${this.templatePrefix}`,
      method: 'get',
    });
  }
}

const templateStepsApi = new TemplateStepsApi();
const templateStepsApiConfig = new TemplateStepsApi(true);
export { templateStepsApi, templateStepsApiConfig };
