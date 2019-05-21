'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AsyncModuleWrapper = function (_Component) {
  (0, _inherits3['default'])(AsyncModuleWrapper, _Component);

  function AsyncModuleWrapper() {
    (0, _classCallCheck3['default'])(this, AsyncModuleWrapper);
    return (0, _possibleConstructorReturn3['default'])(this, (AsyncModuleWrapper.__proto__ || Object.getPrototypeOf(AsyncModuleWrapper)).apply(this, arguments));
  }

  (0, _createClass3['default'])(AsyncModuleWrapper, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.shouldUpdate || false;
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);
  return AsyncModuleWrapper;
}(_react.Component);

exports['default'] = AsyncModuleWrapper;