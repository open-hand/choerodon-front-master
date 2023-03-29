import Api from './Api';

class CbaseApi extends Api<CbaseApi> {
  get prefix() {
    return '/cbase/choerodon/v1';
  }

  getCustomFieldsOptions(orgId:string, fieldId: string, searchValue: string) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/organizations/${orgId}/project_field/${fieldId}/options?page=0&size=50&onlyEnabled=&searchValue=${searchValue || ''}`,
      data: [],
    });
  }
}

const cbaseApi = new CbaseApi();
const cbaseApiConfig = new CbaseApi(true);
export { cbaseApi, cbaseApiConfig };
