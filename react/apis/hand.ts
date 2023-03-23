import { omit } from 'lodash';
import Api from './Api';

class HandApi extends Api<HandApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return `/cbase/choerodon/v1/hand/${this.orgId}`;
  }

  getOrgOrigin() {
    return this.request({
      url: `${this.prefix}`,
      method: 'get',
    });
  }
}

const handApi = new HandApi();
const handApiConfig = new HandApi(true);
export { handApi, handApiConfig };
