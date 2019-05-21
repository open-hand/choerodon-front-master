'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _common = require('@choerodon/boot/lib/containers/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Avatar = function (_Component) {
  (0, _inherits3['default'])(Avatar, _Component);

  function Avatar() {
    (0, _classCallCheck3['default'])(this, Avatar);
    return (0, _possibleConstructorReturn3['default'])(this, (Avatar.__proto__ || Object.getPrototypeOf(Avatar)).apply(this, arguments));
  }

  (0, _createClass3['default'])(Avatar, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          src = _props.src,
          children = _props.children,
          className = _props.className,
          style = _props.style,
          prefixCls = _props.prefixCls,
          props = (0, _objectWithoutProperties3['default'])(_props, ['src', 'children', 'className', 'style', 'prefixCls']);

      return _react2['default'].createElement(
        'div',
        (0, _extends3['default'])({
          className: (0, _classnames2['default'])(prefixCls + '-avatar', className),
          style: (0, _extends3['default'])({}, style, {
            backgroundImage: src && 'url(' + (0, _common.fileServer)(src) + ')'
          })
        }, props),
        !src && children
      );
    }
  }]);
  return Avatar;
}(_react.Component);

exports['default'] = Avatar;