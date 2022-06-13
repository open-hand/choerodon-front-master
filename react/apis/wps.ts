import Api from './Api';

class WpsApi extends Api<WpsApi> {
  get prefix() {
    return '/iam/choerodon/v1';
  }

  // 知识库查询连接数
  loadConnects({
    type, tenantId,
  }:any) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/${type}s/${type === 'organization' ? this.orgId : this.projectId}/wps/config${type === 'project' ? `?tenant_id=${tenantId}` : ''}`,
    });
  }
}

const wpsApi = new WpsApi();
const wpsApiConfig = new WpsApi(true);
export { wpsApi, wpsApiConfig };
