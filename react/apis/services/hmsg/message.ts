import Api from '../../Api';

class MessageApi extends Api<MessageApi> {
  get prefix() {
    return '/hmsg/v1/messages';
  }

  getMsgList() {
    return this.request({
      url: `/hmsg/choerodon/v1/mails/records/ding_talk/${this.orgId}`,
      method: 'get',
    });
  }

  reSendMsg(id:string) {
    return this.request({
      url: `/hmsg/v1/${this.orgId}/messages/resend?transactionId=${id}`,
      method: 'post',
    });
  }

  getEnterpriseWechatMsgList() {
    return this.request({
      url: `/hmsg/choerodon/v1/mails/records/wechat_enterprise/${this.orgId}`,
      method: 'get',
    });
  }
}

const messageApi = new MessageApi();
const messageApiConfig = new MessageApi(true);
export { messageApi, messageApiConfig };
