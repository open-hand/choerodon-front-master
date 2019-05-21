'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

exports['default'] = esModule;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var moduleDefaultExport = function moduleDefaultExport(module) {
  return module['default'] || module;
};

function esModule(module) {
  if ((0, _isArray3['default'])(module)) {
    return module.map(moduleDefaultExport);
  }
  return moduleDefaultExport(module);
}