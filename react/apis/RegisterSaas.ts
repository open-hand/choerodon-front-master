import Api from './Api';

class RegisterSaasApi extends Api<RegisterSaasApi> {
  get prefix() {
    return '/cbase//choerodon/v1/register_saas';
  }

  isSaasTenant(data: any) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/is_saas_tenant`,
      params: data,
    });
  }
}

const registerSaasApi = new RegisterSaasApi();
const registerSaasApiConfig = new RegisterSaasApi(true);
export { registerSaasApi, registerSaasApiConfig };
