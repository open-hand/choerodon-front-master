import { getCookie, removeCookie, setCookie } from './cookie';
import {
  ACCESS_TOKEN, TOKEN_TYPE,
} from './constants';

let cachedToken = null;

export function getCookieToken() {
  const option = {
    path: '/',
  };
  const token = getCookie(ACCESS_TOKEN, option);
  if (token && cachedToken && token !== cachedToken) {
    return null;
  }
  return token;
}

/**
 * 前端存储cookie token
 */
export function setAccessToken(token, tokenType, expiresIn) {
  const isHttps = window.location.protocol === 'https:';
  const option = {
    path: '/',

  };
  if (isHttps) {
    option.sameSite = 'none';
    option.secure = true;
  }
  if (expiresIn) {
    const expires = 30 * 24 * 60 * 60 * 1000;
    option.expires = new Date(Date.now() + expires);
  }
  setCookie(ACCESS_TOKEN, token, option);
  setCookie(TOKEN_TYPE, tokenType, option);
  cachedToken = token;
}

/**
 * 获取cookie token
 */
export function getAccessToken() {
  const option = {
    path: '/',
  };
  const accessToken = getCookieToken();
  const tokenType = getCookie(TOKEN_TYPE, option);
  if (accessToken && tokenType) {
    return `${tokenType} ${accessToken}`;
  }
  return null;
}

/**
 * 移除token
 */
export function removeAccessToken() {
  const option = {
    path: '/',
  };
  removeCookie(ACCESS_TOKEN, option);
  removeCookie(TOKEN_TYPE, option);
}
