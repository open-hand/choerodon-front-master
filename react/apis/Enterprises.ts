import Api from './Api';

class EnterprisesApi extends Api<EnterprisesApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/iam/choerodon/v1/enterprises';
  }

  checkEnterpriseInfo() {
    return this.request({
      url: `${this.prefix}/default`,
      method: 'get',
      enabledCancelRoute: false,
    });
  }
}

const enterprisesApi = new EnterprisesApi();
const enterprisesConfig = new EnterprisesApi(true);
export { enterprisesApi, enterprisesConfig };
