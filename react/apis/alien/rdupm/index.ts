import Api from '../../Api';

class RdupmAlienApi extends Api<RdupmAlienApi> {
  get prefix() {
    return '/rdupm';
  }

  getProjectProductLibList(type?: string) {
    return this.request({
      url: `${this.prefix}/v2/product-library/list/215874867621597184?repo_type=${type}`,
      method: 'get',
    });
  }

  getnexusMavenRepoIds(type?: string) {
    return this.request({
      url: `${this.prefix}/v1/nexus-repositorys/${this.orgId}/project/${this.projectId}/ci/repo/list?repoType=MAVEN${type ? `&type=${type}` : ''}`,
      method: 'get',
    });
  }

  getProjectRepos() {
    return this.request({
      url: `${this.prefix}/v1/harbor-project/${this.projectId}/project_repos`,
      method: 'get',
    });
  }

  getImageRepoList() {
    return this.request({
      url: `${this.prefix}/v1/harbor-choerodon-repos/listImageRepo`,
      method: 'get',
      params: {
        projectId: this.projectId,
      },
    });
  }

  getImageHarbor(repoId: string, repoType: string) {
    return this.request({
      url: `${this.prefix}/v1/harbor-choerodon-repos/listHarborImage`,
      method: 'get',
      params: {
        repoId,
        repoType,
      },
    });
  }

  getImageTag(repoName: string) {
    return this.request({
      url: `${this.prefix}/v1/harbor-image-tag/list/${this.projectId}`,
      method: 'get',
      params: {
        repoName,
      },
    });
  }

  createNexus(data: any) {
    return this.request({
      url: `${this.prefix}/v1/site/nexus-server-configs`,
      method: 'post',
      data,
    });
  }

  updateNexus(id: any, data: any) {
    return this.request({
      url: `${this.prefix}/v1/site/nexus-server-configs/${id}`,
      method: 'put',
      data,
    });
  }

  getNexusList() {
    return this.request({
      url: `${this.prefix}/v1/site/nexus-server-configs/list`,
      method: 'get',
    });
  }

  setDefaultServer(id: any) {
    return this.request({
      url: `${this.prefix}/v1/site/nexus-server-configs/${id}/default`,
      method: 'put',
    });
  }

  checkNexusName(params: any) {
    return this.request({
      url: `${this.prefix}/v1/site/nexus-server-configs/check_name`,
      params,
      method: 'get',
    });
  }
}

const rdupmAlienApi = new RdupmAlienApi();
const RdupmAlienApiConfig = new RdupmAlienApi(true);
export { rdupmAlienApi, RdupmAlienApiConfig };
