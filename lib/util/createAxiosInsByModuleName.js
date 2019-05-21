'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _authorize = require('../../common/authorize');

var _accessToken = require('../../common/accessToken');

var _constants = require('../../common/constants');

var _sessionExpiredLogin = require('../../common/sessionExpiredLogin');

var _sessionExpiredLogin2 = _interopRequireDefault(_sessionExpiredLogin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MODULE_SERVER_LINK_MAP = _constants.SERVICES_CONFIG === '' ? [] : JSON.parse(_constants.SERVICES_CONFIG);
var AXIOS_INSTANCE_MAP = {};
var SINGLE_APP_SERVER = 'SINGLE_APP_SERVER';

function getServerByModule(moduleName) {
  var server = SINGLE_APP_SERVER;
  for (var i = 0; i < MODULE_SERVER_LINK_MAP.length; i += 1) {
    var modules = (0, _get2['default'])(MODULE_SERVER_LINK_MAP, [i, 'services', 'modules']);
    if (Array.isArray(modules) && modules.includes(moduleName)) {
      server = (0, _get2['default'])(MODULE_SERVER_LINK_MAP, [i, 'services', 'name']);
      break;
    }
  }
  return server;
}

function getNearsetServer(module, server, targetModule) {
  var serviceObj = MODULE_SERVER_LINK_MAP.find(function (s) {
    return s.services.name === server;
  });
  if (serviceObj && Array.isArray(serviceObj.modules) && serviceObj.modules.includes(targetModule)) {
    return server;
  }
  return getServerByModule(targetModule);
}

function getKeyByModuleAndServer(module, server) {
  return 'KEY:' + server;
}

function getPrefixByServer(server) {
  var services = MODULE_SERVER_LINK_MAP.find(function (service) {
    return service.services.name === server;
  });
  if (services) {
    return services.services.prefix;
  }
}

function createAxiosInstance(module, server) {
  var prefix = getPrefixByServer(server);
  var instance = _axios2['default'].create({
    timeout: 30000,
    baseURL: prefix && server !== SINGLE_APP_SERVER ? _constants.API_HOST + '/' + prefix : _constants.API_HOST
  });

  var CSRF_TOKEN = void 0;

  instance.interceptors.request.use(function (config) {
    var newConfig = config;
    newConfig.headers['Content-Type'] = 'application/json';
    newConfig.headers['X-Requested-With'] = 'XMLHttpRequest';
    newConfig.headers.Accept = 'application/json';
    if (CSRF_TOKEN) {
      newConfig.headers['x-csrf-token'] = CSRF_TOKEN;
    }
    var accessToken = (0, _accessToken.getAccessToken)();
    if (accessToken) {
      newConfig.headers.Authorization = accessToken;
    }
    return newConfig;
  }, function (err) {
    var error = err;
    return Promise.reject(error);
  });

  instance.interceptors.response.use(function (response) {
    var status = response.status,
        headers = response.headers;

    if (!CSRF_TOKEN && headers['x-csrf-token']) {
      CSRF_TOKEN = headers['x-csrf-token'];
    }
    if (status === 200 && response.request.responseURL && response.request.responseURL.endsWith('login')) {
      (0, _authorize.authorize)();
      return Promise.reject(new Error('need login'));
    }
    if (status === 200 && response.data && !response.data.success && response.data.code === 'sys_session_timeout') {
      // 弹窗警告登录失效
      (0, _sessionExpiredLogin2['default'])();
    }
    if (status === 204) {
      return response;
    }
    return response.data;
  }, function (error) {
    var response = error.response;

    if (response) {
      var status = response.status;

      switch (status) {
        case 401:
          {
            (0, _accessToken.removeAccessToken)();
            (0, _authorize.authorize)();
            break;
          }
        default:
          break;
      }
    }
    throw error;
  });

  return instance;
}

function getAxiosInstance(module, server) {
  var moduleServerKey = getKeyByModuleAndServer(module, server);
  if (AXIOS_INSTANCE_MAP[moduleServerKey]) {
    return AXIOS_INSTANCE_MAP[moduleServerKey];
  }
  var instance = createAxiosInstance(module, server);
  AXIOS_INSTANCE_MAP[moduleServerKey] = instance;
  return instance;
}

function getAxios(module) {
  var server = getServerByModule(module);
  // eslint-disable-next-line func-names
  return function () {
    var targetModule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var finalModule = targetModule || module;
    var finalServer = void 0;
    if (!targetModule) {
      finalServer = server;
    } else {
      finalServer = getNearsetServer(module, server, targetModule);
    }
    var axiosInstance = getAxiosInstance(finalModule, finalServer);
    return axiosInstance;
  };
}

exports['default'] = getAxios;