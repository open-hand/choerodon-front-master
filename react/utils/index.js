import url from 'url';
import { FILE_SERVER, LOCAL } from './constants';
import prompt from './prompt';
import handleResponseError from './handleResponseError';
import warning from './warning';
import checkPassword from './checkPassword';

export {
  prompt, handleResponseError, warning, checkPassword,
};

export {
  authorize, logout, authorizeC7n, logoutC7n,
} from './authorize';
export { getAccessToken, removeAccessToken, setAccessToken } from './accessToken';
export { getCookie, removeCookie, setCookie } from './cookie';
export {
  ACCESS_TOKEN, AUTH_URL, FILE_SERVER, LOCAL, WEBSOCKET_SERVER, STRING_DEVIDER, API_HOST,
} from './constants';
export { getMessage, intl } from './intl';

// 生成指定长度的随机字符串
export function randomString(len = 32) {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  for (let i = 0; i < len; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
  }
  return code;
}

export function historyPushMenu(history, path, domain, method = 'push') {
  if (!domain || LOCAL) {
    history[method](path);
  } else if (!path) {
    window.location = `${domain}`;
  } else {
    const reg = new RegExp(domain, 'g');
    if (reg.test(window.location.host)) {
      history[method](path);
    } else {
      window.location = `${domain}/#${path}`;
    }
  }
}

export function historyReplaceMenu(history, path, uri) {
  historyPushMenu(history, path, uri, 'replace');
}

export function getRandomBackground(id) {
  const index = id % 4;
  const valiable = [
    'linear-gradient(225deg,rgba(152,229,218,1) 0%,rgba(0,191,165,1) 100%)',
    'linear-gradient(226deg,rgba(255,212,163,1) 0%,rgba(255,185,106,1) 100%)',
    'linear-gradient(226deg,rgba(161,188,245,1) 0%,rgba(104,135,232,1) 100%)',
    'linear-gradient(226deg,rgba(255,177,185,1) 0%,rgba(244,133,144,1) 100%)',
  ];
  return valiable[index];
}

export function fileServer(path) {
  return url.resolve(FILE_SERVER, path || '');
}
