'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

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


require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/spin/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _asyncRouteOld = require('../util/asyncRouteOld');

var _asyncRouteOld2 = _interopRequireDefault(_asyncRouteOld);

var _GuidePanel = require('./GuidePanel');

var _GuidePanel2 = _interopRequireDefault(_GuidePanel);

var _GuideItem = require('./GuideItem');

var _GuideItem2 = _interopRequireDefault(_GuideItem);

require('./style');

var _warning = require('@choerodon/boot/lib/common/warning');

var _warning2 = _interopRequireDefault(_warning);

var _asyncLocaleProvider = require('@choerodon/boot/lib/containers/components/util/asyncLocaleProvider');

var _asyncLocaleProvider2 = _interopRequireDefault(_asyncLocaleProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Guide = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore', 'GuideStore'), _dec(_class = (0, _reactIntl.injectIntl)(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Guide, _Component);

  function Guide() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Guide);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Guide.__proto__ || Object.getPrototypeOf(Guide)).call.apply(_ref, [this].concat(args))), _this), _this.renderItem = function (data) {
      var _this$props = _this.props,
          guideLocale = _this$props.guide.guideLocale,
          AppState = _this$props.AppState,
          GuideStore = _this$props.GuideStore;
      // const localKey = Object.keys(guideLocale)[0];

      var localKey = data.substring(0, data.indexOf('/')).concat('/zh_CN');
      var getMessage = guideLocale[localKey];
      var language = AppState.currentLanguage;
      var IntlProviderAsync = (0, _asyncLocaleProvider2['default'])(language, getMessage);
      return _react2['default'].createElement(
        IntlProviderAsync,
        { key: '' + data },
        _react2['default'].createElement(_GuideItem2['default'], { data: data })
      );
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Guide, [{
    key: 'renderGuideStep',
    value: function renderGuideStep(current) {
      var _props = this.props,
          _props$guide = _props.guide,
          guideComponents = _props$guide.guideComponents,
          guideLocale = _props$guide.guideLocale,
          AppState = _props.AppState,
          GuideStore = _props.GuideStore;

      var guideComponent = (0, _asyncRouteOld2['default'])(guideComponents[current], null, null, function () {
        GuideStore.setLoading(current);
      });
      (0, _warning2['default'])(current in guideComponents, 'Guide Component<' + current + '> is missing.');
      var locale = current.substring(0, current.indexOf('/')).concat('/zh_CN');
      return _react2['default'].createElement(
        _spin2['default'],
        { spinning: AppState.getGuideExpanded && GuideStore.getLoading.get(current) !== false },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-boot-guide-step', style: { display: !AppState.getGuideExpanded ? 'none' : 'block', width: '300px' } },
          _react2['default'].createElement(_GuidePanel2['default'], { component: guideComponent, locale: guideLocale[locale], current: current })
        )
      );
    }
  }, {
    key: 'renderFooter',
    value: function renderFooter() {
      var _props2 = this.props,
          AppState = _props2.AppState,
          GuideStore = _props2.GuideStore;

      return _react2['default'].createElement(
        'div',
        {
          className: 'c7n-boot-guide-footer',
          onClick: function onClick() {
            AppState.setGuideExpanded(false);
            GuideStore.setCurrentGuideComponent(false);
            GuideStore.setCurrentStep(0);
          },
          style: { display: AppState.getGuideExpanded ? null : 'none' }
        },
        _react2['default'].createElement('div', { className: 'c7n-boot-guide-line' }),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-boot-guide-close' },
          _react2['default'].createElement(_icon2['default'], { type: 'close' }),
          ' \u5173\u95ED\u6559\u7A0B'
        )
      );
    }
  }, {
    key: 'renderGuideIndex',
    value: function renderGuideIndex() {
      var _this2 = this;

      var _props3 = this.props,
          guideComponents = _props3.guide.guideComponents,
          AppState = _props3.AppState;


      return _react2['default'].createElement(
        'div',
        { className: 'c7n-boot-guide-overflow', style: { display: !AppState.getGuideExpanded ? 'none' : 'block', width: '280px' } },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-boot-guide-title' },
          _react2['default'].createElement(
            'h2',
            null,
            '\u5F00\u59CB\u5B66\u4E60\u6559\u7A0B'
          ),
          _react2['default'].createElement(
            'p',
            null,
            '\u901A\u8FC7\u6559\u7A0B\u4E86\u89E3Choerodon\u4EA7\u54C1\u548C\u670D\u52A1'
          ),
          _react2['default'].createElement('div', { className: 'c7n-boot-guide-line' })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'c7n-boot-guide-content' },
          _react2['default'].createElement(
            'ul',
            null,
            Object.keys(guideComponents).map(function (value) {
              return _this2.renderItem(value);
            })
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          AppState = _props4.AppState,
          GuideStore = _props4.GuideStore;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-boot-guide', style: { width: AppState.getGuideExpanded ? '300px' : '0px' } },
        GuideStore.getCurrentGuideComponent ? this.renderGuideStep(GuideStore.getCurrentGuideComponent) : this.renderGuideIndex(),
        this.renderFooter()
      );
    }
  }]);
  return Guide;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = Guide;