import Api from '../../Api';

class CICDPipelineApi extends Api<CICDPipelineApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/cicd_pipelines`;
  }

  getTemplate(pipelineId: number, include_default?: boolean) {
    return this.request({
      url: `${this.prefix}/${pipelineId}/functions`,
      method: 'post',
      params: {
        include_default,
      }
    })
  }
}

const cicdPipelineApi = new CICDPipelineApi();
const cicdPipelineApiConfig = new CICDPipelineApi(true);
export { cicdPipelineApi, cicdPipelineApiConfig };
