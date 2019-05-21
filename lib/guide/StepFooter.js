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

var _dec, _class, _class2, _temp2;

require('choerodon-ui/lib/button/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./style/index.scss');

var _mobxReact = require('mobx-react');

var _reactIntl = require('react-intl');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var StepFooter = (_dec = (0, _mobxReact.inject)('GuideStore'), _dec(_class = (0, _reactIntl.injectIntl)(_class = (0, _mobxReact.observer)(_class = (_temp2 = _class2 = function (_Component) {
  (0, _inherits3['default'])(StepFooter, _Component);

  function StepFooter() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, StepFooter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = StepFooter.__proto__ || Object.getPrototypeOf(StepFooter)).call.apply(_ref, [this].concat(args))), _this), _this.handleNextClick = function () {
      var _this$props = _this.props,
          GuideStore = _this$props.GuideStore,
          total = _this$props.total;

      if (GuideStore.getCurrentStep < total) GuideStore.addCurrentStep();else {
        GuideStore.setCurrentGuideComponent(false);
        GuideStore.setCurrentStep(0);
      }
    }, _this.handleBackClick = function () {
      var GuideStore = _this.props.GuideStore;

      if (GuideStore.getCurrentStep === 0) GuideStore.setCurrentGuideComponent(false);else GuideStore.setCurrentStep(GuideStore.getCurrentStep - 1);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(StepFooter, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          GuideStore = _props.GuideStore,
          total = _props.total;

      return _react2['default'].createElement(
        'div',
        { className: 'c7n-boot-guide-step-footer' },
        _react2['default'].createElement(
          _button2['default'],
          { funcType: 'raised', onClick: function onClick() {
              return _this2.handleBackClick();
            } },
          '\u8FD4\u56DE'
        ),
        _react2['default'].createElement(
          _button2['default'],
          { type: 'primary', funcType: 'raised', style: { float: 'right' }, onClick: function onClick() {
              return _this2.handleNextClick();
            } },
          GuideStore.getCurrentStep < total ? '继续' : '所有教程'
        )
      );
    }
  }]);
  return StepFooter;
}(_react.Component), _class2.propTypes = {
  total: _propTypes2['default'].number
}, _temp2)) || _class) || _class) || _class);
exports['default'] = StepFooter;