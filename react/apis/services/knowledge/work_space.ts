import Api from '../../Api';

class WorkSpaceApi extends Api<WorkSpaceApi> {
  get prefix() {
    return `/knowledge/v1/projects/${this.projectId}/work_space`;
  }

  getFolderContent(id: any) {
    return this.request({
      url: `${this.prefix}/folder/${id}`,
      method: 'get',
    });
  }
}

const workSpaceApi = new WorkSpaceApi();
const workSpaceApiConfig = new WorkSpaceApi(true);
export { workSpaceApi, workSpaceApiConfig };
