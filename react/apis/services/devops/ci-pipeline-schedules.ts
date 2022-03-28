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
}
const ciPipelineSchedulesApi = new CiPipelineSchedules();
const ciPipelineSchedulesApiConfig = new CiPipelineSchedules(true);
export { ciPipelineSchedulesApi, ciPipelineSchedulesApiConfig };
