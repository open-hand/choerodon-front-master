import Api from './Api';

class PermissionsApi extends Api<PermissionsApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/cbase/choerodon/v1/permissions';
  }

  checkPermissions(data:string[], params: {
    projectId?:string | number
    tenantId:string |number
  }) {
    const newParams = params;
    if (!newParams?.projectId) {
      delete newParams.projectId;
    }
    return this.request({
      url: `${this.prefix}/menus/check-permissions`,
      method: 'post',
      params: newParams,
      data,
    });
  }
}

const permissionsApi = new PermissionsApi();
const permissionsApiConfig = new PermissionsApi(true);
export { permissionsApi, permissionsApiConfig };
