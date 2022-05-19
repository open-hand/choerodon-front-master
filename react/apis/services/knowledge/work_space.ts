import Api from '../../Api';

class WorkSpaceApi extends Api<WorkSpaceApi> {
  get prefix() {
    return `/knowledge/v1/projects/${this.projectId}/work_space`;
  }

  get orgPrefix() {
    return `/knowledge/v1/organizations/${this.orgId}/work_space`;
  }

  getOrgFolderContent(id: any) {
    return this.request({
      url: `${this.orgPrefix}/folder/${id}`,
      method: 'get',
    });
  }

  getFolderContent(id: any, page: any, size: any) {
    return this.request({
      url: `${this.prefix}/folder/${id}`,
      method: 'get',
      params: {
        organization_id: this.orgId,
        page,
        size,
      },
    });
  }

  getOrgFiledData(id: any) {
    return this.request({
      url: `${this.orgPrefix}/${id}`,
      method: 'get',
      params: {
        organizationId: this.orgId,
      },
    });
  }

  getFileData(id: any) {
    return this.request({
      url: `${this.prefix}/${id}`,
      method: 'get',
      params: {
        organizationId: this.orgId,
      },
    });
  }

  rename(id: any, name: any) {
    return this.request({
      url: `${this.prefix}/rename/${id}`,
      method: 'put',
      params: {
        new_name: name,
        organization_id: this.orgId,
      },
    });
  }
}

const workSpaceApi = new WorkSpaceApi();
const workSpaceApiConfig = new WorkSpaceApi(true);
export { workSpaceApi, workSpaceApiConfig };
