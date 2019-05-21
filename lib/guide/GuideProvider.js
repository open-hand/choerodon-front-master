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

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var GuideProvider = (_temp2 = _class = function (_Component) {
  (0, _inherits3['default'])(GuideProvider, _Component);

  function GuideProvider() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, GuideProvider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = GuideProvider.__proto__ || Object.getPrototypeOf(GuideProvider)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      toolbar: null
    }, _this.renderToolBar = function (toolbar) {
      _this.setState({
        toolbar: toolbar
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(GuideProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        render: this.renderToolBar
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;
      var toolbar = this.state.toolbar;

      if (typeof children === 'function') {
        return children(toolbar);
      } else {
        return children;
      }
    }
  }]);
  return GuideProvider;
}(_react.Component), _class.childContextTypes = {
  render: _propTypes2['default'].func
}, _temp2);
exports['default'] = GuideProvider;