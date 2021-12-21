import Api from '../../Api';

class RdupmAlienApi extends Api<RdupmAlienApi> {
  get prefix() {
    return '/rdupm';
  }

  getnexusMavenRepoIds() {
    return this.request({
      url: `${this.prefix}/v1/nexus-repositorys/${this.orgId}/project/${this.projectId}/ci/repo/list?repoType=MAVEN`,
      method: 'get',
    });
  }
}

const rdupmAlienApi = new RdupmAlienApi();
const RdupmAlienApiConfig = new RdupmAlienApi(true);
export { rdupmAlienApi, RdupmAlienApiConfig };
