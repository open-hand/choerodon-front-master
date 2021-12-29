import Api from '../../Api';

class SitePipelineTemplateApi extends Api<SitePipelineTemplateApi> {
  /**
   * @description: 前缀
   * @param {*}
   * @return {*}
   */
  get prefix() {
    return '/devops/v1/site';
  }

  getSitePinelineCategory(params:any) {
    return this.request({
      url: `${this.prefix}/0/ci_template_category`,
      method: 'get',
      params,
    });
  }
}

const sitePipelineTemplateApi = new SitePipelineTemplateApi();
const sitePipelineTemplateApiConfig = new SitePipelineTemplateApi(true);
export { sitePipelineTemplateApi, sitePipelineTemplateApiConfig };
