import Api from '@/apis/Api';

export interface SearchData {
  startDate?: string
  endDate?: string
  typeIds?: string[]
  otherTypes?: string[]
  createdByIds?: string[]
}

class ProjectDynamicApi extends Api<ProjectDynamicApi> {
  get prefix() {
    return `/agile/v1/dynamic/project/${this.projectId}`;
  }

  loadProjectDynamic({ data, params }: {data: SearchData, params: {
    page: number,
    size: number
  }}) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/project_operation`,
      data,
      params,
    });
  }
}

const projectDynamicApi = new ProjectDynamicApi();
const projectDynamicApiConfig = new ProjectDynamicApi(true);
export { projectDynamicApi, projectDynamicApiConfig };
