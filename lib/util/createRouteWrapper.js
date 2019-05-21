'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

exports['default'] = createRouteWrapper;

require('choerodon-ui/lib/tabs/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TabPane = _tabs2['default'].TabPane;

var METADATA_PLACEHOLDER_STRING = 'hap-modeling/metadata';

function createRouteWrapper(keyString, cmp) {
  var maps = {};

  var RouterWrapper = function (_Component) {
    (0, _inherits3['default'])(RouterWrapper, _Component);

    function RouterWrapper() {
      (0, _classCallCheck3['default'])(this, RouterWrapper);
      return (0, _possibleConstructorReturn3['default'])(this, (RouterWrapper.__proto__ || Object.getPrototypeOf(RouterWrapper)).apply(this, arguments));
    }

    (0, _createClass3['default'])(RouterWrapper, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var MenuStore = this.props.MenuStore;
        var functionCode = MenuStore.activeMenu.functionCode,
            tabs = MenuStore.tabs;

        var currentTabs = void 0;
        if (keyString === METADATA_PLACEHOLDER_STRING) {
          currentTabs = tabs.filter(function (tab) {
            return tab.symbol === 'PAGE';
          });
        } else {
          currentTabs = tabs.filter(function (tab) {
            return tab.url && tab.url.startsWith(keyString);
          });
        }

        return _react2['default'].createElement(
          _tabs2['default'],
          { activeKey: functionCode, animated: false },
          currentTabs.map(function (tab) {
            return _react2['default'].createElement(
              TabPane,
              {
                tab: 'TAB_IFRAME',
                key: tab.functionCode,
                forceRender: false
              },
              _react2['default'].createElement(
                'div',
                { style: { width: '100%', height: 'calc(100vh - 88px)', overflow: 'hidden', position: 'relative' } },
                _react2['default'].createElement(cmp, { history: _this2.props.history })
              )
            );
          })
        );
      }
    }]);
    return RouterWrapper;
  }(_react.Component);

  if (!maps[keyString]) {
    maps[keyString] = (0, _mobxReact.inject)('MenuStore')((0, _mobxReact.observer)(RouterWrapper));
  }
  // return inject('MenuStore')(observer(RouterWrapper));
  return maps[keyString];
}