/* eslint-disable no-console */
const styles = {
  log: 'color: white; background-color: #5365EA;padding: 2px',
  warn: 'color: white; background-color: #faad14;padding: 2px',
  error: 'color: white; background-color: red;padding: 2px',
};
type LogType = 'log' | 'warn' | 'error';

function info(type: LogType, message: string, ...extraMessage: any[]) {
  if (extraMessage.length > 0) {
    console.groupCollapsed(`%c${message}`, styles[type]);
    console.log.apply(null, extraMessage);
    console.groupEnd();
  } else {
    console.log(`%c${message}`, styles[type]);
  }
}
export function log(message: string, ...extraMessage: any[]) {
  info('log', message, ...extraMessage);
}
export function warn(message: string, ...extraMessage: any[]) {
  info('warn', message, ...extraMessage);
}
export function error(message: string, ...extraMessage: any[]) {
  info('error', message, ...extraMessage);
}
// log('跳转错误，请检查参数', 'ssss', { a: 1 });
// warn('跳转错误，请检查参数');
// error('跳转错误，请检查参数');
// error('请求错误 http://172.23.16.92:30094/hmsg/v1/0/messages/user/count');
