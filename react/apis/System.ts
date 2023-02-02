import Api from './Api';

class SystemApi extends Api<SystemApi> {
  get prefix() {
    return '/cbase/choerodon/v1/system/setting';
  }

  getLoginIndexInfo = () => this.request({
    method: 'get',
    url: '/iam/choerodon/v1/system/setting/login_all',
  })

  editLoginIndexInfo = (data:any) => this.request({
    method: 'put',
    url: '/iam/choerodon/v1/system/setting/login',
    data,
  })
}

const systemApi = new SystemApi();
const systemApiConifg = new SystemApi(true);
export { systemApi, systemApiConifg };
