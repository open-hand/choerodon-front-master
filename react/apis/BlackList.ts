import { omit } from 'lodash';
import Api from './Api';

class BlackListApi extends Api<BlackListApi> {
  get prefix() {
    return '/iam/choerodon/v1/blacklist';
  }

  getblackList =(data: object) => this.request({
    method: 'get',
    url: `${this.prefix}/paging_query`,
    params: data,
  });

  export = (postData: any) => this.request({
    method: 'post',
    url: `${this.prefix}/export`,
    data: omit(postData, 'user_id'),
    params: {
      user_id: postData.user_id,
    },
  });

  // eslint-disable-next-line camelcase
  exportHistory = (user_id: string) => this.request({
    method: 'get',
    url: `${this.prefix}/export/history`,
    params: {
      user_id,
    },
  });

  validateDomain = (data: object) => this.request({
    method: 'get',
    url: `${this.prefix}/check`,
    params: data,
  });

  createBlackList = (data: object) => this.request({
    method: 'post',
    url: `${this.prefix}`,
    data,
  });

  editBlackList= (data:any) => this.request({
    method: 'put',
    url: `${this.prefix}/${data.id}`,
    data: omit(data, 'id'),
  });

  updateStatus= (data:any) => this.request({
    method: 'put',
    url: `${this.prefix}/status`,
    params: data,
  });
}

const blackListApi = new BlackListApi();
const blackListApiConifg = new BlackListApi(true);
export { blackListApi, blackListApiConifg };
