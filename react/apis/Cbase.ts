import Api from './Api';

class CbaseApi extends Api<CbaseApi> {
  get prefix() {
    return '/cbase/choerodon/v1';
  }

  getCustomFieldsOptions(orgId:string, fieldId: string, params: any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/organizations/${orgId}/project_field/${fieldId}/options`,
      params,
      data: [],
    });
  }

  /**
   *
   * @param params
    pageAction为可选参数
    - 为空是查详情页面全部字段
    - create表示创建页面
    - edit表示更新页面

    buildInFlag是可选参数
    - 为空查系统字段和自定义字段
    - true查系统字段
    - false查自定义字段

    projectId是可选字段
更新时需要传过来，获取当前项目的自定义字段值
   */

  getFields(params:any) {
    return this.request({
      method: 'get',
      url: `/cbase/choerodon/v1/organizations/${this.orgId}/project_field/list_by_action`,
      params,
    });
  }
}

const cbaseApi = new CbaseApi();
const cbaseApiConfig = new CbaseApi(true);
export { cbaseApi, cbaseApiConfig };
