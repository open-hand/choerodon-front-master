import Api from '../../Api';

class SyncedApi extends Api<SyncedApi> {
  get prefix() {
    return `/market/v1/market/application/${this.projectId}/synced`;
  }

  /**
   * 获取hzero应用版本
   * @param {string} appId
   * @return {*}
   * @memberof SyncedApi
   */
  getHzeroAppVersions(appId:string) {
    return this.request({
      url: `${this.prefix}/application/version?application_id=${appId}`,
      method: 'get',
    });
  }
}

const syncedApi = new SyncedApi();
const syncedApiConfig = new SyncedApi(true);
export { syncedApi, syncedApiConfig };
