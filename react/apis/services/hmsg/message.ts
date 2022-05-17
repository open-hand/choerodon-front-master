import Api from '../../Api';

class MessageApi extends Api<MessageApi> {
  get prefix() {
    return '/hmsg/v1/messages';
  }

  reSendMsg(id:string) {
    return this.request({
      url: `${this.prefix}/resend?transactionId=${this.orgId}`,
      method: 'post',
    });
  }
}

const messageApi = new MessageApi();
const messageApiConfig = new MessageApi(true);
export { messageApi, messageApiConfig };
