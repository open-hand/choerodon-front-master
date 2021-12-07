import Api from '../../Api';

class PodsApi extends Api<PodsApi> {
  get prefix() {
    return `/devops/v1/projects/${this.projectId}/pods`;
  }

  deletePods(podId:string, envId:string) {
    return this.request({
      url: `${this.prefix}/${podId}?env_id=${envId}`,
      method: 'delete',
    });
  }
}

const podsApi = new PodsApi();
const podsApiConfig = new PodsApi(true);
export { podsApi, podsApiConfig };
