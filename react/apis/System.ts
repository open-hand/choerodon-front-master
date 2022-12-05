import Api from './Api';

class SystemApi extends Api<SystemApi> {
  get prefix() {
    return '/cbase/choerodon/v1/system/setting';
  }

  getLoginIndexInfo = () => this.request({
    method: 'get',
    url: `${this.prefix}/login_all`,
  })

  editLoginIndexInfo = (data:any) => this.request({
    method: 'put',
    url: `${this.prefix}/login`,
    data,
  })
}

const systemApi = new SystemApi();
const systemApiConifg = new SystemApi(true);
export { systemApi, systemApiConifg };
