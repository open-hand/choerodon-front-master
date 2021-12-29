import Api from '../../Api';

class TemplateStepsApi extends Api<TemplateStepsApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/template_steps`;
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
}

const templateStepsApi = new TemplateStepsApi();
const templateStepsApiConfig = new TemplateStepsApi(true);
export { templateStepsApi, templateStepsApiConfig };
