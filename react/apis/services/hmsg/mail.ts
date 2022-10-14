import Api from '../../Api';

class MailApi extends Api<MailApi> {
  get prefix() {
    return '/hmsg/v1/messages';
  }

  orgCreateOrUpdateMailTemplate(data:any) {
    return this.request({
      url: `hmsg/choerodon/v1/email/config/${this.orgId}/create_or_update`,
      method: 'post',
      data,
    });
  }

  siteCreateOrUpdateMailTemplate(data:any) {
    return this.request({
      url: 'hmsg/choerodon/v1/email/config/site/create_or_update',
      method: 'post',
      data,
    });
  }

  orgGetMailTemplateConfig(defaultConfig:boolean) {
    return this.request({
      url: `hmsg/choerodon/v1/email/config/${this.orgId}`,
      method: 'get',
      params: {
        default_config: defaultConfig,
      },
    });
  }

  siteGetMailTemplateConfig() {
    return this.request({
      url: 'hmsg/choerodon/v1/email/config/site/query_config',
      method: 'get',
    });
  }

  mailTemplatePreview(data:any) {
    return this.request({
      url: 'hmsg/choerodon/v1/email/config/preview',
      method: 'post',
      data,
    });
  }
}

const mailApi = new MailApi();
const mailApiConfig = new MailApi(true);
export { mailApi, mailApiConfig };
