import Api from '../../Api';

class WpsApi extends Api<WpsApi> {
  get prefix() {
    return `/cbase/choerodon/v1/projects/${this.projectId}/wps`;
  }

  get orgPrefix() {
    return `/cbase/choerodon/v1/organizations/${this.orgId}/wps`;
  }

  // 知识库查询连接数
  loadConnects({
    type, tenantId,
  }:any) {
    return this.request({
      method: 'get',
      url: `${type === 'organization' ? this.orgPrefix : this.prefix}/config${type === 'project' ? `?tenant_id=${tenantId}` : ''}`,
    });
  }
}

const wpsApi = new WpsApi();
const wpsApiConfig = new WpsApi(true);
export { wpsApi, wpsApiConfig };
