'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _IntlManager = require('../pro/masterPro/IntlManager');

var _IntlManager2 = _interopRequireDefault(_IntlManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function $l(code) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var intlManager = (0, _IntlManager2['default'])();
  return intlManager.get(code) || defaultValue || code;
}

exports['default'] = $l;