import Api from './Api';

class MenusApi extends Api<MenusApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/cbase/choerodon/v1/menus';
  }

  getPlatFormMenuEntryPermission() {
    return this.request({
      url: `${this.prefix}/site_menu_flag`,
      method: 'get',
    });
  }
}

const menusApi = new MenusApi();
const menusApiConfig = new MenusApi(true);
export { menusApi, menusApiConfig };
