import Api from '../../Api';

class CICDPipelineApi extends Api<CICDPipelineApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/cicd_pipelines`;
  }

  // eslint-disable-next-line camelcase
  getTemplate(pipelineId: number, include_default?: boolean) {
    return this.request({
      url: `${this.prefix}/${pipelineId}/functions`,
      method: 'post',
      params: {
        include_default,
      },
    });
  }

  getPipelineGitlabCiYml(pipelineId: string) {
    return this.request({
      url: `${this.prefix}/${pipelineId}/gitlab_ci_yaml`,
      method: 'get',
    });
  }
}

const cicdPipelineApi = new CICDPipelineApi();
const cicdPipelineApiConfig = new CICDPipelineApi(true);
export { cicdPipelineApi, cicdPipelineApiConfig };
