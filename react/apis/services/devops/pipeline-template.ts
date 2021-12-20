import Api from '../../Api';

class PipelinTemplateApi extends Api<PipelinTemplateApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/pipeline_templates`;
  }

  getPipelineTemplate() {
    return this.request({
      url: `${this.prefix}`,
      method: 'get',
    });
  }
}

const pipelinTemplateApi = new PipelinTemplateApi();
const pipelinTemplateApiConfig = new PipelinTemplateApi(true);
export { pipelinTemplateApi, pipelinTemplateApiConfig };
