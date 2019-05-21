'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

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

require('choerodon-ui/lib/icon/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _mobxReact = require('mobx-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var GuideItem = (_dec = (0, _mobxReact.inject)('GuideStore'), _dec(_class = (0, _reactIntl.injectIntl)(_class = function (_Component) {
  (0, _inherits3['default'])(GuideItem, _Component);

  function GuideItem() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, GuideItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = GuideItem.__proto__ || Object.getPrototypeOf(GuideItem)).call.apply(_ref, [this].concat(args))), _this), _this.handleGuideClick = function (guideComponent) {
      _this.props.GuideStore.setCurrentGuideComponent(guideComponent);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(GuideItem, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          intl = _props.intl,
          data = _props.data;

      var prefix = data.replace('/', '.').toLowerCase();
      return _react2['default'].createElement(
        'li',
        { key: intl.formatMessage({ id: 'guide.' + prefix + '.title' }) },
        _react2['default'].createElement(
          'div',
          { className: 'c7n-boot-guide-item', onClick: function onClick() {
              return _this2.handleGuideClick(data);
            } },
          _react2['default'].createElement(_icon2['default'], { type: intl.formatMessage({ id: 'guide.' + prefix + '.icon' }), style: { fontSize: '24px', color: 'rgba(0,0,0,0.65)' } }),
          _react2['default'].createElement(
            'h4',
            null,
            intl.formatMessage({ id: 'guide.' + prefix + '.title' })
          ),
          _react2['default'].createElement(
            'p',
            null,
            intl.formatMessage({ id: 'guide.' + prefix + '.description' })
          )
        ),
        _react2['default'].createElement('div', { className: 'c7n-boot-guide-line' })
      );
    }
  }]);
  return GuideItem;
}(_react.Component)) || _class) || _class);
exports['default'] = GuideItem;