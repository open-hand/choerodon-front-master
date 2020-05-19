import { message } from 'choerodon-ui/pro';
import url from 'url';
import { prompt, handleResponseError, warning } from '@/utils';
import { authorize, logout, authorizeC7n, logoutC7n } from './authorize';
import { getAccessToken, removeAccessToken, setAccessToken } from './accessToken';
import { getCookie, removeCookie, setCookie } from './cookie';
import { ACCESS_TOKEN, AUTH_URL, FILE_SERVER, LOCAL, USE_DASHBOARD, WEBSOCKET_SERVER, USE_GUIDE, STRING_DEVIDER, API_HOST } from './constants';
import { getMessage, intl } from './intl';
import checkPassword from './checkPassword';
// 生成指定长度的随机字符串
function randomString(len = 32) {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  for (let i = 0; i < len; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
  }
  return code;
}

function historyPushMenu(history, path, domain, method = 'push') {
  method = 'push';
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

function historyReplaceMenu(history, path, uri) {
  historyPushMenu(history, path, uri, 'replace');
}

function fileServer(path) {
  return url.resolve(FILE_SERVER, path || '');
}

export default {
  ACCESS_TOKEN,
  AUTH_URL,
  API_HOST,
  FILE_SERVER,
  WEBSOCKET_SERVER,
  STRING_DEVIDER,
  fileServer,
  setCookie,
  getCookie,
  removeCookie,
  setAccessToken,
  getAccessToken,
  removeAccessToken,
  intl,
  getMessage,
  logout,
  prompt,
  checkPassword,
  handleResponseError,
  randomString,
  historyPushMenu,
  historyReplaceMenu,
  authorize,
  warning,
  authorizeC7n,
  logoutC7n,
};
