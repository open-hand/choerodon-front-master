'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

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

var _dec, _class;

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _findFirstLeafMenu2 = require('../util/findFirstLeafMenu');

var _findFirstLeafMenu3 = _interopRequireDefault(_findFirstLeafMenu2);

var _common = require('@choerodon/boot/lib/containers/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Setting = (_dec = (0, _mobxReact.inject)('AppState', 'MenuStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Setting, _Component);

  function Setting() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Setting);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Setting.__proto__ || Object.getPrototypeOf(Setting)).call.apply(_ref, [this].concat(args))), _this), _this.getGlobalMenuData = function () {
      var _this$props = _this.props,
          MenuStore = _this$props.MenuStore,
          history = _this$props.history;

      MenuStore.loadMenuData({ type: 'site' }, false).then(function (menus) {
        if (menus.length) {
          var _findFirstLeafMenu = (0, _findFirstLeafMenu3['default'])(menus[0]),
              route = _findFirstLeafMenu.route,
              domain = _findFirstLeafMenu.domain;

          (0, _common.historyPushMenu)(history, route, domain);
        }
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Setting, [{
    key: 'render',
    value: function render() {
      var AppState = this.props.AppState;

      var classString = (0, _classnames2['default'])({
        active: AppState.currentMenuType.type === 'site' && !AppState.isTypeUser
      });
      return _react2['default'].createElement(
        _button2['default'],
        { className: classString, onClick: this.getGlobalMenuData },
        (0, _common.getMessage)('管理', 'Manage'),
        _react2['default'].createElement(_icon2['default'], { className: 'manager-icon', type: 'settings ', style: { marginLeft: '5px' } })
      );
    }
  }]);
  return Setting;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = Setting;