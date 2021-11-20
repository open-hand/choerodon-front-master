import Api from '../../Api';

class StatisticApi extends Api<StatisticApi> {
  get prefix() {
    return '/hadm/choerodon/v1/statistic';
  }

  handleMenuClick(data:any) {
    return this.request({
      url: `${this.prefix}/menu_click/save`,
      method: 'post',
      data,
    });
  }
}

const statistcApi = new StatisticApi();
const statistcApiConfig = new StatisticApi(true);
export { statistcApi, statistcApiConfig };
