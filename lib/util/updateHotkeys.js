'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = updateHotkeys;

var _AppState = require('../../stores/pro/AppState');

var _AppState2 = _interopRequireDefault(_AppState);

var _HotkeyManager = require('../pro/masterPro/HotkeyManager');

var _HotkeyManager2 = _interopRequireDefault(_HotkeyManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function updateHotkeys(mutationsRows) {
  if (!mutationsRows.length) {
    return;
  }

  var isChange = false;
  var hotkeyManager = (0, _HotkeyManager2['default'])();
  var dictionary = hotkeyManager.dictionary;


  mutationsRows.forEach(function (row) {
    var __status = row.__status,
        hotkeyId = row.hotkeyId,
        description = row.description;

    if (__status === 'add') {
      dictionary.push(row);
      isChange = true;
    } else if (__status === 'update') {
      var index = dictionary.findIndex(function (hotkey) {
        return hotkey.hotkeyId === hotkeyId;
      });
      if (index !== -1) {
        dictionary[index] = row;
        isChange = true;
      }
    } else if (__status === 'delete') {
      var _index = dictionary.findIndex(function (hotkey) {
        return hotkey.hotkeyId === hotkeyId;
      });
      if (_index !== -1) {
        dictionary.splice(_index, 1);
        isChange = true;
      }
    }
  });

  if (isChange) {
    // localeContext.setSupports(locales);
  }
}