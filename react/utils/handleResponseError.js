import { message } from 'choerodon-ui/pro';
// 处理错误相应
export default function handleResponseError(error) {
  const { response } = error;
  if (response) {
    const { status } = response;
    switch (status) {
      case 400: {
        const mess = response.data.message;
        message.error(mess);
        break;
      }
      default:
        break;
    }
  }
}
