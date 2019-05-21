'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports['default'] = updateIntl;

var _AppState = require('../../stores/pro/AppState');

var _AppState2 = _interopRequireDefault(_AppState);

var _IntlManager = require('../pro/masterPro/IntlManager');

var _IntlManager2 = _interopRequireDefault(_IntlManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function updateIntl(mutationsRows) {
  if (!mutationsRows.length) {
    return;
  }

  var intlManager = (0, _IntlManager2['default'])();

  mutationsRows.forEach(function (row) {
    var __status = row.__status,
        promptCode = row.promptCode,
        description = row.description;

    if (__status === 'add' || __status === 'update') {
      intlManager.add((0, _defineProperty3['default'])({}, promptCode, description));
    } else if (__status === 'delete') {
      intlManager['delete'](promptCode);
    }
  });
}