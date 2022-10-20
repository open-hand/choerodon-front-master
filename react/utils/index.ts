import url from 'url';
import type { History } from 'history';
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
type FilterNull<T, K extends keyof T = keyof T> = K extends string ? { code: T[K] extends true ? K : never } : never;
type KeyofFunction<T> = FilterNull<{ [K in keyof T]: T[K] extends (...args: any) => any ? true : null }>['code'];
/**
 * 不稳定的push方法
 * //TODO: 需要对此方法进行修正 加强类型校验
 * 各个参数的类型都不准确,调用时可能会得到意想不到的结果
 *
 * @param history
 * @param path
 * @param domain
 * @param method 未做更准确的参数类型匹配去调用 history执行方法
 */
export function historyPushMenu(history: History, path: string, domain?: string | null | RegExp, method: KeyofFunction<History> = 'push') {
  if (!domain || LOCAL) {
    history[method](path as any);
  } else if (!path) {
    window.location = `${domain}` as any;
  } else {
    const reg = new RegExp(domain, 'g');
    if (reg.test(window.location.host)) {
      history[method](path as any);
    } else {
      window.location = `${domain}/#${path}` as any;
    }
  }
}

export function historyReplaceMenu(history: History, path: string, uri: any) {
  historyPushMenu(history, path, uri, 'replace');
}

export function getRandomBackground(id: number | string) {
  // TODO:  此处未做更细致的处理
  const index = (id as number) % 4;
  const valiable = [
    'linear-gradient(225deg,rgba(152,229,218,1) 0%,rgba(0,191,165,1) 100%)',
    'linear-gradient(226deg,rgba(255,212,163,1) 0%,rgba(255,185,106,1) 100%)',
    'linear-gradient(226deg,rgba(161,188,245,1) 0%,rgba(104,135,232,1) 100%)',
    'linear-gradient(226deg,rgba(255,177,185,1) 0%,rgba(244,133,144,1) 100%)',
  ];
  return valiable[index];
}

export function fileServer(path?: string) {
  return url.resolve(FILE_SERVER, path || '');
}
