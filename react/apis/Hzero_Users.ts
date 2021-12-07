import { LanguageTypes } from '@/typings';
import Api from './Api';

class HzeroUsersApi extends Api<HzeroUsersApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/iam/hzero/v1/users';
  }

  changeLanguages(language:LanguageTypes) {
    return this.request({
      url: `${this.prefix}/default-language?language=${language}`,
      method: 'put',
    });
  }
}

const hzerosUsersApi = new HzeroUsersApi();
const hzerosUsersApiConfig = new HzeroUsersApi(true);
export { hzerosUsersApi, hzerosUsersApiConfig };
