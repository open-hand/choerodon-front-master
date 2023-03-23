import Api from '../../Api';

class ContinuousDeploymentApi extends Api<ContinuousDeploymentApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}`;
  }

  getDeploymentProcessDetail(pipelineId: string) {
    return this.request({
      url: `${this.prefix}/pipelines/${pipelineId}`,
      method: 'get',
    });
  }

  checkDeploymentProcessName(params: any) {
    return this.request({
      url: `${this.prefix}/pipelines/check_name`,
      method: 'get',
      params,
    });
  }

  createDeploymentProcess(data: any) {
    return this.request({
      url: `${this.prefix}/pipelines`,
      method: 'post',
      data,
    });
  }

  editDeploymentProcess(pipelineId:string, data: any) {
    return this.request({
      url: `${this.prefix}/pipelines/${pipelineId}`,
      method: 'put',
      data,
    });
  }
}

const continuousDeploymentApi = new ContinuousDeploymentApi();
const continuousDeploymentApiConfig = new ContinuousDeploymentApi(true);
export { continuousDeploymentApi, continuousDeploymentApiConfig };
