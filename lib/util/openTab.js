'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MenuStore = require('../../stores/pro/MenuStore');

var _MenuStore2 = _interopRequireDefault(_MenuStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function openTab(id, title, url, closeIcon) {
  _MenuStore2['default'].openTab(id, title, url, closeIcon);
}

window.openTab = openTab;

exports['default'] = openTab;