import { message } from 'choerodon-ui/pro';
// 提示错误信息
export default function prompt(
  content,
  type = 'info',
  duration,
  placement = 'leftBottom',
  onClose,
) {
  const messageType = [
    'success',
    'error',
    'info',
    'warning',
    'warn',
    'loading',
  ];
  if (messageType.indexOf(type) !== -1) {
    message[type](content, duration, onClose, placement);
  }
}
