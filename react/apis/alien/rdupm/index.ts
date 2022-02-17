import Api from '../../Api';

class RdupmAlienApi extends Api<RdupmAlienApi> {
  get prefix() {
    return '/rdupm';
  }

  getnexusMavenRepoIds(type?: string) {
    return this.request({
      url: `${this.prefix}/v1/nexus-repositorys/${this.orgId}/project/${this.projectId}/ci/repo/list?repoType=MAVEN${type ? `&type=${type}` : ''}`,
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
}

const rdupmAlienApi = new RdupmAlienApi();
const RdupmAlienApiConfig = new RdupmAlienApi(true);
export { rdupmAlienApi, RdupmAlienApiConfig };
