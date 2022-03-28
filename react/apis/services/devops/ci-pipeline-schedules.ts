import Api from '../../Api';

class CiPipelineSchedules extends Api<CiPipelineSchedules> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/ci_pipeline_schedules`;
  }

  createPlan({
    data,
  }: any) {
    return this.request({
      url: this.prefix,
      method: 'post',
      data,
    });
  }

  getPlanList({
    appServiceId,
  }: any) {
    return this.request({
      url: this.prefix,
      method: 'get',
      params: {
        app_service_id: appServiceId,
      },
    });
  }

  disabledPlan({
    id,
  }: any) {
    return this.request({
      url: `${this.prefix}/${id}/disable`,
      method: 'put',
    });
  }

  enablePlan({
    id,
  }: any) {
    return this.request({
      url: `${this.prefix}/${id}/enable`,
      method: 'put',
    });
  }

  deletePlan({
    id,
  }: any) {
    return this.request({
      url: `${this.prefix}/${id}`,
      method: 'delete',
    });
  }
}
const ciPipelineSchedulesApi = new CiPipelineSchedules();
const ciPipelineSchedulesApiConfig = new CiPipelineSchedules(true);
export { ciPipelineSchedulesApi, ciPipelineSchedulesApiConfig };
