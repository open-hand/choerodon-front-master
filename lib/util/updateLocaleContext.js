'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _localeContext2 = require('choerodon-ui/pro/lib/locale-context');

var _localeContext3 = _interopRequireDefault(_localeContext2);

exports['default'] = updateLocalContext;

require('choerodon-ui/pro/lib/locale-context/style');

var _AppState = require('../../stores/pro/AppState');

var _AppState2 = _interopRequireDefault(_AppState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// function addFunc(locales, langCode, description, changeSign) {
//   locales[langCode] = description;
//   changeSign();
// }

// function deleteFunc(locales, langCode, description, changeSign) {
//   if (locales[langCode]) {
//     delete locales[langCode];
//     changeSign();
//   }
// }

// function updateFunc(locales, langCode, description, changeSign) {
//   locales[langCode] = description;
//   changeSign();
// }

function updateLocalContext(mutationsRows) {
  if (!mutationsRows.length) {
    return;
  }

  var isChange = false;
  var locales = _localeContext3['default'].supports;

  mutationsRows.forEach(function (row) {
    var __status = row.__status,
        langCode = row.langCode,
        description = row.description;
    // [`${__status}Func`](locales, langCode, description, () => { isChange = true; });

    if (__status === 'add') {
      locales[langCode] = description;
      isChange = true;
    } else if (__status === 'update') {
      locales[langCode] = description;
      isChange = true;
    } else if (__status === 'delete') {
      if (locales[langCode]) {
        delete locales[langCode];
        isChange = true;
      }
    }
  });

  _AppState2['default'].setLocales(locales);

  if (isChange) {
    _localeContext3['default'].setSupports(locales);
  }
}