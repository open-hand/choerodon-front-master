'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _message2 = require('choerodon-ui/pro/lib/message');

var _message3 = _interopRequireDefault(_message2);

require('choerodon-ui/pro/lib/message/style');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var successHandle = function successHandle(mgs, title, opts) {
  _message3['default'].success(mgs);
};

var infoHandle = function infoHandle(mgs, title, opts) {
  _message3['default'].info(mgs);
};

var warningHandle = function warningHandle(mgs, title, opts) {
  _message3['default'].warning(mgs);
};

var errorHandle = function errorHandle(mgs, title, opts) {
  _message3['default'].error(mgs);
};

var handle = function handle(msg, title, opts) {
  _message3['default'].config({
    top: 50,
    bottom: 50,
    duration: 2
  });
  _message3['default'][opts.type](msg, undefined, undefined, 'rightBottom');
};

var toastr = {
  success: handle,
  info: handle,
  warning: handle,
  error: handle
};

window.toastr = toastr;

exports['default'] = toastr;