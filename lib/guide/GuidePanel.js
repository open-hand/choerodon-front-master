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

var _dec, _class;
// import asyncLocaleProvider from '../../util/asyncLocaleProvider';


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _GuideProvider = require('./GuideProvider');

var _GuideProvider2 = _interopRequireDefault(_GuideProvider);

var _asyncLocaleProvider = require('@choerodon/boot/lib/containers/components/util/asyncLocaleProvider');

var _asyncLocaleProvider2 = _interopRequireDefault(_asyncLocaleProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var localKeyReg = /.+\\/;

var GuidePanel = (_dec = (0, _mobxReact.inject)('AppState', 'GuideStore'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(GuidePanel, _Component);

  function GuidePanel() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, GuidePanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = GuidePanel.__proto__ || Object.getPrototypeOf(GuidePanel)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(GuidePanel, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          prefixCls = _props.prefixCls,
          children = _props.children,
          component = _props.component,
          locale = _props.locale,
          AppState = _props.AppState,
          current = _props.current,
          GuideStore = _props.GuideStore;

      var language = AppState.currentLanguage;
      var IntlProviderAsync = (0, _asyncLocaleProvider2['default'])(language, locale);

      return _react2['default'].createElement(
        IntlProviderAsync,
        { key: '' + component.name },
        _react2['default'].createElement(
          'section',
          null,
          _react2['default'].createElement(
            'div',
            { className: 'c7n-boot-guide-placeholder' },
            _react2['default'].createElement(
              _GuideProvider2['default'],
              null,
              function (toolbar) {
                return component && (0, _react.createElement)(component);
              }
            )
          )
        )
      );
    }
  }]);
  return GuidePanel;
}(_react.Component)) || _class) || _class);
exports['default'] = GuidePanel;