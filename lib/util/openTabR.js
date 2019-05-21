'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MenuStore = require('../../stores/pro/MenuStore');

var _MenuStore2 = _interopRequireDefault(_MenuStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function openTabR(url, title, key) {
  if (!key) {
    _MenuStore2['default'].openTabR(url, title);
    return;
  }

  var type = 'REACT';
  var tabs = _MenuStore2['default'].tabs;

  var targetTabIndex = tabs.findIndex(function (tab) {
    return tab.url === key;
  });
  if (targetTabIndex !== -1) {
    _MenuStore2['default'].loadMenus().then(function (me) {
      _MenuStore2['default'].getPathById(url.slice(1), me, type, function (temppath, targetNode) {
        if (tabs.find(function (tab) {
          return tab.functionCode === targetNode.functionCode;
        })) {
          _MenuStore2['default'].openTabR(url, title);
        } else {
          tabs[targetTabIndex] = targetNode;
          _MenuStore2['default'].openTabR(url, title);
        }
      }, function () {
        var construct = {
          children: null,
          expand: false,
          functionCode: key,
          icon: null,
          id: -1,
          ischecked: null,
          score: -1,
          shortcutId: null,
          text: title,
          url: url.slice(1),
          symbol: type
        };
        tabs[targetTabIndex] = construct;
        _MenuStore2['default'].openTabR(url, title);
      });
    });
  }
  _MenuStore2['default'].openTabR(url, title);
}

exports['default'] = openTabR;