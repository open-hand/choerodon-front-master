'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

require('choerodon-ui/lib/button/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require('@choerodon/boot/lib/containers/common/constants');

var _common = require('@choerodon/boot/lib/containers/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var prefixCls = _constants.PREFIX_CLS + '-boot-header-logo';

var Logo = (_dec = (0, _mobxReact.inject)('AppState', 'MenuStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Logo, _Component);

  function Logo() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Logo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Logo.__proto__ || Object.getPrototypeOf(Logo)).call.apply(_ref, [this].concat(args))), _this), _this.handleMenuClick = function () {
      var AppState = _this.props.AppState;

      AppState.setMenuExpanded(!AppState.getMenuExpanded);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Logo, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          AppState = _props.AppState,
          MenuStore = _props.MenuStore,
          location = _props.location;
      var pathname = location.pathname,
          search = location.search;
      var _AppState$getSiteInfo = AppState.getSiteInfo,
          systemLogo = _AppState$getSiteInfo.systemLogo,
          systemName = _AppState$getSiteInfo.systemName;

      var menus = MenuStore.getMenuData;
      var homePath = '/';
      if (_common.dashboard) {
        var _AppState$currentMenu = AppState.currentMenuType,
            type = _AppState$currentMenu.type,
            id = _AppState$currentMenu.id,
            name = _AppState$currentMenu.name,
            organizationId = _AppState$currentMenu.organizationId;

        if (type && type !== 'site') {
          homePath = homePath + '?type=' + type + '&id=' + id + '&name=' + name;
          if (organizationId) {
            homePath += '&organizationId=' + organizationId;
          }
        }
      }
      return _react2['default'].createElement(
        'div',
        { className: prefixCls + '-wrap' },
        menus.length ? _react2['default'].createElement(_button2['default'], { shape: 'circle', icon: 'menu', className: prefixCls + '-menu-icon', onClick: this.handleMenuClick }) : _react2['default'].createElement('div', { className: (0, _classnames2['default'])(prefixCls + '-icon', systemLogo ? null : prefixCls + '-default-icon'), style: { backgroundImage: systemLogo ? 'url(' + systemLogo + ')' : null } }),
        pathname === '/' && !search ? _react2['default'].createElement(
          'div',
          { className: (0, _classnames2['default'])('' + prefixCls, systemName ? null : prefixCls + '-default-logo') },
          systemName
        ) : _react2['default'].createElement(
          _reactRouterDom.Link,
          { to: homePath, className: (0, _classnames2['default'])('' + prefixCls, systemName ? null : prefixCls + '-default-logo'), style: { textDecoration: 'none' } },
          systemName
        )
      );
    }
  }]);
  return Logo;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = Logo;