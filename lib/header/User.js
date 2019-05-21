'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _popover = require('choerodon-ui/lib/popover');

var _popover2 = _interopRequireDefault(_popover);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _menu = require('choerodon-ui/lib/menu');

var _menu2 = _interopRequireDefault(_menu);

var _dec, _class;

require('choerodon-ui/lib/popover/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/menu/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _findFirstLeafMenu2 = require('../util/findFirstLeafMenu');

var _findFirstLeafMenu3 = _interopRequireDefault(_findFirstLeafMenu2);

var _common = require('@choerodon/boot/lib/containers/common');

var _constants = require('@choerodon/boot/lib/containers/common/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MenuItem = _menu2['default'].Item;
var prefixCls = _constants.PREFIX_CLS + '-boot-header-user';
var blackList = new Set(['choerodon.code.usercenter.receive-setting']);

var UserPreferences = (_dec = (0, _mobxReact.inject)('AppState', 'MenuStore', 'HeaderStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(UserPreferences, _Component);

  function UserPreferences() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, UserPreferences);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = UserPreferences.__proto__ || Object.getPrototypeOf(UserPreferences)).call.apply(_ref, [this].concat(args))), _this), _this.preferences = function () {
      var _this$props = _this.props,
          MenuStore = _this$props.MenuStore,
          history = _this$props.history,
          HeaderStore = _this$props.HeaderStore;

      MenuStore.loadMenuData({ type: 'site' }, true).then(function (menus) {
        if (menus.length) {
          var _findFirstLeafMenu = (0, _findFirstLeafMenu3['default'])(menus[0]),
              route = _findFirstLeafMenu.route,
              domain = _findFirstLeafMenu.domain;

          (0, _common.historyPushMenu)(history, route + '?type=site', domain);
        }
      });
      HeaderStore.setUserPreferenceVisible(false);
    }, _this.handleVisibleChange = function (visible) {
      _this.props.HeaderStore.setUserPreferenceVisible(visible);
    }, _this.handleMenuItemClick = function (_ref2) {
      var key = _ref2.key;
      var history = _this.props.history;

      history.push(key + '?type=site');
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(UserPreferences, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          history = _props.history,
          MenuStore = _props.MenuStore;

      if (window.location.href.split('#')[1].split('&')[1] === 'token_type=bearer') {
        history.push('/');
      }
      MenuStore.loadMenuData({ type: 'site' }, true);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          AppState = _props2.AppState,
          HeaderStore = _props2.HeaderStore,
          MenuStore = _props2.MenuStore;

      var _ref3 = AppState.getUserInfo || {},
          imageUrl = _ref3.imageUrl,
          loginName = _ref3.loginName,
          realName = _ref3.realName,
          email = _ref3.email;

      var realData = MenuStore.menuGroup && MenuStore.menuGroup.user.slice()[0] && MenuStore.menuGroup.user.slice()[0].subMenus.filter(function (item) {
        return !blackList.has(item.code);
      });
      var AppBarIconRight = _react2['default'].createElement(
        'div',
        { className: prefixCls + '-popover-content' },
        _react2['default'].createElement(
          _Avatar2['default'],
          { src: imageUrl, prefixCls: prefixCls, onClick: function onClick() {
              window.location = '/#/iam/user-info?type=site';
            } },
          realName && realName.charAt(0)
        ),
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-popover-title' },
          _react2['default'].createElement(
            'span',
            null,
            realName
          ),
          _react2['default'].createElement(
            'span',
            null,
            email
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-popover-menu' },
          _react2['default'].createElement(
            _menu2['default'],
            { selectedKeys: [-1], onClick: this.handleMenuItemClick },
            realData && realData.map(function (item) {
              return _react2['default'].createElement(
                MenuItem,
                { className: prefixCls + '-popover-menu-item', key: item.route },
                _react2['default'].createElement(_icon2['default'], { type: item.icon }),
                item.name
              );
            })
          )
        ),
        _react2['default'].createElement('div', { className: 'divider' }),
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-popover-logout' },
          _react2['default'].createElement(
            'li',
            {
              onClick: function onClick() {
                return (0, _common.logout)();
              }
            },
            _react2['default'].createElement(_icon2['default'], { type: 'exit_to_app' }),
            (0, _common.getMessage)('退出登录', 'sign Out')
          )
        )
      );
      return _react2['default'].createElement(
        _popover2['default'],
        {
          overlayClassName: prefixCls + '-popover',
          content: AppBarIconRight,
          trigger: 'click',
          visible: HeaderStore.userPreferenceVisible,
          placement: 'bottomRight',
          onVisibleChange: this.handleVisibleChange
        },
        _react2['default'].createElement(
          _Avatar2['default'],
          { src: imageUrl, prefixCls: prefixCls },
          realName && realName.charAt(0)
        )
      );
    }
  }]);
  return UserPreferences;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = UserPreferences;