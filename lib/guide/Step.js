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

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Step = (_temp = _class = function (_Component) {
  (0, _inherits3['default'])(Step, _Component);

  function Step() {
    (0, _classCallCheck3['default'])(this, Step);
    return (0, _possibleConstructorReturn3['default'])(this, (Step.__proto__ || Object.getPrototypeOf(Step)).apply(this, arguments));
  }

  (0, _createClass3['default'])(Step, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          current = _props.current,
          total = _props.total;

      var stepWidth = 276 * current / total;
      return _react2['default'].createElement(
        'div',
        { style: { width: '276px', height: '4px', marginTop: '12px', marginBottom: '20px', background: 'rgba(0,0,0,0.08)' } },
        _react2['default'].createElement('div', { style: { width: stepWidth, height: '4px', marginTop: '12px', marginBottom: '20px', background: '#00BFA5' } })
      );
    }
  }]);
  return Step;
}(_react.Component), _class.propTypes = {
  current: _propTypes2['default'].number,
  total: _propTypes2['default'].number
}, _temp);
exports['default'] = Step;