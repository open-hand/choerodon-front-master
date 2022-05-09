/* eslint-disable no-underscore-dangle */
function get(valueName, defaultValue) {
  if (window._env_ && window._env_[valueName]) {
    return window._env_[valueName];
  }
  if (defaultValue) {
    return defaultValue;
  }
  return undefined;
}

export const LOCAL = JSON.parse(get('LOCAL', process.env.LOCAL) || 'true');
export const CLIENT_ID = get('CLIENT_ID', process.env.CLIENT_ID);
export const API_HOST = get('API_HOST', process.env.API_HOST);
export const COOKIE_SERVER = get('COOKIE_SERVER', process.env.COOKIE_SERVER);
export const FILE_SERVER = get('FILE_SERVER', `${process.env.FILE_SERVER}`);
export const WEBSOCKET_SERVER = get('WEBSOCKET_SERVER', `${process.env.WEBSOCKET_SERVER}`);
export const APIM_GATEWAY = get('APIM_GATEWAY', process.env.APIM_GATEWAY);
export const EMAIL_BLOCK_LIST = get('EMAIL_BLACK_LIST', process.env.EMAIL_BLACK_LIST);
export const HEADER_TITLE_NAME = `${get('HEADER_TITLE_NAME', process.env.HEADER_TITLE_NAME) || get('TITLE_NAME', process.env.TITLE_NAME) || 'Choerodon'}`;

export const PREFIX_CLS = 'c7n';
export const ACCESS_TOKEN = 'access_token';
export const TOKEN_TYPE = 'token_type';
export const ACCESS_DOMAIN = 'domain';
export const STRING_DEVIDER = '__@.@__';
export const NODE_ENV = `${process.env.NODE_ENV}`;
export const AUTH_HOST = `${API_HOST}/oauth`;
export const AUTH_URL = `${true ? `${API_HOST}/oauth/oauth/authorize?response_type=token&client_id=${CLIENT_ID}&state=` : `${AUTH_HOST}/login`}`;
export const USE_DASHBOARD = JSON.parse(process.env.USE_DASHBOARD || 'false');
export const USE_GUIDE = JSON.parse(process.env.USE_GUIDE || 'false');
export const MENU_THEME = `${process.env.MENU_THEME || 'light'}`;
export const SERVICES_CONFIG = `${process.env.SERVICES_CONFIG}`;
export const TYPE = `${process.env.TYPE}`;
export const RESOURCES_LEVEL = `${process.env.RESOURCES_LEVEL || ''}`;
export const OUTWARD = `${process.env.OUTWARD || 'undefined'}`;
export const EXTERNAL_LINK = get('EXTERNAL_LINK', process.env.EXTERNAL_LINK);
export const SAAS_FEEDBACK = get('SAAS_FEEDBACK', process.env.SAAS_FEEDBACK);
// 不需要设置的历史路径 为了避免登录后 重定向到这个地址
export const NO_NEED_HISTORYPATH = ['access_token', 'unauthorized', 'invite-user', 'register-saas', 'register-organization', 'dingTalkTransition'];
