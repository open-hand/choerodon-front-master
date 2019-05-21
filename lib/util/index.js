'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyReplaceMenu = exports.historyPushMenu = undefined;

var _message2 = require('choerodon-ui/pro/lib/message');

var _message3 = _interopRequireDefault(_message2);

require('choerodon-ui/pro/lib/message/style');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// 提示错误信息
function prompt(content) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
  var duration = arguments[2];
  var placement = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'leftBottom';
  var onClose = arguments[4];

  var messageType = ['success', 'error', 'info', 'warning', 'warn', 'loading'];
  if (messageType.indexOf(type) !== -1) {
    _message3['default'][type](content, duration, onClose, placement);
  }
}

// 处理错误相应
function handleResponseError(error) {
  var response = error.response;

  if (response) {
    var status = response.status;

    switch (status) {
      case 400:
        {
          var mess = response.data.message;
          _message3['default'].error(mess);
          break;
        }
      default:
        break;
    }
  }
}

// 生成指定长度的随机字符串
function randomString() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;

  var code = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var maxPos = chars.length;
  for (var i = 0; i < len; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
  }
  return code;
}

function historyPushMenu(history, path, domain) {
  var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'push';

  method = 'push';
  if (!domain || LOCAL) {
    history[method](path);
  } else if (!path) {
    window.location = '' + domain;
  } else {
    var reg = new RegExp(domain, 'g');
    if (reg.test(window.location.host)) {
      history[method](path);
    } else {
      window.location = domain + '/#' + path;
    }
  }
}

function historyReplaceMenu(history, path, uri) {
  historyPushMenu(history, path, uri, 'replace');
}

function fileServer(path) {
  return _url2['default'].resolve(FILE_SERVER, path || '');
}

exports.historyPushMenu = historyPushMenu;
exports.historyReplaceMenu = historyReplaceMenu;